import { OS, Platform } from "../platform";

export const makeBasename = ({ os }: Platform): string => {
  switch (os) {
    case OS.DARWIN:
      return "chrome-mac.zip";
    case OS.LINUX:
      return "chrome-linux.zip";
    case OS.WINDOWS:
      return "chrome-win.zip";
  }
};
