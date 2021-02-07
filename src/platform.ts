import os from "os";

export type Platform = {
  os: OS;
  arch: Arch;
};

export const OS = {
  WINDOWS: "windows",
} as const;

export const Arch = {
  AMD64: "amd64",
} as const;

export type OS = typeof OS[keyof typeof OS];
export type Arch = typeof Arch[keyof typeof Arch];

export const getOS = (): OS => {
  const platform = os.platform();
  switch (platform) {
    case "win32":
      return OS.WINDOWS;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};

export const getArch = (): Arch => {
  const arch = os.arch();
  switch (arch) {
    case "x64":
      return Arch.AMD64;
    default:
      throw new Error(`Unsupported arch: ${arch}`);
  }
};

export const getPlatform = (): Platform => {
  return {
    os: getOS(),
    arch: getArch(),
  };
};
