<template>
  <div class="settingsModal">
    <div class="van-dialog__header">
      <div class="text">{{ $t('lang.swap40') }}</div>
      <div class="cancel" @click="handleClose"></div>
    </div>
    <div class="van-hairline--top van-dialog__footer"></div>
    <div class="van-content">
      <div class="van-content-top">
        <div class="van-content-title">{{ $t('lang.swap41') }}</div>
        <div class="van-content-top-tab">
          <van-button :type="gasPrice == 5000000000 ? 'primary' : 'info'" class="gasPrice" @click="handlePrice(5000000000)">{{ $t('lang.swap42') }}(5)</van-button>
          <van-button :type="gasPrice == 6000000000 ? 'primary' : 'info'" class="gasPrice" @click="handlePrice(6000000000)">{{ $t('lang.swap43') }}(6)</van-button>
          <van-button :type="gasPrice == 7000000000 ? 'primary' : 'info'" class="gasPrice" @click="handlePrice(7000000000)">{{ $t('lang.swap44') }}(7)</van-button>
        </div>
      </div>

      <div class="van-content-bottom">
        <div class="van-content-title">{{ $t('lang.swap8') }}</div>
        <div class="van-content-bottom-tab">
          <van-button :type="slippage == 0.1 ? 'primary' : 'info'" class="cur" @click="handleSlippage(0.1)">0.1%</van-button>
          <van-button :type="slippage == 0.5 ? 'primary' : 'info'" class="cur" @click="handleSlippage(0.5)">0.5%</van-button>
          <van-button :type="slippage == 1 ? 'primary' : 'info'" class="cur" @click="handleSlippage(1)">1.0%</van-button>
          <div class="inputDiv1">
            <van-field type="number" class="slipInput" input-align="center" @input="onInputDeadlineSlippage" v-model="slippage" />
            <div class="uint">%</div>
          </div>
        </div>
        <div class="tip1" v-if="slippage >= 50">{{ $t('lang.swap46') }}</div>
        <div class="tip1" v-else-if="slippage == 0">{{ $t('lang.swap47') }}</div>
        <div class="tip1" v-else-if="slippage > 5">{{ $t('lang.swap48') }}</div>
        <div class="van-content-bottom-select">
          <div class="select-list">
            <div class="label">{{ $t('lang.swap49') }}</div>
            <van-field type="number" class="deadInput" input-align="center" @input="onInputDeadline" v-model="deadline" />
          </div>
          <!-- <div class="select-list">
            <div class="label">专家模式</div>
            <div class="select"><van-switch v-model="checked" size="25px" /></div>
          </div> -->
          <div class="select-list">
            <div class="label">{{ $t('lang.swap51') }}</div>
            <div class="select"><van-switch v-model="multipath" size="25px" @change="handleMultipath" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      gasPrice: '',
      slippage: '',
      deadline: 20,
      multipath: false,
    };
  },
  computed: {
    ...mapState('ModalStore', {
      settingsModal: state => state.settingsModal,
    }),
  },
  created() {
    this.gasPrice = this.$store.state.gasPrice;
    this.slippage = this.$store.state.slippage;
    this.deadline = this.$store.state.deadline;
    this.multipath = this.$store.state.multipath;
  },
  methods: {
    handleClose() {
      this.$emit('listenClose');
    },
    handlePrice(gasPrice) {
      this.gasPrice = gasPrice;
      localStorage.setItem('gasPrice', gasPrice);
      this.$store.commit('SET_GASPRICE', gasPrice);
    },
    handleSlippage(slippage) {
      this.slippage = slippage;
      localStorage.setItem('slippage', slippage);
      this.$store.commit('SET_SLIPPAGE', slippage);
    },
    handleMultipath(multipath) {
      this.multipath = multipath;
      localStorage.setItem('multipath', multipath);
      this.$store.commit('SET_MULTIPATH', multipath);
    },
    onInputDeadline(deadLine) {
      this.deadLine = deadLine;
      localStorage.setItem('deadLine', deadLine);
      this.$store.commit('SET_DEADLINE', deadLine);
    },
    onInputDeadlineSlippage(slippage) {
      if (this.slippage >= 50) {
        this.slippage = slippage;
        return;
      }
      this.slippage = slippage;
      localStorage.setItem('slippage', slippage);
      this.$store.commit('SET_SLIPPAGE', slippage);
    },
  },
};
</script>

<style lang="less" scoped>
.settingsModal {
  width: 350px;
  .van-dialog {
    height: 500px;
    overflow: auto;
  }
  .van-dialog__header {
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #e9e9e9;
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
  .van-content {
    padding: 20px;
  }

  .van-content-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #0c0047;
  }
  .van-content-top-tab {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    .gasPrice {
      margin-right: 15px;
      width: 94px;
      font-size: 16px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .active {
    background-color: #12cdb7;
    color: #ffffff;
  }
  //bottom
  .van-content-bottom {
    margin-top: 20px;

    .van-content-bottom-title {
      font-size: 14px;
    }
  }
  .van-content-bottom-tab {
    display: flex;
    align-items: center;
    margin-top: 20px;
    .cur {
      margin-right: 15px;
      width: 64px;
      font-size: 12px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      cursor: pointer;
    }
    .uint {
      color: #12cdb7;
    }
    .inputDiv1 {
      display: flex;
      color: #12cdb7;
      width: 84px;
      align-items: center;
      .slipInput {
        font-size: 12px;
        border-radius: 4px;
        height: 32px;
        line-height: 32px;
        background-color: #e9e9e9;
      }

      .uint {
        color: #12cdb7;
        margin-left: 4px;
      }
    }
  }
  //select
  .van-content-bottom-select {
    margin-top: 30px;
    .select-list {
      display: flex;
      font-size: 12px;
      margin-top: 20px;
      align-items: center;
      justify-content: space-between;
      .label {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        color: #0c0047;
      }
      .deadInput {
        width: 64px;
        height: 25px;
        border-radius: 4px;
        background-color: #e9e9e9;
        border: 0px;
        padding-left: 10px;
        color: #12cdb7;
      }
      .van-cell {
        padding: 0;
      }
      .van-cell::after {
        content: none;
      }
    }
  }
  .tip1 {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    margin-top: 10px;
    color: #cc9300;
  }
}
</style>
