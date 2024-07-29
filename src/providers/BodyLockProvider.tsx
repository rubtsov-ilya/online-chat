import{ FC, createContext, useEffect, useState } from 'react'

interface IValue {
  isBodyLock: boolean,
  lockPaddingValue: number,
  toggleBodyLock: () => void
}

interface BodyLockProviderProps {
  children: React.ReactNode
}

export const bodyLockContext = createContext<IValue | null>(null)

const BodyLockProvider: FC<BodyLockProviderProps> = ({ children }) => {
  const bodyTag = document.querySelector('body') as HTMLBodyElement
  const [isBodyLock, setIsBodyLock] = useState<boolean>(false)
  const [lockPaddingValue, setLockPaddingValue] = useState< number >(0)

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile) {
      setLockPaddingValue(window.innerWidth - (document.querySelector('#root') as HTMLDivElement).offsetWidth);
    }
  }, [])
  
  const toggleBodyLock = () => { 
    bodyTag.classList.toggle('lock');
    setIsBodyLock((prev) => !prev)
   }

  /* console.log(lockPaddingValue, isBodyLock) */
   
   const value: IValue = {isBodyLock, lockPaddingValue, toggleBodyLock}

   // style for section 
   // style={ isBodyLock ? { paddingRight: `${lockPaddingValue}px` } : {}}
   // get in components
   // const {isBodyLock, lockPaddingValue, toggleBodyLock} = useBodyLock()
  return (
    <bodyLockContext.Provider value={value}>
      {children}
    </bodyLockContext.Provider>
  )
}

export default BodyLockProvider