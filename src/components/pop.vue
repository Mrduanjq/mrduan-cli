<template lang="html">
  <div class="pop-component-wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
  .pop-component-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background-color: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
