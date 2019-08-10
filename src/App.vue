<template>
	<div id="app" v-cloak>
	  <my-loading v-show="loading" class="loading"></my-loading>
    <div :style="'opacity:'+ (+!loading)" class="app-content">
      <my-header></my-header>
	    <transition name="fade">
	        <router-view @click="toggleMenu({isHeader: false})"></router-view>
	    </transition>
    </div>
  </div>

</template>

<script>
  import {setCookie, getParam} from "@/common/common.js"
  import {getSoundsSetting, SUCCESS} from "@/api/api.js"
  import Loading from "@/components/loading"
  import {mapMutations, mapState}  from "vuex"
  import Header from "@/components/header"
  export default {
    name: "app",
    data() {
      return {}
    },
    computed: {
      ...mapState(['loading', 'audio'])
    },
    created() {
      setCookie('token', getParam('token'));
      setCookie('lang', getParam('lang'));
      this.getSoundsSetting();
      this.version();
    },
		mounted() {
			this.$nextTick(() => {
				document.querySelector('body').style.backgroundColor = "#c74547";
			})
			this.listenerScreen();
		},
    components: {
      "my-header": Header, // header
      "my-loading": Loading,
    },
    methods: {
      getSoundsSetting() {
        getSoundsSetting({}).then(res => {
          if (res.status.code === SUCCESS) {
            this.toggleSounds(res.data);
            return;
          }
          layer.msg(res.status.message);
        })
      },
			listenerScreen() {
				let hiddenProperty = 'hidden' in document ? 'hidden' :
						'webkitHidden' in document ? 'webkitHidden' :
						'mozHidden' in document ? 'mozHidden' :
						'msHidden' in document ? 'msHidden' :
						null;
				let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
				let soundsArr = []; // 记录谁暂停了
				let onVisibilityChange = () => {
						// 页面变为不可见
						if (document.visibilityState == 'hidden') {
							for (let i in this.audio) {
								if (typeof this.audio[i] === 'boolean') continue;
								if (!this.audio[i].paused && this.audio[i].loop) { // 排除那些不是循环的音效
									soundsArr.push(i);
									this[i+'Stop']();
								}
							}
						}
						// 页面变为可见时触发
            if (document.visibilityState == 'visible') {
              for (let i in soundsArr) {
								this[soundsArr[i]+'Start'](true); // 播放刚才暂停的音乐
							}
							soundsArr = []; // 清除之前的保存
            }
				}
				document.addEventListener(visibilityChangeEvent, onVisibilityChange);
			},
      ...mapMutations(['toggleMenu', 'toggleSounds', 'toggleHeaderLayer', 'version', 'slashStart', 'slashStop', 'slashbgyxStart', 'slashbgyxStop', 'successyxStart', 'successyxStop', 'failyxStart', 'failyxStop', 'homebgyyStart', 'homebgyyStop', 'slashbgyyStop', 'slashbgyyStart'])
    }

  }
</script>

<style lang="less">
  @import "../static/css/layer.css";
  html,body,#app{height: 100%; overflow: hidden;}
  body{margin: 0 auto;font-family: Arial,"Microsoft Yahei",Helvetica,sans-serif;}
  a{text-decoration: none; color: #fff;}
  h1{margin: 0 auto;}
  h3{margin: 0;}
  div,a,p,span,ul,li{box-sizing: border-box;}
  i{font-style: normal;}
  strong{font-weight: 500;}
  p{margin-top: 0; margin-bottom: 0;}
  ul{list-style: none; margin-top: 0; margin-bottom: 0; padding-left: 0;}
  img[lazy="loading"] { display: block; }
  [v-cloak]{
      display: none;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
	.loading{position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999; background-color: rgba(255, 255, 255, .5); display: flex; justify-content: center;align-items: center;}
  .loading>img{width: 100%; height: 100%;}

  .tip-top{
      position: absolute;
      top: -50px;
      width: 100%;
      text-align: center;
      font-size: 26px;
      color: #dadada;
  }
  .tip-bottom{
      position: absolute;
      bottom: -50px;
      width: 100%;
      padding: 10px 0;
      text-align: center;
      font-size: 26px;
      color: #dadada;
  }
  // 字体大小
  .fs-35{font-size: 35px;}
  .fs-34{font-size: 34px;}
  .fs-30{font-size: 30px;}
  .fs-28{font-size: 28px;}
  .fs-25{font-size: 25px;}
  .fs-20{font-size: 20px;}
  .fs-22{font-size: 22px;}
  // 字体粗细
  .fw-500 {font-weight: 500;}
  .fw-700 {font-weight: 700;}
  // 颜色
  .color-fir{color: #fb4509;}
  .color-sec{color: #cc9999;}
  .color-thir{color: #919191;}
  .color-red{color: #fb4509;}
  // margin
  .mt-15{margin-top: 15px;}
  .mt-21{margin-top: 21px;}
  .mt-24{margin-top: 24px;}
  .mt-25{margin-top: 25px;}
  .mt-33{margin-top: 33px;}
  .mb-15{margin-bottom: 15px;}
  .mb-25{margin-bottom: 25px;}
  .mb-8{margin-bottom: 8px;}
  .mt-8{margin-top: 8px;}
  .pt-15{padding-top: 15px;}
  .pb-15{padding-bottom: 15px;}
  .pb-8{padding-bottom: 8px;}
  .pt-8{padding-top: 8px;}
  // 背景颜色
  .gray{background: gray !important; border-color: gray !important;}

	// 滚动插件覆盖
	.mescroll-downwarp .downwarp-tip, .mescroll-upwarp .upwarp-tip, .mescroll-upwarp .upwarp-nodata{
		font-size: 26px !important;
	}
	.mescroll-downwarp .downwarp-progress, .mescroll-upwarp .upwarp-progress{
		width: 22px !important;
		height: 22px !important;
	}
</style>
