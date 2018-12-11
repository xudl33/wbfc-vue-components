'use strict';

import $ from 'jQuery';
import WbfcUtils from './WbfcUtils';

var defaultsOptions = {
	datas: {}, // 字典数据
	mapping:{ // 映射关系
		lab: 'label', // 标签
		val: 'value' // 值
	},
	showLog: false // 是否显示debug日志
};

export default {
	name: 'Wbfc-Dicts',
	defaults: defaultsOptions,
	install(Vue, options){
		this.options = $.extend({}, defaultsOptions, options || {});
		if(Vue.$wbfc){
			Vue.$wbfc.Dicts = this;
		}
	},
	addTypes : function(label, types) { // 添加字典类型
		if(!label){
			return;
		}
		if(label && types){
			// types必须是数组
			if(!WbfcUtils.isArray(types)){
				// 打印日志
				if(this.options.showLog){
					console.log("Wbfc-Dicts addTypes label= %s, type=%o, Type must be array!", label, types);
				}
				return false;
			}
			this.options.datas[label] = types;
		} else if(WbfcUtils.isObj(label)){
			var temp = null;
			for(var i in label){
				temp = this.addTypes(i, label[i]);
				if(temp === false){
					break;
				}
			}
		}
	},
	getTypes : function(typ, options) {
		if(!typ){
			return;
		}
		// 替换配置
		var opt = this.options;
		if(options){
			opt = $.extend({}, opt, options);
		}
		/** 取得数据值字典中的标签 */
		var dict = this.options.datas;
		// 取得数据字典
		if(dict){
			var typeArray = null;
			typeArray = dict[typ];
			if (!typeArray) {
				if (opt.showLog) {
					console.log("Wbfc-Dicts getTypes type=%s are not found", typ);
				}
				return;
			}
			if (opt.showLog) {
				console.log("Wbfc-Dicts getDictType type=%s:%o", typ, typeArray);
			}
			return typeArray;
		}
	},
	getLabel : function(typ, val, options) {
		if(!(typ && val)){
			return;
		}
		// 替换配置
		var opt = this.options;
		if(options){
			opt = $.extend({}, opt, options);
		}
		/** 取得数据值字典中的标签 */
		var dict = this.options.datas;
		// 取得数据字典
		if(dict){
			var res = null;
			var typeArray = dict[typ];
			// 如果未取到字典,说明字典中没有对应的数据类型,直接返回
			if (!typeArray) {
				if (opt.showLog) {
					console.log("Wbfc-Dicts getTypes type=%s are not found", typ);
				}
				return;
			}
			// types必须是数组
			if(!WbfcUtils.isArray(typeArray)){
				// 打印日志
				if(this.options.showLog){
					console.log("Wbfc-Dicts getLabel type=%s, Type must be array! type=%o", typ, typeArray);
				}
				return;
			}

			// 按lable
			if(opt.eqLabel){
				$.each(typeArray, function(i, n) {
					if (val === n[opt.mapping.lab]) {
						res = n[opt.mapping.val];
						return false;
					}
				});
				if (opt.showLog) {
					console.log("Wbfc-Dicts getLable type=%s value=%s label=%s" , typ, res, val);
				}
			} else {
				// 按value
				$.each(typeArray, function(i, n) {
					if (val === n[opt.mapping.val]) {
						res = n[opt.mapping.lab];
						return false;
					}
				});
				// 打印日志
				if (opt.showLog) {
					console.log("Wbfc-Dicts getLable type=%s value=%s label=%s" , typ, val, res);
				}
			}
			// 是否有默认值
			if(!res && opt.default){
				res = opt.default;
			}
			// 是否有转换器
			if(opt.converter){
				res = opt.converter.call(this, typ, val, res, opt);
			}

			return res;
		}
	},
	getVal : function(typ, label, options) {
		var opt = $.extend({eqLabel: true}, options);
		return this.getLabel(typ, label, opt);
	}
}