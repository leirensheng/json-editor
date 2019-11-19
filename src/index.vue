<template>
  <div :class="isRoot?'':'has-border'">
    <div class="object-row" :key="getRandomId()">
      <XLine
        v-if="!isRoot"
        style="position:relative;top:-4px"
      ></XLine>
      <span
        v-else
        style="margin-left:30px"
      ></span>
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

      <input
        type="text"
        v-if="['number','string'].includes(type)"
        :value="value"
        @input="e=>updateVal(e.target.value)"
      >
      <select
        v-if="type==='boolean'"
        :value="value"
        @input="(e)=>updateVal(e)"
      >
        <option :value="true">true</option>
        <option :value="false">false</option>
      </select>

      <delete-btn
        class="delete-btn"
        v-if="!isRoot"
        @click="()=>this.$emit('deleteItem', bindKey)"
      ></delete-btn>
    </div>

    <div v-if="isObjectOrArray">
      <div v-if="type==='array'">
        <json-editor
          class="has-margin"
          v-for="(item,index) in value"
          :key="index"
          :isRoot="false"
          :bindKey="index"
          :value="item"
          @deleteItem="handleDelete"
          @update:value="(newVal)=>handleUpdateVal({value,key:index,newVal})"
        ></json-editor>
      </div>
      <div v-else>
        <json-editor
          class="has-margin"
          v-for="(val,key) in value"
          :key="key"
          :isRoot="false"
          :value="val"
          :bindKey="key"
          @deleteItem="handleDelete"
          @update:bindKey="(newBindKey)=>handleUpdateKey({key,value,newBindKey})"
          @update:value="(newVal)=>handleUpdateVal({key,value,newVal})"
        ></json-editor>
      </div>
      <add-btn @click="handleAdd"></add-btn>
    </div>
  </div>
</template>

<script>
import AddBtn from './components/add-btn.vue';
import DeleteBtn from './components/delete-btn.vue';
import XLine from './components/x-line.vue';
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
    isObjectOrArray() {
      return ['object', 'array'].includes(this.type);
    },
    type: {
      get() {
        return this.getType(this.value);
      },
      set(val) {
        let value;
        if (val === 'string' && this.type === 'number') {
          value = String(this.value);
        // eslint-disable-next-line no-restricted-globals
        } else if (val === 'number' && !isNaN(this.value - 0)) {
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
    XLine,
    SelectType,
    AddBtn,
    DeleteBtn,
  },

  data() {
    return {};
  },
  mounted() {
    this.updateVal = debounce(this.updateVal);
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
    handleUpdateVal({ value, key, newVal }) {
      this.$set(value, key, newVal);
    },
    handleUpdateKey({ value, key, newBindKey }) {
      const val = value[key];
      // eslint-disable-next-line no-param-reassign
      delete value[key];
      this.$set(value, newBindKey, val);
    },
    updateKey(val) {
      this.$emit('update:bindKey', val);
    },

    updateVal(val) {
      this.$emit('update:value', val);
    },
  },
};
</script>
<style >
input,
select {
  box-sizing: border-box;
  width: 95px;
  height: 27px;
  padding: 4px;
  border: 1px solid rgb(219, 203, 203);
}
input:disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}
</style>
<style scoped>
.has-border {
  border-left: 1px solid rgb(219, 203, 203);
}
.delete-btn {
  position: relative;
  top: 4px;
  margin-left: 10px;
}
.basic-item {
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
