import { useEffect } from 'react';

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  maxHeight: number,
) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = '0px';
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      if (scrollHeight <= maxHeight) {
        textAreaRef.style.height = scrollHeight + 'px';
        if (textAreaRef.style.overflow !== 'hidden') {
          textAreaRef.style.overflow = 'hidden';
        }
      } else {
        if (textAreaRef.style.overflow !== 'auto') {
          textAreaRef.style.overflow = 'auto';
        }
        textAreaRef.style.height = maxHeight + 'px';
      }
    }
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;
