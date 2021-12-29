<template>
  <div class="swap">
    <div class="headWrap">
      <van-row type="flex" justify="space-between">
        <van-col class="title">{{ $t('lang.swap1') }}</van-col>
        <van-col>
          <img src="@/assets/img/set.png" @click="handleSettingShow" alt="" class="iconSet" />
          <img src="@/assets/img/record.png" @click="handleRecordShow" alt="" class="iconRecord" />
        </van-col>
      </van-row>
      <div class="text">{{ $t('lang.swap2') }}</div>
    </div>

    <div class="container">
      <div class="box">
        <van-row type="flex" justify="space-between">
          <van-col class="title">
            <div>
              {{ $t('lang.swap3') }}<span v-if="inputSource == 'to' && fromInput != ''">({{ $t('lang.swap50') }})</span>
            </div>
          </van-col>
          <van-col @click="handleToMax">{{ fromCur.balance ? $t('lang.swap4') : '' }} {{ significantDigits(fromCur.balance) }}</van-col>
        </van-row>
        <van-row type="flex" justify="space-between" class="btRow">
          <van-col :span="12" class="title"><van-field type="number" v-model="fromInput" @input="hanldeInputFrom" placeholder="0.0" /> </van-col>
          <van-col>
            <div v-if="fromCur.name" class="selectedCurrency">
              <div class="maxWord" @click="handleToMax">{{ $t('lang.swap6') }}</div>
              <div class="tokenDetail" @click="handleGetCurrency('from')">
                <van-image round class="tokenImg" height="20px" :src="fromCur.logoURI" />
                <div class="tokenSymbol">{{ fromCur.symbol }}</div>
              </div>
            </div>
            <div v-else class="tokenSymbol">{{ $t('lang.swap5') }}</div>
          </van-col>
        </van-row>
      </div>
      <img src="@/assets/img/opposite.png" @click="handleTurnAround" alt="" class="iconDown" />
      <div class="box">
        <van-row type="flex" justify="space-between">
          <van-col class="title">
            <div>
              {{ $t('lang.swap32') }} <span v-if="inputSource == 'from' && toInput != ''">({{ $t('lang.swap50') }})</span>
            </div>
          </van-col>
          <van-col>{{ significantDigits(toCur.balance) }}</van-col>
        </van-row>

        <van-row type="flex" justify="space-between" class="btRow">
          <van-col :span="12" class="title"><van-field type="number" v-model="toInput" @input="hanldeInputTo" placeholder="0.0" /> </van-col>
          <van-col @click="handleGetCurrency('to')">
            <div v-if="toCur.name" class="selectedCurrency">
              <div class="tokenDetail">
                <van-image round class="tokenImg" height="20px" :src="toCur.logoURI" />
                <div class="tokenSymbol">{{ toCur.symbol }}</div>
              </div>
            </div>
            <div v-else class="tokenSymbol">{{ $t('lang.swap5') }}</div>
          </van-col>
        </van-row>
      </div>
      <van-row v-if="priceShow" type="flex" justify="space-between" class="price" @click="changePriceDirection">
        <van-col class="text">{{ $t('lang.swap7') }}</van-col>
        <van-col v-if="priceDirection"> 1{{ toCur.symbol }} = {{ price }} {{ fromCur.symbol }} <van-image class="opppsite" :src="require('@/assets/img/opposite.png')" /> </van-col>
        <van-col v-else> 1 {{ fromCur.symbol }}= {{ price }} {{ toCur.symbol }} <van-image class="opppsite" :src="require('@/assets/img/opposite.png')" /> </van-col>
      </van-row>
      <van-row type="flex" justify="space-between" class="slipWrap">
        <van-col class="text">{{ $t('lang.swap8') }}</van-col>
        <van-col>{{ slippage }}%</van-col>
      </van-row>

      <van-button type="primary" class="swapBtn" v-if="!account" @click="handleLogin">{{ $t('lang.swap9') }}</van-button>
      <van-button type="default" class="swapBtn" v-else-if="insufficientLiquidityShow" disabled>{{ $t('lang.swap12') }}</van-button>
      <van-button type="default" class="swapBtn" v-else-if="getNoInputBtnShow" disabled>{{ $t('lang.swap10') }}</van-button>
      <van-button type="default" class="swapBtn" v-else-if="getNoBalanceBtnShow" disabled>{{ $t('lang.swap11') }}</van-button>
      <van-button type="default" class="swapBtn" v-else-if="getNoSelectBtnShow" disabled>{{ $t('lang.swap13') }}</van-button>
      <van-button type="primary" class="swapBtn" :loading="approveLoading" loading-text="Approving..." v-else-if="allowanceToRouter" @click="handleApprove">{{ $t('lang.swap14') }}</van-button>
      <van-button type="primary" class="swapBtn" v-else-if="getWrap" @click="handleDeposit">{{ $t('lang.swap15') }}</van-button>
      <van-button type="primary" class="swapBtn" v-else-if="getWithdraw" @click="handleWithdraw">{{ $t('lang.swap16') }}</van-button>
      <van-button type="primary" class="swapBtn" v-else @click="handleSwap">{{ $t('lang.swap17') }}</van-button>
    </div>
    <van-popup v-if="tokenListShow" v-model="tokenListShow" round>
      <currency-list @listenClose="handleTokenListClose" @listenSelecteCurrency="handlerSelecteCurrency" />
    </van-popup>
    <van-popup v-model="settingShow" round>
      <SettingsModal @listenClose="handleSettingClose" />
    </van-popup>
    <van-popup v-model="swapDetailShow" :round="true" @closed="handleSwapDetailClosed">
      <swap-detail @listenClose="handleSwapDetailClose" @listenConfirm="handleConfirm" :fromCur="fromCur" :toCur="toCur" :swapDetail="swapDetail" />
    </van-popup>
    <van-popup v-model="pendingDetailShow" round @closed="handlePendingSwapClosed">
      <pending-swap @listenClose="handlePendingSwapClose" :pendingDetail="pendingDetail" :fromCur="fromCur" :toCur="toCur" />
    </van-popup>
    <van-popup v-model="transactionRecordShow" round>
      <transaction-record @listenClose="handleTransactionRecordClose" />
    </van-popup>
  </div>
</template>

<script>
import CurrencyList from '@/components/CurrencyList.vue';
import SwapDetail from '@/views/swap/SwapDetail.vue';
import PendingSwap from '@/views/swap/PendingSwap.vue';
import TransactionRecord from '@/views/swap/TransactionRecord.vue';

import { mapState } from 'vuex';
import { formatAmount, parseAmount, accMul, accDiv, toFixed, accAdd, accSub, accGt, significantDigits, gasProcessing } from '@/utils/format.js';
import { isBnb } from '@/utils/verify.js';
import { getJackRouterAddress } from '@/utils/addressHelp';
import { MaxUint256 } from '@ethersproject/constants';
import { getErc20Contract, getJackRouterContract, getJackPairContract, getJackFactoryContract } from '@/utils/contractHelp';
import SettingsModal from '@/components/SettingsModal.vue';
import { simpleRpcProvider } from '@/utils/provider';
import { useJackRouterContract, useErc20Contract, useWethContract } from '@/utils/useContract';
import { getAllPair } from '@/utils/pairHelp';
import web3 from 'web3';
export default {
  name: 'Home',
  data() {
    return {
      fromBalance: '',
      tokenListShow: false,
      settingShow: false,
      isShow: true,
      approveLoading: false, //授权loading
      pendingDetailShow: false,
      transactionRecordShow: false, //交易记录
      pendingDetail: { status: 0, hash: '', fromInput: '', toInput: '' },
      allPaths: [], //所有的多路径
      currentPaths: [], //当前所有多路径
      pathIndex: -1, //当前选择的多路径
      insufficientLiquidityShow: false, //当固定输出时，大于池子深度
      fromInput: '', //from输入框
      fromCur: {
        name: 'BNB',
        symbol: 'BNB',
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        chainId: 56,
        decimals: 18,
        balance: '',
        logoURI: 'https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png',
      },
      toInput: '',
      toCur: {
        balance: '',
        name: '',
        symbol: '',
        address: '',
        chainId: '',
        decimals: '',
        logoURI: '',
      },
      tokenSource: 'from',
      priceDirection: true,
      price: '',
      priceShow: false,
      inputSource: '',
      allowanceToRouter: false, //显示是否需要授权
      swapDetailShow: false,
      swapDetail: { fromInput: '', toInput: '', amountIn: 0, amountInMax: 0, amountOut: 0, amountOutMin: 0, path: [], to: '', deadline: 0, inputSource: 'from', fee: 0 },
    };
  },
  mounted() {},
  beforeDestroy() {
    window.clearInterval(this.timer);
    window.clearInterval(this.timerBalance);
  },
  async created() {
    this.initialization();
  },
  watch: {
    account() {
      this.initialization();
    },
  },
  components: {
    CurrencyList,
    SettingsModal,
    SwapDetail,
    PendingSwap,
    TransactionRecord,
  },
  computed: {
    ...mapState(['account', 'provider', 'gasPrice', 'slippage', 'deadline', 'multipath']),

    // 是否需要显示余额不足提示
    getNoBalanceBtnShow() {
      if (accGt(this.fromInput, this.fromCur.balance)) {
        return true;
      }
      return false;
    },
    //是否需要显示inputBtn按钮
    getNoInputBtnShow() {
      if ((parseFloat(this.fromInput) === 0 || this.fromInput === '') && this.fromCur.address !== '') {
        return true;
      } else if ((parseFloat(this.toInput) === 0 || this.toInput === '') && this.toCur.address !== '') {
        return true;
      }
      return false;
    },
    // 是否需要显示选择币种
    getNoSelectBtnShow() {
      if (this.fromCur.address == '' || this.toCur.address == '') {
        return true;
      }
      return false;
    },
    // 是否BNB - WBNB
    getWrap() {
      if (isBnb(this.fromCur) && this.toCur.address == this.fromCur.address) {
        return true;
      }
      return false;
    },
    // 是否WBNB - BNB
    getWithdraw() {
      if (isBnb(this.toCur) && this.toCur.address == this.fromCur.address) {
        return true;
      }
      return false;
    },
  },
  methods: {
    handleLogin() {
      this.$store.dispatch('setWallet');
    },
    async handleDeposit() {
      const wethContract = useWethContract();
      const payableAmount = parseAmount(this.fromInput);
      const gas = await wethContract.methods.deposit().estimateGas({ from: this.account, value: payableAmount });
      wethContract.methods
        .deposit()
        .send({ from: this.account, value: payableAmount, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
        .on('transactionHash', hash => {
          const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap15')} ${this.toInput} ${this.toCur.symbol}`;
          const title = this.$t('lang.swap18');
          const transactionsDetail = {
            hash,
            title,
            message,
            addedTime: new Date().getTime(),
            from: this.account,
          };
          this.$store.commit('SETTRANSACTIONS', transactionsDetail);
        })
        .on('receipt', receipt => {})
        .on('error', function (error, receipt) {
          throw error;
        });
    },
    async handleWithdraw() {
      const wethContract = useWethContract();
      const wad = parseAmount(this.fromInput);
      const gas = await wethContract.methods.withdraw(wad).estimateGas({ from: this.account });
      wethContract.methods
        .withdraw(wad)
        .send({ from: this.account, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
        .on('transactionHash', hash => {
          const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap16')} ${this.toInput} ${this.toCur.symbol}`;
          const title = this.$t('lang.swap18');
          const transactionsDetail = {
            hash,
            title,
            message,
            addedTime: new Date().getTime(),
            from: this.account,
          };
          this.$store.commit('SETTRANSACTIONS', transactionsDetail);
        })
        .on('receipt', receipt => {})
        .on('error', function (error, receipt) {
          throw error;
        });
    },
    handleSwapDetailClose() {
      this.swapDetailShow = false;
    },
    handleSwapDetailClosed() {
      this.swapDetail = { fromInput: '', toInput: '', amountIn: 0, amountInMax: 0, amountOut: 0, amountOutMin: 0, path: [], to: '', deadline: 0, inputSource: 'from', fee: 0 };
    },
    handlePendingSwapClose() {
      this.pendingDetailShow = false;
    },
    handleTransactionRecordClose() {
      this.transactionRecordShow = false;
    },
    handlePendingSwapClosed() {
      this.pendingDetail = { status: 0, hash: '', fromInput: '', toInput: '' };
    },
    handleTokenListClose() {
      this.tokenListShow = false;
    },
    handleSettingClose() {
      this.settingShow = false;
    },

    // 获取两边币种余额
    async handleCurBalance() {
      if (this.account) {
        if (isBnb(this.fromCur)) {
          const balance = await simpleRpcProvider.eth.getBalance(this.account);
          this.fromCur.balance = formatAmount(balance);
        }

        if (!isBnb(this.fromCur) && this.fromCur.address != '') {
          const erc20Contract = getErc20Contract(this.fromCur.address);
          const balance = await erc20Contract.methods.balanceOf(this.account).call();
          this.fromCur.balance = formatAmount(balance, this.fromCur.decimals);
        }

        if (isBnb(this.toCur)) {
          const balance = await simpleRpcProvider.eth.getBalance(this.account);
          this.toCur.balance = formatAmount(balance);
        }

        if (!isBnb(this.toCur) && this.toCur.address != '') {
          const erc20Contract = getErc20Contract(this.toCur.address);
          const balance = await erc20Contract.methods.balanceOf(this.account).call();
          this.toCur.balance = formatAmount(balance, this.toCur.decimals);
        }
      }
    },
    // 闪兑
    handleSwap() {
      const slippage = accDiv(this.slippage, 100);
      this.swapDetail.inputInMax = significantDigits(accAdd(this.fromInput, accMul(this.fromInput, slippage)));
      this.swapDetail.inputOutMin = significantDigits(accSub(this.toInput, accMul(this.toInput, slippage)));
      this.swapDetail.inputSource = this.inputSource;
      this.swapDetail.price = this.price;
      this.swapDetail.fromInput = this.fromInput;
      this.swapDetail.toInput = this.toInput;
      this.swapDetail.fee = accMul(this.swapDetail.inputInMax, 0.003);
      this.swapDetailShow = true;
    },
    handleConfirm() {
      const slippage = accDiv(this.slippage, 100);
      const amountIn = parseAmount(this.fromInput, this.fromCur.decimals);
      const amountInMax = toFixed(accAdd(amountIn, accMul(amountIn, slippage)), 0);
      const amountOut = parseAmount(this.toInput, this.toCur.decimals);
      const amountOutMin = toFixed(accSub(amountOut, accMul(amountOut, slippage)), 0);
      let path = [];

      const currentPath = this.currentPaths[this.pathIndex];
      if (currentPath.length == 1) {
        path = [this.fromCur.address, this.toCur.address];
      }

      if (currentPath.length == 2) {
        path = [this.fromCur.address, currentPath[0].toCur.address, currentPath[1].toCur.address];
      }
      const to = this.account;
      const deadline = accAdd(accDiv(Date.parse(new Date()), 1000), accMul(this.deadline, 60));
      this.pendingDetail.fromInput = this.fromInput;
      this.pendingDetail.toInput = this.toInput;
      if (isBnb(this.fromCur) && this.inputSource == 'from') {
        this.swapExactETHForTokens(amountIn, amountOutMin, path, to, deadline);
        return;
      }

      if (isBnb(this.fromCur) && this.inputSource == 'to') {
        this.swapETHForExactTokens(amountOut, amountInMax, path, to, deadline);
        return;
      }

      if (isBnb(this.toCur) && this.inputSource == 'from') {
        this.swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline);
        return;
      }

      if (isBnb(this.toCur) && this.inputSource == 'to') {
        this.swapTokensForExactETH(amountOut, amountInMax, path, to, deadline);
        return;
      }
      if (this.inputSource == 'from') {
        this.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
        return;
      }

      if (this.inputSource == 'to') {
        this.swapTokensForExactTokens(amountOut, amountInMax, path, to, deadline);
        return;
      }
    },
    async swapExactETHForTokens(amountIn, amountOutMin, path, to, deadline) {
      const jackRouterContract = useJackRouterContract();
      const gas = await jackRouterContract.methods.swapExactETHForTokens(amountOutMin, path, to, deadline).estimateGas({ from: this.account, value: amountIn });
      this.swapDetailShow = false;
      this.pendingDetailShow = true;
      jackRouterContract.methods
        .swapExactETHForTokens(amountOutMin, path, to, deadline)
        .send({ from: this.account, value: amountIn, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
        .on('transactionHash', hash => {
          const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap1')} ${this.toInput} ${this.toCur.symbol}`;
          const title = this.$t('lang.swap18');
          const transactionsDetail = {
            hash,
            title,
            message,
            addedTime: new Date().getTime(),
            from: this.account,
          };
          this.$store.commit('SETTRANSACTIONS', transactionsDetail);
          this.pendingDetail.status = 1;
          this.pendingDetail.hash = hash;
        })
        .on('error', (error, receipt) => {
          this.pendingDetail.status = 2;
          throw error;
        });
    },
    async swapETHForExactTokens(amountOut, amountInMax, path, to, deadline) {
      const jackRouterContract = useJackRouterContract();
      const gas = await jackRouterContract.methods
        .swapETHForExactTokens(amountOut, path, to, deadline)
        .estimateGas({ from: this.account, value: amountInMax })
        .catch(async e => {
          const gas = await jackRouterContract.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(amountOut, path, to, deadline).estimateGas({ from: this.account, value: amountInMax });
          this.swapDetailShow = false;
          this.pendingDetailShow = true;
          jackRouterContract.methods
            .swapExactETHForTokensSupportingFeeOnTransferTokens(amountOut, path, to, deadline)
            .send({ from: this.account, value: amountInMax, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
            .on('transactionHash', hash => {
              const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap1')} ${this.toInput} ${this.toCur.symbol}`;
              const title = this.$t('lang.swap18');
              const transactionsDetail = {
                hash,
                title,
                message,
                addedTime: new Date().getTime(),
                from: this.account,
              };
              this.$store.commit('SETTRANSACTIONS', transactionsDetail);
              this.pendingDetail.status = 1;
              this.pendingDetail.hash = hash;
            })
            .on('error', (error, receipt) => {
              this.pendingDetail.status = 2;
              throw error;
            });
        });
      this.swapDetailShow = false;
      this.pendingDetailShow = true;
      jackRouterContract.methods
        .swapETHForExactTokens(amountOut, path, to, deadline)
        .send({ from: this.account, value: amountInMax, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
        .on('transactionHash', hash => {
          const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap1')} ${this.toInput} ${this.toCur.symbol}`;
          const title = this.$t('lang.swap18');
          const transactionsDetail = {
            hash,
            title,
            message,
            addedTime: new Date().getTime(),
            from: this.account,
          };
          this.$store.commit('SETTRANSACTIONS', transactionsDetail);
          this.pendingDetail.status = 1;
          this.pendingDetail.hash = hash;
        })
        .on('error', (error, receipt) => {
          this.pendingDetail.status = 2;
          throw error;
        });
    },
    async swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline) {
      const jackRouterContract = useJackRouterContract();
      const gas = await jackRouterContract.methods.swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline).estimateGas({ from: this.account });
      this.swapDetailShow = false;
      this.pendingDetailShow = true;
      jackRouterContract.methods
        .swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline)
        .send({ from: this.account, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
        .on('transactionHash', hash => {
          const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap1')} ${this.toInput} ${this.toCur.symbol}`;
          const title = this.$t('lang.swap18');
          const transactionsDetail = {
            hash,
            title,
            message,
            addedTime: new Date().getTime(),
            from: this.account,
          };
          this.$store.commit('SETTRANSACTIONS', transactionsDetail);
          this.pendingDetail.status = 1;
          this.pendingDetail.hash = hash;
        })
        .on('error', (error, receipt) => {
          this.pendingDetail.status = 2;
          throw error;
        });
    },
    async swapTokensForExactETH(amountOut, amountInMax, path, to, deadline) {
      const jackRouterContract = useJackRouterContract();
      const gas = await jackRouterContract.methods.swapTokensForExactETH(amountOut, amountInMax, path, to, deadline).estimateGas({ from: this.account });
      this.swapDetailShow = false;
      this.pendingDetailShow = true;
      jackRouterContract.methods
        .swapTokensForExactETH(amountOut, amountInMax, path, to, deadline)
        .send({ from: this.account, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
        .on('transactionHash', hash => {
          const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap1')} ${this.toInput} ${this.toCur.symbol}`;
          const title = this.$t('lang.swap18');
          const transactionsDetail = {
            hash,
            title,
            message,
            addedTime: new Date().getTime(),
            from: this.account,
          };
          this.$store.commit('SETTRANSACTIONS', transactionsDetail);
          this.pendingDetail.status = 1;
          this.pendingDetail.hash = hash;
        })
        .on('error', (error, receipt) => {
          this.pendingDetail.status = 2;
          throw error;
        });
    },
    async swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline) {
      const jackRouterContract = useJackRouterContract();
      const gas = await jackRouterContract.methods
        .swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)
        .estimateGas({ from: this.account })
        .catch(async e => {
          const gas = await jackRouterContract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, to, deadline).estimateGas({ from: this.account });
          this.swapDetailShow = false;
          this.pendingDetailShow = true;
          jackRouterContract.methods
            .swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, to, deadline)
            .send({ from: this.account, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
            .on('transactionHash', hash => {
              const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap1')} ${this.toInput} ${this.toCur.symbol}`;
              const title = this.$t('lang.swap18');
              const transactionsDetail = {
                hash,
                title,
                message,
                addedTime: new Date().getTime(),
                from: this.account,
              };
              this.$store.commit('SETTRANSACTIONS', transactionsDetail);
              this.pendingDetail.status = 1;
              this.pendingDetail.hash = hash;
            })
            .on('error', (error, receipt) => {
              this.pendingDetail.status = 2;
              throw error;
            });
        });
      this.swapDetailShow = false;
      this.pendingDetailShow = true;
      jackRouterContract.methods
        .swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)
        .send({ from: this.account, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
        .on('transactionHash', hash => {
          const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap1')} ${this.toInput} ${this.toCur.symbol}`;
          const title = this.$t('lang.swap18');
          const transactionsDetail = {
            hash,
            title,
            message,
            addedTime: new Date().getTime(),
            from: this.account,
          };
          this.$store.commit('SETTRANSACTIONS', transactionsDetail);
          this.pendingDetail.status = 1;
          this.pendingDetail.hash = hash;
        })
        .on('error', (error, receipt) => {
          this.pendingDetail.status = 2;
          throw error;
        });
    },
    async swapTokensForExactTokens(amountOut, amountInMax, path, to, deadline) {
      const jackRouterContract = useJackRouterContract();
      const gas = await jackRouterContract.methods.swapTokensForExactTokens(amountOut, amountInMax, path, to, deadline).estimateGas({ from: this.account });
      this.swapDetailShow = false;
      this.pendingDetailShow = true;
      jackRouterContract.methods
        .swapTokensForExactTokens(amountOut, amountInMax, path, to, deadline)
        .send({ from: this.account, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
        .on('transactionHash', hash => {
          const message = `${this.fromInput} ${this.fromCur.symbol} ${this.$t('lang.swap1')} ${this.toInput} ${this.toCur.symbol}`;
          const title = this.$t('lang.swap18');
          const transactionsDetail = {
            hash,
            title,
            message,
            addedTime: new Date().getTime(),
            from: this.account,
          };
          this.$store.commit('SETTRANSACTIONS', transactionsDetail);
          this.pendingDetail.status = 1;
          this.pendingDetail.hash = hash;
        })
        .on('error', error => {
          this.pendingDetail.status = 2;
          throw error;
        });
    },

    async handleGetAllPair() {
      if (this.getWrap || this.getWithdraw) {
        this.allpaths = [];
        return;
      }
      if (this.fromCur.address == '' || this.toCur.address == '') {
        return;
      }
      const allPair = getAllPair(this.fromCur, this.toCur);
      const promisePairAddress = allPair.map(item => {
        const jackFactoryContract = getJackFactoryContract();
        const pairAddress = jackFactoryContract.methods.getPair(item.fromCur.address, item.toCur.address).call();
        return pairAddress;
      });
      let allPairAddress = await Promise.all(promisePairAddress);
      let lpPair = [];
      for (let i = 0; i < allPair.length; i++) {
        const lpAddress = allPairAddress[i];
        if (lpAddress == '0x0000000000000000000000000000000000000000') {
          continue;
        }
        lpPair.push({ lpAddress, ...allPair[i] });
      }

      let promiseReserve = lpPair.map(item => {
        const jackPairContract = getJackPairContract(item.lpAddress);
        const reserves = jackPairContract.methods.getReserves().call();
        return reserves;
      });

      const allReserves = await Promise.all(promiseReserve);
      let newlpPair = lpPair.map((item, index) => {
        let newItem = JSON.parse(JSON.stringify(item));
        if (newItem.fromCur.address.toLowerCase() < newItem.toCur.address.toLowerCase()) {
          newItem.fromCur.reserves = allReserves[index]._reserve0;
          newItem.toCur.reserves = allReserves[index]._reserve1;
        } else {
          newItem.fromCur.reserves = allReserves[index]._reserve1;
          newItem.toCur.reserves = allReserves[index]._reserve0;
        }
        return newItem;
      });
      let pathFrom = [];
      for (let i of newlpPair) {
        if (i.fromCur.address == this.fromCur.address) {
          pathFrom.push(i);
        }
      }
      let pathTo = [];

      for (let i of newlpPair) {
        if (i.toCur.address == this.toCur.address) {
          pathTo.push(i);
        }
      }

      let allpaths = [];
      // 算出到底有多少条路径
      for (let i = 0; i < pathFrom.length; i++) {
        const item = pathFrom[i];
        const findItem = pathTo.find(toItem => {
          return item.toCur.address == toItem.fromCur.address;
        });
        if (findItem && findItem.toCur.address == this.toCur.address) {
          allpaths.push([item, findItem]);
          continue;
        }
        if (item.toCur.address == this.toCur.address) {
          allpaths.push([item]);
        }
      }
      this.allpaths = allpaths;

      if (this.inputSource === 'from') {
        this.getAmountsOut();
      }

      if (this.inputSource === 'to') {
        this.getAmountsIn();
      }
    },

    // from的输入框
    async hanldeInputFrom() {
      this.inputSource = 'from';
      this.getAmountsOut();
    },

    //to的输入框
    hanldeInputTo() {
      this.inputSource = 'to';
      this.getAmountsIn();
    },

    // 是否需要显示授权按钮
    async handleApproveBtnShow() {
      if (isBnb(this.fromCur) || this.fromCur.address == '') {
        this.allowanceToRouter = false;
        return;
      }
      if (this.account) {
        const erc20Contract = getErc20Contract(this.fromCur.address);
        const to = getJackRouterAddress();
        const allowance = await erc20Contract.methods.allowance(this.account, to).call();
        if (allowance == 0) {
          this.allowanceToRouter = true;
        } else {
          this.allowanceToRouter = false;
        }
      }
    },
    // 设置输入框最大值
    async handleToMax() {
      this.fromInput = this.fromCur.balance;
      this.inputSource = 'from';
      this.getAmountsOut();
    },
    async initialization() {
      this.handleCurBalance();
      // 余额定时器请求
      this.handleTimerBalance();
    },
    async handleTimerBalance() {
      window.clearTimeout(this.timerBalance);
      this.timerBalance = setInterval(async () => {
        this.handleCurBalance();
      }, 3000);
    },
    // 修改价格方向
    changePriceDirection() {
      this.priceDirection = !this.priceDirection;
      this.getPairPrice();
    },

    //
    handleSettingShow() {
      this.settingShow = true;
    },
    handleRecordShow() {
      this.transactionRecordShow = true;
    },
    async handlerSelecteCurrency(currency) {
      this.tokenListShow = false;
      if (this.tokenSource == 'from') {
        if (currency.address == this.toCur.address && currency.name == this.toCur.name) {
          this.turnAround();
        } else {
          this.fromCur = currency;
        }
      } else {
        if (currency.address == this.fromCur.address && currency.name == this.fromCur.name) {
          this.turnAround();
        } else {
          this.toCur = currency;
        }
      }
      this.handleGetAllPair();
      this.handleApproveBtnShow();
      this.handleCurBalance();
    },

    // 流动池价格
    async getPairPrice() {
      if (parseFloat(this.fromInput) === 0 || parseFloat(this.toInput) === 0) {
        this.fromInput = '';
        return;
      }

      if (this.fromCur.address === '' || this.toCur.address === '') {
        this.fromInput = '';
        return;
      }
      const fromInput = parseFloat(this.fromInput);
      const toInput = parseFloat(this.toInput);
      if (this.priceDirection) {
        const price = accDiv(fromInput, toInput);
        this.price = significantDigits(price);
      } else {
        const price = accDiv(toInput, fromInput);
        this.price = significantDigits(price);
      }
      this.priceShow = true;
    },
    async getAmountsOut() {
      this.insufficientLiquidityShow = false;
      if (parseFloat(this.fromInput) === 0 || this.fromInput == '') {
        this.toInput = '';
        this.priceShow = false;
        return;
      }

      if (this.fromCur.address === '' || this.toCur.address === '') {
        this.toInput = '';
        this.priceShow = false;
        return;
      }

      if (this.getWrap || this.getWithdraw) {
        this.toInput = this.fromInput;
        return;
      }

      if (this.multipath) {
        this.currentPaths = this.allpaths.filter(item => {
          return item.length == 1;
        });
      } else {
        this.currentPaths = this.allpaths;
      }
      let pathIndex = -1;
      let max = 0;
      console.log(this.currentPaths, 'currentPathscurrentPaths');
      for (let i = 0; i < this.currentPaths.length; i++) {
        const pathItem = this.currentPaths[i];
        let amounts = [];
        amounts[0] = parseAmount(this.fromInput, this.fromCur.decimals);
        for (let j = 0; j < pathItem.length; j++) {
          let reserveIn = pathItem[j].fromCur.reserves;
          let reserveOut = pathItem[j].toCur.reserves;
          if (reserveIn == 0 || reserveOut == 0) {
            amounts[j + 1] = 0;
            break;
          }
          let amountInWithFee = accMul(amounts[j], 997);
          let numerator = accMul(amountInWithFee, reserveOut);
          let denominator = accAdd(accMul(reserveIn, 1000), amountInWithFee);
          let amountOut = toFixed(accDiv(numerator, denominator), 0);
          amounts[j + 1] = amountOut;
        }
        if (accGt(amounts[amounts.length - 1], max)) {
          max = amounts[amounts.length - 1];
          pathIndex = i;
        }
      }
      if (pathIndex == -1 || this.currentPaths.length == 0) {
        this.insufficientLiquidityShow = true;
        this.toInput = '';
        return;
      }
      console.log(pathIndex, 'pathIndexpathIndex');
      this.pathIndex = pathIndex;
      this.toInput = formatAmount(max, this.toCur.decimals);
      this.getPairPrice();
    },

    async getAmountsIn() {
      this.insufficientLiquidityShow = false;
      if (parseFloat(this.toInput) === 0 || this.toInput == '') {
        this.fromInput = '';
        this.priceShow = false;
        return;
      }

      if (this.fromCur.address === '' || this.toCur.address === '') {
        this.fromInput = '';
        this.priceShow = false;
        return;
      }

      if (this.getWrap || this.getWithdraw) {
        this.fromInput = this.toInput;
        return;
      }

      if (this.multipath) {
        this.currentPaths = this.allpaths.filter(item => {
          return item.length == 1;
        });
      } else {
        this.currentPaths = this.allpaths;
      }
      let pathIndex = -1;
      let min = 0;

      for (let i = 0; i < 1; i++) {
        const pathItem = this.currentPaths[i];
        let amounts = [];

        amounts[pathItem.length] = parseAmount(this.toInput, this.toCur.decimals);
        for (let j = pathItem.length; j > 0; j--) {
          let reserveIn = pathItem[j - 1].fromCur.reserves;
          let reserveOut = pathItem[j - 1].toCur.reserves;
          if (reserveIn == 0 || reserveOut == 0) {
            amounts[j - 1] = 0;
            break;
          }
          let numerator = accMul(accMul(reserveIn, amounts[j]), 1000);
          let denominator = accMul(accSub(reserveOut, amounts[j]), 997);
          let amountIn = toFixed(accAdd(accDiv(numerator, denominator), 1), 0);
          amounts[j - 1] = amountIn;
        }

        if (accGt(amounts[0], 0)) {
          if (i == 0) {
            min = amounts[0];
            pathIndex = i;
          } else if (accGt(min, amounts[0])) {
            min = amounts[0];
            pathIndex = i;
          }
        }
      }

      this.pathIndex = pathIndex;
      // 流动性不足
      if (pathIndex == -1 || this.currentPaths.length == 0) {
        this.insufficientLiquidityShow = true;
        this.fromInput = '';
        return;
      }
      this.fromInput = formatAmount(min, this.fromCur.decimals);
      this.getPairPrice();
    },
    handleGetCurrency(tokenSource) {
      this.tokenSource = tokenSource;
      this.tokenListShow = true;
    },

    // 点击反转按钮
    handleTurnAround() {
      this.turnAround();
      this.handleGetAllPair();
      this.handleApproveBtnShow();
      this.handleCurBalance();
    },

    // 交换from to数据
    turnAround() {
      const tempCurrency = { ...this.toCur };
      this.toCur = { ...this.fromCur };
      this.fromCur = { ...tempCurrency };

      const tempInput = this.toInput;
      this.toInput = this.fromInput;
      this.fromInput = tempInput;

      this.inputSource = this.inputSource === 'from' ? 'to' : 'from';
    },

    async handleApprove() {
      const erc20Contract = useErc20Contract(this.fromCur.address);
      const amount = MaxUint256.toString();
      const to = getJackRouterAddress();
      const gas = await erc20Contract.methods.approve(to, amount).estimateGas({ from: this.account });
      this.approveLoading = true;
      erc20Contract.methods
        .approve(to, amount)
        .send({ from: this.account, gas: gasProcessing(gas), gasPrice: web3.utils.numberToHex(this.gasPrice) })
        .on('transactionHash', hash => {
          const transactionsDetail = {
            title: '',
            hash,
            message: `${this.$t('lang.swap14')} ${this.fromCur.symbol}`,
            addedTime: new Date().getTime(),
            from: this.account,
          };
          this.$store.commit('SETTRANSACTIONS', transactionsDetail);
        })
        .on('receipt', receipt => {
          this.handleApproveBtnShow();
          this.approveLoading = false;
        })
        .on('error', (error, receipt) => {
          this.approveLoading = false;
          this.handleApproveBtnShow();
          throw error;
        });
    },
    significantDigits,
  },
};
</script>

<style lang="less" scoped>
.swap {
  background: #fff;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0px 6px 32px rgba(13, 13, 13, 0.08);
  // border: 2px solid #f2f2f2;
  .headWrap {
    padding: 16px 16px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    .title {
      font-weight: 700;
      font-size: 18px;
    }
    .iconSet {
      width: 20px;
      height: 20px;
      // margin-right: 23px;
      cursor: pointer;
    }
    .iconRecord {
      width: 20px;
      height: 20px;
      margin-left: 15px;
      cursor: pointer;
    }
    .iconHash {
      width: 20px;
      height: 20px;
    }
    .text {
      color: #9289c1;
      font-size: 14px;
      margin-top: 4px;
    }
  }
  .container {
    padding: 20px;
    .box {
      padding: 10px 15px;
      // background: @background-gray;
      border-radius: 10px;
      background: #edeaf1;
      border: 1px solid #dedede;
      .btRow {
        margin-top: 10px;
        .maxWord {
          color: #5ec4d2;
          font-weight: bold;
          cursor: pointer;
        }
      }
      .van-cell {
        background: transparent;
        padding: 0;
      }
      .tokenSymbol {
        cursor: pointer;
      }
      .selectedCurrency {
        display: flex;
        align-items: center;
        .tokenDetail {
          display: flex;
          align-items: center;
        }
        .tokenImg {
          margin-right: 5px;
          margin-left: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }
    .iconDown {
      height: 18px;
      width: 18px;
      display: block;
      margin: 13px auto;
      cursor: pointer;
    }

    .price {
      padding: 0 10px;
      margin-top: 15px;
      .text {
        font-size: 14px;
        font-weight: bold;
      }
      .opppsite {
        height: 10px;
        width: 10px;
      }
    }
    .slipWrap {
      padding: 0 10px;
      margin-top: 15px;
      .text {
        font-size: 14px;
        font-weight: bold;
      }
    }
    .swapBtn {
      width: 100%;
      margin-top: 22px;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
