<template>
  <div :class="isRoot?'json-editor':'json-editor has-border'">
    <div class="one-item">
      <XLine
        v-if="!isRoot"
        style="position:relative;top:-1px"
      />
      <span
        v-else
        class="has-margin"
      />

      <el-input
        size="mini"
        type="text"
        placeholder="字段"
        v-model="tempKey"
        style="width:100px"
        :disabled="isRoot||typeof bindKey==='number'"
        @blur="handleBlur"
      />

      <span style="padding:0 10px">=</span>
      <select-type
        :disabled="isRoot && rootType!==''"
        :key="getRandomId()"
        class="slect-type"
        :isRoot="isRoot"
        v-model="type"
      />

      <el-input
        size="mini"
        style="width:100px;margin-left:10px"
        v-if="['number','string'].includes(type)"
        :value="value"
        placeholder="值"
        @input="updateVal"
      />
      <el-select
        size="mini"
        style="width:100px;margin-left:10px"
        v-if="type==='boolean'"
        :value="String(value)"
        @input="updateVal"
      >
        <el-option value="true">true</el-option>
        <el-option value="false">false</el-option>
      </el-select>

      <delete-btn
        class="delete-btn"
        v-if="!isRoot"
        @click="()=>this.$emit('deleteItem', bindKey)"
      />
    </div>

    <div v-if="isObjectOrArray" style="position:relative;top:-2px">
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
        />
      </div>
      <div v-else>
        <div v-for="(item) in objectToArrayData"  :key="item.uniqueKey">
          <json-editor
          class="has-margin"
          :isRoot="false"
          :value="value[item.key]"
          :bindKey="item.key"
          @deleteItem="handleDelete"
          @update:bindKey="(newBindKey)=>handleUpdateKey({key:item.key,value,newBindKey})"
          @update:value="(newVal)=>handleUpdateVal({key:item.key,value,newVal})"
        />
        </div>
      </div>
      <add-btn @click="handleAdd" />
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
    jsonName: {
      default: () => '',
    },
    rootType: {
      default: () => '',
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
        if (this.type === 'object' && val !== 'object') {
          this.objectToArrayData = [];
        }
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
  watch: {
    bindKey: {
      handler(val) {
        this.tempKey = this.jsonName || val;
      },
      immediate: true,
    },
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.type === 'object') {
          const keys = Object.keys(val);
          const arr = this.objectToArrayData;
          const objectDataKeys = arr.map(one => one.key);

          if (arr.length === keys.length) {
            const changeIndex = objectDataKeys.findIndex(one => !keys.includes(one));
            if (changeIndex !== -1) {
              const newKey = keys.find(one => !objectDataKeys.includes(one));
              const newVal = { ...arr[changeIndex], key: newKey };
              this.objectToArrayData.splice(changeIndex, 1, newVal);
            }
          } else if (arr.length > keys.length) {
            const deleteItemIdx = arr.findIndex(one => !keys.includes(one.key));
            this.objectToArrayData.splice(deleteItemIdx, 1);
          } else if (keys.length - arr.length === 1) {
            this.uniqueKey = this.uniqueKey + 1;
            const addNewKey = keys.find(key => !objectDataKeys.includes(key));
            this.objectToArrayData = [...arr, { value: val[addNewKey], key: addNewKey, uniqueKey: this.uniqueKey }];
          } else {
            const tempData = keys.map((key) => {
              this.uniqueKey = this.uniqueKey + 1;
              return {
                key,
                value: val[key],
                uniqueKey: this.uniqueKey,
              };
            });
            this.objectToArrayData = tempData.sort((a, b) => a.uniqueKey - b.uniqueKey);
          }
        }
      },
    },
  },

  data() {
    return {
      tempKey: '',
      uniqueKey: 1,
      objectToArrayData: [],
    };
  },
  mounted() {
    this.updateKey = debounce(this.updateKey);
  },
  methods: {
    getType,
    handleBlur() {
      this.handlerTempKeyChange(this.tempKey, '');
    },
    handlerTempKeyChange(val, oldVal) {
      this.$nextTick(() => {
        const keys = this.$parent.objectToArrayData.map(one => one.key);
        keys.pop();
        let message = '';
        if (val === '') {
          message = '字段名不能为空';
        } else if (keys.includes(val)) {
          message = `已经存在字段${val}`;
        }
        if (message) {
          this.$notification({
            message,
            type: 'warning',
          });
          this.tempKey = oldVal;
          this.updateKey(oldVal);
        } else {
          this.updateKey(val);
        }
      });
    },
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
      const isArray = this.type === 'array';
      if (!isArray) {
        if ('' in this.value) {
          this.$notification({
            message: '请先填写空的字段',
            type: 'warning',
          });
          return;
        }
      }
      const newValue = isArray
        ? [...this.value, '']
        : { ...this.value, '': '' };

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
      if (this.type === 'number') {
        if (!/^\d*$/g.test(val)) {
          this.$notification({
            message: '请输入数字',
            type: 'warning',
          });
        } else {
          this.$emit('update:value', Number(val));
        }
      } else if (this.type === 'boolean') {
        this.$emit('update:value', val !== 'false');
      } else {
        this.$emit('update:value', val);
      }
    },
  },
};
</script>
<style lang="scss">
</style>
<style scoped>
.has-border {
  border-left: 1px solid rgb(219, 203, 203);
}
.delete-btn {
  margin-left: 10px;
}
.select-type{
  position: relative;
  top:-0.5px;
}
.one-item {
  position: relative;
  padding-top: 25px;
  top: -1px;
  display: flex;
  align-items: center;
}
.has-margin {
  margin-left: 30px;
}
</style>
