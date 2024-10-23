export interface IImgMedia {
  imgUrl: string;
  isHorizontal: boolean;
  isSquare: boolean;
}

export interface IVideoMedia {
  videoUrl: string;
  videoPreview: string;
  isHorizontal: boolean;
  isSquare: boolean;
}

export interface IFile {
  fileUrl: string;
  fileName: string;
}

export interface IMessage {
  messageText: string;
  messageDateUTC: string;
  messageId: string;
  isChecked: boolean;
  senderUid: string;
  userAvatar: string;
  isLoading: boolean;
  media: (IImgMedia | IVideoMedia)[];
  files: IFile[];
}
