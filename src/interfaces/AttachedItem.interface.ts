interface ImageItem {
  imgUrl: string;
}
interface VideoItem {
  videoUrl: string;
}
interface FileItem {
  fileUrl: string;
  fileName: string;
}

export type AttachedItemType = ImageItem | VideoItem | FileItem;
