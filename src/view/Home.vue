<template lang="html">
  <div @click="toggleMenu({isHeader: false})">
		<mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView home">
			<div class="list-wrapper">
        <my-banner v-if="!loading"></my-banner>
        <div class="list">
          <ul class="list-left">
            <li @click.stop="listDetail(item)" v-for="item in homeData.dataLeft">
              <div class="top"><img :src="item.img" alt=""></div>
              <div class="bottom">
                <p class="fs-30 mt-15 mb-15">{{item.name}}</p>
                <p class="color-sec fs-30" v-show="+item.discount !== 1"><del><i class="fs-20">KHR </i>{{item.old_amount | formatAmount}}</del></p>
                <p class="fs-34 color-fir pb-15"><i class="fs-22 fw-700">KHR</i> {{item.amount | formatAmount}}</p>
              </div>
            </li>
          </ul>
          <ul class="list-right">
            <li @click.stop="listDetail(item)" v-for="item in homeData.dataRight">
              <div class="top"><img :src="item.img"  alt=""></div>
              <div class="bottom">
                <p class="fs-30 mt-15 mb-15">{{item.name}}</p>
                <p class="fs-20 color-sec" v-show="+item.discount !== 1"><del>KHR{{item.old_amount | formatAmount}}</del></p>
                <p class="fs-34 color-fir pb-15"><i class="fs-22 fw-700">KHR</i> {{item.amount | formatAmount}}</p>
              </div>
            </li>
          </ul>
          <ul class="list-content" v-show="homeData.dataList.length">
            <li v-for="item in homeData.dataList">
              <div class="top"><img :src="item.img"  alt=""></div>
              <div class="bottom">
                <p class="fs-30 mt-15 mb-15">{{item.name}}</p>
                <p class="fs-20 color-sec" v-show="+item.discount !== 1"><del>KHR{{item.old_amount | formatAmount}}</del></p>
                <p class="fs-34 color-fir pb-15"><i class="fs-22 fw-700">KHR</i> {{item.amount | formatAmount}}</p>
              </div>
            </li>
          </ul>
        </div>

      </div>
		</mescroll-vue>
    <my-pop class="my-pop" v-show="isPopShow && (curListDetail.type == 1)">
      <div class="detail">
        <div class="close"><span @click.stop="close" class="iconfont icon-guanbi2"></span></div>
        <div class="content mt-15">
          <div class="detail-header">
            <h3 class="title">{{curListDetail.name}}</h3>
          </div>
          <div v-if="curListDetail.type == 2" class="detail-content mt-64">
            <p v-for="(info, index) in curListDetail.info" class="mb-25">{{info}}</p>
          </div>
          <div v-else-if="curListDetail.type == 1" class="detail-content">
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
					<div v-if="curListDetail.info && curListDetail.type != 2" class="buy-send">
						<div @click="toggleGoods(btn, idx)" :class="[{'on': idx === curIdx}]" class="buy-send-list" v-for="(btn, idx) in curListDetail.info">
							<span v-if="idx==0">{{btn.num}}</span>
							<span v-else>{{lang[language].message.buy}} {{btn.buy}} {{lang[language].message.free}} {{btn.send}}</span>
							<span>KHR {{btn.amount | formatAmount}}</span>
						</div>
					</div>
          <div class="btn" @click.stop="buyGoods(curListDetail.id)">KHR {{curListDetail.amount | formatAmount}}  <del v-show="curListDetail.discount != 1">{{curListDetail.old_amount | formatAmount}}</del>  </div>
        </div>
      </div>
    </my-pop>
    <div class="gifts-wrapper" v-if="isPopShow && (curListDetail.type == 2)">
      <div class="gifts">
        <div class="gifts-header">
          <span>{{curListDetail.info.produce_name}}</span>
          <span @click.stop="close" class="gifts-close"></span>
        </div>
        <div class="gifts-info">
          {{curListDetail.info.produce_name}} contains {{curListDetail.info.total_number}} scratch tickets
        </div>
        <div class="gifts-list">
          <div class="gifts-items" v-for="item in curListDetail.info.list">
            <div class="items-left">
              <span>KHR {{item.amount | formatAmount}}</span>
              <span class="border"></span>
              <span>{{item.scratch_name}}</span>
            </div>
            <div class="items-right">
              &times; {{item.number}}
            </div>
          </div>
        </div>
      </div>
      <div class="gifts-btn" @click.stop="buyGoods(curListDetail.id)">
        KHR {{curListDetail.amount | formatAmount}}  <del v-show="curListDetail.discount != 1">{{curListDetail.old_amount | formatAmount}}</del>
      </div>
    </div>
		<my-setting v-show="isSetting" :langue="language" class="setting"></my-setting>
  </div>
</template>

<script>
  import {getGoodsList, buyGoods, SUCCESS} from "@/api/api"
  import {splitArr} from "@/common/common.js"
  import Banner from "@/components/banner"
  import MescrollVue from "mescroll.js/mescroll.vue"
  import Pop from "@/components/pop"
  import Setting from "@/components/setting"
  import {mapState, mapMutations} from "vuex"
  export default {
    name: "home",
    data() {
      return {
        isPopShow: false,
        homeData: {
          leftHeight: 0,
          rightHeight: 0,
          dataList: [],
          dataLeft: [],
          dataRight: [],
        },
        level: {},
        role: {},
        curListDetail: {},
        lastID: "",
        curIdx: 0,
				tempMoney: "", // 临时储存的money
				mescroll: null,
				mescrollDown:{
					callback: this.downCallback,
					auto: false,
					textInOffset: "",
					textOutOffset: "",
					textLoading: "",
				}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
			  mescrollUp: { // 上拉加载的配置.
			    callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
					auto: false,
					htmlLoading: "",
			  },
      }
    },
    components: {
      "my-banner": Banner,
      "my-pop": Pop,
      "my-setting": Setting,
			MescrollVue
    },
    computed: {
			language() {
			},
      ...mapState(['language', 'lang', 'scroll', 'home', 'user', 'isSetting', 'loading'])
    },
    created() {
      this.getGoodsList();
      this.toggleHeaderLayer({isHome: true});
			this.mescrollDown.textInOffset = this.lang[this.language].message.pulldownToRefresh;
			this.mescrollDown.textOutOffset = this.lang[this.language].message.releaseToRefresh;
			this.mescrollDown.textLoading = this.lang[this.language].message.loading;
			this.mescrollUp.htmlLoading = `<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">${this.lang[this.language].message.loading}</p>`;
    },
		watch: {
			language(newName, oldName) {
				this.mescrollDown.textInOffset = this.lang[newName].message.pulldownToRefresh;
				this.mescrollDown.textOutOffset = this.lang[newName].message.releaseToRefresh;
				this.mescrollDown.textLoading = this.lang[newName].message.loading;
				this.mescrollUp.htmlLoading = `<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">${this.lang[newName].message.loading}</p>`;
			}
		},
		mounted() {
			this.slashbgyyStop();
			this.homebgyyStart(true);
		},
    methods: {
			mescrollInit(mescroll) {
		   this.mescroll = mescroll;
			},
			upCallback(page, mescroll) {
			 this.getGoodsList("pullingUp");
			},
			downCallback(page, mescroll) {
			 this.getGoodsList("pullDown");
			},
      getGoodsList(type) {
        let _this = this;
        let params = {};
        if (type === 'pullDown') {
          params.last = "";
        } else if (type === 'pullingUp') {
          params.last = this.lastID
        }
        getGoodsList(params).then((res) => {
          if (res.status.code !== SUCCESS) return;
          this.homeData.dataList = res.data;
          if (type === 'pullDown') {
            this.homeData.dataRight = [];
            this.homeData.dataLeft = [];
            this.homeData.leftHeight = 0;
            this.homeData.rightHeight = 0;
          }
          this.$nextTick(() => {
              var aLi = document.querySelectorAll('.list-content li');
              var aImg = document.querySelectorAll('.list-content li img');
              if (type === 'pullingUp') {
                _this.lastID = res.data.length == 0 ? _this.lastID : res.data[res.data.length-1].id;
								_this.mescroll.endSuccess(res.data.length,res.data.length!==0);
                layer.closeAll();
              } else if (type === 'pullDown'){
                _this.lastID = (_this.homeData.dataList.length != 0) && _this.homeData.dataList[_this.homeData.dataList.length-1].id;
								_this.mescroll.resetUpScroll();
								layer.closeAll();
              } else {
                _this.lastID = (_this.homeData.dataList.length != 0) && _this.homeData.dataList[_this.homeData.dataList.length-1].id;
                layer.closeAll();
              }
              for(let i=0;i<aLi.length;i++){
								let minH = aImg[i].naturalHeight/(aImg[i].naturalWidth/aImg[i].width);
                if (_this.homeData.leftHeight > _this.homeData.rightHeight) {
                  _this.homeData.dataRight.push(_this.homeData.dataList[i]);
                  _this.homeData.rightHeight += (aLi[i].offsetHeight || minH);
                } else {
                  _this.homeData.dataLeft.push(_this.homeData.dataList[i]);
                  _this.homeData.leftHeight += (aLi[i].offsetHeight || minH);
                }
              }
              _this.homeData.dataList = [];
          })
        })
      },
      listDetail(info) {
        this.toggleMenu({isHeader: false});
        this.curListDetail = info;
				this.tempMoney = info.amount;
        if (info.type == 1) { // 普通商品
          let obj = this.lang[this.language][info.scratch_key.toLowerCase()];
          this.level = splitArr(obj.level);
          this.role = obj.role;
          this.curIdx = 0;
          if (this.curListDetail.info[0] && this.curListDetail.info[0].num !== 1)
            this.curListDetail.info.unshift({amount: this.curListDetail.amount, num: 1, id: this.curListDetail.id})
        } else if (info.type == 2){ // 大礼包商品

        }
        this.isPopShow = true;
      },
      toggleGoods(item, idx) {
        this.curIdx = idx;
        this.curListDetail.amount = item.amount;
        this.curListDetail.id = item.id;
      },
      buyGoods(id) {
        layer.mask();
        buyGoods({id: id}).then((res) => {
          if (res.status.code === SUCCESS) {
            layer.closeAll();
            this.userInfo(res.data.balance);
            this.routerChange({url: '/play', query: {isHome: false, id: res.data.id}});
            return;
          } else {
            layer.closeAll();
            layer.msg(res.status.message);
          }
        })
      },
      routerChange(obj) {
        this.$router.push({
          path: obj.url,
          query: obj.query
        })
      },
      close() {
				this.curListDetail.amount = this.tempMoney;
        this.isPopShow = false;
      },
      ...mapMutations(['userInfo', 'getHomeData', 'toggleHeaderLayer', 'toggleMenu', 'homebgyyStart', 'slashbgyyStop'])
    },
  }
</script>

<style lang="less" scoped>
  .mescroll {
    position: fixed;
    padding-bottom: 1rem;
    top: 80px;
    bottom: 0;
    height: auto;
  }
  .home{
    background-color: #f2f2f2;
    .list-wrapper{
      background-color: #f2f2f2;
    }
    .list{
      padding: 18px 20px 0;
      display: flex;
      justify-content: center;
      ul{
        width:50%;
        li{
          border-radius: 10px;
          background-color: #fff;
          margin-bottom: 20px;
          box-shadow: 2px 2px 3px 3px #d9d1d1;
          overflow: hidden;
          .top{
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            img{
              width: 345px;
              height: auto;
            }
          }
          .bottom{
            padding: 0 24px;
          }
        }
      }
      .list-left{
        margin-right: 10px;
      }
      .list-right{
        margin-left: 10px;
      }
      .list-content{
        position: absolute;
        top: 220px;
        left: 0;
        right: 0;
        bottom: 0;
      }
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
      padding-top: 40px;
      background: url(../../static/images/icon_detail_bg.png) center center / 100% 100% no-repeat;
      .title{
        margin-left: 52px;
        color: #fff;
      }
    }
    .detail-content{
      width: 463px;
      max-height: 564px;
      overflow-y: auto;
      margin-left: auto;
      margin-right: auto;
      .level-info, .role-info{
        padding-bottom: 15px;
        box-sizing: content-box;
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
    }
		.buy-send{
			width: 453px;
			margin: 0 auto;
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
				box-sizing: content-box;
				padding: 5px 0;
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
  .close{
    text-align: right;
    color: #fff;
    span {
      font-size: 45px;
    }
  }
  .btn {
    width: 463px;
    height: 96px;
    margin: 15px auto 25px;
    background-color: #f76160;
    background:linear-gradient(0deg,rgba(249,29,29,1) 0%,rgba(245,159,159,1) 100%);
    border:1px solid rgba(249, 7, 7, 0.94);
    box-shadow: 0px 3px 1px 1px #c50b0b;
    border-radius: 48px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    del{
      margin-left: 15px;
      font-size: 28px;
      margin-top: 5px;
    }
  }
  h3 {margin-top: 0; margin-bottom: 0;}
  .mt-64{margin-top: 64px;}
  .gifts-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9;
    background-color: rgba(0,0,0,.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .gifts{
      width: 724px;
      height: 1065px;
      background: url(http://scratch-card.oss-ap-southeast-1.aliyuncs.com/images/gifts_bg.png) center center / 100% auto no-repeat;
      padding-top: 250px;
      padding-left: 43px;
      padding-right: 43px;
      .gifts-header{
        position: relative;
        width: 350px;
        margin: 0 auto;
        text-align: center;
        font-size: 60px;
        line-height: 60px;
        color: #fff;
        .gifts-close{
          width: 40px;
          height: 40px;
          position: absolute;
          top: -25px;
          right: -116px;
        }
      }
      .gifts-info{
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        font-size: 24px;
        line-height: 24px;
        color: #FFF230;
        margin-top: 57px;
        margin-bottom: 20px;
        &:after{
          margin-left: 10px;
          content: "";
          width: 73px;
          height: 1px;
          background-color: #FFF230;
        }
        &:before{
          margin-right: 10px;
          content: "";
          width: 73px;
          height: 1px;
          background-color: #FFF230;
        }
      }
      .gifts-list{
        height: 607px;
        overflow: hidden;
        overflow-y: auto;
        margin-left: 91px;
        .gifts-items{
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          .items-left{
            display: flex;
            align-items: center;
            padding-left: 40px;
            padding-right: 20px;
            width: 455px;
            height: 98px;
            background: url(../../static/images/gifts_item.png) center center / 100% auto no-repeat;
            margin-right: 14px;
            span{
              &:nth-of-type(1) {
                font-size: 24px;
                color: #F44C31;
                min-width: 135px;
                width: 135px;
                white-space: nowrap;
              }
              &.border {
                min-width: 1px;
                width: 1px;
                height: 70px;
                background-color: #dedede;
              }
              &:nth-last-of-type(1) {
                font-size: 30px;
                padding-left: 12px;
                color: #323232;
                line-height: 30px;
              }
            }
          }
          .items-right{
            color: #fff;
            font-size: 30px;
          }

        }
      }
    }
    .gifts-btn{
      width: 382px;
      height: 120px;
      margin-top: 40px;
      background: url(../../static/images/gifts_btn.png) center center / 100% auto no-repeat;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 5px;
      font-size: 48px;
      color: #fff;
      font-weight: 400;
      del{
        font-size: 36px;
        color: #ffcfbf;
      }
    }
  }
</style>
