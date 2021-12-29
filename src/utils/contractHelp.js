import { simpleRpcProvider } from '@/utils/provider';
import jackFactoryAbi from '@/config/abi/jackFactory.json';
import jackRouterAbi from '@/config/abi/jackRouter.json';
import jackPairAbi from '@/config/abi/jackPair.json';
import wethAbi from '@/config/abi/weth.json';

import erc20Abi from '@/config/abi/erc20.json';

import { getJackFactoryAddress, getJackRouterAddress, getWethAddress } from '@/utils/addressHelp';

const getContract = (abi, address, provider) => {
  let signerOrProvider = provider != undefined ? provider : simpleRpcProvider;
  return new signerOrProvider.eth.Contract(abi, address);
};

export const getErc20Contract = (address, provider) => {
  return getContract(erc20Abi, address, provider);
};

export const getJackRouterContract = provider => {
  return getContract(jackRouterAbi, getJackRouterAddress(), provider);
};

export const getJackFactoryContract = provider => {
  return getContract(jackFactoryAbi, getJackFactoryAddress(), provider);
};

export const getJackPairContract = (address, provider) => {
  return getContract(jackPairAbi, address, provider);
};

export const getWethContract = provider => {
  console.log(getWethAddress(), 'getWethAddress()');
  return getContract(wethAbi, getWethAddress(), provider);
};
