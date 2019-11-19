<template>
  <select v-model="type" class="select-type">
    <option
      v-for="one in types"
      :key="one.value"
      :value="one.value"
    >{{one.value}}</option>
  </select>
</template>

<script>
export default {
  name: 'select-type',
  data() {
    return {
      type: '',
      basicTypes: [
        { label: '字符串', value: 'string' },
        { label: '数字', value: 'number' },
        { label: '布尔值', value: 'boolean' },
        { label: 'null', value: 'null' },
        { label: '对象', value: 'object' },
        { label: '数组', value: 'array' },
      ],
    };
  },
  props: {
    value: {},
    isRoot: {
      default: () => false,
    },
  },
  computed: {
    types() {
      return this.isRoot ? this.basicTypes.filter(one => ['object', 'array'].includes(one.value)) : this.basicTypes;
    },
  },
  watch: {
    value: {
      handler(val) {
        this.type = val;
      },
      immediate: true,
    },
    type(val) {
      this.$emit('input', val);
    },
  },
};
</script>

<style scoped>
.select-type{
  position: relative;
  top:2px;
}
</style>
