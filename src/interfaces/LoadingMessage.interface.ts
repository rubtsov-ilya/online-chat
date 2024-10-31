export interface ILoadingImgMedia {
  imgUrl: string;
  isHorizontal: boolean;
  isSquare: boolean;
  fileObject: File;
  progress: number;
  loadingId: string;
}

export interface ILoadingVideoMedia {
  videoUrl: string;
  videoPreview: string;
  videoName: string;
  isHorizontal: boolean;
  isSquare: boolean;
  fileObject: File;
  progress: number;
  progressPreview: number;
  loadingId: string;
}

export interface ILoadingFile {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileObject: File;
  progress: number;
  loadingId: string;
}

export interface ILoadingMessage {
  messageText: string;
  messageDateUTC: string;
  messageId: string;
  isChecked: boolean;
  senderUid: string;
  userAvatar: string;
  isLoading: boolean;
  isCanceled: boolean;
  isEdited: boolean;
  media: (ILoadingImgMedia | ILoadingVideoMedia)[];
  files: ILoadingFile[];
}
