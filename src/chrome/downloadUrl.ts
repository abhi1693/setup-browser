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

  private readonly appguid: any = {
    [Version.STABLE]: "{8A69D345-D564-463C-AFF1-A69D9E530F96}",
    [Version.BETA]: "{8237E44A-0054-442C-B6B6-EA0509993955}",
    [Version.DEV]: "{401C381F-E0DE-4B85-8BD8-3F3F14FBDA57}",
  };
  iid = "{980B7082-EC04-6DFB-63B8-08C1EC45EB8E}";
  lang = "en";
  browser = "3";
  usagestats = "0";
  appname: any = {
    [Version.STABLE]: "Google Chrome",
    [Version.BETA]: "Google Chrome Beta",
    [Version.DEV]: "Google Chrome Dev",
  };
  needsadmin = "prefers";
  ap: any = {
    [Arch.AMD64]: "-arch_x64-statsdef_1",
    [Arch.I686]: "-arch_x86-statsdef_1",
  };
  installdataindex = "empty";
  path: any = {
    [Arch.AMD64]: {
      stable: "chrome/install/ChromeStandaloneSetup64.exe",
      beta: "chrome/install/beta/ChromeBetaStandaloneSetup64.exe",
      dev: "chrome/install/dev/ChromeDevStandaloneSetup64.exe",
    },
    [Arch.I686]: {
      stable: "chrome/install/ChromeStandaloneSetup.exe",
      beta: "chrome/install/beta/ChromeBetaStandaloneSetup.exe",
      dev: "chrome/install/dev/ChromeDevStandaloneSetup.exe",
    },
  };
  params = [
    ["appguid", this.appguid[this.version]],
    ["iid", this.iid],
    ["lang", this.lang],
    ["browser", this.browser],
    ["usagestats", this.usagestats],
    ["appname", encodeURIComponent(this.appname[this.version])],
    ["needsadmin", this.needsadmin],
    ["ap", this.ap[getPlatform().arch]],
    ["installdataindex", this.installdataindex],
  ]
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  win_url = `https://dl.google.com/tag/s/${encodeURIComponent(this.params)}/${
    this.path[getPlatform().arch][this.version]
  }`;

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
          default:
            throw new UnsupportedPlatformError(platform, this.version);
        }
      case OS.WINDOWS:
        return this.win_url;
    }
    throw new UnsupportedPlatformError(platform, this.version);
  }
}
