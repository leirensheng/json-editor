<template>
  <el-input size="mini" style="width:100px;" v-model="temp" v-bind="$attrs" @blur="handleBlur" />
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
    },
    type: {
      type: String,
      default: () => 'number',
    },
    validateFunc: {
      type: Function,
      default: () => () => true,
    },
  },
  data() {
    return {
      temp: '',
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.temp = val;
      },
    },
  },
  methods: {
    handleBlur() {
      const val = this.temp;
      if (val !== this.value) {
        const isNumberType = this.type === 'number';
        if (isNumberType) {
          const reg = /^(-)?\d+(\.\d+)?$/;
          if (!reg.test(val)) {
            this.$notification({
              type: 'warning',
              message: '请输入数字',
            });
            this.temp = this.value;
            return;
          }
        }

        if (this.validateFunc(val)) {
          this.$emit('input', isNumberType ? Number(val) : val);
        } else {
          this.temp = this.value;
        }
      }
    },
  },
};
</script>
