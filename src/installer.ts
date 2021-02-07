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
  const toolPath = tc.find(browser, version);

  if (toolPath) {
    core.info(`Found ${browser} at ${toolPath}`);
    return toolPath;
  }
  core.info(`Attempting to download ${browser} (${version})...`);
  let archivePath;

  if (browser === "chrome" || browser === "chromium") {
    const downloader = new DownloaderChrome();
    archivePath = await (async () => {
      return await downloader.download(version);
    })();
  }

  if (archivePath) {
    core.info(`Extracting ${browser}`);
    const extPath = await tc.extractZip(archivePath);
    core.info(`Successfully extracted ${browser} to ${extPath}`);
    core.info("Adding to the cache ...");
    const cacheDir = await tc.cacheDir(extPath, browser, version, arch());
    core.info(`Successfully cached ${browser} to ${cacheDir}`);

    switch (getPlatform().os) {
      case OS.DARWIN:
        return path.join(
          cacheDir,
          `${browser}-mac`,
          `${browser}.app/Contents/MacOS/${browser}`
        );
      case OS.LINUX:
        return path.join(cacheDir, `${browser}-linux`, browser);
      case OS.WINDOWS:
        return path.join(cacheDir, `${browser}-win`, `${browser}.exe`);
    }
  } else {
    core.setFailed("missing archive path");
    return "";
  }

  return "";
};
