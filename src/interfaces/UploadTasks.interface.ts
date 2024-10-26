import { StorageReference, UploadTask } from 'firebase/storage';

export interface IUploadTaskWithRef {
  task: UploadTask;
  fileRef: StorageReference;
}

export interface IUploadTasksRef {
  [messageId: string]: {
    [loadingId: string]: IUploadTaskWithRef;
  };
}
