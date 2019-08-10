<template lang="html">
  <div class="ydm">
    <div ref="produce" class="data-show" v-show="isShowPage">
      <div class="content">
        <img :src="'../../../static/images/scratch_yeaysomdram/'+scratchData.scratch_info.a+'.png'" alt="" class="result">
        <div class="content-list">
          <div v-for="item in scratchData.scratch_info.list" :class="[{'bonus': ((scratchData.scratch_info.a == item.data) && isShow)}]">
            <img :src="'../../../static/images/scratch_yeaysomdram/'+item.data+'.png'" alt="">
            <img :src="'../../../static/images/scratch_yeaysomdram/'+item.money+'.png'" alt="">
          </div>
        </div>
      </div>
    </div>
    <canvas id="ydm" :class="[{'on': payout}]">您的浏览器不支持canvas技术，请更换浏览器</canvas>
    <img id="point" src="../../../static/images/icon_pointer.png" alt="">
    <p v-show="isShowPage" class="serial-number">{{scratchData.serial_number}}</p>
  </div>
</template>

<script>
  import {offset, getStyle, checkAudio} from '@/common/common.js'
  import {mapMutations} from 'vuex'
  export default {
    props: ['scratchData', 'isShow', 'payout', 'mask'],
    data() {
      return{
        canvas: null,
        context: null,
        source: null,
        // audio: null,
        point: null,
        pointerConfig: {
          x: 0,
          y: 0,
          max_x: 0,
        },
        point: {
          pageX: 0,
          pageY: 0,
          size: 5,
          color: 'transparent',
        },
        img: {
          canvasImg: "http://scard-images.mohasomnang.com/tickets/2019/YDM/YDM-pre.jpg"
        },
        isEmpty: null, // 刮票信息 产品类型 HPS\NDM\MFL\YSM
        isShowPage: false,
				isPoinet: false, // 优化手指图片没有了还可以刮奖问题
        devicePixelRatio: "",
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.canvas = document.getElementById('ydm');
        this.devicePixelRatio = window.devicePixelRatio;
        this.point = document.getElementById('point');
        this.point.size = (document.documentElement.clientWidth * 100 / 750) * 0.15;
        this.pointerConfig.max_x = document.documentElement.clientWidth - parseInt(getComputedStyle(this.point, null).width)/2;
        this._initCanvas();
        this.canvas.addEventListener('touchstart', this.start);
        this.initPointer();

        let total_h = document.documentElement.clientHeight;
        let header_h = parseInt(getComputedStyle(document.querySelector('.header'), null).height);
        let footer_h = parseInt(getComputedStyle(document.querySelector('.footer'), null).height);
        let cvs = parseInt(getComputedStyle(document.querySelector(".play-wrapper").firstChild, null).height);
        let offset_y = (total_h - header_h - footer_h - cvs) / 2;
        document.querySelector('.play-wrapper').style.top = (offset_y + header_h) + "px";
      })
    },
		beforeDestroy() {
			this.slashStop();
		},
    methods: {
      _initCanvas() {
        this.canvas.width = document.documentElement.clientWidth * this.devicePixelRatio;
        this.canvas.height = this.canvas.parentElement.clientHeight * this.devicePixelRatio;
        this.canvas.style.width = document.documentElement.clientWidth + 'px';
        this.canvas.style.height = this.canvas.parentElement.clientHeight + 'px';
        this.context = this.canvas.getContext('2d');
        this.context.setTransform(this.devicePixelRatio, 0, 0, this.devicePixelRatio, 0, 0);
        let img = new Image();
        img.src = this.img.canvasImg;
        this.context.globalCompositeOperation = "source-over";
        this.context.fillStyle = '#c74547';
        this.context.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.context.fill();
        img.onload = () => {
          let w = parseInt(this.canvas.style.width);
          let h = parseInt(this.canvas.style.height);
          let scale_x= w*img.width/img.height;
          let scale_y= Math.round(w*img.height/img.width);
          this.context.drawImage(img, 0, 0, img.width, img.height, 0, -Math.floor((scale_y-h)/2), w, scale_y);
          document.querySelector('.data-show').style.backgroundSize = `${w}px ${scale_y}px`;
          document.querySelector('.data-show').style.backgroundPosition = `0px ${-Math.floor((scale_y-h)/2)}px`;
          document.querySelector('.data-show').style.height = `${h}px`;
          this.context.globalCompositeOperation = 'destination-out';
          this.canvas.addEventListener('touchmove', this.move);
          this.canvas.addEventListener('touchend', this.end);
          this.mask && layer.closeAll();
          this.isShowPage = true;
        }
      },
      start(e) {
        e.preventDefault();
				// this.audio.currentTime = 0;
        this.slashStart(true, 0);
        if (e.changedTouches) {
          e = e.changedTouches[e.changedTouches.length - 1];
        }
        let oX = offset(this.canvas.parentElement, 'left');
        let oY = offset(this.canvas.parentElement, 'top');
        this.point.pageX = e.pageX - oX || 0;
        this.point.pageY = e.pageY - oY || 0;
        this.context.lineJoin = "round";
        this.context.lineCap = "round";
        this.context.strokeStyle = this.point.color;
        this.context.lineWidth = this.point.size;

        this.context.beginPath();
        this.context.arc(this.point.pageX, this.point.pageY, this.point.size/2, 0, Math.PI*2, true);
        this.context.closePath();
        this.context.fill();

        // start draw path for canvas
        this.context.beginPath();
        this.context.moveTo(this.point.pageX, this.point.pageY);
      },
      move(e) {
        e.preventDefault();
        if (!this.isPoinet) return;
        if (e.changedTouches) {
          e = e.changedTouches[e.changedTouches.length - 1];
        }
        let oX = offset(this.canvas.parentElement, 'left');
        let oY = offset(this.canvas.parentElement, 'top');
        this.point.pageX = e.pageX - oX || 0;
        this.point.pageY = e.pageY - oY || 0;

        this.context.lineTo(this.point.pageX, this.point.pageY);
        this.context.stroke();
      },
      end(e) {
        e.preventDefault();
        this.slashStop();
        this.context.closePath();
      },
      // initAudio() {
      //   this.audio = new Audio();
      //   let type = checkAudio(this.audio);
      //   if (!type) return;
      //   let src = "../../../static/audio/slash."+type;
      //   this.audio.src = src;
      //   this.audio.loop = true;
      // },
      initPointer() {
        this.canvas.parentElement.addEventListener('touchstart', (e) => {
          if (e.changedTouches) {
            e = e.changedTouches[e.changedTouches.length - 1];
          }
					this.isPoinet = true;
          let oX = offset(this.canvas.parentElement, 'left');
          let oY = offset(this.canvas.parentElement, 'top');
          this.pointerConfig.x = e.pageX-parseInt(getStyle(this.point, 'width'))/2-oX;
          this.pointerConfig.y = e.pageY-parseInt(getStyle(this.point, 'height'))/2-oY;
          if (this.pointerConfig.x >= this.pointerConfig.max_x) {
            this.pointerConfig.x = this.pointerConfig.max_x;
          }
          this.point.style.left = this.pointerConfig.x + 'px';
          this.point.style.top = this.pointerConfig.y + 'px';
          this.point.style.display = 'block';
        })

        this.canvas.parentElement.addEventListener('touchmove', (e) => {
					if(e.changedTouches.length>1) {
						this.isPoinet = false;
					}
          if (e.changedTouches) {
            e = e.changedTouches[e.changedTouches.length - 1];
          }
          let oX = offset(this.canvas.parentElement, 'left');
          let oY = offset(this.canvas.parentElement, 'top');
          this.pointerConfig.x = e.pageX-parseInt(getStyle(this.point, 'width'))/2-oX;
          this.pointerConfig.y = e.pageY-parseInt(getStyle(this.point, 'height'))/2-oY;
          if (this.pointerConfig.x >= this.pointerConfig.max_x) {
            this.pointerConfig.x = this.pointerConfig.max_x;
          }
          this.point.style.left = this.pointerConfig.x + 'px';
          this.point.style.top = this.pointerConfig.y + 'px';
          this.isPoinet && (this.point.style.display = 'block');
        })

        this.canvas.parentElement.addEventListener('touchend', (e) => {
					this.isPoinet = false;
          this.point.style.display = "none";
        })
      },
			...mapMutations(['slashStart', 'slashStop'])
    },
  }
</script>

<style lang="less" scoped>
  .ydm{
    position: relative;
    height: 1061px;
    canvas{
      position: relative;
      z-index: 2;
    }
    canvas.on{
      // transform-origin:right; /*  动画基点，这里是以左边为基点 */
      transition: opacity 1s;
      opacity: 0;
      // transform: rotateY(90deg);
    }
    .bonus{
      box-shadow: 0 0 0 3px red;
      border-radius: 50%;
    }
    .data-show{
      position: absolute;
      top: 0;
      left:0;
      right: 0;
      bottom: 0;
      padding-left: 15px;
      padding-right: 15px;
      background: url(http://scard-images.mohasomnang.com/tickets/2019/YDM/YDM-open.jpg);
      background-position: center center;
      background-repeat: no-repeat;
      z-index: 1;
    }
    .serial-number {
      position: absolute;
      right: 15px;
      bottom: 50px;
      z-index: 2;
      padding: 2px 7.5px;
      background-color: #fff;
    }
  }
  #point{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    width: 145px;
    height: 125px;
    display: none;
  }
  .content{
    position: relative;
    height: 100%;
    img{
      width: 75px;
    }
    .result{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-165px, -225px, 0);
    }
    .content-list{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 393px;
      transform: translate3d(-10px, -10px, 0);
      div{
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          &:nth-of-type(2) {
            width: 194px;
          }
        }
        &:nth-of-type(1) {
          transform: translate3d(-225px, -237.5px, 0) scale(.8);
        }
        &:nth-of-type(2) {
          transform: translate3d(-65px, -237.5px, 0) scale(.8);
        }
        &:nth-of-type(3) {
          transform: translate3d(-320px, -95px, 0) scale(.8);
        }
        &:nth-of-type(4) {
          transform: translate3d(-142px, -95px, 0) scale(.8);
        }
        &:nth-of-type(5) {
          transform: translate3d(7.5px, -95px, 0) scale(.8);
        }
        &:nth-of-type(6) {
          transform: translate3d(-237.5px, 55px, 0) scale(.8);
        }
        &:nth-of-type(7) {
          transform: translate3d(-70.5px, 55px, 0) scale(.8);
        }
      }
    }
  }
</style>
