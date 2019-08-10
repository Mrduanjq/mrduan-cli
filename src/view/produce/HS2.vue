<template lang="html">
  <div class="happy2">
    <div ref="produce" class="data-show" v-show="isShowPage">
      <div class="data-content">
        <div class="data-item" v-for="item in scratchData.scratch_info.list">
          <span v-for="val in item.data" :class="[{'bonus': ((scratchData.scratch_info.a == val) && isShow)}]">{{val}}</span>
          <img :src="'../../../static/images/scratch_happy2/'+item.money+'.png'" alt="">
        </div>
      </div>
      <div class="result">{{scratchData.scratch_info.a}}</div>
    </div>
    <canvas :class="[{'on': payout}]" id="happy2">您的浏览器不支持canvas技术，请更换浏览器</canvas>
    <img id="point" src="../../../static/images/icon_pointer.png" alt="">
    <p v-show="isShowPage" class="serial-number">{{scratchData.serial_number}}</p>
  </div>
</template>

<script>
  import {offset, getStyle, checkAudio} from '@/common/common.js'
  import {mapMutations} from 'vuex'
  export default {
    props: {
      scratchData: {
        type: Object,
        default: () =>  {}
      },
      payout: {
        type: Boolean,
        default: false
      },
      isShow: {
        type: Boolean,
        default: false
      },
      mask: {
        type: Boolean,
        default: true
      }
    },
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
          canvasImg: "http://scard-images.mohasomnang.com/tickets/2019/HS2/HS2-pre.jpg"
        },
        scratch: {}, // 刮票信息 产品类型 HPS\NDM\MFL\YSM
        isShowPage: false,
        isBonus: false,
				isPoinet: false, // 优化手指图片没有了还可以刮奖问题
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.canvas = document.getElementById('happy2');
        // this.initAudio();
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
			// this.audio.pause();
			this.slashStop();
		},
    methods: {
      _initCanvas() {
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        this.context = this.canvas.getContext('2d');
        let img = new Image();
        img.src = this.img.canvasImg;
        this.context.globalCompositeOperation = "source-over";
        this.context.fillStyle = '#c74547';
        this.context.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.context.fill();
        img.onload = () => {
          let w = this.canvas.width;
          let h = this.canvas.height;
          let x = this.canvas.width/2-w/2;
          let y = this.canvas.height/2-h/2;
          this.context.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
          document.querySelector('.data-show').style.height = `${h}px`;
          this.context.globalCompositeOperation = 'destination-out';
          this.canvas.addEventListener('touchmove', this.move);
          this.canvas.addEventListener('touchend', this.end);
          this.isShowPage = true;
          this.mask && layer.closeAll();
        }
      },
      start(e) {
        e.preventDefault();
        // this.audio.currentTime = 0;
        this.slashStart(true, 0);
        if (e.changedTouches) {
          e = e.changedTouches[0];
        }
        let oX = offset(this.canvas.parentElement, 'left');
        let oY = offset(this.canvas.parentElement, 'top');
        this.point.pageX = e.pageX - oX || 0;
        this.point.pageY = e.pageY - oY || 0;
        // this.context.globalCompositeOperation = "destination-out";
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
  .happy2{
    position: relative;
    height: 1061px;
    canvas{
      position: relative;
      z-index: 2;
    }
    canvas.on{
      transition: opacity 1s;
      opacity: 0;
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
      padding-top: 305px;
      background:url(http://scard-images.mohasomnang.com/tickets/2019/HS2/HS2-open.jpg) center center / 100% 100% no-repeat;
      z-index: 1;
      .data-content{
      	position: relative;
        height: 725px;
        .data-item{
          position: absolute;
          right: 0;
          top: 0;
          left: 0;
          height: 65px;
          &:nth-of-type(1){
            span{
              right: 0;
              transform: translateX(-20px);
            }
            img{
              right: 0;
              transform: translateX(-90px);
            }
          }
          &:nth-of-type(2){
            transform: translateY(65px);
            span{
              right: 0;
              &:nth-of-type(1) {
                transform: translateX(-20px);
              }
              &:nth-of-type(2) {
                transform: translateX(-92px);
              }
            }
            img{
              right: 0;
              transform: translateX(-158px);
            }
          }
          &:nth-of-type(3){
            transform: translateY(133px);
            span{
              right: 0;
              &:nth-of-type(1) {
                transform: translateX(-20px);
              }
              &:nth-of-type(2) {
                transform: translateX(-92px);
              }
              &:nth-of-type(3) {
                transform: translateX(-164px);
              }
            }
            img{
              right: 0;
              transform: translateX(-230px);
            }
          }
          &:nth-of-type(4){
            transform: translateY(198px);
            span{
              right: 0;
              transform: translateX(-20px);
              &:nth-of-type(2) {
                transform: translateX(-92px);
              }
              &:nth-of-type(3) {
                transform: translateX(-164px);
              }
              &:nth-of-type(4) {
                transform: translateX(-230px);
              }
            }
            img{
              right: 0;
              transform: translateX(-300px);
            }
          }
          &:nth-of-type(5){
            transform: translateY(265px);
            span{
              right: 0;
              transform: translateX(-20px);
              &:nth-of-type(2) {
                transform: translateX(-92px);
              }
              &:nth-of-type(3) {
                transform: translateX(-164px);
              }
              &:nth-of-type(4) {
                transform: translateX(-230px);
              }
              &:nth-of-type(5) {
                transform: translateX(-300px);
              }
            }
            img{
              right: 0;
              transform: translateX(-370px);
            }
          }
          &:nth-of-type(6){
            transform: translateY(332px);
            span{
              right: 0;
              transform: translateX(-20px);
              &:nth-of-type(2) {
                transform: translateX(-92px);
              }
              &:nth-of-type(3) {
                transform: translateX(-164px);
              }
              &:nth-of-type(4) {
                transform: translateX(-230px);
              }
              &:nth-of-type(5) {
                transform: translateX(-300px);
              }
              &:nth-of-type(6) {
                transform: translateX(-375px);
              }
            }
            img{
              right: 0;
              transform: translateX(-440px);
            }
          }
          &:nth-of-type(7){
            transform: translateY(398px);
            span{
              right: 0;
              transform: translateX(-20px);
              &:nth-of-type(2) {
                transform: translateX(-92px);
              }
              &:nth-of-type(3) {
                transform: translateX(-164px);
              }
              &:nth-of-type(4) {
                transform: translateX(-230px);
              }
              &:nth-of-type(5) {
                transform: translateX(-300px);
              }
              &:nth-of-type(6) {
                transform: translateX(-375px);
              }
              &:nth-of-type(7) {
                transform: translateX(-445px);
              }
            }
            img{
              right: 0;
              transform: translateX(-510px);
            }
          }
          &:nth-of-type(8),&:nth-of-type(9),&:nth-of-type(10){
	            span{
	              right: 0;
	              transform: translateX(-20px);
	              &:nth-of-type(2) {
	                transform: translateX(-92px);
	              }
	              &:nth-of-type(3) {
	                transform: translateX(-164px);
	              }
	              &:nth-of-type(4) {
	                transform: translateX(-230px);
	              }
	              &:nth-of-type(5) {
	                transform: translateX(-300px);
	              }
	              &:nth-of-type(6) {
	                transform: translateX(-375px);
	              }
	              &:nth-of-type(7) {
	                transform: translateX(-445px);
	              }
	              &:nth-of-type(8) {
	                transform: translateX(-516px);
	              }
	            }
	            img{
	              right: 0;
	              transform: translateX(-580px);
	            }
          }
					&:nth-of-type(8){
						transform: translateY(463px);
					}
					&:nth-of-type(9){
						transform: translateY(528px);
          }
					&:nth-of-type(10){
						transform: translateY(593px);
          }
          display: flex;
          align-items: center;

          img{
            position: absolute;
            height: 33px;
          }
          span{
            position: absolute;
            font-weight: 700;
          }
        }
      }
      .result{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-275px, -180px, 0);
        font-size: 45px;
        font-weight: 700;
        width: 112.5px;
        height: 105px;
        // border-left: 1px solid #000;
        text-align: center;

      }
    }
    .serial-number {
      position: absolute;
      left: 50%;
      bottom: 7.5px;
      z-index: 3;
      transform: translateX(-320px);
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

</style>
