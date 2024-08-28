import { FC, useLayoutEffect, useRef, useState } from 'react';

import styles from './ChatMessagesSection.module.scss';
import Message from './message/Message';

interface ChatMessagesSectionProps {
  isMobileScreen?: boolean;
}

const ChatMessagesSection: FC<ChatMessagesSectionProps> = ({
  isMobileScreen,
}) => {
  const ComponentTag = isMobileScreen ? 'section' : 'div';
  const [messagesArray, setMessagesArray] = useState([]);
  const endRef = useRef<HTMLDivElement>(null);

  console.log(messagesArray);

  const devMessagesArray = [
    {
      contentText: 'sdasasdasdasdasdasddasdsdg',
      messageDate: '10:18',
      isChecked: false,
      isOwn: true,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [],
    },
    {
      contentText: 'sdsdg',
      messageDate: '10:18',
      isChecked: false,
      isOwn: false,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [],
    },
    {
      contentText:
        'Lorem Ipsum - это текст-"рыба", часто используемый вasffsfasfasfa asf f asf фы ывп укр оа печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDate: '10:16',
      isChecked: true,
      isOwn: true,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [
        'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-clouds_23-2150752964.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1723680000&semt=ais_hybrid',
        'https://img.freepik.com/free-photo/3d-fox-cartoon-illustration_23-2151395230.jpg?w=826&t=st=1723726366~exp=1723726966~hmac=15ea325ff52334c6e93b14b3e48acf15f74f70ad2f4955e324814a53bd99ccf0',
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
        'https://img.freepik.com/free-photo/3d-rendering-cartoon-like-dog_23-2150780764.jpg?t=st=1724515633~exp=1724519233~hmac=a550dd14a8dd0623bbe2a7fa48f4c8975c71d25b7b7e5af8c08cddf80c10e2a5&w=740',
        'https://img.freepik.com/free-photo/cute-cat-studio_23-2150932341.jpg?t=st=1724515653~exp=1724519253~hmac=0ad6312ca276255b06a2064cc76249db1520f9adf6ecc9357d544fcc5160b857&w=1380',
        'https://img.freepik.com/free-photo/beautiful-kitten-relaxing-indoors_23-2150752966.jpg?t=st=1724515666~exp=1724519266~hmac=7873c92d60a54c7d768038de2799f1882863420a0f815f7ae0705ed93ce8be1a&w=740',
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
        'https://img.freepik.com/free-photo/close-up-adorable-kitten-couch_23-2150782443.jpg?t=st=1724515679~exp=1724519279~hmac=04bf75014723b310598a5b66df30acf2530f1fc49b58e9cc98c418a8d726fc91&w=740',
      ],
    },
    {
      contentText:
        'Lorem Ipsum - это текст-"рыба", часто используемый вasffsfasfasfa asf f asf фы ывп укр оа печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDate: '10:16',
      isChecked: true,
      isOwn: true,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
        'https://img.freepik.com/free-photo/3d-fox-cartoon-illustration_23-2151395230.jpg?w=826&t=st=1723726366~exp=1723726966~hmac=15ea325ff52334c6e93b14b3e48acf15f74f70ad2f4955e324814a53bd99ccf0',
      ],
    },
    {
      contentText:
        'Lorem Ipsum - это текст-"рыба", часто используемый вasffsfasfasfa asf f asf фы ывп укр оа печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDate: '10:16',
      isChecked: true,
      isOwn: true,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [
        'https://img.freepik.com/free-photo/3d-fox-cartoon-illustration_23-2151395230.jpg?w=826&t=st=1723726366~exp=1723726966~hmac=15ea325ff52334c6e93b14b3e48acf15f74f70ad2f4955e324814a53bd99ccf0',
        'https://img.freepik.com/free-photo/3d-fox-cartoon-illustration_23-2151395230.jpg?w=826&t=st=1723726366~exp=1723726966~hmac=15ea325ff52334c6e93b14b3e48acf15f74f70ad2f4955e324814a53bd99ccf0',
      ],
    },
    {
      contentText:
        'Lorem Ipsum - это текст-"рыбой "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDate: '10:17',
      isChecked: true,
      isOwn: true,
      userAvatar:
        'https://img.freepik.com/premium-photo/there-is-cat-that-is-looking-camera-flowers-generative-ai_1035438-4846.jpg?w=740',
      images: [
        'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-clouds_23-2150752964.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1723680000&semt=ais_hybrid',
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
      ],
    },
    {
      contentText:
        'Lorem Ipsum - это текст-"рыбой "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDate: '10:17',
      isChecked: true,
      isOwn: true,
      userAvatar:
        'https://img.freepik.com/premium-photo/there-is-cat-that-is-looking-camera-flowers-generative-ai_1035438-4846.jpg?w=740',
      images: [
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
        'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-clouds_23-2150752964.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1723680000&semt=ais_hybrid',
      ],
    },
    {
      contentText:
        'Lorem Ipsum - это текст-"рыбой "рыбой" для текстов на латиницеаы цйццаа фыафыаафыаыsf ',
      messageDate: '10:17',
      isChecked: true,
      isOwn: true,
      userAvatar:
        'https://img.freepik.com/premium-photo/there-is-cat-that-is-looking-camera-flowers-generative-ai_1035438-4846.jpg?w=740',
      images: [],
    },
    {
      contentText:
        'Lorem Ipsum - это текст-"рыба", часто используемый вasffsfasfasfa asf f asf фы ывп укр оа печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDate: '10:18',
      isChecked: true,
      isOwn: false,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [],
    },
    {
      contentText: '',
      messageDate: '10:18',
      isChecked: false,
      isOwn: false,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
      ],
    },
    {
      contentText: '',
      messageDate: '10:18',
      isChecked: false,
      isOwn: false,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
        'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
      ],
    },
    {
      contentText:
        'Lorem Ipsum - это текст-"рыба", часто используемый https://www.npmjs.com/package/linkify-react и https://web.telegram.org/a/',
      messageDate: '10:18',
      isChecked: true,
      isOwn: false,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [],
    },
  ];

  useLayoutEffect(() => {
    let ignore = false;

    const loadImages = async (message) => {
      if (message.images.length > 0) {
        const imageData: {
          img: string;
          isHorizontal: boolean;
          isSquare: boolean;
        }[] = await Promise.all(
          message.images.map(async (img) => {
            const image = new Image();
            image.src = img;
            await new Promise((resolve) => {
              image.onload = resolve;
            });
            return {
              img,
              isHorizontal:
                image.width > image.height || image.width === image.height,
              isSquare: image.width === image.height,
            };
          }),
        );
        return {
          ...message,
          images: imageData,
        };
      } else {
        return {
          ...message,
        };
      }
    };

    const loadMessages = async () => {
      if (devMessagesArray && !ignore) {
        const newArray = await Promise.all(devMessagesArray.map(loadImages));
        setMessagesArray(newArray);
      }
    };

    loadMessages();

    return () => {
      ignore = true;
    };
  }, []);

  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messagesArray]);

  return (
    <ComponentTag className={styles['chat-messages']}>
      <div
        className={
          isMobileScreen
            ? 'container container--height'
            : 'container container--max-width-unset container--height'
        }
      >
        <div className={styles['chat-messages__content']}>
          {messagesArray.map((messageData, index) => {
            return (
              <Message
                key={index}
                messageData={messageData}
                isLastOfGroup={
                  index === messagesArray.length - 1 ||
                  messageData.isOwn !== messagesArray[index + 1]?.isOwn
                }
                isFirstOfGroup={
                  index === 0 ||
                  messageData.isOwn !== messagesArray[index - 1]?.isOwn
                }
              />
            );
          })}
        </div>
        <div ref={endRef}></div>
      </div>
    </ComponentTag>
  );
};

export default ChatMessagesSection;
