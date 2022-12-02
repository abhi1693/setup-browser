import {makePlatformPart, makePlatformPartVersion} from "./utils";
import { getPlatform } from "../platform";
import DownloadUrl from "../downloadUrl";
import { makeBasename, productPart } from "./utils";

export class ArchiveDownloadUrl implements DownloadUrl {
  constructor(private readonly version: string) {}

  getUrl(): string {
    const platform = getPlatform();
    return `https://ftp.mozilla.org/pub/firefox/releases/${
      this.version
    }/${makePlatformPartVersion(platform)}/en-US/${makeBasename(platform, this.version)}`;
  }
}

export class LatestDownloadUrl implements DownloadUrl {
  constructor(private readonly version: string) {}

  getUrl(): string {
    const platform = getPlatform();
    return `https://download.mozilla.org/?product=${productPart(
      this.version
    )}&os=${makePlatformPart(platform)}&lang=en-US`;
  }
}
