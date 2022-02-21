import DownloadUrl from "../downloadUrl";
import { isLatestVersion } from "./version";
import { ArchiveDownloadUrl, LatestDownloadUrl } from "./downloadUrl";

export class DownloadUrlFactory {
  constructor(private readonly version: string) {}

  create(): DownloadUrl {
    if (isLatestVersion(this.version)) {
      return new LatestDownloadUrl(this.version);
    }
    return new ArchiveDownloadUrl(this.version);
  }
}
