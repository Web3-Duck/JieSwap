<template>
  <div class="swapDetail">
    <div class="van-dialog__header">
      <div class="text">{{ $t('lang.swap27') }}</div>
      <div class="cancel" @click="handleClose"></div>
    </div>
    <div class="btContent">
      <div class="tokenInfo">
        <div class="leftItem">
          <img class="tokenImg" :src="fromCur.logoURI" alt="" />
          <div class="input">{{ swapDetail.fromInput }}</div>
        </div>
        <div class="symbol">{{ fromCur.symbol }}</div>
      </div>
      <img class="down" src="@/assets/img/opposite.png" alt="" />
      <div class="tokenInfo">
        <div class="leftItem">
          <img class="tokenImg" :src="toCur.logoURI" alt="" />
          <div class="input">{{ swapDetail.toInput }}</div>
        </div>
        <div class="symbol">{{ toCur.symbol }}</div>
      </div>
      <div class="tip" v-if="swapDetail.inputSource === 'from'">
        {{ $t('lang.swap28', { inputOutMin: swapDetail.inputOutMin, symbol: toCur.symbol }) }}
      </div>
      <div class="tip" v-else>{{ $t('lang.swap29', { inputInMax: swapDetail.inputInMax, symbol: fromCur.symbol }) }}</div>

      <div class="wrap">
        <div class="wrapItem" @click="changePriceDirection">
          <div>{{ $t('lang.swap7') }}</div>
          <div class="priceItem">
            <div v-if="priceDirection">1{{ toCur.symbol }} = {{ swapDetail.price }} {{ fromCur.symbol }}</div>
            <div v-else>1{{ fromCur.symbol }} = {{ opppsitePrice }} {{ toCur.symbol }}</div>
            <van-image class="opppsite" :src="require('@/assets/img/opposite.png')" />
          </div>
        </div>
        <div class="wrapItem" v-if="swapDetail.inputSource === 'from'">
          <div>{{ $t('lang.swap30') }}</div>
          <div>{{ swapDetail.inputOutMin }} {{ toCur.symbol }}</div>
        </div>
        <div class="wrapItem" v-else>
          <div>{{ $t('lang.swap31') }}</div>
          <div>{{ swapDetail.inputInMax }} {{ fromCur.symbol }}</div>
        </div>
        <!-- <div class="wrapItem">
          <div>流动性供应商费用</div>
          <div>{{ swapDetail.fee }} {{ fromCur.symbol }}</div>
        </div> -->
      </div>
      <van-button type="primary" class="confirmBtn" @click="handleConfirm">{{ $t('lang.swap27') }}</van-button>
    </div>
  </div>
</template>

<script>
import { accDiv, significantDigits } from '@/utils/format.js';

export default {
  name: 'swapDetail',
  props: ['fromCur', 'toCur', 'swapDetail'],
  data() {
    return {
      priceDirection: true,
      opppsitePrice: '',
    };
  },
  mounted() {},
  methods: {
    handleConfirm() {
      this.$emit('listenConfirm');
    },
    handleClose() {
      this.$emit('listenClose');
    },
    changePriceDirection() {
      this.priceDirection = !this.priceDirection;
      this.opppsitePrice = significantDigits(accDiv(1, this.swapDetail.price));
    },
    significantDigits,
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

    padding: 0 16px;
  }
  .down {
    height: 20px;
    width: 20px;
  }
  .tokenInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    .leftItem {
      display: flex;
      align-items: center;
      .input {
        margin-left: 5px;
      }
      .tokenImg {
        height: 30px;
        width: 30px;
        border-radius: 50%;
      }
      .symbol {
        font-size: 16px;
      }
    }
  }
  .tip {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #a399d9;
    margin-top: 20px;
  }
  .wrap {
    background: #f8f7fa;
    border: 1px solid #f2f2f2;
    padding: 4px 16px;
    font-size: 14px;
    margin-top: 20px;
    .wrapItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      .priceItem {
        display: flex;
        align-items: center;
        .opppsite {
          height: 20px;
          width: 20px;
          margin-left: 4px;
        }
      }
    }
  }
  .confirmBtn {
    width: 100%;
    margin: 22px 0;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
