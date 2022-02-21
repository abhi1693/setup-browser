import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import fs from "fs";
import os from "os";
import path from "path";
import { DownloadResult } from "../downloadUrl";
import { UnsupportedPlatformError } from "../errors";
import { InstallResult } from "../installer";
import { getPlatform } from "../platform";
import { DownloadUrlFactory } from "./downloadUrlFactory";
import { isVersion, VERSION, Version } from "./version";

export interface InstallerFactory {
  checkInstalled(version: string): Promise<InstallResult | undefined>;

  download(version: string | undefined): Promise<DownloadResult>;

  install(version: string, archive: string): Promise<InstallResult>;
}

export class LinuxInstaller implements InstallerFactory {
  async checkInstalled(version: string): Promise<InstallResult | undefined> {
    const root = tc.find("chromium", version);
    if (root) {
      return { root, bin: "chrome" };
    }
    return undefined;
  }

  async download(version: string): Promise<DownloadResult> {
    if (!isVersion(version)) {
      throw new Error(`Unexpected version: ${version}`);
    }

    const url = new DownloadUrlFactory(version).create().getUrl();
    core.info(`Downloading chromium ${version} from ${url}`);
    const archive = await tc.downloadTool(url);
    return { archive };
  }

  async install(version: string, archive: string): Promise<InstallResult> {
    if (!isVersion(version)) {
      throw new Error(`Unexpected version: ${version}`);
    }

    core.info("Extracting Chrome...");
    const tmpdir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "deb-"));
    const extdir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "chrome-"));
    await exec.exec("ar", ["x", archive], { cwd: tmpdir });
    await exec.exec("tar", [
      "-xf",
      path.join(tmpdir, "data.tar.xz"),
      "--directory",
      extdir,
      "--strip-components",
      "4",
      "./opt/google",
    ]);
    core.info(`Successfully extracted chrome ${version} to ${extdir}`);

    // remove broken symlinks
    await fs.promises.unlink(path.join(extdir, "google-chrome"));

    core.info("Adding to the cache ...");
    const root = await tc.cacheDir(extdir, "chromium", version);
    core.info(`Successfully cached chrome ${version} to ${root}`);

    return { root: extdir, bin: "chrome" };
  }
}

export class WindowsInstaller implements InstallerFactory {
  async checkInstalled(version: string): Promise<InstallResult | undefined> {
    if (!isVersion(version)) {
      throw new UnsupportedPlatformError(getPlatform(), version);
    }

    const root = tc.find("chrome", version);
    if (root) {
      return { root, bin: "chrome.exe" };
    }
    return undefined;
  }

  async download(version: string): Promise<DownloadResult> {
    if (!isVersion(version)) {
      throw new UnsupportedPlatformError(getPlatform(), version);
    }

    const url = new DownloadUrlFactory(version).create().getUrl();
    core.info(`Downloading chromium ${version} from ${url}`);
    const archive = await tc.downloadTool(url);
    await fs.promises.rename(archive, `${archive}.exe`);
    return { archive: `${archive}.exe` };
  }

  async install(version: string, archive: string): Promise<InstallResult> {
    if (!isVersion(version)) {
      throw new UnsupportedPlatformError(getPlatform(), version);
    }
    await exec.exec(archive, ["/silent", "/install"]);
    core.info(`Successfully install chromium to ${this.rootDir(version)}`);

    return { root: this.rootDir(version), bin: "chrome.exe" };
  }

  private rootDir = (version: VERSION) => {
    switch (version) {
      case Version.LATEST:
      case Version.STABLE:
        return "C:\\Program Files\\Google\\Chrome\\Application";
      case Version.BETA:
        return "C:\\Program Files\\Google\\Chrome Beta\\Application";
      case Version.DEV:
        return "C:\\Program Files\\Google\\Chrome Dev\\Application";
      default:
        throw new UnsupportedPlatformError(getPlatform(), version);
    }
  };
}

export class MacOsInstaller implements InstallerFactory {
  async checkInstalled(version: string): Promise<InstallResult | undefined> {
    if (!isVersion(version)) {
      throw new UnsupportedPlatformError(getPlatform(), version);
    }

    const root = tc.find("chromium", version);
    if (root) {
      return { root, bin: "Contents/MacOS/chrome" };
    }
    return undefined;
  }

  async download(version: string): Promise<DownloadResult> {
    if (!isVersion(version)) {
      throw new UnsupportedPlatformError(getPlatform(), version);
    }

    const url = new DownloadUrlFactory(version).create().getUrl();
    core.info(`Downloading chromium ${version} from ${url}`);
    const archive = await tc.downloadTool(url);
    return { archive };
  }

  async install(version: string, archive: string): Promise<InstallResult> {
    if (!isVersion(version)) {
      throw new UnsupportedPlatformError(getPlatform(), version);
    }

    const mountPoint = path.join("/Volumes", path.basename(archive));
    await exec.exec("hdiutil", [
      "attach",
      "-quiet",
      "-noautofsck",
      "-noautoopen",
      "-mountpoint",
      mountPoint,
      archive,
    ]);

    let root = (() => {
      switch (version) {
        case Version.STABLE:
          return path.join(mountPoint, "Google Chrome.app");
        case Version.BETA:
          return path.join(mountPoint, "Google Chrome Beta.app");
        case Version.DEV:
          return path.join(mountPoint, "Google Chrome Dev.app");
        default:
          throw new UnsupportedPlatformError(getPlatform(), version);
      }
    })();

    const bin = (() => {
      switch (version) {
        case Version.STABLE:
          return "Contents/MacOS/Google Chrome";
        case Version.BETA:
          return "Contents/MacOS/Google Chrome Beta";
        case Version.DEV:
          return "Contents/MacOS/Google Chrome Dev";
        default:
          throw new UnsupportedPlatformError(getPlatform(), version);
      }
    })();
    const bin2 = path.join(path.dirname(bin), "chrome");

    root = await tc.cacheDir(root, "chromium", version);
    await fs.promises.symlink(path.basename(bin), path.join(root, bin2));
    core.info(`Successfully install chromium to ${root}`);

    return { root, bin: bin2 };
  }
}
