import * as tc from "@actions/tool-cache"
import * as core from "@actions/core"
import {Downloader} from "./downloader";

export async function install(browser, version) {
    const toolPath = tc.find(browser, version);

    if (toolPath) {
        core.info(`Found ${browser} at ${toolPath}`)
        return toolPath
    }

    const archivePath = new Downloader(browser, version);
    core.info(`Extracting ${browser}`)
    const extPath=await tc.extractZip(archivePath)
    core.info(`Successfully extracted ${browser} to ${extPath}`)
}