/* eslint-disable functional/no-return-void */
import { createDomain } from 'effector';

import { HasPlayerName } from './logtail';
import { PresenceEvent, useLoggedEvents } from './logtail/events';
import { MessageLog, useLogtail } from './logtail/logs';
import { useStorage } from './storage/storage';

export const sculk = (rootDir?: string) => {
  const context = createDomain('sculk');
  const storage = useStorage({ context, rootDir });
  const { pushedLog, pushedMessage } = useLogtail({
    context,
    tail: storage.stream$,
  });
  const events$ = useLoggedEvents({
    context,
    source: pushedMessage,
  });

  const { playerJoined, playerLeft, chatMessage } = events$;

  const hooks$ = {
    $serverLogged: (callback: (event: string) => void) =>
      pushedLog.watch((v) => callback(v)),
    $playerJoined: (
      callback: (timestamp: string, playerName: string) => void
    ) => playerJoined.watch((v) => callback(v.timestamp, v.data.playerName)),
    $playerLeft: (callback: (timestamp: string, playerName: string) => void) =>
      playerLeft.watch((v) => callback(v.timestamp, v.data.playerName)),
    $chatMessage: (
      callback: (
        timestamp: string,
        playerName: string,
        chatMessage: string
      ) => void
    ) =>
      chatMessage.watch((v) =>
        callback(v.timestamp, v.data.playerName, v.data.chatMessage)
      ),
  };

  return Object.assign(
    {
      context,
      storage: storage,
      logs$: pushedLog,
      messages$: pushedMessage,
      events$,
    },
    hooks$
  );
};
