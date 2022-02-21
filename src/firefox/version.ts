export const Version = {
  LATEST_DEV_EDITION: "latest-devedition",
  LATEST_BETA: "latest-beta",
  LATEST_ESR: "latest-esr",
  LATEST: "latest",
} as const;

export type LATEST_VERSION = typeof Version[keyof typeof Version];

export const isLatestVersion = (version: string): version is LATEST_VERSION => {
  return (
    version === Version.LATEST ||
    version === Version.LATEST_BETA ||
    version === Version.LATEST_DEV_EDITION ||
    version === Version.LATEST_ESR
  );
};
