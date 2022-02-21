import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { DownloadResult } from "../downloadUrl";
import { InstallResult } from "../installer";
import { InstallerFactory } from "./installerFactory";
import { getPlatform, OS } from "../platform";
import path from "path";
import { makeBasename } from "./utils";
import { makePlatformPart } from "./utils";

export class SnapshotInstaller implements InstallerFactory {
  async checkInstalled(version: string): Promise<InstallResult | undefined> {
    const root = tc.find("chromium", version);
    if (root) {
      return { root, bin: "chrome" };
    }
    return undefined;
  }

  async download(version: string): Promise<DownloadResult> {
    const platform = getPlatform();
    const url = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${makePlatformPart(
      platform
    )}%2F${version}%2F${makeBasename(platform)}?alt=media`;

    core.info(`Downloading: chromium ${version} from ${url}`);
    const archive = await tc.downloadTool(url);
    return { archive };
  }

  async install(version: string, archive: string): Promise<InstallResult> {
    const extPath = await tc.extractZip(archive);
    const platform = getPlatform();

    let root = (() => {
      switch (platform.os) {
        case OS.DARWIN:
          return path.join(extPath, "chrome-mac");
        case OS.LINUX:
          return path.join(extPath, "chrome-linux");
        case OS.WINDOWS:
          return path.join(extPath, "chrome-win");
      }
    })();

    const bin = (() => {
      switch (platform.os) {
        case OS.DARWIN:
          return "Chromium.app/Contents/MacOS/Chromium";
        case OS.LINUX:
          return "chrome";
        case OS.WINDOWS:
          return "chrome.exe";
      }
    })();

    root = await tc.cacheDir(root, "chromium", version);
    core.info(`Successfully installed chromium to ${root}`);

    return { root, bin };
  }
}
