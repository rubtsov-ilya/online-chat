export interface IValueServerError {
  isTooManyRequestsError: boolean;
  setServerError: () => void;
}
