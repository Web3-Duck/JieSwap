<template>
  <div class="liquidity">
    <div class="headWrap">
      <van-row type="flex" justify="space-between">
        <van-col class="title">您的流动性</van-col>
        <van-col>
          <img src="@/assets/tw.png" alt="" class="iconSet" />
          <img src="@/assets/tw.png" alt="" class="iconHash" />
        </van-col>
      </van-row>
      <div class="text">移除流动性以回收代币</div>
    </div>
    <div class="container">
      <div class="box">
        <van-row type="flex" justify="space-between">
          <van-col class="title">从</van-col>
          <van-col>{{ fromBalance }}</van-col>
        </van-row>
        <van-row type="flex" justify="space-between" class="btRow">
          <van-col class="title"><van-field v-model="text" placeholder="0.0" /> </van-col>
          <van-col>选择币种</van-col>
        </van-row>
      </div>
      <img src="@/assets/tw.png" alt="" class="iconDown" />
      <div class="box">
        <van-row type="flex" justify="space-between">
          <van-col class="title">从</van-col>
          <van-col>{{ fromBalance }}</van-col>
        </van-row>
        <van-row type="flex" justify="space-between" class="btRow">
          <van-col class="title"><van-field v-model="text" placeholder="0.0" /> </van-col>
          <van-col>选择币种</van-col>
        </van-row>
      </div>
      <van-row type="flex" justify="space-between" class="slipWrap">
        <van-col class="text">滑点容差</van-col>
        <van-col>1%</van-col>
      </van-row>
      <van-button type="default" class="swapBtn">输入数量</van-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ERC20_ABI from '@/abis/erc20.json';
import PAIR_ABI from '@/abis/pair.json';
import REWARD_ABI from '@/abis/reward.json';
import { formatAmount, accMul, accDiv, toFixed, accAdd, accSub } from '@/utils/format.js';

export default {
  name: 'Home',
  data() {
    return {
      fromBalance: '',
      text: '',
    };
  },
  components: {},
  computed: {
    ...mapState(['web3', 'account', 'net']),
  },
  created() {},
  beforeDestroy() {},
  watch: {},
  methods: {},
};
</script>

<style lang="less" scoped>
.liquidity {
  background: #fff;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  .headWrap {
    padding: 32px 20px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    .title {
      font-weight: 700;
      font-size: 18px;
    }
    .iconSet {
      width: 20px;
      height: 20px;
      margin-right: 23px;
    }
    .iconHash {
      width: 20px;
      height: 20px;
    }
    .text {
      color: @gray;
      font-size: 14px;
      margin-top: 8px;
    }
  }
  .container {
    padding: 20px;
    .box {
      padding: 10px 15px;
      background: @background-gray;
      border-radius: 10px;
      .btRow {
        margin-top: 10px;
      }
      .van-cell {
        background: transparent;
        padding: 0;
      }
    }
    .iconDown {
      height: 16px;
      width: 16px;
      display: block;
      margin: 10px auto;
    }
    .slipWrap {
      padding: 0 10px;
      margin-top: 40px;
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
