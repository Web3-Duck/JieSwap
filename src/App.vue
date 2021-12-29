<template>
  <div id="app">
    <Header></Header>
    <router-view class="router" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { simpleRpcProvider } from '@/utils/provider';
import Header from '@/components/Header.vue';
export default {
  name: 'App',
  components: {
    Header,
  },
  beforeCreate() {
    this.$store.dispatch('setWebProvider');
  },
  computed: {
    ...mapState(['account', 'provider', 'gasPrice', 'slippage', 'deadline', 'transactions', 'block']),
  },
  async created() {
    const blockNumber = await simpleRpcProvider.eth.getBlockNumber();
    this.$store.commit('SETBLOCK', blockNumber);
    this.timer = setInterval(async () => {
      const blockNumber = await simpleRpcProvider.eth.getBlockNumber();
      this.$store.commit('SETBLOCK', blockNumber);
    }, 6000);
  },
  watch: {
    block() {
      this.handleUpdateTransactions();
    },
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  },
  methods: {
    async handleUpdateTransactions() {
      if (!this.account) {
        return;
      }
      const allTransactions = Object.values(this.transactions);
      const pendTransactions = allTransactions.filter(item => {
        return !item.receipt && item.from.toLowerCase() == this.account.toLowerCase();
      });
      pendTransactions.forEach((item, index) => {
        simpleRpcProvider.eth.getTransactionReceipt(item.hash).then(receipt => {
          if (receipt) {
            this.$store.commit('SETTRANSACTIONSRECEIPT', {
              hash: item.hash,
              receipt,
            });
            if (document.documentElement.clientWidth < 400) {
              this.$message({ type: 'success', title: item.title, message: item.message, hash: receipt.hash });
            } else {
              this.$message({
                position: 'top-right',
                type: 'success',
                title: item.title,
                message: item.message,
                hash: receipt.hash,
              });
            }
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
#app {
  font-family: Roboto, Segoe UI, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #372590;
  height: 100%;
  image-rendering: -webkit-optimize-contrast;
  .router {
    height: calc(100% - 50px);
  }
}
</style>
