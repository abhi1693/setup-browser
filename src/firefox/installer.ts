// Route to platform specific installer

import { getPlatform, OS } from "../platform";
import * as core from "@actions/core";
import path from "path";
import { Version } from "./version";
import { LinuxInstaller, WindowsInstaller } from "./installerFactory";

export const FirefoxInstaller = async (version: string): Promise<string> => {
  const platform = getPlatform();
  const i = (() => {
    switch (version) {
      case Version.LATEST:
      case Version.LATEST_BETA:
      case Version.LATEST_DEV_EDITION:
      case Version.LATEST_ESR:
        switch (platform.os) {
          case OS.LINUX:
            return new LinuxInstaller();
          case OS.WINDOWS:
            return new WindowsInstaller();
        }
    }
  })();

  if (i) {
    const cache = await i.checkInstalled(version);
    if (cache) {
      core.info(`Firefox found in the cache ${version}`);
      return path.join(cache.root, cache.bin);
    }

    core.info(`Attempting to download: firefox ${version}`);
    const { archive } = await i.download(version);

    core.info("Installing firefox");
    const { root, bin } = await i.install(version, archive);

    core.info(`Successfully installed firefox to ${path.join(root, bin)}`);
    return path.join(root, bin);
  } else {
    core.error(`Installer for ${platform} not found`);
    return "";
  }
};
