export default {
  userInfo(state, payLoad) {
    if (typeof payLoad === "object") {
      state.user = payLoad;
      state.language = payLoad.lang;
      return;
    }
    let clickStr = +new Date();
    let stepStr = clickStr - state.curStr;
    state.curStr = clickStr; // 重新赋值;
    if (stepStr <= 1000) { // 用户点击频率
      state.user.balance = payLoad;
      return;
    }

    clearInterval(state.timer);
    state.timer = setInterval(function() {
      if (payLoad > state.user.balance) {
        state.user.balance = +state.user.balance + 100;
      } else if (payLoad < state.user.balance) {
        state.user.balance = +state.user.balance - 100;
      } else {
        clearInterval(state.timer);
        state.user.balance = payLoad;
      }
    }, 1)
  },
	toggleSounds(state, payLoad) {
    // 赋值音效是否打开
    state.audio.isYx = payLoad.bs == 1 ? true : false;
    state.audio.isYy = payLoad.bm == 1 ? true : false;
    payLoad.startMusic && (state.startMusic = payLoad.startMusic)
  },
  toggleSetting(state, payLoad) {
    state.isSetting = payLoad;
  },
  getHomeData(state, payLoad) {
    state.home = payLoad;
  },
	togglePlayHideStatus(state, payLoad) {
		state.palyHide = payLoad;
	},
  toggleMenu(state, payLoad) {
    if (payLoad.isHeader) {
      state.menuList = !state.menuList;
      return;
    }
    state.menuList = false;
  },
  toggleLoading(state, payLoad) {
    state.loading = payLoad.loading;
  },
  toggleHeaderLayer(state, payLoad) {
    state.isHome = (payLoad.isHome === 'false' || payLoad.isHome === false) ? false : true;
  },
  initScroll(state, payLoad) {
    state.scroll = payLoad.scroll;
  },
  version(state){
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      state.os = 'android';
    } else {
      state.os = 'ios';
    }
  },
	audioFun(state, payLoad){
		state.sound = payLoad;
	},
	initAudioConfig(state, payLoad) {
		for (let i in payLoad) {
			state.audio[i] = payLoad[i];
		}
	},
	slashStart(state, isLoop=false, currentTime=0) {
    if (!state.audio.slash) return;
    state.audio.slash.loop = isLoop;
		if (currentTime !== false) {
			state.audio.slash.currentTime = currentTime;
		}
    if (state.audio.isYx) {
      state.audio.slash.play();
    } else {
      state.audio.slash.pause();
    }
  },
  slashStop(state) {
    if (!state.audio.slash) return;
    state.audio.slash.pause();
  },
  slashbgyxStart(state, isLoop=false) {
    if (!state.audio.slashbgyx) return;
    state.audio.slashbgyx.loop = isLoop;
    if (state.audio.isYx) {
      state.audio.slashbgyx.play();
    } else {
      state.audio.slashbgyx.pause();
    }
  },
  slashbgyxStop(state) {
    if (!state.audio.slashbgyx) return;
    state.audio.slashbgyx.pause();
  },
  successbgyxStart(state, isLoop=false) {
    if (!state.audio.successbgyx) return;
    state.audio.successbgyx.loop = isLoop;
    if (state.audio.isYx) {
      state.audio.successbgyx.play();
    } else {
      state.audio.successbgyx.pause();
    }
  },
  successbgyxStop(state) {
    if (!state.audio.successbgyx) return;
    state.audio.successbgyx.pause();
  },
  failbgyxStart(state, isLoop=false) {
    if (!state.audio.failbgyx) return;
    state.audio.failbgyx.loop = isLoop;
    if (state.audio.isYx) {
      state.audio.failbgyx.play();
    } else {
      state.audio.failbgyx.pause();
    }
  },
  failyxStop(state) {
    if (!state.audio.failbgyx) return;
    state.audio.failbgyx.pause();
  },
  homebgyyStart(state, isLoop=false) {
    if (!state.audio.homebgyy) return;
    state.audio.homebgyy.loop = isLoop;
    if (state.audio.isYy) {
      state.audio.homebgyy.play();
    } else {
      state.audio.homebgyy.pause();
    }
  },
  homebgyyStop(state) {
    if (!state.audio.homebgyy) return;
    state.audio.homebgyy.pause();
  },
  slashbgyyStart(state, isLoop=false) {
    if (!state.audio.slashbgyy) return;
    state.audio.slashbgyy.loop = isLoop;
    if (state.audio.isYy) {
      state.audio.slashbgyy.play();
    } else {
      state.audio.slashbgyy.pause();
    }
  },
  slashbgyyStop(state) {
    if (!state.audio.slashbgyy) return;
    state.audio.slashbgyy.pause();
  },
}
