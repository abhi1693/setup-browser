import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import { install } from "./installer";
import path from "path";
import { getPlatform, OS } from "./platform";

async function run(): Promise<void> {
  try {
    let browser = core.getInput("browser");
    const version = core.getInput("version") || "latest";

    if (getPlatform().os === OS.DARWIN) {
      if (browser === "chrome") {
        browser = "chromium";
      }
    }

    core.info(`Setup ${browser} ${version}`);

    const binPath = await install(browser, version);
    const installDir = path.dirname(binPath);
    const binName = path.basename(binPath);

    core.addPath(path.join(installDir));
    core.info(`Successfully setup ${browser} version ${version}`);

    if (getPlatform().os === OS.WINDOWS) {
      await io.which(browser, true);
    } else if (
      getPlatform().os === OS.DARWIN ||
      getPlatform().os === OS.LINUX
    ) {
      await exec.exec(binName, ["--version"]);
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

run();