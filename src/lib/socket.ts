import { SocketNamespace } from '@/types/common';
import { io, Socket } from 'socket.io-client';
import { STORAGE_KEY_AT } from './constants';
import { isEmpty, isNil } from 'lodash';

const socketInstances: Record<SocketNamespace, Socket> = {} as any;

export const getSocketClient = (
  namespace: SocketNamespace,
  query: any = {}
): Socket | undefined => {
  const token = sessionStorage.getItem(STORAGE_KEY_AT);

  if (isNil(token) || isEmpty(token)) {
    return;
  }

  if (socketInstances[namespace]) {
    return socketInstances[namespace];
  }

  const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}${namespace}`, {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
    timeout: 5000,
    query: {
      token,
      ...query,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
  });

  socketInstances[namespace] = socket;

  return socket;
};
