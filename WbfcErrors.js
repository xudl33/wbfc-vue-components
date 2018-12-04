'use strict';
import $ from 'jQuery'
import WbfcUtils from './WbfcUtils'

var defaultsOptions = {
	showLog: false // 打印debug日志
}
var defaultErrors = {
	'001': '参数类型不正确', // 不是JSON格式
	'002': '参数有效性不正确', // 参数错误:{0}没有{1}的定义
	'003': '必填项为空或信息不全',
	'004': '数据错误，操作对象不存在',
	'005': '参数校验未通过',
	'009': '数据已被修改，请刷新后重试', // 排他错误
	'901': '没有系统权限',
	'904': '验证码错误或已过期',
	'999': '操作失败，请刷新后重试' // 未知错误
};
var mappings = {}; // 映射临时变量
export default {
	name: 'Wbfc-Errors',
	defaults: defaultsOptions,
	install(Vue, options) {
		this.option = $.extend({}, defaultsOptions, options);
		// 初始化赋值
		this.mappings = $.extend({}, this.defaultErrors);

		if(Vue.$wbfc){
			Vue.$wbfc.Errors = this;
		}
		//console.log("WbfcErrors this", this);
	},
	isSuccess(code){
		if(code){
			// 接口返回值为000时为成功  还有一小部分接口会返回20000也是成功
			if('000' === code || '20000' === code){
				return true;
			}
		}
		return false;
	},
	mapping(res) { // 映射错误消息
		var msg;
		var temp = res || {};
		// 使用code查询映射
		if(temp.code){
			msg = this.mappings[temp.code];
			if(!msg){
				msg = temp.msg;
			} else {
				// 打印映射日志
				if(this.option.showLog){
					console.log('Mapping %s:%s to %s:%s with %o', temp.code, temp.msg, temp.code, msg, temp);
				}
			}
		}
		return msg;
	},
	addMapping(code, msg) { // 添加错误映射
		if(code && msg){
			var temp = {};
			temp[code] = msg;
			// 合并
			this.mappings = $.extend({}, this.defaultErrors, temp);
			// 打印日志
			if(this.option.showLog){
				console.log('Add mapping %s:%s', code, msg);
			}
		} else {
			// 如果是对象的话
			if(WbfcUtils.isObj(code)){
				for(var i in code){
					var mapObj = code[i];
					this.addMapping(i, mapObj);
				}
			}
		}
	}
}
