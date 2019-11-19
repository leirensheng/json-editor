<template>
  <div :class="isRoot?'':'has-border'">
    <div v-if="['object','array'].includes(type)">
      <div class="object-row">
        <XLine
          v-if="!isRoot"
          style="position:relative;top:-4px"
        ></XLine>
        <span v-else style="margin-left:30px"></span>
        <input
          type="text"
          :value="bindKey"
          :disabled="isRoot||typeof bindKey==='number'"
          @input="(e)=>updateKey(e.target.value)"
        >
        <span>=</span>
        <select-type
          class="slect-type"
          :isRoot="isRoot"
          v-model="type"
        ></select-type>
        <delete-btn
         class="delete-btn"
         v-if="!isRoot"
          @click="()=>deleteItem({bindKey})"></delete-btn>
      </div>
      <div v-if="type==='array'">
        <json-editor
          :class="false?'':'has-margin'"
          v-for="(item,index) in value"
          :key="index"
          :isRoot="false"
          :bindKey="index"
          :value="item"
          @deleteItem="handleDelete"
          @updateNormalVal="(newVal)=>updateValByChild({key:index,value,newVal})"
          @update:value="(newVal)=>updateValByChild({value,key:index,newVal})"
        ></json-editor>
      </div>
      <div v-else>
        <json-editor
          :class="false?'':'has-margin'"
          v-for="(val,key) in value"
          :key="key"
          :isRoot="false"
          :value="val"
          :bindKey="key"
          @deleteItem="handleDelete"
          @updateNormalKey="(newBindKey)=>updateBindKeyByChild({key,value,newBindKey})"
          @updateNormalVal="(newVal)=>updateValByChild({key,value,newVal})"
          @update:bindKey="(newBindKey)=>updateBindKeyByChild({key,value,newBindKey})"
          @update:value="(newVal)=>updateValByChild({key,value,newVal})"
        ></json-editor>
      </div>

      <add-btn @click="handleAdd"></add-btn>
    </div>

    <basic-item
     class="basic-item"
      v-else
      :bindKey="bindKey"
      :value="value"
      :type="type"
      @deleteItem="()=>this.$emit('deleteItem',bindKey)"
      @update:type="(newType)=>this.type=newType"
      @update:bindKey="(newBindKey)=>this.$emit('updateNormalKey',newBindKey)"
      @update:value="(newVal)=>this.$emit('updateNormalVal',newVal)"
    ></basic-item>
  </div>
</template>

<script>
import AddBtn from './components/add-btn.vue';
import DeleteBtn from './components/delete-btn.vue';
import XLine from './components/x-line.vue';
import BasicItem from './components/basic-item.vue';
import SelectType from './components/types.vue';
import { getType, debounce } from './utils';


export default {
  name: 'json-editor',
  props: {
    value: {
      default: () => ({}),
    },
    isRoot: {
      default: true,
    },
    bindKey: {
      default: () => 'root',
    },
  },
  computed: {
    type: {
      get() {
        return this.getType(this.value);
      },
      set(val) {
        let value;
        if (val === 'string' && this.type === 'number') {
          value = String(this.value);
        } else if (val === 'number' && (!Math.isNaN(this.value - 0))) {
          value = Number(this.value);
        } else {
          const maps = {
            array: [],
            object: {},
            string: '',
            number: 0,
            boolean: false,
            null: null,
          };
          value = maps[val];
        }

        if (this.isRoot) {
          this.$emit('input', value);
        } else {
          this.$emit('update:value', value);
        }
      },
    },
  },
  components: {
    XLine, BasicItem, SelectType, AddBtn, DeleteBtn,
  },

  data() {
    return {
    };
  },
  mounted() {
    this.updateKey = debounce(this.updateKey);
  },
  methods: {
    getType,
    getRandomId() {
      return Math.random()
        .toString(16)
        .slice(-6);
    },
    handleDelete(key) {
      const copy = JSON.parse(JSON.stringify(this.value));
      if (this.type === 'array') {
        copy.splice(key, 1);
      } else {
        delete copy[key];
      }
      if (this.isRoot) {
        this.$emit('input', copy);
      } else {
        this.$emit('update:value', copy);
      }
    },
    handleAdd() {
      const newValue = this.type === 'array'
        ? [...this.value, '']
        : { ...this.value, [this.getRandomId()]: '' };
      if (this.isRoot) {
        this.$emit('input', newValue);
      } else {
        this.$emit('update:value', newValue);
      }
    },
    updateValByChild({ value, key, newVal }) {
      this.$set(value, key, newVal);
    },
    deleteItem({ bindKey }) {
      this.$emit('deleteItem', bindKey);
    },
    updateBindKeyByChild({ value, key, newBindKey }) {
      const val = value[key];
      // eslint-disable-next-line no-param-reassign
      delete value[key];
      this.$set(value, newBindKey, val);
    },
    updateKey(val) {
      this.$emit('update:bindKey', val);
    },
  },
};
</script>
<style >
 input,select{
   box-sizing: border-box;
  width: 95px;
  height: 27px;
  padding: 4px;
  border:1px solid rgb(219,203,203)
}
input:disabled{
  background-color: #f5f7fa;
  cursor: not-allowed;
}
</style>
<style scoped>

.has-border {
  border-left: 1px solid rgb(219, 203, 203);
}
.delete-btn{
  position: relative;
  top:4px;
  margin-left: 10px;
}
.basic-item{
  padding-top: 25px;

}
.object-row {
  position: relative;
  padding-top: 25px;
  top: -1px;
}
.has-margin {
  margin-left: 30px;
}
</style>
