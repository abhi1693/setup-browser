import os from "os";

export const OS = {
    WINDOWS: "windows"
}

export const Arch = {
    AMD64: "amd64"
}

export const getOS = () => {
    const platform = os.platform();
    switch (platform) {
        case "win32":
            return OS.WINDOWS;
        default:
            throw new Error(`Unsupported platform: ${platform}`)
    }
}

export const getArch = () => {
    const arch = os.arch();
    switch (arch) {
        case "x64":
            return Arch.AMD64;
        default:
            throw new Error(`Unsupported arch: ${arch}`)
    }
}

export const getPlatform = () => {
    return {
        os: getOS(),
        arch: getArch()
    }
}