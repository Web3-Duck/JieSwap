<template>
  <div class="header">
    <div span="12" class="elcol1">
      <img src="@/assets/img/logo.png" alt="" class="logo" />
    </div>
    <div span="12" class="rightItem">
      <van-popover v-model="showPopover" className="langPopover" trigger="click" :actions="actions" @select="onSelect">
        <template #reference>
          <img src="@/assets/img/lang.png" alt="" class="rightIcon" />
        </template>
      </van-popover>
      <img src="@/assets/img/set.png" @click="handleSettingShow" alt="" class="rightIcon" />
      <div class="addressBox" v-if="account">
        <div class="walletBox">
          <img src="@/assets/img/wallet.png" alt="" class="wallet" />
        </div>
        <div class="account">
          {{ getAccount }}
        </div>
      </div>
      <van-button type="primary" class="loginBtn" v-else @click="handleLogin">{{ $t('lang.swap9') }}</van-button>
    </div>
    <van-popup v-model="settingShow" round>
      <SettingsModal @listenClose="handleSettingClose" />
    </van-popup>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import SettingsModal from '@/components/SettingsModal.vue';

export default {
  name: 'Header',
  components: {
    SettingsModal,
  },
  data() {
    return {
      settingShow: false,
      showPopover: false,
      actions: [
        { text: '中文', lang: 'zh', className: 'langPopover' },
        { text: 'English', lang: 'en', className: 'langPopover' },
      ],
    };
  },
  computed: {
    ...mapState(['account']),
    getAccount() {
      if (this.account) {
        return '0x...' + this.account.substring(this.account.length - 4, this.account.length);
      } else {
        return '';
      }
    },
  },
  created() {
    this.$i18n.locale = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
  },
  mounted() {},
  methods: {
    handleLogin() {
      this.$store.dispatch('setWallet');
    },
    handleSettingShow() {
      this.settingShow = true;
    },
    handleSettingClose() {
      this.settingShow = false;
    },
    onSelect(item) {
      console.log(item.lang, 'lang');
      // let lang = this.lang.$i18n.locale === 'zh' ? 'en' : 'zh';
      this.$i18n.locale = item.lang;
      localStorage.setItem('lang', item.lang);
    },
    changeLaguages() {
      let lang = this.$i18n.locale === 'zh' ? 'en' : 'zh';
      this.$i18n.locale = lang;
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  .rightItem {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .rightIcon {
      height: 20px;
      width: 20px;
      margin-right: 10px;
      cursor: pointer;
    }
    .loginBtn {
      height: 35px;
    }
  }
  .addressBox {
    max-width: 150px;
    line-height: 20px;
    font-size: 20px;
    // padding: 5px;
    display: flex;
    align-items: center;
  }
  .walletBox {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: -12px;
    z-index: 10;
    .wallet {
      height: 30px;
      width: 30px;
    }
  }
  .account {
    font-family: Kanit, sans-serif;
    font-size: 16px;
    font-weight: bold;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: rgb(239, 244, 245);
    padding: 0 5px 0 10px;
    line-height: 28px;
    color: #333;
    border-radius: 0 10px 10px 0;
  }
}
.logo {
  // width: 40px;
  height: 40px;
}
.van-popover__wrapper {
  height: 20px;
}
</style>

<style>
.langPopover .van-hairline--bottom::after {
  border-bottom-width: 0px !important;
}
</style>
