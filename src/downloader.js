import {Arch, getPlatform, OS} from "./platform"
import * as core from "@actions/core";
import * as httpm from "@actions/http-client"
import * as tc from "@actions/tool-cache";

export class DownloaderChrome {
    http = new httpm.HttpClient("setup-browser");

    constructor(version) {
    }

    makeBasename = ({os}) => {
        switch (os) {
            case OS.WINDOWS:
                return "chrome-win.zip"
        }
    }
    makePlatformPart = ({os, arch}) => {
        if (os === OS.WINDOWS && arch === Arch.AMD64) {
            return "Win_x64";
        }
        throw new Error(`Unsupported platform ${os} ${arch}`);
    }

    async downloadSnapshot(commitPosition) {
        const url = ` https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${this.makePlatformPart(getPlatform())}%2F${commitPosition}%2F${this.makeBasename(getPlatform().os)}?alt=media`;
        core.info(`Acquiring ${commitPosition} from ${url}`);
        return tc.downloadTool(url);
    }

    async downloadLatest() {
        const url = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${this.makePlatformPart(getPlatform())}%2FLAST_CHANGE?alt=media`;
        const response = await this.http.get(url);

        if (response.message.statusCode !== httpm.HttpCodes.OK) {
            throw new Error(`Failed to get latest version: server returns ${response.message.statusCode}`)
        }
        const version = await response.readBody();
        return this.downloadSnapshot(version);
    }
}

export class Downloader {
    async constructor(browser, version) {
        let downloader;

        if (browser === "chrome") {
            downloader = new DownloaderChrome(version);
            return await (async () => {
                if (version === "latest") {
                    return await downloader.downloadLatest();
                } else {
                    return await downloader.downloadSnapshot(version);
                }
            })();
        }
    }
}