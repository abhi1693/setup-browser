import DownloadUrl from "../downloadUrl";
import { LatestDownloadUrl, SnapshotDownloadUrl } from "./downloadUrl";
import { isLatestVersion } from "./version";

export class DownloadUrlFactory {
  constructor(private readonly version: string) {}

  create(): DownloadUrl {
    if (isLatestVersion(this.version)) {
      return new LatestDownloadUrl();
    }
    return new SnapshotDownloadUrl(this.version);
  }
}
