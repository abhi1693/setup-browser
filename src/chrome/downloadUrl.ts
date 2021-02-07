import DownloadUrl from "../downloadUrl";
import { UnsupportedPlatformError } from "../errors";
import { Arch, getPlatform, OS } from "../platform";
import { makeBasename, makePlatformPart } from "./utils";
import { Version } from "./version";

export class SnapshotDownloadUrl implements DownloadUrl {
  constructor(private readonly version: string) {}

  getUrl(): string {
    const platform = getPlatform();
    return `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${makePlatformPart(
      platform
    )}%2F${this.version}%2F${makeBasename(platform)}?alt=media`;
  }
}

export class LatestDownloadUrl implements DownloadUrl {
  getUrl(): string {
    const platform = getPlatform();
    return `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${makePlatformPart(
      platform
    )}%2FLAST_CHANGE?alt=media`;
  }
}

export class ChannelDownloadUrl implements DownloadUrl {
  constructor(private readonly version: string) {}

  getUrl(): string {
    const platform = getPlatform();
    switch (platform.os) {
      case OS.DARWIN:
        switch (platform.arch) {
          case Arch.AMD64:
            switch (this.version) {
              case Version.STABLE:
                return "https://dl.google.com/chrome/mac/stable/GGRO/googlechrome.dmg";
              default:
                return `https://dl.google.com/chrome/mac/${this.version}/googlechrome${this.version}.dmg`;
            }
          case Arch.ARM64:
            switch (this.version) {
              case Version.STABLE:
                return "https://dl.google.com/chrome/mac/universal/stable/GGRO/googlechrome.dmg";
              default:
                return `https://dl.google.com/chrome/mac/universal/${this.version}/googlechrome${this.version}.dmg`;
            }
          default:
            throw new UnsupportedPlatformError(platform, this.version);
        }
      case OS.LINUX:
        switch (this.version) {
          case Version.STABLE:
            return "https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb";
          case Version.BETA:
            return "https://dl.google.com/linux/direct/google-chrome-beta_current_amd64.deb";
          case Version.DEV:
            return "https://dl.google.com/linux/direct/google-chrome-unstable_current_amd64.deb";
        }
        break;
      case OS.WINDOWS:
        return "";
    }
    return "";
  }
}
