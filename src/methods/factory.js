import store from '@/store';
import { getJackFactoryContract, getErc20Contract } from '@/utils/contractHelp';

export const useErc20 = address => {
  const { provider } = store.state;
  return getErc20Contract(address, provider);
};

export const useJackFactory = () => {
  const { provider } = store.state;
  return getJackFactoryContract(provider);
};
