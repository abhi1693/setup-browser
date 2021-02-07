import { Arch, getPlatform, OS, Platform } from "./platform";
import * as tc from "@actions/tool-cache";
import * as http from "@actions/http-client";
import * as core from "@actions/core";

export class DownloaderChrome {
  private readonly hc = new http.HttpClient("setup-browser");

  makeBasename = ({ os }: Platform): string => {
    switch (os) {
      case OS.DARWIN:
        return "chrome-mac.zip";
      case OS.LINUX:
        return "chrome-linux.zip";
      case OS.WINDOWS:
        return "chrome-win.zip";
    }
  };
  makePlatformPart = ({ os, arch }: Platform): string => {
    if (os === OS.DARWIN && arch === Arch.AMD64) {
      return "Mac";
    } else if (os === OS.LINUX && arch === Arch.I686) {
      return "Linux";
    } else if (os === OS.LINUX && arch === Arch.AMD64) {
      return "Linux_x64";
    } else if (os === OS.WINDOWS && arch === Arch.I686) {
      return "Win";
    } else if (os === OS.WINDOWS && arch === Arch.AMD64) {
      return "Win_x64";
    }
    throw new Error(`Unsupported platform ${os} ${arch}`);
  };

  async downloadSnapshot(commitPosition: string): Promise<string> {
    const url = ` https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${this.makePlatformPart(
      getPlatform()
    )}%2F${commitPosition}%2F${this.makeBasename(getPlatform())}?alt=media`;
    core.info(`Acquiring ${commitPosition} from ${url}`);
    return tc.downloadTool(url);
  }

  async downloadLatest(): Promise<string> {
    const url = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${this.makePlatformPart(
      getPlatform()
    )}%2FLAST_CHANGE?alt=media`;
    const response = await this.hc.get(url);

    if (response.message.statusCode !== http.HttpCodes.OK) {
      throw new Error(
        `Failed to get latest version: server returns ${response.message.statusCode}`
      );
    }
    const version = await response.readBody();
    return this.downloadSnapshot(version);
  }

  async download(version: string): Promise<string> {
    if (version === "latest") {
      return this.downloadLatest();
    } else {
      return this.downloadSnapshot(version);
    }
  }
}
