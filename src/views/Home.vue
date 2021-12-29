<template>
  <div class="home">
    <!-- <div class="nav">
      <div :class="['navItem', selectdIndex == index ? 'selectd' : '']" v-for="(item, index) in list" :key="index" @click="handleSelectd(index, item.path)">{{ item.name }}</div>
    </div> -->
    <div class="content">
      <div class="router"><router-view /></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      list: [
        { name: '闪兑', path: '/swap' },
        { name: '流动池', path: '/liquidity' },
      ],
      selectdIndex: 0,
    };
  },
  methods: {
    handleSelectd(index, path) {
      if (index == this.selectdIndex) {
        return;
      }
      this.selectdIndex = index;
      this.$router.push(path);
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  .nav {
    display: flex;
    padding-left: 30px;
    height: 50px;
    .navItem {
      font-size: 18px;
      margin-right: 25px;
      line-height: 50px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 700;
    }
    .selectd {
      color: @green;
      position: relative;
      cursor: pointer;
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        height: 4px;
        width: 100%;
        background: @green;
        border-radius: 2px 2px 0 0;
      }
    }
  }
  .content {
    flex: 1;
    width: 100%;
    background: #f4f5f7;
    background-size: 100% 100%;
    padding: 0 16px;
    .router {
      margin: 0 auto;
      max-width: 600px;
      padding-top: 24px;
    }
  }
}
</style>
