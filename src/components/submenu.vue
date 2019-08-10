<template lang="html">
  <div class="sub-menu">
    <span @click="toggle('zhichu')" :class="[{'on': text == 'zhichu'}]"><strong>购买</strong></span>
    <span @click="toggle('shouru')" :class="[{'on': text == 'shouru'}]"><strong>中奖</strong></span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        text: "zhichu"
      }
    },
    methods: {
      toggle(txt) {
        this.text = txt;
      },
    },
  }
</script>

<style lang="less" scoped>
  .sub-menu{
    width: 678px;
    height: 80px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    padding: 6px 0px;
    span{
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 24px;
      &:nth-of-type(1){
        border-right: 1px solid #ececec;
      }
      strong{
        border-bottom: 2px solid transparent;
        width: 180px;
        height: 100%;
        line-height: 68px;
      }
      &.on{
        strong{
          border-bottom-color: #f00;
        }
      }
    }
  }
</style>
