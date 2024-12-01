import { useMediaQuery } from 'react-responsive';

const useMobileScreen = () => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 991px)' });
  return { isMobileScreen };
};

export default useMobileScreen;

/* получение
const { isMobileScreen } = useMobileScreen(); */
