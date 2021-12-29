import { ETH, BNB } from '@/config/constants/bnb';

export const isBnb = token => {
  if (token.address.toLowerCase() === BNB.address.toLowerCase() && token.name.toLowerCase() === 'bnb') {
    return true;
  }

  return false;
};

export const isEth = token => {
  if (token.address.toLowerCase() === ETH.address.toLowerCase() && token.name.toLowerCase() === 'eth') {
    return true;
  }

  return false;
};
