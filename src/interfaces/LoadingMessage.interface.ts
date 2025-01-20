import { IFile, IImgMedia, IMessage, IVideoMedia } from "./Message.interface";

export interface ILoadingImgMedia extends IImgMedia {
  fileObject: File;
  progress: number;
  loadingId: string;
}

export interface ILoadingVideoMedia extends IVideoMedia {
  videoName: string;
  fileObject: File;
  progress: number;
  progressPreview: number;
  loadingId: string;
}

export interface ILoadingFile extends IFile {
  fileObject: File;
  progress: number;
  loadingId: string;
}

export interface ILoadingMessage extends IMessage {
  isCanceled: boolean;
  media: (ILoadingImgMedia | ILoadingVideoMedia)[];
  files: ILoadingFile[];
}
