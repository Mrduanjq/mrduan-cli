<template>
  <div class="banner-wrapper">
      <div class="banner-inner"> </div>
      <div class="banner-center"></div>
      <div class="banner-outer-1" :class="[{'on': isExit}]">
        <p>{{lang[language].banner[idx]}}</p>
      </div>
      <div class="banner-outer-2">
        <img @click="toggle" src="http://scratch-card.oss-ap-southeast-1.aliyuncs.com/images/scratch_banner/5.png" alt="">
      </div>
  </div>

</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {getBanner, SUCCESS} from '@/api/api'
  export default {
    data() {
      return {
        swiper: null,
        isExit: true,
        timer: null,
        idx: 0,
      }
    },
    created() {
      this.getBanner();
    },
    computed: {
      ...mapState(['home', 'lang', 'language'])
    },
    methods: {
      getBanner() {
        getBanner({}).then((res) => {
          if (res.status.code === SUCCESS) {
            this.getHomeData(res.data);
            return;
          }
          layer.msg(res.status.message);
        })
      },
      toggle() {
        this.isExit = false;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.idx = Math.floor(Math.random() * this.lang[this.language].banner.length);
          this.isExit = true;
        }, 500)
      },
      ...mapMutations(['getHomeData'])
    },
  }
</script>

<style lang="less" scoped>
  .banner-wrapper{
    position: relative;
    height: 220px;
    background-color: #73241e;
    overflow: hidden;
    .banner-inner{
      position: absolute;
      top: -230px;
      left: 50%;
      width: 830px;
      height: 830px;
      background: url(http://scratch-card.oss-ap-southeast-1.aliyuncs.com/images/scratch_banner/1.png) center top / 830px 830px no-repeat;
      animation: rotateZ 10s linear infinite;
    }
    .banner-center {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url(http://scratch-card.oss-ap-southeast-1.aliyuncs.com/images/scratch_banner/2.png) center center / 100% auto no-repeat;
    }
    .banner-outer-1{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 366px;
      height: 113px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px 50px 15px 15px;
      font-size: 30px;
      font-weight: 700;
      transition: transform 0.5s linear;
      transform: translate3d(-165px, -57.5px, 0) scale(0);
      background: url(http://scratch-card.oss-ap-southeast-1.aliyuncs.com/images/scratch_banner/4.png) center / 100% auto no-repeat;
      &.on{
        transform: translate3d(-330px, -20px, 0) scale(1);
      }
      p{line-height: 30px}
    }
    .banner-outer-2{
      position: absolute;
      top: 20px;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: right;
      img{
        width: 352px;
        animation: leftToRight 0.8s linear infinite alternate;
      }
    }
  }

  @keyframes rotateZ {
    from{
      transform:translateX(-50%) rotate(0deg);
    }
    to{
      transform:translateX(-50%) rotate(360deg);
    }
  }
  @keyframes leftToRight {
    0%{
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(-10deg);
    }
  }
</style>
