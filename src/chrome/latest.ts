import { InstallerFactory } from "./installerFactory";
import * as hc from "@actions/http-client";
import * as tc from "@actions/tool-cache";
import { SnapshotInstaller } from "./snapshot";
import { getPlatform } from "../platform";
import { InstallResult } from "../installer";
import { DownloadResult } from "../downloadUrl";
import { makePlatformPart } from "./utils";

export class LatestInstaller implements InstallerFactory {
  private readonly http = new hc.HttpClient("abhi1693/setup-browser");
  private readonly snapshotInstaller = new SnapshotInstaller();

  async checkInstalled(version: string): Promise<InstallResult | undefined> {
    const root = tc.find("chromium", version);
    if (root) {
      return { root, bin: "chrome" };
    }
    return undefined;
  }

  async download(): Promise<DownloadResult> {
    const platform = getPlatform();
    const url = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${makePlatformPart(
      platform
    )}%2FLAST_CHANGE?alt=media`;
    const response = await this.http.get(url);
    if (response.message.statusCode !== hc.HttpCodes.OK) {
      throw new Error(
        `Failed to get latest version of chromium: ${response.message.statusMessage}`
      );
    }

    const v = await response.readBody();
    return this.snapshotInstaller.download(v);
  }

  async install(version: string, archive: string): Promise<InstallResult> {
    return this.snapshotInstaller.install(version, archive);
  }
}
