<template>
  <svg
    width="1"
    :height="height"
    version="1.1"
  >
    <line
      x1="0"
      y1="0"
      x2="0"
      :y2="height"
      style="stroke: rgb(219, 203, 203);stroke-width:2"
    />
  </svg>
</template>

<script>
export default {
  props: {
    height: {
      default: 100,
    },
  },
};
</script>
