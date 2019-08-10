<template lang="html">
  <div class="audio-wrapper">
  </div>
</template>
<script>
  import {mapState, mapMutations} from "vuex"
  import {getBuffer, checkAudio} from "@/common/common.js"
  export default {
    data() {
      return {
        timer: null,
        isLoadMusic: false,
      }
    },
    computed: {
      ...mapState(['audio', 'os', 'loading', 'user', 'startMusic'])
    },
    watch: {
      startMusic(newName, oldName) {
        if (newName) {
          this.isLoadMusic && this.homebgyyStart(true);
        }
      },
    },
    created() {
      this.initAudio();
    },
    methods: {
      initAudio() {
        let sounds = {
          slash: null,
          slashbgyx: null,
          homebgyy: null,
          slashbgyy: null,
          successbgyx: null,
          failbgyx: null,
        };
        let soundsUrl = "http://scratch-card.oss-ap-southeast-1.aliyuncs.com/audio/";
        for (let i in sounds) {
          sounds[i] = new Audio();
					let type = checkAudio(sounds[i]);
					if (!type) {throw('音频'+i+'出错')};
					let src = soundsUrl + i + '.' +type;
					sounds[i].src = src;
        }

        this.initAudioConfig(sounds);
				this.audioEventListener();
      },
			audioEventListener() {
				let eventName = this.os === 'ios' ? 'loadstart' : 'canplay';
        this.audio.homebgyy.addEventListener(eventName, () => {
          let params = {
            bs: this.audio.isYx,
            bm: this.audio.isYy,
            startMusic: true,
          }
          this.isLoadMusic = true;
          this.toggleSounds(params);
        })
			},
      ...mapMutations(['initAudioConfig', 'homebgyyStart', 'slashbgyxStart', 'toggleSounds'])
    },
  }
</script>
<style lang="less" scoped>
  audio{display: none};
</style>
