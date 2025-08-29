import { replace } from 'lodash';

const BASE_ROUTER = '/[__LANG__]';

function createRoute(path: string = ''): string {
  return path ? `${BASE_ROUTER}/${path}` : `${BASE_ROUTER}/`;
}

export const ROUTER = {
  HOME: createRoute('home'),
  MAIN: createRoute(),
  GAME_ROOM: createRoute('room/[gameId]'),
  INTRO: createRoute('room/[gameId]/intro'),
  DECIDE_ORDER: createRoute('room/[gameId]/decide-order'),
  IN_GAME: createRoute('room/[gameId]/game'),
  PRO_MODE_SELECTION: createRoute('room/pro'),
};

export function getRouteWithLocale(locale: string, route: string): string {
  return replace(route, '[__LANG__]', locale);
}
