import store from '@/store';

import { getErc20Contract, getJackRouterContract, getJackFactoryContract, getWethContract } from '@/utils/contractHelp';
export const useErc20Contract = address => {
  const { provider } = store.state;

  return getErc20Contract(address, provider);
};

export const useJackRouterContract = () => {
  const { provider } = store.state;

  return getJackRouterContract(provider);
};

export const useJackFactoryContract = () => {
  const { provider } = store.state;

  return getJackFactoryContract(provider);
};

export const useWethContract = () => {
  const { provider } = store.state;

  return getWethContract(provider);
};
