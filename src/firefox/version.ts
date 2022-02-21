export const Version = {
  LATEST_DEV_EDITION: "latest-devedition",
  LATEST_BETA: "latest-beta",
  LATEST_ESR: "latest-esr",
  LATEST: "latest",
} as const;

export type LatestVersion = typeof Version[keyof typeof Version];

export const isLatestVersion = (version: string): version is LatestVersion => {
  return (
    version === Version.LATEST ||
    version === Version.LATEST_BETA ||
    version === Version.LATEST_DEV_EDITION ||
    version === Version.LATEST_ESR
  );
};
