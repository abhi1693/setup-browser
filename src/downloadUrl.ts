export type DownloadResult = {
  archive: string;
};

export default interface DownloadUrl {
  getUrl(): string;
}
