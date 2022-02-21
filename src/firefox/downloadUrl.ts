import { makePlatformPart } from "./utils";
import { getPlatform } from "../platform";
import DownloadUrl from "../downloadUrl";
import { makeBasename, productPart } from "./utils";

export class ArchiveDownloadUrl implements DownloadUrl {
  constructor(private readonly version: string) {}

  getUrl(): string {
    const platform = getPlatform();
    return `https://ftp.mozilla.org/pub/firefox/releases/${
      this.version
    }/${makePlatformPart(platform)}/en/${makeBasename(platform, this.version)}`;
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
