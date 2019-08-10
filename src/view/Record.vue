<template lang="html">
  <div class="record">
    <div class="sub-menu">
      <span @click="toggleMenu('buy')" :class="[{'on': text == 'buy'}]"><strong>{{lang[language].message.pay}}</strong></span>
      <span @click="toggleMenu('get')" :class="[{'on': text == 'get'}]"><strong>{{lang[language].message.win}}</strong></span>
    </div>
    <div class="space"></div>
    <div class="space-2"></div>
		<mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="record-list">
			<div class="record-list-wrapper">
        <ul class="list">
          <li v-for="item in recordList">
            <div class="list-left"><img :src="item.img" alt=""></div>
            <div class="list-right">
              <div class="list-name">
                <span class="fs-30">{{item.name}} <i v-show="item.info">({{item.info}})</i></span>
                <strong v-show="text === 'get'" class="fs-30 color-red">{{lang[language].message.get}}</strong>
              </div>
              <div class="mt-8">
                <span class="fs-28">{{text === 'buy' ? lang[language].message.orderNumber : lang[language].message.serialNumber}}: {{item.order_id}}</span>
              </div>
              <div class="list-date mt-8">
                <span class="fs-22 color-thir">{{item.add_time}}</span>
                <strong class="fs-30" :class="[{'color-red': text === 'get'}]">KHR {{item.money | formatAmount}}</strong>
              </div>
            </div>
          </li>
        </ul>
      </div>
		</mescroll-vue>
  </div>
</template>

<script>
  import MescrollVue from "mescroll.js/mescroll.vue"
  import {mapMutations, mapState} from "vuex"
  import {getRecords, getRecordsIncome, SUCCESS} from "@/api/api"
  export default {
    data() {
      return {
        recordList: [],
        text: 'buy',
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
			MescrollVue
    },
    computed: {
			language() {
			},
      ...mapState(['scroll', 'lang', 'language'])
    },
		watch: {
			language(newName, oldName) {
				this.mescrollDown.textInOffset = this.lang[newName].message.pulldownToRefresh;
				this.mescrollDown.textOutOffset = this.lang[newName].message.releaseToRefresh;
				this.mescrollDown.textLoading = this.lang[newName].message.loading;
				this.mescrollUp.htmlLoading = `<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">${this.lang[newName].message.loading}</p>`;
			}
		},
    created() {
			this.mescrollDown.textInOffset = this.lang[this.language].message.pulldownToRefresh;
			this.mescrollDown.textOutOffset = this.lang[this.language].message.releaseToRefresh;
			this.mescrollDown.textLoading = this.lang[this.language].message.loading;
			this.mescrollUp.htmlLoading = `<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">${this.lang[this.language].message.loading}</p>`;
      this.toggleHeaderLayer(this.$route.query);
      this.getRecords();
    },
		mounted() {
			this.homebgyyStop();
		},
    methods: {
			mescrollInit(mescroll) {
		   this.mescroll = mescroll;
			},
			upCallback(page, mescroll) {
			 this.getRecords("pullingUp", this.text);
			},
			downCallback(page, mescroll) {
			 this.getRecords("pullDown", this.text);
			},
      getRecords(type, menu) {
				let _this = this;
        let params = {
          last: ""
        };

        if (type === 'pullDown') {
          params.last = "";
        } else if (type === 'pullingUp') {
          params.last = this.recordList.length === 0 ? null : this.recordList[this.recordList.length-1].id;
        }

        if (menu == 'get') {
          getRecordsIncome(params).then(res => {
            if (res.status.code === SUCCESS) {
              if (type === 'pullingUp') {
	              this.recordList = this.recordList.concat(res.data);
								this.mescroll.endSuccess(res.data.length,res.data.length!==0);
              } else if (type === 'pullDown'){
                this.recordList = res.data;
								this.mescroll.resetUpScroll();
              } else {
                this.recordList = res.data;
								this.mescroll.resetUpScroll();
              }
              layer.closeAll();
            } else {
              layer.closeAll();
              layer.msg(res.status.message);
            }
          })
          return;
        }

        getRecords(params).then((res) => {
          if (res.status.code === SUCCESS) {
            if (type === 'pullingUp') {
              this.recordList = this.recordList.concat(res.data);
							this.mescroll.endSuccess(res.data.length,res.data.length!==0);
            } else if (type === 'pullDown'){
              this.recordList = res.data;
							this.mescroll.resetUpScroll();
            } else {
              this.recordList = res.data;
							this.mescroll.resetUpScroll();
            }
            layer.closeAll();
          } else {
            layer.msg(res.status.message);
            layer.closeAll();
          }
        })
      },
      toggleMenu(txt) {
        if (txt === this.text) return;
        layer.mask();
        this.text = txt;
				this.mescroll.scrollTo(0, 0);
        this.getRecords(null, this.text);

      },
      ...mapMutations(['toggleLoading', 'toggleHeaderLayer', 'homebgyyStop'])
    },
  }
</script>

<style lang="less" scoped>
  .record{
    .sub-menu{
      width: 678px;
      height: 80px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 5px;
      padding: 6px 0px;
      box-shadow:0px 2px 5px 0px rgba(8,1,3,0.34);
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
          font-size: 30px;
        }
        &.on{
          strong{
            border-bottom-color: #f00;
          }
        }
      }
    }
    .space{
      position: fixed;
      top: 50px;
      left: 0;
      right: 0;
      z-index: -1;
      height: 69px;
      background-color: #f44c31;
    }
    .space-2{
      position: fixed;
      top: 113px;
      left: 0;
      right: 0;
      height: 69px;
      background-color: #f2f2f2;
      z-index: -1;
    }
    .record-list{
      position: fixed;
      top: 178px;
      bottom: 0px;
      width: 100%;
      background-color: #f2f2f2;
      padding: 0 15px;
      z-index: 1;
			height: auto;
      .record-list-wrapper{
        min-height: 101%;
      }
      .list{
        background-color: #fff;
        li{
          display: flex;
          .list-left{
            min-width: 145px;
            width: 145px;
            height: 145px;
            margin: 12px 29px 12px 14px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .list-right{
            flex-grow: 1;
            padding: 21px 29px 23px 0;
            border-bottom: 1px solid #f6f6f6;
            .list-name,
            .list-date{
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
          }
        }
      }
    }
  }
</style>
