let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = AudioContext ? new AudioContext() : '';
export function getBuffer(link) {
  return new Promise((resolve, reject) => {
    if (audioCtx) {
      let request = new XMLHttpRequest();
      request.open("GET", link, true);
      request.responseType = "arraybuffer";
      request.onload = function() {
        audioCtx.decodeAudioData(request.response, function(buffer) {
          resolve(buffer)
        }, function(e) {
          reject(e);
        });
      };
      request.send();
    } else {
      reject('not support AudioContext');
    }
  })
}
export function createSound(buffer) {
  if (audioCtx.state == 'suspended') {
    audioCtx.resume();
  }
  let source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.loop = true;
  return source;
}



export function setCookie(key, value, hours) {
  let date = new Date();
  if (typeof(hours) == "undefined") {
    hours = 7 * 24;
  }
  date.setTime(date.getTime() + hours * 3600 * 1000);
  document.cookie = key+"="+escape(value)+";expires="+date.toUTCString()+"; path=/";
}

export function getCookie(key){
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for(var i = 0; i < arrCookie.length; i++){
        var arr = arrCookie[i].split("=");
        if(key == arr[0]){
            return arr[1];
        }
    }
    return;
}

export function clearCookie(name) {
  this.setCookie(name, '', -1);
}
export function getParam(key) {
  let group = location.href.match(eval('/'+key+'=([^#&\/]+)/'));
  if (group) {
    return group[1];
  }
  return null;
}

export function offset(obj,direction){
    //将top,left首字母大写,并拼接成offsetTop,offsetLeft
    var offsetDir = 'offset'+ direction[0].toUpperCase()+direction.substring(1);

    var realNum = obj[offsetDir];
    var positionParent = obj.offsetParent;  //获取上一级定位元素对象
    while(positionParent != null){
        realNum += positionParent[offsetDir];
        positionParent = positionParent.offsetParent;
    }
    return realNum;
}

export function getStyle(element, attr) {
  if(element.currentStyle) {
      return element.currentStyle[attr];
  } else {
      return getComputedStyle(element, false)[attr];
  }
}

export function isAndroid(str) {
  if (str === 'android')
    return true;
  return false;
}

export function splitArr(arr) {
  if (!arr.length) return [];
  let newArr = JSON.parse(JSON.stringify(arr));
  let leftArr = [];
  let rightArr = [];
  if (arr.length % 2 === 0) {
    leftArr = newArr.splice(0, newArr.length/2);
    return {
      leftArr: leftArr,
      rightArr: newArr
    }
  }
  leftArr = newArr.splice(0, Math.ceil(newArr.length/2));
  return {
    leftArr: leftArr,
    rightArr: newArr
  }
}
export function checkAudio(myAudio) {
    if (myAudio.canPlayType) {
        if ("" != myAudio.canPlayType('audio/ogg;codecs="vorbis"')) {
            return "ogg";
        }
        if ("" != myAudio.canPlayType('audio/mpeg')) {
            return "mp3";
        }
        if ("" != myAudio.canPlayType('audio/mp4;codecs="mp4a.40.5"')) {
            return false;
        }
    } else {
        return false;
    }
}
