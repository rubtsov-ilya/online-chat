import { useContext } from "react";
import { bodyLockContext } from "src/providers/BodyLockProvider";


export default function useBodyLock() {
  const context = useContext(bodyLockContext);
  if (!context) {
    throw new Error("useDarkTheme is null");
  }
  return context;
}
