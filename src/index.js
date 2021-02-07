import {getPlatform} from "./platform";
import {install} from "./installer";

const core = require('@actions/core');

async function run() {
    try {
        const browser = core.getInput("browser") || "chrome";
        const version = core.getInput("version") || "latest";

        const binPath = install(browser, version);
    } catch (e) {
        core.setFailed(e.message)
    }
}

run()