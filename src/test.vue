<template>
  <div>
    <div style="width:1250px">
      <json-editor v-model="json"></json-editor>
    </div>
  </div>

</template>

<script>
import jsonEditor from './index.vue';

export default {
  components: { jsonEditor },
  data() {
    return {
      // json:[123]
      json: { a: [{ b: 4 }] },
    };
  },
  watch: {
    json: {
      deep: true,
      handler(val) {
        console.log(JSON.stringify(val, null, 4));
      },
    },
  },
  mounted() {},
  methods: {},
};
</script>
