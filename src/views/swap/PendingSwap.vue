<template>
  <div class="pendingSwap">
    <div class="van-dialog__header">
      <div class="text">{{ $t('lang.swap27') }}</div>
      <div class="cancel" @click="handleClose"></div>
    </div>
    <div class="btContent">
      <div v-if="pendingDetail.status == 0">
        <img class="wait" src="@/assets/img/wait.png" alt="" />
        <div class="word1">{{ $t('lang.swap19') }}</div>
        <div class="word2">{{ $t('lang.swap20') }} {{ pendingDetail.fromInput }} {{ fromCur.symbol }} {{ $t('lang.swap21') }} {{ pendingDetail.toInput }} {{ toCur.symbol }}</div>
        <div class="word3">{{ $t('lang.swap22') }}</div>
      </div>
      <div v-if="pendingDetail.status == 1">
        <img class="wait" src="@/assets/img/reslove.png" alt="" />
        <div class="word1">{{ $t('lang.swap23') }}</div>
        <div class="word4" @click="viewHash(pendingDetail.hash)">{{ $t('lang.swap24') }}</div>
        <van-button type="primary" class="closeBtn" @click="handleClose">{{ $t('lang.swap25') }}</van-button>
      </div>
      <div v-if="pendingDetail.status == 2">
        <img class="wait" src="@/assets/img/reject.png" alt="" />
        <div>{{ $t('lang.swap26') }}</div>
        <van-button type="primary" class="closeBtn" @click="handleClose">{{ $t('lang.swap25') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { viewHash } from '@/utils/common';

export default {
  name: 'pendingSwap',
  props: ['pendingDetail', 'fromCur', 'toCur'],
  methods: {
    viewHash,
    handleClose() {
      this.$emit('listenClose');
    },
  },
};
</script>

<style lang="less" scoped>
.pendingSwap {
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
    padding: 0 16px 16px;
    text-align: center;
    .wait {
      width: 250px;
    }
    .word1 {
      font-weight: bold;
      font-size: 20px;
      line-height: 28px;
      color: #372590;
    }
    .word2 {
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      color: #372590;
      margin-top: 12px;
    }
    .word3 {
      font-size: 12px;
      line-height: 17px;
      color: #9d97ba;
      margin-top: 12px;
    }
    .word4 {
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      margin-top: 12px;
      color: #48dae9;
    }
    .closeBtn {
      height: 58px;
      line-height: 58px;
      width: 100px;
      margin-top: 18px;
    }
  }
  .tokenInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .leftItem {
      display: flex;
      align-items: center;
      .input {
        margin-left: 5px;
      }
      .tokenImg {
        height: 30px;
        width: 30px;
        border-radius: 5px;
      }
    }
  }
  .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .confirmBtn {
    width: 100%;
    margin-top: 22px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
