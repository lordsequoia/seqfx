import { Domain } from 'effector';
import { splitMap } from 'patronum';

import {
  chatMessageCase,
  HasPlayerName,
  playerJoinCase,
  playerLeftCase,
} from './cases';

import { MessageLog$ } from '.';
import { MessageLog } from './index';

export type UseLoggedEvents = {
  readonly context: Domain;
  readonly source: MessageLog$;
};

/* export type LoggedEvents = {
  readonly playerJoined: Event<MessageLog & { readonly data: HasPlayerName }>;
  readonly playerLeft: Event<MessageLog & { readonly data: HasPlayerName }>;
  readonly chatMessage: Event<MessageLog & { readonly data: HasChatMessage }>;
  readonly __: Event<MessageLog>;
}; */

export type PresenceEvent = MessageLog & { readonly data: HasPlayerName };

export type PlayerJoinedMessage = PresenceEvent;
export type PlayerLeftMessage = PresenceEvent;

export const MESSAGE_CASES = {
  playerJoined: (v: MessageLog) => playerJoinCase(v),
  playerLeft: (v: MessageLog) => playerLeftCase(v),
  chatMessage: (v: MessageLog) => chatMessageCase(v),
};

export const useLoggedEvents = ({ source }: UseLoggedEvents) =>
  splitMap({ source, cases: MESSAGE_CASES });
