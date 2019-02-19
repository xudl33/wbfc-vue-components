import Vue from 'vue'
import $ from 'jQuery';
import WbfcDicts from './WbfcDicts'
import WbfcUtils from './WbfcUtils'
var defaultsOptions = {
	lal2Val: function(typ, lab, options){ // 数据字典标签转值
		return WbfcDicts.getVal(typ, lab, options);
	},
	val2Lab: function(typ, val, options){ // 数据字典值转标签
		return WbfcDicts.getLabel(typ, val, options);
	},
	dateFormat: function(date, fmt) { // 日期格式化函数
		return WbfcUtils.dateFormat(date, fmt);
	}
};
export default {
	defaults: defaultsOptions,
	install(Vue, options){
		var filters = $.extend({}, defaultsOptions, options || {});
		for(var f in filters){
			Vue.filter(f, filters[f]);
		}
	}
}