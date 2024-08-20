import { FC, useLayoutEffect, useRef } from 'react';

import styles from './ChatMessagesSection.module.scss';
import Message from './message/Message';

interface ChatMessagesSectionProps {
  isMobileScreen?: boolean;
}

const ChatMessagesSection: FC<ChatMessagesSectionProps> = ({
  isMobileScreen,
}) => {
  const ComponentTag = isMobileScreen ? 'section' : 'div';
  const endRef = useRef<HTMLDivElement>(null);

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
      contentText: 'sdsdg',
      messageDate: '10:18',
      isChecked: false,
      isOwn: false,
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
      ],
    },
    /*     {
      contentText: 'sdsdg',
      messageDate: '10:18',
      isChecked: false,
      isOwn: false,
      userAvatar:
        'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
      images: [],
    }, */
  ];

  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

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
          {devMessagesArray.map((messageData, index) => {
            return <Message key={index} messageData={messageData} isLast={index === devMessagesArray.length - 1 || messageData.isOwn !== devMessagesArray[index + 1]?.isOwn} isFirst={index === 0 || messageData.isOwn !== devMessagesArray[index - 1]?.isOwn}/>
          })}
        </div>
        <div ref={endRef}></div>
      </div>
    </ComponentTag>
  );
};

export default ChatMessagesSection;
