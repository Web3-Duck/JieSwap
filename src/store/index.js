import Vue from 'vue';
import Vuex from 'vuex';
import Web3 from 'web3';
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
//模块化store
// import Sys from '../components/modal/store';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    provider: {},
    account: '',
    net: 0,
    gasPrice: 5000000000,
    slippage: 0.1,
    deadline: 20,
    multipath: 0,
    transactions: {},
    block: 0,
  },
  mutations: {
    SETPROVIDER: (state, provider) => {
      state.provider = provider;
    },
    SETBLOCK: (state, block) => {
      state.block = block;
    },
    DELETETRANSACTIONS: state => {
      state.transactions = {};
    },
    SETTRANSACTIONS: (state, transactionsDetail) => {
      let tempObj = JSON.parse(JSON.stringify(state.transactions));
      tempObj[transactionsDetail.hash] = transactionsDetail;
      state.transactions = tempObj;
    },
    SETTRANSACTIONSRECEIPT: (state, transactionsDetail) => {
      let tempObj = JSON.parse(JSON.stringify(state.transactions));
      tempObj[transactionsDetail.hash].receipt = transactionsDetail.receipt;
      state.transactions = tempObj;
    },
    SETACCOUNTS: (state, account) => {
      state.account = account;
    },
    SETNET: (state, net) => {
      state.net = net;
    },
    SET_GASPRICE(state, gasPrice) {
      state.gasPrice = gasPrice;
    },
    SET_SLIPPAGE(state, slippage) {
      state.slippage = slippage;
    },
    SET_DEADLINE(state, deadline) {
      state.deadline = deadline;
    },
    SET_MULTIPATH(state, multipath) {
      state.multipath = multipath;
    },
  },
  actions: {
    async setWallet() {
      var web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          await web3Provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'bnb',
                  decimals: 18,
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: [`https://bscscan.com/`],
              },
            ],
          });
          await web3Provider.enable();
        } catch (error) {
          console.error('User denied account access');
        }
      }
    },
    async setWebProvider({ commit }) {
      var web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          // 请求用户授权
          await web3Provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'bnb',
                  decimals: 18,
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: [`https://bscscan.com/`],
              },
            ],
          });
          // await web3Provider.request({
          //   method: 'wallet_addEthereumChain',
          //   params: [
          //     {
          //       chainId: '0x3',
          //       chainName: 'Ropsten 测试网络',
          //       nativeCurrency: {
          //         name: 'ETH',
          //         symbol: 'eth',
          //         decimals: 18,
          //       },
          //       rpcUrls: ['https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
          //       blockExplorerUrls: [`https://ropsten.etherscan.io`],
          //     },
          //   ],
          // });
          await web3Provider.enable();
        } catch (error) {
          // 用户不授权时
          console.error('User denied account access');
        }
        const web3js = new Web3(web3Provider); //web3js就是你需要的web3实例
        commit('SETPROVIDER', web3js);
        web3js.eth.net.getId(function (error, result) {
          if (!error) {
            console.log(result, '网络'); //授权成功后result能正常获取到账号了
            commit('SETNET', result);
          }
        });
        web3js.eth.getAccounts(function (error, result) {
          if (!error) {
            console.log(result, '账号'); //授权成功后result能正常获取到账号了
            commit('SETACCOUNTS', result[0]);
          }
        });
        web3Provider.on('networkChanged', function (networkIDstring) {
          commit('SETNET', networkIDstring);
        });
        web3Provider.on('accountsChanged', function (accounts) {
          commit('SETACCOUNTS', accounts[0]);
          console.log('切换账号', accounts);
        });
      }
    },
  },
  plugins: [
    createPersistedState({
      paths: ['gasPrice', 'slippage', 'deadline', 'multipath', 'transactions', 'block'],
    }),
  ],
});
