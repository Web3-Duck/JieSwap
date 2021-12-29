<template>
  <div class="m-message" v-show="visible">
    <div class="toastbox">
      <div class="iconBox"><img src="@/assets/img/success.png" alt="" /></div>
      <div class="rightBox">
        <div class="content">
          <div class="title" v-if="content">{{ title }}</div>
          <div class="data" v-if="content">{{ content }}</div>
          <div class="scan" @click="viewHash(hash)">{{ $t('lang.swap24') }}</div>
        </div>
        <div class="closeBox">
          <img src="@/assets/img/cancel.png" alt="" @click="handleClose" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { viewHash } from '@/utils/common';

export default {
  name: 'jackMessage',
  props: {
    iconImg: String,
    closable: Boolean,
    closeHandler: Function,
    title: String,
    content: String,
    supportHTML: Boolean, // content support html
    isCollapsed: {
      type: Boolean,
      default: true,
    },
    collapsable: {
      type: Boolean,
      default: true,
    },
    hash: String,
  },
  data() {
    return {
      visible: true,
      collapsed: this.isCollapsed,
    };
  },
  methods: {
    viewHash,
    triggerCollapse() {
      this.collapsed = !this.collapsed;
    },
    close() {
      this.visible = false;
    },
    handleClose() {
      if (typeof this.closeHandler === 'function') this.closeHandler(this.close);
      else this.close();
    },
  },
};
</script>

<style lang="less" scoped>
.toastbox {
  width: 344px;
  background: #31d0aa;
  display: flex;

  // right: 0;
}
.iconBox {
  text-align: center;
  width: 64px;
  padding-top: 16px;
  img {
    width: 20px;
    height: 20px;
  }
}
.closeBox {
  width: 64px;
  text-align: center;
  img {
    width: 20px;
    height: 20px;
  }
}
.rightBox {
  background: #fff;
  padding: 16px;
  flex: 1;
  display: flex;
  .content {
    display: flex;
    flex: 1;
    justify-content: space-between;
    flex-direction: column;
    .title {
      font-weight: bold;
      font-size: 16px;
      line-height: 22px;

      color: #372590;
    }
    .data {
      font-size: 16px;
      line-height: 22px;
      margin-top: 20px;
      color: #372590;
    }
    .scan {
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      margin-top: 20px;
      color: #48dae9;
    }
  }
}
</style>
