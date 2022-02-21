// Route to platform specific installer

import { getPlatform, OS } from "../platform";
import { LatestInstaller } from "./latest";
import { Version } from "./version";
import { SnapshotInstaller } from "./snapshot";
import * as core from "@actions/core";
import path from "path";
import {
  LinuxInstaller,
  MacOsInstaller,
  WindowsInstaller,
} from "./installerFactory";

export const ChromeInstaller = async (version: string): Promise<string> => {
  const platform = getPlatform();
  const i = (() => {
    switch (version) {
      case Version.LATEST:
        return new LatestInstaller();
      case Version.DEV:
      case Version.BETA:
      case Version.STABLE:
        switch (platform.os) {
          case OS.DARWIN:
            return new MacOsInstaller();
          case OS.LINUX:
            return new LinuxInstaller();
          case OS.WINDOWS:
            return new WindowsInstaller();
        }
        break;
      default:
        return new SnapshotInstaller();
    }
  })();

  const cache = await i.checkInstalled(version);
  if (cache) {
    core.info(`Chromium found in the cache ${version}`);
    return path.join(cache.root, cache.bin);
  }

  core.info(`Attempting to download: chromium ${version}`);
  const { archive } = await i.download(version);

  core.info("Installing chromium");
  const { root, bin } = await i.install(version, archive);

  core.info(`Successfully installed chromium to ${path.join(root, bin)}`);
  return path.join(root, bin);
};
