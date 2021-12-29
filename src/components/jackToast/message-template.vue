<template>
  <transition name="m-message-fade" mode="in-out">
    <div
      class="m-message-wrapper"
      v-show="show"
      :style="{
        width: width,
      }"
      :class="['m-message-wrapper', wrapperClassName, pc ? 'pc-message-wrapper' : '']"
    >
      <message
        :class="[type && 'm-message--' + type, className]"
        @mouseenter.native="clearTimer"
        @mouseleave.native="startTimer"
        :content="message"
        :hash="hash"
        :closable="showClose"
        :is-collapsed="isCollapsed"
        :collapsable="collapsable"
        :close-handler="close"
        :title="title"
        :supportHTML="supportHTML"
      >
      </message>
    </div>
  </transition>
</template>
<script>
import Message from './message.vue';

export default {
  name: 'jackMessageTemplate',
  components: { Message },
  data() {
    return {
      show: false,
      type: 'info',
      iconImg: '',
      title: '',
      message: '',
      duration: 3000,
      showClose: false,
      isCollapsed: false,
      collapsable: true,
      width: '',
      className: '',
      wrapperClassName: '',
      supportHTML: false,
      onClose: null,
      timer: null,
      closed: false,
      hash: '',
      pc: false,
    };
  },
  watch: {
    closed(val) {
      if (val) {
        this.show = false;
        this.$el.addEventListener('animationend', this.destroyElement);
      }
    },
  },

  methods: {
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },
    clearTimer() {
      clearTimeout(this.timer);
    },
    startTimer() {
      if (this.duration > 0 && this.type !== 'loading') {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    destroyElement() {
      this.$el.removeEventListener('transitionend', this.destroyElement);
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
  },
  mounted() {
    if (this.type !== 'loading') {
      this.startTimer();
      if (this.duration <= 0) {
        this.showClose = true;
      }
    }
  },
};
</script>
