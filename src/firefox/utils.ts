import { OS, Platform } from "../platform";
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
