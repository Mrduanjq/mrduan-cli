<template lang="html">
  <div class="setting">
    <div>
      <div class="close"><span @click.stop="toggleSetting(false)" class="iconfont icon-guanbi2"></span></div>
      <div class="content mt-33">
        <div class="setting-header">
          <h3 class="title">{{lang[langue].message.setting}}</h3>
        </div>
        <div class="setting-content">
          <div class="music">
            <span>{{lang[langue].message.music}}</span>
            <img v-if="audio.isYy==0 || audio.isYy ==1" @click="toggleStatus('music')" :src="'../../static/images/icon_select_'+(+audio.isYy)+'.png'" alt="">
          </div>
          <div class="yx">
            <span>{{lang[langue].message.soundEffect}}</span>
            <img v-if="audio.isYx==0||audio.isYx==1" @click="toggleStatus('yx')" :src="'../../static/images/icon_select_'+(+audio.isYx)+'.png'" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from "vuex"
  import {soundsSetting, SUCCESS} from "@/api/api"
  export default {
    data() {
      return {
        music: 0,
        yx: 0,
      }
    },
		props: ['langue'],
    computed: {
      ...mapState(['lang', 'audio'])
    },
    methods: {
      toggleStatus(type) {
        this.music = this.audio.isYy;
        this.yx = this.audio.isYx;
        if (this[type] == 0) {
          this[type] = 1;
        } else {
          this[type] = 0;
        }
        this.soundsSetting();
      },
      soundsSetting() {
        let params = {
          bm: this.music,
          bs: this.yx,
        };
        soundsSetting(params).then(res => {
          if (res.status.code !== SUCCESS) {
            layer.msg(res.status.message);
            return;
          }
          this.toggleSounds(params);
          this.homebgyyStart(true);
        })
      },
      ...mapMutations(['toggleSetting', 'toggleSounds', 'homebgyyStart'])
    },
  }
</script>
<style lang="less" scoped>
  .setting{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background-color: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;
    .close{
      text-align: right;
      color: #fff;
      .iconfont{
        font-size: 56px;
      }
    }
    .content{
      border-radius: 12px;
      width: 550px;
      background-color: #fff;
      .setting-header{
        width: 100%;
        height: 217px;
        padding-top: 40px;
        background: url('../assets/images/icon_detail_bg.png') center center / 100% 100% no-repeat;
        h3{
          padding-left: 40px;
          color: #fff;
        }
      }
      .setting-content{
        width: 463px;
        margin-left: auto;
        margin-right: auto;
        padding-bottom: 54px;
        img{
          width: 46px;
          height: 46px;
        }
        .music,.yx{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 55px;
        }
      }
    }
  }
</style>
