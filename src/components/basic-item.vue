<template>
  <div style="padding-top:20px">
    <X-Line style="position:relative;top:-4px"></X-Line>
    <input
      type="text"
      :value="bindKey"
      :disabled="typeof bindKey==='number'"
      @input="(e)=>updateData('bindKey',e.target.value)"
    >
    <span>=</span>

    <select-type
      :value="type"
      @input="(e)=>updateData('type',e)"
    ></select-type>
    <span style="margin-left:14px" v-if="type!=='null'">
      <input
        v-if="!['null','boolean'].includes(type)"
        type="text"
         placeholder="值"
        :value="value"
        @input="(e)=>updateData('value',e.target.value)"
      >
      <select
        v-if="type==='boolean'"
        :value="value"
        @input="(e)=>updateData('value',e)"
      >
        <option :value="true">true</option>
        <option :value="false">false</option>
      </select>

    </span>
      <delete-btn class="delete-btn" @click="()=>this.$emit('deleteItem')"></delete-btn>
  </div>
</template>

<script>
import XLine from './x-line.vue';
import SelectType from './types.vue';
import DeleteBtn from './delete-btn.vue';

const REFRESHTIME = 500;

export default {
  name: 'basic-item',
  props: ['value', 'bindKey', 'type'],
  components: {
    XLine,
    SelectType,
    DeleteBtn,
  },
  data() {
    return {
      timmer: null,
    };
  },
  methods: {
    updateData(key, val) {
      if (key === 'type') {
        this.$emit(`update:${key}`, val);
      } else {
        clearTimeout(this.timmer);
        this.timmer = setTimeout(() => {
          let value = val;
          if (key === 'value' && this.type === 'number') {
            value = Number(val);
          }
          this.$emit(`update:${key}`, value);
          this.timmer = null;
        }, REFRESHTIME);
      }
    },
  },
  watch: {},
  computed: {},
};
</script>

<style scoped>
.delete-btn{
  position: relative;
  top:5px;
  margin-left: 10px
}
</style>
