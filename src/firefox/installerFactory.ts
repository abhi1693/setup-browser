import { InstallResult } from "../installer";
import { DownloadResult } from "../downloadUrl";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { isLatestVersion } from "./version";
import { DownloadUrlFactory } from "./downloadUrlFactory";

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
    if (!isLatestVersion(version)) {
      throw new Error(`Unexpected version: ${version}`);
    }

    const url = new DownloadUrlFactory(version).create().getUrl();
    core.info(`Downloading firefox ${version} from ${url}`);
    const archive = await tc.downloadTool(url);
    return { archive };
  }

  async install(version: string, archive: string): Promise<InstallResult> {
    if (!isLatestVersion(version)) {
      throw new Error(`Unexpected version: ${version}`);
    }

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
