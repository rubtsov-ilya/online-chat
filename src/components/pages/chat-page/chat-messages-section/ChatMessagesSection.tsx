import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import useMessagesFromRtk from 'src/hooks/useMessagesFromRtk';
import styles from './ChatMessagesSection.module.scss';
import ToBottomBtn from 'src/components/ui/to-bottom-btn/ToBottomBtn';
import { addInitialMessagesArray } from 'src/redux/slices/MessagesArraySlice';
import { useDispatch } from 'react-redux';
import { IMessage } from 'src/interfaces/Message.interface';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';
import useAuth from 'src/hooks/useAuth';
import MessageDateGroup from './message-date-group/MessageDateGroup';
import { ILoadingMessage } from 'src/interfaces/LoadingMessage.interface';
import SectionLoader from './section-loader/SectionLoader';

interface ChatMessagesSectionProps {
  isMobileScreen: boolean;
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  activeChatId: string | null;
  isSubscribeLoading: boolean;
}

const ChatMessagesSection: FC<ChatMessagesSectionProps> = ({
  isMobileScreen,
  uploadTasksRef,
  activeChatId,
  isSubscribeLoading,
}) => {
  const ComponentTag = isMobileScreen ? 'section' : 'div';
  /* const [messagesArray, setMessagesArray] = useState([]); */
  const { uid } = useAuth();
  const { messagesArray } = useMessagesFromRtk();
  const endRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [doScroll, setDoScroll] = useState<boolean>(false);
  const dispatch = useDispatch();
  const devMessagesArrayInit: IMessage[] = [
    {
      messageText: 'sdasasdasdasdasdasddasdsdg',
      messageDateUTC: '2024-10-20T09:01:04.275Z',
      messageId: '7320616e-a5ac-4d55-bf99-cf8f4cbbb44f',
      isChecked: false,
      senderUid: uid!,
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [],
      files: [],
    },
    {
      messageText: 'sdsdg',
      messageDateUTC: '2024-10-20T09:02:04.275Z',
      messageId: '2f44f109-7661-485c-bb23-ef5068e2bcd9',
      isChecked: true,
      senderUid: 'yp7vuU1DFuRnGlwa5m7IGUtV7GJ6',
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [],
      files: [],
    },
    {
      messageText:
        'Lorem Ipsum - это текст-"рыба", часто используемый вasffsfasfasfa asf f asf фы ывп укр оа печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDateUTC: '2024-10-20T09:03:04.275Z',
      messageId: 'ee2a85a2-f7e3-4430-908a-599f2b88901b',
      isChecked: false,
      senderUid: uid!,
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [
        {
          imgUrl:
            'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-clouds_23-2150752964.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1723680000&semt=ais_hybrid',
          isHorizontal: false,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/3d-fox-cartoon-illustration_23-2151395230.jpg?w=826&t=st=1723726366~exp=1723726966~hmac=15ea325ff52334c6e93b14b3e48acf15f74f70ad2f4955e324814a53bd99ccf0',
          isHorizontal: true,
          isSquare: true,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/3d-rendering-cartoon-like-dog_23-2150780764.jpg?t=st=1724515633~exp=1724519233~hmac=a550dd14a8dd0623bbe2a7fa48f4c8975c71d25b7b7e5af8c08cddf80c10e2a5&w=740',
          isHorizontal: false,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-cat-studio_23-2150932341.jpg?t=st=1724515653~exp=1724519253~hmac=0ad6312ca276255b06a2064cc76249db1520f9adf6ecc9357d544fcc5160b857&w=1380',
          isHorizontal: true,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/beautiful-kitten-relaxing-indoors_23-2150752966.jpg?t=st=1724515666~exp=1724519266~hmac=7873c92d60a54c7d768038de2799f1882863420a0f815f7ae0705ed93ce8be1a&w=740',
          isHorizontal: false,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/close-up-adorable-kitten-couch_23-2150782443.jpg?t=st=1724515679~exp=1724519279~hmac=04bf75014723b310598a5b66df30acf2530f1fc49b58e9cc98c418a8d726fc91&w=740',
          isHorizontal: false,
          isSquare: false,
        },
      ],
      files: [],
    },
    {
      messageText:
        'Lorem Ipsum - это текст-"рыба", часто используемый вasffsfasfasfa asf f asf фы ывп укр оа печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDateUTC: '2024-10-21T09:03:04.275Z',
      messageId: '4a985e4f-21c7-4a66-869b-5d4fc3d6d0fc',
      isChecked: true,
      senderUid: uid!,
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [
        {
          imgUrl:
            'https://img.freepik.com/free-photo/3d-fox-cartoon-illustration_23-2151395230.jpg?w=826&t=st=1723726366~exp=1723726966~hmac=15ea325ff52334c6e93b14b3e48acf15f74f70ad2f4955e324814a53bd99ccf0',
          isHorizontal: true,
          isSquare: true,
        },
      ],
      files: [],
    },
    {
      messageText:
        'Lorem Ipsum - это текст-"рыба", часто используемый вasffsfasfasfa asf f asf фы ывп укр оа печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDateUTC: '2024-10-21T09:04:04.275Z',
      messageId: 'cd625728-6a3f-4528-a6f1-546f1f81df26',
      isChecked: true,
      senderUid: uid!,
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [
        {
          imgUrl:
            'https://img.freepik.com/free-photo/3d-fox-cartoon-illustration_23-2151395230.jpg?w=826&t=st=1723726366~exp=1723726966~hmac=15ea325ff52334c6e93b14b3e48acf15f74f70ad2f4955e324814a53bd99ccf0',
          isHorizontal: true,
          isSquare: true,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/3d-fox-cartoon-illustration_23-2151395230.jpg?w=826&t=st=1723726366~exp=1723726966~hmac=15ea325ff52334c6e93b14b3e48acf15f74f70ad2f4955e324814a53bd99ccf0',
          isHorizontal: true,
          isSquare: true,
        },
      ],
      files: [],
    },
    {
      messageText:
        'Lorem Ipsum - это текст-"рыбой "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDateUTC: '2024-10-22T09:05:04.275Z',
      messageId: '28af7d4a-af65-4640-92be-6873e72e7689',
      isChecked: false,
      senderUid: uid!,
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [
        {
          imgUrl:
            'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-clouds_23-2150752964.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1723680000&semt=ais_hybrid',
          isHorizontal: false,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
      ],
      files: [],
    },
    {
      messageText:
        'Lorem Ipsum - это текст-"рыбой "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDateUTC: '2024-10-22T09:06:04.275Z',
      messageId: 'fecb7b57-3361-4d67-9456-30eec3f1980c',
      isChecked: true,
      senderUid: uid!,
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-clouds_23-2150752964.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1723680000&semt=ais_hybrid',
          isHorizontal: false,
          isSquare: false,
        },
      ],
      files: [
        {
          fileUrl: 'https://i.imgur.com/8yEqycg.mp4',
          fileName: 'Anton-1337.pdf',
          fileSize: 1000,
        },
      ],
    },
    {
      messageText:
        'Lorem Ipsum - это текст-"рыбой "рыбой" для текстов на латиницеаы цйццаа фыафыаафыаыsf ',
      messageDateUTC: '2024-10-23T09:06:02.275Z',
      messageId: '93bbffa4-90b0-4a31-8dbd-8fe86f76f08a',
      isChecked: false,
      senderUid: uid!,
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [],
      files: [],
    },
    {
      messageText:
        'Lorem Ipsum - это текст-"рыба", часто используемый вasffsfasfasfa asf f asf фы ывп укр оа печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. оапппп fgswtst аармсмти пофвфаы цйццаа фыафыаафыаыsf ',
      messageDateUTC: '2024-10-23T09:07:04.275Z',
      messageId: 'd6ec6240-80b9-4317-8ebb-ea2f2d6da78c',
      isChecked: true,
      senderUid: 'yp7vuU1DFuRnGlwa5m7IGUtV7GJ6',
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [],
      files: [],
    },
    {
      messageText: '',
      messageDateUTC: '2024-10-23T09:07:04.275Z',
      messageId: '3d3cf30e-1adb-4ed2-b585-866000ef70e3',
      isChecked: true,
      senderUid: 'yp7vuU1DFuRnGlwa5m7IGUtV7GJ6',
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
      ],
      files: [],
    },
    {
      messageText: '',
      messageDateUTC: '2024-10-23T09:09:04.275Z',
      messageId: '8df26386-978b-4be7-b484-4fc9d1edd231',
      isChecked: false,
      senderUid: 'yp7vuU1DFuRnGlwa5m7IGUtV7GJ6',
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
        },
      ],
      files: [],
    },
    {
      messageText:
        'Lorem Ipsum - это текст-"рыба", часто используемый https://www.npmjs.com/package/linkify-react и https://web.telegram.org/a/',
      messageDateUTC: '2024-10-23T09:10:04.275Z',
      messageId: '8c9480a9-5e6b-4940-bd71-e180a7764329',
      isChecked: false,
      senderUid: 'yp7vuU1DFuRnGlwa5m7IGUtV7GJ6',
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [],
      files: [],
    },
    {
      messageText: '',
      messageDateUTC: '2024-10-23T09:12:04.275Z',
      messageId: '6f664af4-6aa8-4f48-b24b-5457ff5fa083',
      isChecked: true,
      senderUid: 'yp7vuU1DFuRnGlwa5m7IGUtV7GJ6',
      isDeleted: false,
      isLoading: false,
      media: [
        {
          imgUrl:
            'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-clouds_23-2150752964.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1723680000&semt=ais_hybrid',
          isHorizontal: false,
          isSquare: false,
          progress: 50,
        },
        {
          videoUrl: 'https://i.imgur.com/8yEqycg.mp4',
          videoPreview:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: false,
          isSquare: false,
          progress: 50,
        },
      ],
      files: [],
    },
    {
      messageText: '',
      messageDateUTC: '2024-10-23T09:13:04.275Z',
      messageId: '66354598-bba7-4ae7-9940-9aba88f93cac',
      isChecked: false,
      senderUid: 'yp7vuU1DFuRnGlwa5m7IGUtV7GJ6',
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
          progress: 50,
        },
      ],
      files: [
        {
          fileUrl: 'https://i.imgur.com/8yEqycg.mp4',
          fileName: 'file.txt',
          progress: 50,
          fileSize: 1201,
        },
      ],
    },
    {
      messageText: '',
      messageDateUTC: '2024-10-23T10:01:04.275Z',
      messageId: '909e395c-6ac2-4900-a56a-b2766609cc60',
      isChecked: true,
      senderUid: 'yp7vuU1DFuRnGlwa5m7IGUtV7GJ6',
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [
        {
          videoUrl: 'https://i.imgur.com/v5DeFBo.mp4',
          videoPreview: '',
          isHorizontal: true,
          isSquare: false,
          progress: 10,
          progressPreview: 100,
        },
        {
          imgUrl:
            'https://img.freepik.com/free-photo/cute-kitten-playing-in-autumn-forest-surrounded-by-colorful-leaves-generated-by-artificial-intelligence_25030-63162.jpg?w=1380&t=st=1723726321~exp=1723726921~hmac=cdf9e98345c44adc4544d5e0a7ef3ed68e10491a00cb165f3955d9cc85099382',
          isHorizontal: true,
          isSquare: false,
          progress: 0,
        },
      ],
      files: [],
    },
    {
      messageText: '',
      messageDateUTC: '2024-10-24T10:03:04.275Z',
      messageId: '9ec08cd0-7be2-488d-8bfd-a5a0b6d165e0',
      isChecked: true,
      senderUid: 'qUVScdkpzHWlTIzQy281u2ZnLrj2',
      isDeleted: false,
      isLoading: false,
      isEdited: false,
      media: [],
      files: [
        {
          fileUrl: 'https://i.imgur.com/8yEqycg.mp4',
          fileName: 'Anton-1337.pdf',
          fileSize: 130,
        },
        {
          fileUrl: 'https://i.imgur.com/8yEqycg.mp4',
          fileName: 'ASDASDSFASFASFAS2112512asf5125125125125FASF.docx',
          progress: 30,
          fileSize: 10301,
        },
      ],
    },
  ];
  const [initialMessagesArray, setInitialMessagesArray] =
    useState(devMessagesArrayInit);

  /* console.log(messagesArray); */

  useLayoutEffect(() => {
    // здесь подписку сделать на обновления чата из фаербейза
    // если есть стейт в ртк то подписку делаем и ставит она стейт

    if (activeChatId !== null) {
      dispatch(addInitialMessagesArray(initialMessagesArray));
    }
    // если нет стейта ртк, то не делать подписку и тогда чат пустой будет
    if (activeChatId === null) {
      dispatch(addInitialMessagesArray([]));
    }

    setDoScroll(true);
    return () => {};
  }, [activeChatId]);

  useLayoutEffect(() => {
    /*  скролл вниз секции */
    /* логику изменить. прокручивать до непрочитанного чата надо будет, а не вниз. но если таких нет, то вниз */
    endRef.current?.scrollIntoView({ behavior: 'auto' });
    return () => {};
  }, [doScroll, isSubscribeLoading]);

  const scrollToBottom = (isOwnMessage: boolean) => {
    if (chatMessagesRef.current) {
      const chatMessagesCurrent = chatMessagesRef.current;
      const animationLength = 80;
      const scrollCoefficient = 2.8;
      const { scrollTop, clientHeight, scrollHeight } = chatMessagesCurrent;
      if (isOwnMessage) {
        //if логика = высота всего div минус прокрученное расстояние от верха > высота viewport умноженная на коэффициент (колво экранов заданное вручную)
        if (scrollHeight - scrollTop > clientHeight * scrollCoefficient) {
          const scrollPosition = scrollHeight - clientHeight - animationLength;
          chatMessagesCurrent.scrollTo({
            top: scrollPosition,
            behavior: 'auto',
          });
          endRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
          endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (!isOwnMessage) {
        const scrollPosition = scrollHeight - scrollTop - clientHeight;
        if (scrollPosition < animationLength) {
          endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    // прокрутка секции вниз при отправке смс со стороны пользователя
    if (messagesArray.length > 0) {
      scrollToBottom(messagesArray[messagesArray.length - 1].senderUid === uid);
    }
    return () => {};
  }, [messagesArray.length]);

  if (isSubscribeLoading) {
    return <SectionLoader />
  }

  return (
    <ComponentTag
      className={styles['chat-messages']}
      ref={chatMessagesRef}
      id="chat-messages"
      onContextMenu={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
      }}
    >
      <div
        className={
          isMobileScreen
            ? 'container container--height'
            : 'container container--max-width-unset container--height'
        }
      >
        <div
          className={`${styles['chat-messages__content']} ${messagesArray.length === 0 ? styles['chat-messages__content--no-messages'] : ''}`}
        >
          {messagesArray.length > 0 &&
            Object.entries(
              messagesArray.reduce(
                (acc, message) => {
                  const dateKey = new Date(
                    message.messageDateUTC as number,
                  ).toLocaleDateString();
                  if (!acc[dateKey]) {
                    acc[dateKey] = []; // Инициализируем новый массив, если такой даты еще нет
                  }
                  acc[dateKey].push(message); // Добавляем сообщение к соответствующему массиву
                  return acc; // Возвращаем аккумулированный объект
                },
                {} as Record<string, (IMessage | ILoadingMessage)[]>,
              ),
            ).map(([date, messages]) => (
              <MessageDateGroup
                key={date}
                messagesArray={messages}
                uid={uid!}
                uploadTasksRef={uploadTasksRef}
                chatMessagesRef={chatMessagesRef}
              />
            ))}
          {messagesArray.length === 0 && (
            <span className={styles['chat-messages__no-messages']}>
              Нет сообщений
            </span>
          )}
          <div className={styles['chat-messages__overlay-to-bottom-btn']}>
            <ToBottomBtn
              scrollToBottom={() => scrollToBottom(true)}
              chatMessagesRef={chatMessagesRef}
            />
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
    </ComponentTag>
  );
};

export default ChatMessagesSection;
