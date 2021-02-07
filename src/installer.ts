import * as tc from "@actions/tool-cache";
import * as core from "@actions/core";
import { DownloaderChrome } from "./downloader";
import { arch } from "os";
import { getPlatform, OS } from "./platform";
import path from "path";

export const install = async (
  browser: string,
  version: string
): Promise<string> => {
  if (browser === "chrome" || browser === "chromium") {
    return installChrome(version);
  } else {
    throw new Error(`Unsupported browser: ${browser}`);
  }
};

export const installChrome = async (version: string): Promise<string> => {
  const platform = getPlatform();

  const toolPath = tc.find("chromium", version);

  if (toolPath) {
    core.info(`Found chromium at ${toolPath}`);
    return toolPath;
  }
  core.info(`Attempting to download chromium (${version})...`);

  const downloader = new DownloaderChrome();
  const archivePath = await (async () => {
    return await downloader.download(version);
  })();

  if (archivePath) {
    core.info("Extracting chromium");
    const extPath = await tc.extractZip(archivePath);
    core.info(`Successfully extracted chromium to ${extPath}`);
    core.info("Adding to the cache ...");
    const cacheDir = await tc.cacheDir(extPath, "chromium", version, arch());
    core.info(`Successfully cached chromium to ${cacheDir}`);

    switch (platform.os) {
      case OS.DARWIN:
        return path.join(
          cacheDir,
          "chrome-mac",
          "Chromium.app/Contents/MacOS/Chromium"
        );
      case OS.LINUX:
        return path.join(cacheDir, "chrome-linux", "chrome");
      case OS.WINDOWS:
        return path.join(cacheDir, "chrome-win", "chrome.exe");
    }
  } else {
    throw new Error("missing archive path");
  }
  throw new Error("something went wrong");
};
