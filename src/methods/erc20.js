import { getErc20Contract, getJackFactoryContract, getJackRouterContract, getJackPairContract } from '@/utils/contractHelp';
import { MaxUint256 } from '@ethersproject/constants';
import store from '@/store';

export const getAllowance = async (from, to, address) => {
  const erc20Contract = getErc20Contract(address);
  const allowance = await erc20Contract.methods.allowance(from, to).call();
  return allowance;
};

export const approve = async (from, to, address) => {
  const amount = MaxUint256.toString();
  const { provider } = store.state;

  const erc20Contract = getErc20Contract(address, provider);
  const gas = await erc20Contract.methods.approve(to, amount).estimateGas({ from: from });

  return await erc20Contract.methods.approve(to, amount).send({ from, gas });
};
