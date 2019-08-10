<template lang="html">
	<mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="record-list box-list">
    <div class="list-wrapper">
      <ul>
        <li v-for="item in boxList" @click="detail(item.id)">
          <div class="list-left"><img :src="item.img" alt=""></div>
          <div class="list-right">
            <p class="fs-30">{{item.scratch_name}}</p>
            <p class="fs-28">{{lang[language].message.serialNumber}}：{{item.serial_number}}</p>
            <!-- <p class="fs-28 color-red">刮奖进度： KHR 4,000/1,000</p> -->
            <p class="fs-25 color-thir">{{item.add_time}}</p>
          </div>
        </li>
      </ul>
    </div>
	</mescroll-vue>
</template>

<script>
  import MescrollVue from "mescroll.js/mescroll.vue"
  import {mapState, mapMutations} from "vuex"
  import {getScratchBox, SUCCESS} from "@/api/api"
  export default {
    name: "Box",
    data() {
      return {
        boxList: [],
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
    created() {
			this.mescrollDown.textInOffset = this.lang[this.language].message.pulldownToRefresh;
			this.mescrollDown.textOutOffset = this.lang[this.language].message.releaseToRefresh;
			this.mescrollDown.textLoading = this.lang[this.language].message.loading;
			this.mescrollUp.htmlLoading = `<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">${this.lang[this.language].message.loading}</p>`;
      layer.mask();
      this.toggleHeaderLayer(this.$route.query);
      this.getScratchBox();
    },
    computed: {
			language() {
			},
      ...mapState(['lang', 'language'])
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
			this.homebgyyStop();
		},
    components: {
			MescrollVue
    },
    methods: {
			mescrollInit(mescroll) {
		   this.mescroll = mescroll;
			},
			upCallback(page, mescroll) {
			 this.getScratchBox("pullingUp");
			},
			downCallback(page, mescroll) {
			 this.getScratchBox("pullDown");
			},
      getScratchBox(type) {
				let _this = this;
        let params = {
          last: "",
        };
        if (type === 'pullDown') {
          params.last = "";
        } else if (type === 'pullingUp') {
          params.last = this.boxList.length === 0 ? null : this.boxList[this.boxList.length-1].id;
        }
        getScratchBox(params).then((res) => {
          if (res.status.code === SUCCESS) {
            if (type === 'pullingUp') {
              this.boxList = this.boxList.concat(res.data);
							this.mescroll.endSuccess(res.data.length,res.data.length!==0);
            } else if (type === 'pullDown') {
              this.boxList = res.data;
							this.mescroll.resetUpScroll();
            } else {
              this.boxList = res.data;
            }
            layer.closeAll();
          } else {
            layer.msg(res.status.message);
            layer.closeAll();
          }
					if (this.boxList.length<1) {
						if (this.$route.query.isExit != false) {
							history.back();
						}
					}
        })
      },
      detail(id) {
        this.$router.push({
          path: '/play',
          query: {
            id: id,
            isHome: false
          },
        })
      },
      ...mapMutations(['toggleLoading', 'toggleHeaderLayer', 'slashbgyyStop', 'homebgyyStop'])
    },
  }
</script>

<style lang="less" scoped>
    .box-list{
      position: fixed;
      top: 82px;
      left: 0;
      bottom: 0;
      right: 0;
			height: auto;
      background-color: #f2f2f2;
      ul {
        padding: 20px 15px 0 15px;
        li{
          display: flex;
          background-color: #fff;
          padding: 12px 14px;
          margin-bottom: 20px;
          box-shadow: 0px 2px 5px 0px rgba(8,1,3,0.34);
          .list-left{
            width: 145px;
            height: 145px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 18px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .list-right{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
        }
      }
    }
</style>
