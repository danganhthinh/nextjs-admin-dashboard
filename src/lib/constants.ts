// * auth
export const STORAGE_KEY_AT = 'GT_WEB_GAME_ACCESS_TOKEN';
export const STORAGE_KEY_RT = 'GT_WEB_GAME_REFRESH_TOKEN';
export const STORAGE_USER_INFO = 'GT_WEB_GAME_USER_INFO';

// * ton
export const WALLET_INFO_KEY = 'ton-connect-ui_wallet-info';

export const TON_SETTINGS = {
  manifestUrl:
    'https://' + process.env.NEXT_PUBLIC_CLIENT_URL + '/manifest.json',
  url: process.env.NEXT_PUBLIC_CLIENT_URL,
};

export const tonOptions = [
  { value: '0.1' },
  { value: '1' },
  { value: '10' },
  { value: '100' },
];

export const roomError = {
  ROOM_FULL: 'Room is full (4 players)',
  ROOM_CANCEL: 'Room not found or has been deleted',
  ROOM_NOT_EXISTED: 'Room is not exist',
};

export const playerStatus = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
};

export const landAction = {
  BUY: 'PURCHASE_LAND',
  REPURCHASE_LAND: 'REPURCHASE_LAND',
  SKIP: 'SKIP',
  WORLD_TRAVEL: 'WORLD_TRAVEL',
  DESERTED_ISLAND: 'DESERTED_ISLAND',
  BROKE: 'BROKE',
};

export const landLevel = [
  {
    key: 'land',
    level: 0,
    img: 'building_land',
  },
  {
    key: 'apartment',
    level: 1,
    img: 'building_apartment',
  },
  {
    key: 'building',
    level: 2,
    img: 'building_building',
  },
  {
    key: 'hotel',
    level: 3,
    img: 'building_hotel',
  },
  {
    key: 'landmark',
    level: 4,
    img: 'building_landmark',
  },
];
