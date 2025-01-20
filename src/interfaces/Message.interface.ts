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
  fileSize: number;
}

export interface IMessage {
  messageText: string;
  messageDateUTC: number | object | string;
  messageId: string;
  senderUid: string;
  isDeleted: boolean;
  isChecked: boolean;
  isLoading: boolean;
  isEdited: boolean;
  media: (IImgMedia | IVideoMedia)[];
  files: IFile[];
}
