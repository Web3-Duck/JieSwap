<template>
  <div class="swapDetail">
    <div class="van-dialog__header">
      <div class="text">{{ $t('lang.swap52') }}</div>
      <div class="cancel" @click="handleClose"></div>
    </div>
    <div class="btContent">
      <div class="wrapItem" v-if="transactionsRecords.length">
        <div class="title">{{ $t('lang.swap52') }}</div>
        <van-button type="info" class="clear" @click="handleClear">{{ $t('lang.swap54') }}</van-button>
      </div>
      <div v-else>
        <div class="title">{{ $t('lang.swap53') }}</div>
      </div>
      <div class="wrapItem" v-for="(item, index) in transactionsRecords" :key="index">
        <div class="leftItem" @click="viewHash(item.hash)">
          <span class="message"> {{ item.message }}</span>
          <img class="share" src="@/assets/img/share.png" alt="" />
        </div>
        <div class="statusIcon" v-if="item.receipt == undefined"><img class="loading" src="@/assets/img/loading.png" alt="" /></div>
        <div class="statusIcon" v-else-if="item.receipt.status"><img src="@/assets/img/yes.png" alt="" /></div>
        <div class="statusIcon" v-else><img src="@/assets/img/err.png" alt="" /></div>

        <!-- <div>{{ item.hash }}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { accDiv, significantDigits } from '@/utils/format.js';
import { mapState } from 'vuex';
import { viewHash } from '@/utils/common';

export default {
  name: 'transactionRecord',
  props: ['fromCur', 'toCur', 'swapDetail'],
  data() {
    return {
      priceDirection: true,
      opppsitePrice: '',
      transactionsRecords: [],
    };
  },

  computed: {
    ...mapState(['account', 'provider', 'gasPrice', 'slippage', 'deadline', 'transactions']),
  },
  created() {
    const transactionsRecord = this.$store.state.transactions;
    const allTransactions = Object.values(transactionsRecord);
    this.transactionsRecords = allTransactions.sort((a, b) => {
      return a.addedTime - b.addedTime;
    });
  },
  watch: {
    '$store.state.transactions': {
      //监听的对象
      deep: true, //深度监听设置为 true
      handler: function (newV, oldV) {
        const transactionsRecord = this.$store.state.transactions;
        const allTransactions = Object.values(transactionsRecord);
        this.transactionsRecords = allTransactions.sort((a, b) => {
          return a.addedTime - b.addedTime;
        });
      },
    },
  },
  methods: {
    handleClear() {
      this.$store.commit('DELETETRANSACTIONS');
    },
    handleClose() {
      this.$emit('listenClose');
    },
    viewHash,
  },
};
</script>

<style lang="less" scoped>
.swapDetail {
  width: 350px;
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

    .cancel {
      width: 20px;
      height: 20px;
      background-image: url('~@/assets/img/cancel.png');
      background-size: contain;
      background-repeat: no-repeat;
      cursor: pointer;
    }
  }
  .btContent {
    width: 100%;

    padding: 16px 16px;
    .wrapItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .leftItem {
        display: flex;
        margin-right: 5px;
        padding: 4px 0;
        cursor: pointer;
        .message {
          font-weight: bold;
          font-size: 16px;
          line-height: 19px;
          color: #48dae9;
        }
        .share {
          height: 20px;
          width: 20px;
        }
      }
      .clear {
        height: 20px;
        margin: 10px 0;
      }
    }
    .title {
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      color: #372590;
    }
  }
  .statusIcon {
    img {
      height: 20px;
      width: 20px;
    }
    @-webkit-keyframes rotation {
      from {
        -webkit-transform: rotate(0deg);
      }

      to {
        -webkit-transform: rotate(360deg);
      }
    }
    .loading {
      -webkit-transform: rotate(360deg);

      animation: rotation 3s linear infinite;

      -moz-animation: rotation 3s linear infinite;

      -webkit-animation: rotation 3s linear infinite;

      -o-animation: rotation 3s linear infinite;
    }
  }
}
</style>
