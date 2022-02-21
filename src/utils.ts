import { Arch, OS, Platform } from "./platform";

export const makePlatformPart = ({ os, arch }: Platform): string => {
  if (os === OS.DARWIN && arch === Arch.AMD64) {
    return "Mac";
  } else if (os === OS.LINUX && arch === Arch.I686) {
    return "Linux";
  } else if (os === OS.LINUX && arch === Arch.AMD64) {
    return "Linux_x64";
  } else if (os === OS.WINDOWS && arch === Arch.I686) {
    return "Win";
  } else if (os === OS.WINDOWS && arch === Arch.AMD64) {
    return "Win_x64";
  }
  throw new Error(`Unsupported platform "${os}" "${arch}"`);
};
