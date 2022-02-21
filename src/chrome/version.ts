export const Version = {
  BETA: "beta",
  DEV: "dev",
  LATEST: "latest",
  STABLE: "stable",
} as const;

export type VERSION = typeof Version[keyof typeof Version];

export const isVersion = (version: string): version is VERSION => {
  return (
    version === Version.BETA ||
    version === Version.DEV ||
    version === Version.STABLE ||
    version === Version.LATEST
  );
};

export const isLatestVersion = (version: string): version is VERSION => {
  return version === Version.LATEST;
};
