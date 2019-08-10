import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import lang from '@/common/lang.js'
const state = {
  os: 'android',
  language: "khr",
	palyHide: true,
  lang: lang,
  user: {},
  startMusic: false,
  home: {},
	audio: {
		isYx: true,
		isYy: true,
		slash: null,
		slashbgyx: null,
		homebgyy: null,
		slashbgyy: null,
		successbgyx: null,
		failbgyx: null,
	}, // 音频对象
  menuList: false,
  loading: true,
  scroll: null,
  isHome: true, // 默认是首页
	sound: null,
	isSetting: false, // 默认音效界面关闭
  timer: null, // 数字变化的定时器
  curStr: +new Date(), // 当前时间戳
};

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
