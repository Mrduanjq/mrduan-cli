import {
  get,
  post
} from '@/api/base.js'
import {getCookie} from '@/common/common.js'

let INTF_HOST = "/api/";
export const SUCCESS = "0000";
export const ERROR = 1000;

/**
* 获取用户信息
*/
export function getUserBalance(params) {
  let url = INTF_HOST + "wallet/balance";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 获取banner信息
*/
export function getBanner(params) {
  let url = INTF_HOST + "home";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 获取首页商品列表
*/
export function getGoodsList(params) {
  let url = INTF_HOST + "produce";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 购买商品接口
*/
export function buyGoods(params) {
  let url = INTF_HOST + "produce/buy";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 获取 彩票盒列表
*/
export function getScratchBox(params) {
  let url = INTF_HOST + "box";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 获取 购买记录
*/
export function getRecords(params) {
  let url = INTF_HOST + "records/expenditure";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 获取 收入记录
*/
export function getRecordsIncome(params) {
  let url = INTF_HOST + "records/income";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 获取 刮面数据
*/
export function getScratchData(params) {
  let url = INTF_HOST + "scratch";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 兑奖
*/
export function payout(params) {
  let url = INTF_HOST + "scratch/payout";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 音乐设置
*/
export function soundsSetting(params) {
  let url = INTF_HOST + "wallet/setting";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}

/**
* 音乐设置
*/
export function getSoundsSetting(params) {
  let url = INTF_HOST + "wallet/getsetting";
  params.token = getCookie('token');
  params.lang = getCookie('lang');
  return post(url, params);
}
