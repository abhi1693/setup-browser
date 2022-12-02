import { InstallResult } from "../installer";
import { DownloadResult } from "../downloadUrl";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { isLatestVersion, LATEST_VERSION, Version } from "./version";
import { DownloadUrlFactory } from "./downloadUrlFactory";
import { UnsupportedPlatformError } from "../errors";
import { getPlatform } from "../platform";
import fs from "fs";
import * as exec from "@actions/exec";
import path from "path";

export interface InstallerFactory {
  checkInstalled(version: string): Promise<InstallResult | undefined>;

  download(version: string | undefined): Promise<DownloadResult>;

  install(version: string, archive: string): Promise<InstallResult>;
}

export class LinuxInstaller implements InstallerFactory {
  async checkInstalled(version: string): Promise<InstallResult | undefined> {
    const root = tc.find("firefox", version);
    if (root) {
      return { root, bin: "firefox" };
    }
    return undefined;
  }

  async download(version: string): Promise<DownloadResult> {
    const url = new DownloadUrlFactory(version).create().getUrl();
    core.info(`Downloading firefox ${version} from ${url}`);
    const archive = await tc.downloadTool(url);
    return { archive };
  }

  async install(version: string, archive: string): Promise<InstallResult> {
    core.info("Extracting Firefox...");
    const extPath = await tc.extractTar(archive, "", [
      "xj",
      "--strip-components=1",
    ]);
    core.info(`Successfully extracted firefox ${version} to ${extPath}`);

    core.info("Adding to the cache ...");
    const root = await tc.cacheDir(extPath, "firefox", version);
    core.info(`Successfully cached firefox ${version} to ${root}`);
    return { root: extPath, bin: "firefox" };
  }
}

export class WindowsInstaller implements InstallerFactory {
  async checkInstalled(version: string): Promise<InstallResult | undefined> {
    const root = tc.find("firefox", version);
    if (root) {
      return { root, bin: "firefox.exe" };
    }
    return undefined;
  }

  async download(version: string): Promise<DownloadResult> {
    const url = new DownloadUrlFactory(version).create().getUrl();
    core.info(`Downloading firefox ${version} from ${url}`);
    const archive = await tc.downloadTool(url);
    await fs.promises.rename(archive, `${archive}.exe`);
    return { archive: `${archive}.exe` };
  }

  async install(version: string, archive: string): Promise<InstallResult> {
    await exec.exec(archive, [
      "/S",
      `/InstallDirectoryName=Firefox_${version}`,
    ]);
    core.info(`Successfully install firefox to ${this.rootDir(version)}`);

    return { root: this.rootDir(version), bin: "firefox.exe" };
  }

  private rootDir = (version: string) => {
    switch (version) {
      case Version.LATEST:
      case Version.LATEST_ESR:
      case Version.LATEST_BETA:
      case Version.LATEST_DEV_EDITION:
      case version:
        return `C:\\Program Files\\Firefox_${version}`;
      default:
        throw new UnsupportedPlatformError(getPlatform(), version);
    }
  };
}

export class MacOsInstaller implements InstallerFactory {
  async checkInstalled(version: string): Promise<InstallResult | undefined> {
    const root = tc.find("firefox", version);
    if (root) {
      return { root, bin: "Contents/MacOS/firefox" };
    }
    return undefined;
  }

  async download(version: string): Promise<DownloadResult> {
    const url = new DownloadUrlFactory(version).create().getUrl();
    core.info(`Downloading firefox ${version} from ${url}`);
    const archive = await tc.downloadTool(url);
    return { archive };
  }

  async install(version: string, archive: string): Promise<InstallResult> {
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
        case Version.LATEST_DEV_EDITION:
        case Version.LATEST_BETA:
        case Version.LATEST_ESR:
        case Version.LATEST:
        case version:
          return path.join(mountPoint, "Firefox.app");
        default:
          throw new UnsupportedPlatformError(getPlatform(), version);
      }
    })();

    core.info(`Successfully extracted firefox ${version} to ${root}`);

    core.info("Adding to the cache ...");
    root = await tc.cacheDir(root, "firefox", version);
    core.info(`Successfully cached firefox ${version} to ${root}`);

    return { root, bin: "Contents/MacOS/firefox" };
  }
}
