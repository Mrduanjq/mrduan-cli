<template lang="html">
  <div class="loading">
    <my-audio></my-audio>
    <img :src="img" alt="">
    <div class="progress-wrapper">
      <span class="progress" :style="'width:'+percent+'px'"></span>
      <img class="icon-circle" :style="'left:'+percent+'px'" :src="require('../assets/images/icon_circle.png')" alt="">
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from "vuex"
  import Audio from "@/components/audio"
  import {getParam} from "@/common/common.js"
  export default {
    data() {
      return {
        img: "http://scratch-card.oss-ap-southeast-1.aliyuncs.com/images/start_bg_",
        count: 0,
        percent: '',
        len: 0,
        imgs: [],
      }
    },
    computed: {
      ...mapState(['language', 'os', 'startMusic'])
    },
		created() {
			this.img = this.img + getParam('lang') + ".jpg";
		},
    mounted() {
      this.$nextTick(() => {
        let _this = this;
        this.len = parseInt(getComputedStyle(document.querySelector('.progress-wrapper'), null).width);
        let timer = setInterval(function() {
          if (_this.startMusic) {
            clearInterval(timer);
            _this.preload();
          }
        }, 500)
      })
    },
    components: {
      "my-audio": Audio,
    },
    methods: {
      preload() {
        let _this = this;
        let timer = setInterval(function() {
          _this.percent++;
          if (_this.percent >= _this.len) {
            clearInterval(timer);
            _this.toggleLoading({isHome: false});
          }
        }, 5)
        // let imgs = [
        //   "../../static/images/scratch_family/dad.png",
        //   "../../static/images/scratch_family/daughter.png",
        //   "../../static/images/scratch_family/family.png",
        // ];
        // for (let img of imgs) {
        //     let image = new Image();
        //     image.onload = () => {
        //       this.count++;
        //       // 计算图片加载百分数
        //       let percentNum = Math.floor(this.count / imgs.length * this.len);
        //       this.percent = `${percentNum}`;
        //       if (percentNum >= this.len) {
        //         this.toggleLoading({isHome: false});
        //       }
        //     }
				// 		image.onerror = () => {
				// 			this.count++;
				// 			console.error('图片加载错误');
				// 		}
        //     image.src = img;
        // }
    },
    ...mapMutations(['toggleLoading'])
    },
  }
</script>
<style lang="less" scoped>
  .progress-wrapper{
    position: fixed;
    bottom: 158px;
    left: 58.5px;
    width: 631px;
    height: 3px;
    background-color: #b6b5b5;
    .progress{
      display: block;
      width: 0px;
      // transition: width .1s;
      height: 100%;
      background-color: #f4b444;
    }
    .icon-circle{
      position: absolute;
      top: 0;
      left: 0;
      transform: translate3d(-46px, -46px, 0);
      // transition: left .1s;
      width: 92px;
      height: 92px;
    }
  }
</style>
