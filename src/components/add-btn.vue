<template>
  <div class="add-btn">
    <y-line :height="30"></y-line>
    <X-Line></X-Line>
    <svg
      @click="handleAdd"
      t="1574079790530"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4941"
      width="24"
      height="24"
    >
      <path
        d="M512 149.333333c200.298667 0 362.666667 162.368 362.666667 362.666667s-162.368 362.666667-362.666667 362.666667S149.333333 712.298667 149.333333 512 311.701333 149.333333 512 149.333333z m0 64c-164.949333 0-298.666667 133.717333-298.666667 298.666667s133.717333 298.666667 298.666667 298.666667 298.666667-133.717333 298.666667-298.666667-133.717333-298.666667-298.666667-298.666667z m32 106.666667v160H704v64h-160V704h-64v-160.021333L320 544v-64l160-0.021333V320h64z"
        p-id="4942"
        fill="#bfbfbf"
      ></path>
    </svg>
  </div>
</template>
<script>
import YLine from './y-line.vue';
import XLine from './x-line.vue';

export default {
  components: { XLine, YLine },
  name: 'add-btn',
  methods: {
    handleAdd() {
      this.$emit('click');
    },
  },
};
</script>
<style scoped>
.add-btn {
  margin-left: 30px;
}
.icon{
  cursor: pointer;
  position: relative;
  left: -4px;
  top:12px;
}
</style>
