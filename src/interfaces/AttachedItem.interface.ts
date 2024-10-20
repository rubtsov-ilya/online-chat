interface ImageItem {
  imgUrl: string;
  name: string;
  fileObject: File;
}
interface VideoItem {
  videoUrl: string;
  name: string;
  fileObject: File;
}
interface FileItem {
  isFile: boolean;
  name: string;
  fileObject: File;
}

export type AttachedItemType = ImageItem | VideoItem | FileItem;
