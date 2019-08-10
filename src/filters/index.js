exports.formatAmount = (str) => { // 金额千位格式化
  let str1 = String(str).split('.');
  str = str1[0];
  let strArr = String(str).split("").reverse();
  let strFin = "";
  for (let i=1; i<=strArr.length; i++) {
      strFin = strFin + strArr[i-1];
      if (i%3===0) {
          strFin = strFin + ",";
      }
  }
  let arr = strFin.split('').reverse();
  if (arr[0] === ",") {
      arr.shift();
  }
  if (!arr.length) {
      return 0;
  }
  return arr.join("");
}
