import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  ref, query, orderByKey, limitToLast, limitToFirst, startAt, endAt, get, onValue, off,
} from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import { addInitialMessagesArray, addMessage } from 'src/redux/slices/MessagesArraySlice';
import { IMessage } from 'src/interfaces/Message.interface';

const useMessagesSubscription = (chatId: string | null, uid: string | null) => {
  const dispatch = useDispatch();
  const currentSubscriptions = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (!chatId || !uid) return;

    const messagesRef = ref(firebaseDatabase, `chats/${chatId}/messages`);
    const unreadMessagesRef = ref(firebaseDatabase, `chats/${chatId}/unreadMessages/${uid}`);

    const clearSubscriptions = () => {
      currentSubscriptions.current.forEach(unsub => unsub());
      currentSubscriptions.current = [];
    };

    const subscribeToMessages = async () => {
      clearSubscriptions();

      const snapshot = await get(unreadMessagesRef);
      const unreadKeys = snapshot.exists() ? Object.keys(snapshot.val()).sort() : [];

      let initialQuery: any;

      if (unreadKeys.length > 0) {
        const lastUnreadKey = unreadKeys[unreadKeys.length - 1];

        initialQuery = query(messagesRef, orderByKey(), endAt(lastUnreadKey), limitToLast(4));
        const nextQuery = query(messagesRef, orderByKey(), startAt(lastUnreadKey), limitToFirst(4));

        const unsubscribeInitial = onValue(initialQuery, (snap) => {
          const messages = Object.values(snap.val() || {}) as IMessage[];
          dispatch(addInitialMessagesArray(messages));
        });

        const unsubscribeNext = onValue(nextQuery, (snap) => {
          const messages = Object.values(snap.val() || {}).slice(1) as IMessage[];
          dispatch(addMessage(messages));
        });

        currentSubscriptions.current.push(
          () => off(initialQuery, 'value', unsubscribeInitial),
          () => off(nextQuery, 'value', unsubscribeNext)
        );

      } else {
        initialQuery = query(messagesRef, orderByKey(), limitToLast(6));

        const unsubscribe = onValue(initialQuery, (snap) => {
          const messages = Object.values(snap.val() || {}) as IMessage[];
          dispatch(addInitialMessagesArray(messages));
        });

        currentSubscriptions.current.push(() => off(initialQuery, 'value', unsubscribe));
      }
    };

    subscribeToMessages();

    return () => {
      clearSubscriptions();
    };
  }, [chatId, uid, dispatch]);
};

export default useMessagesSubscription;