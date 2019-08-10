<template lang="html">
  <div class="play-wrapper">
    <component ref=canvas class="component-bg" v-if="hackReset" :is="scratch.scratch_key" :scratchData="scratch" :payout="isPayout" :isShow="flag" :mask="isClose"></component>
    <div class="footer">
      <div class="role" @click.stop="showScratchInfo">
        <img src="../../static/images/icon_info.png" alt="">
        <span @click.stop="showScratchInfo">{{lang[language].message.notes}}</span>
      </div>
      <div v-if="disable">
        <div class="btn gray" v-if="btn.type == 0">{{btn.txt}}</div>
        <div class="btn gray" v-else-if="btn.type == 1">{{lang[language].message.next}}</div>
        <div class="btn gray" v-else-if="btn.type == 2">{{lang[language].message.buyAgin}}</div>
        <div class="btn" @click="confirm(btn.type)" v-else-if="btn.type == 3">{{lang[language].message.backHome}}</div>
      </div>
      <div v-else>
        <div :class="[{'gray': disable}]" class="btn" @click="payout(btn.id)" v-if="btn.type == 0">{{btn.txt}}</div>
        <div :class="[{'gray': disable}]" class="btn" @click="confirm(btn.type)" v-else-if="btn.type == 1">{{lang[language].message.next}}</div>
        <div :class="[{'gray': disable}]" class="btn" @click="confirm(btn.type)" v-else-if="btn.type == 2">{{lang[language].message.buyAgin}} <span v-show="btn.money">(KHR {{ btn.money | formatAmount}})</span> </div>
        <div class="btn" @click="confirm(btn.type)" v-else-if="btn.type == 3">{{lang[language].message.backHome}}</div>
      </div>
    </div>
    <div v-show="isPop && (isWin === 'win')" class="pop-wrapper" @click.stop="close">
      <span @click.stop="close" class="close iconfont icon-guanbi2"></span>
      <div class="pop" @click.prevent="">
        <div class="pop-header">{{lang[language].message.congratulations}}</div>
        <div class="pop-content">
					{{
						lang[language].message.msgBlock.prize ?
						(scratch.prize_level<3?`${lang[language].message.msgBlock.won} ${scratch.prize_level} ${lang[language].message.msgBlock.prize}`:'Win'):
						(scratch.prize_level<3?lang[language].message.msgBlock.won : 'Win')
					}}
				</div>
        <div class="win-money">
          <span>{{scratch.pay_out_money | formatAmount}}</span>
          <p>KHR</p>
        </div>
      </div>
    </div>
    <div v-show="isPop && (isWin === 'fail')" class="pop-wrapper cry" @click.stop="close">
      <span @click.stop="close" class="close iconfont icon-guanbi2"></span>
      <div class="pop" @click.prevent="">
        <div class="pop-header">{{lang[language].message.sorry}}</div>
        <div class="cry-content">
          <p>{{lang[language].message.failMessage[failMessageIdx]}}</p>
        </div>
				<div class="buy-ticket" @click.stop="payout(btn.id)" v-if="btn.type==0">{{btn.txt}}</div>
				<div class="buy-ticket" @click.stop="confirm(btn.type)" v-else-if="btn.type==1">{{lang[language].message.next}}</div>
				<div class="buy-ticket" @click.stop="confirm(btn.type)" v-else-if="btn.type==2">{{lang[language].message.buyAgin}} <span v-show="btn.money">(KHR {{ btn.money | formatAmount}})</span> </div>
				<div class="buy-ticket" @click.stop="confirm(btn.type)" v-else-if="btn.type==3">{{lang[language].message.backHome}}</div>
      </div>
    </div>
    <POP class="my-pop" v-show="isInfo">
      <div class="detail">
        <div class="close"><span @click.stop="isInfo = false" class="iconfont icon-guanbi2"></span></div>
        <div class="content mt-15">
          <div class="detail-header pt-15">
            <h3 class="title">{{lang[language].message.rolesInfo}}</h3>
          </div>
          <div class="detail-content">
            <div class="level-info">
              <h3>{{lang[language].message.prizes}}</h3>
              <div class="level-list">
                <div class="list-left">
                  <div class="list-item" v-for="item in level.leftArr">
                    <span v-if="item.img"><img class="icon-fir" :src="item.img" /></span>
                    <span v-else="item.img">{{item.idx}}</span>
                    <span>{{item.money | formatAmount}}</span>
                  </div>
                </div>
                <div class="list-right">
                  <div class="list-item" v-for="item in level.rightArr">
                    <span v-if="item.img"><img class="icon-fir" :src="item.img" /></span>
                    <span v-else>{{item.idx}}</span>
                    <span>{{item.money | formatAmount}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="role-info">
              <h3>{{role.title}}</h3>
              <div>
                <p class="txt" v-for="info in role.info">{{info}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </POP>
  </div>
</template>

<script>
  import {mapMutations, mapState} from "vuex"
  import {getScratchData, buyGoods, payout, SUCCESS} from "@/api/api"
  import {offset, splitArr, isAndroid, getStyle, getBuffer, createSound} from '@/common/common.js'
  import POP from "@/components/pop"
  import HPS from "@/view/produce/HPS"
  import NDM from "@/view/produce/NDM"
  import MFL from "@/view/produce/MFL"
  import YSM from "@/view/produce/YSM"
  import YDM from "@/view/produce/YDM"
  import BXG from "@/view/produce/BXG"
  import FRT from "@/view/produce/FRT"
  import HS2 from "@/view/produce/HS2"
  import MHT from "@/view/produce/MHT"
  import WDP from "@/view/produce/WDP"
  export default {
    name: 'play',
    data() {
      return{
        scratch: {},
        isPop: false,
        isWin: 'win',
        isInfo: false,
        level: {},
        role: {},
        btn: {
          txt: "",
          type: 0,
          id: "",
          money: 0,
        },
        timer1: null,
        isPayout: false,
        disable: true, // 一开始不让用户点击兑换，获取完数据后，才可以点击兑换
        mask: null,
        flag: false, // 当用户点击兑奖时才为true
        isClose: true, // 告诉子组件是否关闭蒙版
        failMessageIdx: 0, // 用户没中奖的词条索引
      }
    },
    components: {
      POP,
      HPS,
      NDM,
      MFL,
      YSM,
      YDM,
			BXG,
			FRT,
			HS2,
			MHT,
			WDP,
    },
    computed: {
      ...mapState(['language', 'lang'])
    },
    created() {
      this.btn.txt = this.lang[this.language].message.claimPayout;
      this.mask = layer.mask();
      this.toggleHeaderLayer(this.$route.query);
      this.getScratchData();
			this.togglePlayHideStatus(false);
    },
		mounted() {
			this.homebgyyStop();
			this.slashbgyxStart();
      this.slashbgyyStart(true);
		},
		watch: {
			"btn.type": {
				handler: function(newName, oldName) {
					this.togglePlayHideStatus(newName);
				}
			}
		},
		beforeDestroy() {
			this.togglePlayHideStatus(true);
		},
    methods: {
      payout(id) {
        let _this = this;
        this.flag = false;
        this.isPayout = true;
        if (this.disable) return;
        this.random();
        this.disable = true;
        this.mask = layer.mask(0);
        let str = +new Date();
        let params = {
          id: id || this.$route.query.id
        };
        payout(params).then((res) => {
          let curTime = +new Date();
          let temp = curTime - str;
          if (curTime - str >= 1000) {
            temp = 0;
          }
          if (res.status.code === SUCCESS) {
            this.userInfo(res.data.balance);
            this.btn.id = res.data.id;
            this.btn.type = res.data.type;
            this.btn.money = res.data.money;
						clearTimeout(this.timer1);
            this.timer1 = setTimeout(function(){
              _this.isPop = true;
            }, temp)
            if (this.scratch.prize_level === "") {
              this.isWin = "fail";
              this.failbgyxStart();
            } else {
              this.isWin = "win";
							this.successbgyxStart();
            }
            layer.close(this.mask);
            return;
          }

					this.btn.type = 3; // 如果购买失败，就使其显示返回首页
          layer.msg(res.status.message);
          layer.close(this.mask);
        })
      },
      getScratchData(id) {
        let params = {
          id: id || this.$route.query.id
        };
        getScratchData(params).then((res) => {
          if (res.status.code === SUCCESS) {
            this.scratch = res.data;
            let obj = this.lang[this.language][this.scratch.scratch_key.toLowerCase()]
            this.level = splitArr(obj.level);
            this.role = obj.role;
            this.disable = false; // 获取完数据后，可以兑奖
            return;
          }
					this.btn.type = 3; // 如果购买失败，就使其显示返回首页
          layer.msg(res.status.message);
          layer.close(this.mask);
        })
      },
      confirm(type) {
        clearTimeout(this.timer1);
				this.isPop = false;
        this.disable = true; // 下一张或者购买时，不可以兑奖
        this.reset();
        if (type == 1) {
          this.$router.replace({path: "/play", query: {id: this.btn.id, isHome: false}});
          this.getScratchData(this.btn.id);
          this.flag = false;
          this.btn.type = 0;
        } else if (type == 2) {
          this.mask = layer.mask();
          this.btn.type = 0;
          this.isClose = false;
          this.flag = false;
          buyGoods({id: this.btn.id}).then(res => {
            if (res.status.code === SUCCESS) {
              this.userInfo(res.data.balance);
              this.btn.id = res.data.id;
              this.$router.replace({path: "/play", query: {id: this.btn.id, isHome: false}});
              this.getScratchData(res.data.id);
              layer.close(this.mask);
              this.isClose = true;
              return;
            }
						this.btn.type = 3; // 如果购买失败，就使其显示返回首页
            layer.close(this.mask);
            layer.msg(res.status.message);
          })
        } else if (type == 3) {
          this.disable =false;
          this.$router.push({
            path: "/"
          })
        }
      },
      close() {
        clearTimeout(this.timer1);
        this.isPop = false;
        this.disable = false; // 按钮是否能点击控制
        this.flag = true;
      },
      showScratchInfo() {
        this.isInfo = true;
      },
      reset() {
        this.isPayout = false;
      },
      random() {
        this.failMessageIdx = Math.floor(Math.random()*10);
      },
      ...mapMutations(['userInfo', 'togglePlayHideStatus', 'toggleHeaderLayer', 'homebgyyStop', 'slashbgyxStart', 'slashbgyyStart', 'successbgyxStart', 'failbgyxStart'])
    },
  }
</script>

<style lang="less" scoped>
  .play-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    background-color: #f2efef;
    // span{margin-right: 10px}
    .footer{
      position: fixed;
      height: 152px;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url(../../static/images/icon_play_bg.png) center center / 100% 100% no-repeat;
      .role {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
				width: 142.5px;
        font-size: 18px;
        img{
          width: 41px;
          height: 41px;
        }
      }
    }
    .btn{
      width:463px;
      height:96px;
      background:linear-gradient(0deg,rgba(249,29,29,1) 0%,rgba(245,159,159,1) 100%);
      border:1px solid rgba(249, 7, 7, 0.94);
      border-radius:48px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .pop-wrapper{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 3;
      background: url(../../static/images/pop_smile.png) center center / 100% auto no-repeat;
      background-color: rgba(0,0,0,.5);
      background-origin: content-box;
      padding-bottom: 211px;
      display: flex;
      justify-content: center;
      align-items: center;
      .pop{
        width: 590px;
        height: 690px;
        margin-bottom: -210px;
        .pop-header{
          height:90px;
          font-size:52px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(255,255,204,1);
          line-height:90px;
          text-align: center;
					text-indent: 45px;
        }
        .pop-content{
          display: flex;
          justify-content: center;
          align-items: center;
          height: 230px;
          padding: 0 75px;
          font-size:52px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(254,4,4,1);
					text-align: center;
        }
        .win-money{
          text-align: center;
          font-size:32px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(255,1,1,1);
          p{
            margin-top: 40px;
          }
        }
      }
      .close{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(220px, -430px, 0);
        font-size: 56px;
        color: #fff;
      }
    }
    .pop-wrapper.cry{
      background: rgba(0,0,0,.5);
      .pop{
      	height: 760px;
        background: url(../assets/images/pop_cry.png) center center / 100% auto no-repeat;
        .pop-header{
          height: 75px;
          font-size:58px;
          margin-top: 50px;
          font-family:'HYk2gj';
          font-weight:400;
          display: flex;
          justify-content: center;
          color:rgba(76,143,254,1);
          -webkit-text-stroke: 4px;
        }
        .cry-content{
          margin-top: 282.5px;
          text-align: center;
          font-size:52px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          line-height:62px;
          p{
            color:rgba(0,164,222,1);
            box-sizing: content-box;
            font-size: 45px;
            padding: 0 55px;
          }
        }
				.buy-ticket{
					width: 370px;
					height: 70px;
					line-height: 70px;
					background-color: #1084d0;
					border-radius: 35px;
					color: #fff;
					margin: 30px auto 0;
					font-size: 30px;
					text-align: center;
					margin-bottom: 63px;
				}
      }
      .close{
        transform: translate3d(220px, -470px, 0);
      }
    }
    .content{
      width: 550px;
      background-color: #fff;
      overflow: hidden;
      border-radius: 15px;
      .detail-header {
        width: 100%;
        height: 170px;
        background: url('../assets/images/icon_detail_bg.png') center center / 100% 100% no-repeat;
        .title{
          margin-left: 52px;
          color: #fff;
        }
      }
      .detail-content{
        width: 100%;
        padding: 0 32px;
        background-color: #fff;
        .role-info>div{
          height: 282px;
          overflow-y: auto;
        }
        .level-info, .role-info{
          box-sizing: content-box;
          padding-bottom: 15px;
          h3{
            width: 165px;
            padding: 2px 5px;
            color: #fff;
            text-align: center;
            font-size: 30px;
            background:linear-gradient(0deg,rgba(255,71,45,1) 0%,rgba(255,117,71,1) 100%);
            background-color: #ff5636;
            box-shadow:0px 2px 2px 0px rgba(8,1,3,0.34);
            border-radius: 5px;
          }
          .level-list{
            height: 225px;
            overflow-y: auto;
            display: flex;
            font-size: 24px;
            margin-top: 10px;
            .list-left{
              min-width: 50%;
              width: 50%;
              border-right: 1px solid #F2F2F2;
              padding-right: 40px;
              margin-right: 5px;
            }
            .list-right{
              min-width: 49%;
              width: 49%;
            }
            .list-item{
              display: flex;
              align-items: center;
              height: 45px;
              span{
                width: 75px;
                text-align: center;
                text-align: center;
                height: 44px;
                line-height: 44px;
                &:nth-of-type(1) {
                  min-width: 75px;
                  margin-right: 20px;
                }
              }
            }
            img{
              width: 69px;
              height: 44px;
            }
          }
          p{
            font-size: 22px;
            margin-top: 16px;
            padding-left: 20px;
            max-height: 200px;
            overflow: hidden;
            overflow-y: auto;
          }
        }
        .buy-send{
          font-size:20px;
          display: flex;
          flex-wrap: wrap;
          margin-top: 25px;
          .buy-send-list{
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width:220px;
            height:55px;
            background:linear-gradient(0deg,rgba(255,183,9,1),rgba(255,214,48,1));
            border-radius:12px;
            margin-bottom: 10px;
            &.on{
              color: #990000;
            }
            &.on:before{
              content: "";
              position: absolute;
              top: 13px;
              right: 15px;
              border-right: 3px solid #990000;
              border-bottom: 3px solid #990000;
              transform: rotate(45deg);
              width: 10px;
              height: 20px;
            }
            &:nth-of-type(2n+1) {
              margin-right: 13px;
            }
          }
        }
      }
    }
    .close{
      text-align: right;
      color: #fff;
      span {
        font-size: 45px;
      }
    }
    .component-bg{
    	background-color: #c74547;
      // background: url(../../static/images/bg_color.jpg) center center / 100% 100% no-repeat;

    }
  }
</style>
