import { DownloadResult } from "./downloadUrl";
import { ChromeInstaller } from "./chrome/installer";
import { FirefoxInstaller } from "./firefox/installer";

export type InstallResult = {
  root: string;
  bin: string;
};

export type InstallerSpec = {
  version: string;
  platform: string;
};

export default interface Installer {
  checkInstalled(version: string): Promise<InstallResult | undefined>;
  download(version: string): Promise<DownloadResult>;
  install(spec: InstallerSpec): Promise<InstallResult>;
}

export const installer = async (
  browser: string,
  version: string
): Promise<string> => {
  switch (browser) {
    case "chrome":
    case "chromium":
      return ChromeInstaller(version);
    case "firefox":
      return FirefoxInstaller(version);
  }
  return "";
};
