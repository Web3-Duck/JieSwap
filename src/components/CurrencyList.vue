<template>
  <div class="currencyList">
    <div class="van-dialog__header">
      <div v-if="status === 0">
        <div class="text">{{ $t('lang.swap13') }}</div>
      </div>
      <div v-else-if="status === 1" class="headerLeft">
        <van-image round @click="turnLeft" class="turnleft" :src="require('@/assets/img/back.png')" />
        <div class="text">{{ $t('lang.swap33') }}</div>
      </div>
      <div v-else-if="status === 2" class="headerLeft">
        <van-image round @click="turnLeft" class="turnleft" :src="require('@/assets/img/back.png')" />
        <div class="text">{{ $t('lang.swap34') }}</div>
      </div>
      <div class="cancel" @click="handleClose"></div>
    </div>
    <div class="btContent" v-if="status === 0">
      <div class="inputWrap"><van-field class="tokenInput" v-model="searchValue" :placeholder="$t('lang.swap39')" @input="handleSearchValue" /></div>
      <div class="currencyWrap">
        <div @click="handleSelect(item)" v-for="(item, index) in currencyList" class="currency" :key="index">
          <div class="leftItem">
            <van-image round class="tokenImg" :src="item.logoURI" />
            <div>
              <div class="symbol">{{ item.symbol }}</div>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
          <div>{{ significantDigits(item.balance) }}</div>
        </div>
        <div v-if="searchErc20.address" class="currency">
          <div class="leftItem">
            <van-image round class="tokenImg" :src="searchErc20.logoURI" />
            <div>
              <div class="symbol">{{ searchErc20.symbol }}</div>
              <div class="name">{{ searchErc20.name }}</div>
            </div>
          </div>
          <van-button @click="importToken" type="primary" class="importToken">{{ $t('lang.swap35') }}</van-button>
        </div>
      </div>
      <div class="manageTokens" @click="hanldeManageTokens">{{ $t('lang.swap36') }}</div>
    </div>
    <div class="btContent" v-if="status === 1">
      <div class="inputWrap"><van-field class="tokenInput" v-model="searchValue" :placeholder="$t('lang.swap39')" @input="handleSearchValueStore" /></div>
      <div class="currencyWrap currencyWrapManage">
        <div v-for="(item, index) in storeCurList" class="currency" :key="index">
          <div class="leftItem">
            <van-image round class="tokenImg" :src="item.logoURI" />
            <div>
              <div class="symbol">{{ item.symbol }}</div>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
          <div class="rightItem">
            <van-image @click="handleDeleteCur(item, index)" class="delete" :src="require('@/assets/img/cancel.png')" />
            <van-image class="viewHash" @click="viewToken(item.address)" :src="require('@/assets/img/share.png')" />
          </div>
        </div>
      </div>
      <div class="clearTokens">
        <div class="tipText">{{ storeCurList.length }} {{ $t('lang.swap37') }}</div>
        <van-button @click="clearAll" type="info" class="clearAll">{{ $t('lang.swap38') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { simpleRpcProvider } from '@/utils/provider';
import { viewToken } from '@/utils/common';
import DEFAULT_TOKEN_LIST from '@/config/constants/tokenList';
import { mapState } from 'vuex';
import { getErc20Contract } from '@/utils/contractHelp';
import { formatAmount, significantDigits } from '@/utils/format';
import { BNB } from '@/config/constants/bnb';
import web3 from 'web3';
export default {
  name: 'TokenList',
  data() {
    return {
      currencyList: [],
      currencyAllList: [], //所有币种列表
      showBnb: true,
      searchValue: '',
      searchErc20: {
        name: '',
        symbol: '',
        address: '',
        chainId: 56,
        decimals: '',
        balance: '',
        logoURI: 'https://swap.model-swap.com/tokenImg/default.png',
      },
      status: 0,
      storeCurList: [], //自定义代币
    };
  },
  props: ['show'],
  computed: {
    ...mapState(['account']),
  },
  async created() {
    try {
      this.storeCurList = localStorage.getItem('curList') ? JSON.parse(localStorage.getItem('curList')) : [];
    } catch (e) {
      this.storeCurList = [];
    }

    this.currencyList = [BNB, ...DEFAULT_TOKEN_LIST.tokens, ...this.storeCurList];
    this.currencyAllList = [BNB, ...DEFAULT_TOKEN_LIST.tokens, ...this.storeCurList];
  },
  mounted() {
    this.handleCurrencyList();
  },
  watch: {
    account() {
      this.handleCurrencyList();
    },
  },
  methods: {
    clearAll() {
      this.storeCurList = [];
      localStorage.setItem('curList', JSON.stringify([]));
      this.handleCurrencyList();
    },
    turnLeft() {
      this.searchValue = '';
      this.status = 0;
    },
    handleDeleteCur(item, index) {
      this.storeCurList.splice(index, 1);
      localStorage.setItem('curList', JSON.stringify(this.storeCurList));
      this.currencyList = this.currencyList.filter((curItem, index) => {
        return curItem.address.toLowerCase() != item.address.toLowerCase();
      });
      this.currencyAllList = this.currencyAllList.filter((curItem, index) => {
        return curItem.address.toLowerCase() != item.address.toLowerCase();
      });
    },
    hanldeManageTokens() {
      this.searchValue = '';
      this.status = 1;
    },

    handleClose() {
      this.$emit('listenClose');
    },
    importToken() {
      try {
        let storeCurList = localStorage.getItem('curList') ? JSON.parse(localStorage.getItem('curList')) : [];
        storeCurList.push(this.searchErc20);
        localStorage.setItem('curList', JSON.stringify(storeCurList));
      } catch (e) {
        let storeCurList = JSON.stringify([this.searchErc20]);
        localStorage.setItem('curList', storeCurList);
      }

      this.handleSelect(this.searchErc20);
    },
    async getErc20AllInfo(address) {
      const erc20Contract = getErc20Contract(address);
      const decimals = await erc20Contract.methods.decimals().call();
      const name = await erc20Contract.methods.name().call();
      const symbol = await erc20Contract.methods.symbol().call();
      this.searchErc20.address = address;
      this.searchErc20.decimals = decimals;
      this.searchErc20.name = name;
      this.searchErc20.symbol = symbol;
    },
    handleSelect(item) {
      this.$emit('listenSelecteCurrency', item);
      this.searchValue = '';
    },
    async handleSearchValueStore(value) {
      const lowerValue = value.toLowerCase();
      this.currencyList = this.filterList(this.currencyAllList, lowerValue);
    },
    async handleSearchValue(value) {
      const lowerValue = value.toLowerCase();
      this.currencyList = this.filterList(this.currencyAllList, lowerValue);
      if (web3.utils.isAddress(lowerValue) && this.currencyList.length == 0) {
        this.getErc20AllInfo(web3.utils.toChecksumAddress(lowerValue));
      }
    },
    async handleCurrencyList() {
      let storeCurList;
      try {
        storeCurList = localStorage.getItem('curList') ? JSON.parse(localStorage.getItem('curList')) : [];
      } catch (e) {
        storeCurList = [];
      }
      const tokenList = await this.getTokensBalance([...DEFAULT_TOKEN_LIST.tokens, ...storeCurList]);
      this.currencyList = await this.getBnbBalance(tokenList);
      this.currencyAllList = this.currencyList;
    },
    filterList(list, value) {
      if (value) {
        const newList = list.filter(item => {
          return item.address.toLowerCase().includes(value) || item.name.toLowerCase().includes(value) || item.symbol.toLowerCase().includes(value);
        });

        return newList;
      }
      return list;
    },
    async getBnbBalance(list) {
      const ethObject = BNB;
      if (this.showBnb) {
        if (this.account) {
          const bnbBalance = await simpleRpcProvider.eth.getBalance(this.account);
          ethObject.balance = formatAmount(bnbBalance);
        }
        return [ethObject, ...list];
      }
      return list;
    },
    async getTokensBalance(list) {
      if (this.account) {
        const p = list.map(item => {
          const erc20Contract = getErc20Contract(item.address);
          return erc20Contract.methods.balanceOf(this.account).call();
        });
        const balances = await Promise.all(p);

        return list.map((item, index) => {
          return { ...item, balance: formatAmount(balances[index], item.decimals) };
        });
      }

      return list.map(item => {
        return { ...item, balance: '' };
      });
    },
    significantDigits,
  },
};
</script>

<style lang="less" scoped>
.currencyList {
  width: 350px;
  display: flex;
  align-items: center;
  flex-direction: column;
  .van-dialog__header {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: linear-gradient(90deg, #f1eaf1 0%, #eaeef7 100%);
    font-weight: bold;
    font-size: 20px;
    position: relative;
    .cancel {
      width: 20px;
      height: 20px;
      background-image: url('~@/assets/img/cancel.png');
      background-size: contain;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    .headerLeft {
      display: flex;
      align-items: center;
    }
    .turnleft {
      // position: absolute;
      // left: 10px;
      height: 20px;
      width: 20px;
      margin-right: 5px;
      cursor: pointer;
    }
  }
  .btContent {
    width: 100%;
    flex: 1;
    .currencyWrap {
      margin-top: 30px;
      height: 350px;
      overflow-y: auto;
      padding: 0 16px;
    }
    .currencyWrapManage {
      height: auto;
      overflow-y: visible;
    }
    .inputWrap {
      padding: 0 16px;
      .tokenInput {
        height: 50px;
        background: #f8f4ff;
        border: 1px solid #e9dcff;
        margin-top: 15px;
        border-radius: 4px;

        /deep/.van-field__body {
          height: 50px;
          font-size: 16px;
          padding-left: 16px;
        }
      }
    }

    .currency {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      cursor: pointer;
      &:first-child {
        margin-top: 0;
      }
      .leftItem {
        align-items: center;
        display: flex;
        .tokenImg {
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
        .symbol {
          font-weight: bold;
          color: #22105a;
        }
        .name {
          color: #372590;
          font-size: 14px;
          line-height: 17px;
        }
      }
      .rightItem {
        display: flex;
        align-items: center;
        .delete {
          height: 10px;
          width: 10px;
        }
        .viewHash {
          margin-left: 10px;
          height: 10px;
          width: 10px;
        }
      }
      .importToken {
        width: 65px;
        line-height: 40px;
      }
    }
    .manageTokens {
      padding: 16px;
      font-weight: bold;
      font-size: 16px;
      line-height: 22px;
      color: #48dae9;
      text-align: center;
      cursor: pointer;
    }
    .clearTokens {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      .tipText {
        font-weight: 800;
        font-size: 14px;
        line-height: 17px;

        color: #372590;
      }
      .clearAll {
        font-weight: 900;
        font-size: 16px;
        line-height: 22px;
      }
    }
  }

  // background: red;
}
</style>
