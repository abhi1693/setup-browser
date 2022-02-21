import * as core from "@actions/core";
import { installer } from "./src/installer";
import path from "path";

async function run(): Promise<void> {
  try {
    const browser = core.getInput("browser");
    const version = core.getInput("version") || "latest";

    if (browser === "") {
      core.setFailed("'browser' parameter is missing");
      return;
    }

    core.info(`Setup ${browser} (${version})`);
    const binPath = await installer(browser, version);
    const installDir = path.dirname(binPath);
    const binName = path.basename(binPath);

    core.setOutput("binary", binName);
    core.setOutput("path", path.join(installDir));
    core.addPath(path.join(installDir));
    core.info(`Successfully installed ${browser} version ${version}`);
  } catch (e) {
    core.setFailed(e.message);
  }
}

run();
