<template>
  <div class="header" @click="toggleMenu({isHeader: false})">
    <div class="header-left">
      <div class="header-img">
        <img ref="img" :src="user.avatar" onerror="this.src='../../static/images/default_header.png'" alt="">
      </div>
      <div class="header-info">
        <div class="header-name">{{user.nickname}}</div>
        <div class="header-balance" v-if="user.balance">KHR {{user.balance | formatAmount}}</div>
        <div class="header-balance" v-else> -- </div>
      </div>
    </div>
    <div v-if="isHome" class="header-right">
      <span class="box-status" v-show="home.box_status" @click="routerChange({url: '/box', fast: true, query: {isHome: false}})">{{lang[language].message.ticketBox}} <i>{{home.box_status>99?'99+':home.box_status}}</i></span>
      <div class="logout" @click="logout">{{lang[language].message.quit}}</div>
      <div class="header-menu" @click.stop="toggleMenu({isHeader: true})">···</div>
      <div class="menu-list" v-show="menuList">
        <span @click="routerChange({url: '/record', query: {isHome: false}})">{{lang[language].message.record}}</span>
        <span @click="routerChange({url: '/box', query: {isHome: false, isExit: false}})">{{lang[language].message.ticketBox}}</span>
				<span @click="toggleSetting(true)">{{lang[language].message.setting}}</span>
      </div>
    </div>
    <div v-else class="header-right">
        <span class="fs-30" @click="logout" v-show="palyHide">{{lang[language].message.back}}</span>
    </div>
  </div>
</template>

<script>
  import {SUCCESS, getUserBalance} from "@/api/api.js"
  import {mapState, mapMutations} from "vuex"
  export default {
  name: 'commonHeader',
  data() {
    return {
      timer: null,
    }
  },
  computed: {
    ...mapState(['language', 'palyHide', 'lang', 'user', 'menuList', 'isHome', 'home', 'os'])
  },
  created() {
    this.getUserBalance();
  },
  methods: {
    getUserBalance() {
      getUserBalance({}).then((res) => {
        if (res.status.code === SUCCESS) {
          this.userInfo(res.data);
        }
      })
    },
    routerChange(obj) {
			if (obj.fast && this.home.box_id) {
				obj.url = "/play";
				obj.query.id = this.home.box_id;
			}
      this.$router.push({
        path: obj.url,
        query: obj.query
      })
    },
    replaceImg(event) {
      // this.src = '../assets/images/default_header.png'
    },
    logout() {
      if (this.isHome) {
        if (this.os !== 'android') {
          window.webkit.messageHandlers.Logout.postMessage(null);
        } else {
          JSInterface.Logout();
        }
        return;
      }
      history.back();
    },
    ...mapMutations(['userInfo', 'toggleMenu', 'toggleSetting'])
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .header{
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    padding: 0 20px;
    font-size: 26px;
    color: #fff;
    z-index: 1;
    background-color: rgb(244, 76, 49);
    .header-left{
      display: flex;
      align-items: center;
      height: 80px;
    }
    .header-right{
      display: flex;
      height: 80px;
      justify-content: space-between;
      line-height: 80px;
      font-size: 24px;
      .box-status{
        position: relative;
				white-space: nowrap;
        i{
          position: absolute;
          right: -23px;
          top: 0;
          min-width: 36px;
          padding: 0 5px;
          height: 36px;
          line-height: 50px;
          font-size: 24px;
          background-color: #BD0000;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 18px;
        }
      }
      .menu-list{
        position: absolute;
        top: 81px;
        right: 0px;
        z-index: 999;
        text-align: center;
        padding: 0 30px;
        border-top: 1px solid #ff3366;
        background-color: #f44c31;
        display: flex;
        flex-direction: column;
        span{
					border-bottom: 1px solid #fff;
          &:nth-last-of-type(1) {
            border-bottom-color: transparent;
          }
        }
      }
    }
    .logout{
      margin-left: 45px;
			white-space: nowrap;
    }
    .header-img{
      img{width: 60px; height: 60px;}
    }
    .header-info{
      margin-left: 10px;
    }
    .header-menu{
      font-size: 70px;
      margin-left: 50px;
    }
  }
</style>
