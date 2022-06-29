/* eslint-disable functional/immutable-data */
import { MessageLog } from '.';

export type PlayerPresence = 'joined' | 'left';

export type HasPlayerName = { readonly playerName: string };
export type HasChatMessage = { readonly chatMessage: string };

export const createMessageCase =
  <T>(regex: RegExp, map: (groups: readonly string[]) => T) =>
  (v: MessageLog): undefined | (MessageLog & { readonly data: T }) => {
    const result = regex.exec(v.message);

    if (result === undefined) return undefined;

    return Object.assign(v, { data: map(result.map((v) => `${v}`)) });
  };

export const parsePresenceData = ([playerName]) => ({ playerName });

export const createChatMessageData = ([playerName, chatMessage]) => ({
  playerName,
  chatMessage,
});

export const presenceMessageRegex = (presence: PlayerPresence) =>
  new RegExp(`/(.*) ${presence} the game/m`);

export const presenceEvent$ = (presence: PlayerPresence) =>
  createMessageCase<HasPlayerName>(
    presenceMessageRegex(presence),
    parsePresenceData
  );

export const chatMessageEvent$ = (regex: RegExp) =>
  createMessageCase<HasPlayerName & HasChatMessage>(
    regex,
    createChatMessageData
  );

export const playerJoinCase = presenceEvent$('joined');
export const playerLeftCase = presenceEvent$('left');
export const chatMessageCase = chatMessageEvent$(/<(.*)> (.*)/m);
