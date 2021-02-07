import DownloadUrl from "../downloadUrl";
import {
  ChannelDownloadUrl,
  LatestDownloadUrl,
  SnapshotDownloadUrl,
} from "./downloadUrl";
import { isLatestVersion, isVersion } from "./version";

export class DownloadUrlFactory {
  constructor(private readonly version: string) {}

  create(): DownloadUrl {
    if (isLatestVersion(this.version)) {
      return new LatestDownloadUrl();
    } else if (isVersion(this.version)) {
      return new ChannelDownloadUrl(this.version);
    }
    return new SnapshotDownloadUrl(this.version);
  }
}
