import { Arch, OS, Platform } from "../platform";
import { Version } from "./version";

export const makeBasename = ({ os }: Platform, version: string): string => {
  switch (os) {
    case OS.DARWIN:
      return `Firefox%20${version}.dmg`;
    case OS.LINUX:
      return `firefox-${version}.tar.bz2`;
    case OS.WINDOWS:
      return `Firefox%20Setup%20${version}.exe`;
  }
};

export const productPart = (version: string): string => {
  switch (version) {
    case Version.LATEST:
      return "firefox-latest";
    case Version.LATEST_BETA:
      return "firefox-beta-latest";
    case Version.LATEST_DEV_EDITION:
      return "firefox-devedition-latest";
    case Version.LATEST_ESR:
      return "firefox-esr-latest";
    default:
      return "";
  }
};

export const makePlatformPart = ({ os, arch }: Platform): string => {
  if (os === OS.DARWIN && arch === Arch.AMD64) {
    return "osx";
  } else if (os === OS.LINUX && arch === Arch.I686) {
    return "linux";
  } else if (os === OS.LINUX && arch === Arch.AMD64) {
    return "linux64";
  } else if (os === OS.WINDOWS && arch === Arch.I686) {
    return "win";
  } else if (os === OS.WINDOWS && arch === Arch.AMD64) {
    return "win64";
  }
  throw new Error(`Unsupported platform "${os}" "${arch}"`);
};

export const makePlatformPartVersion = ({ os, arch }: Platform): string => {
  if (os === OS.DARWIN && arch === Arch.AMD64) {
    return "mac";
  } else if (os === OS.LINUX && arch === Arch.I686) {
    return "linux-i686";
  } else if (os === OS.LINUX && arch === Arch.AMD64) {
    return "linux-x86_64";
  } else if (os === OS.WINDOWS && arch === Arch.I686) {
    return "win32";
  } else if (os === OS.WINDOWS && arch === Arch.AMD64) {
    return "win64";
  }
  throw new Error(`Unsupported platform "${os}" "${arch}"`);
};
