import $ from 'jQuery';
import WbfcUtils from './WbfcUtils';

var defaultsOptions = {
	dynamicPath: true, // 动态URL true时会更加pathMaping动态生成url 一般用于多服务的情况
	staticPath: 'http://127.0.0.1', // 静态URL配置如果dynamicPaths=false则全部的path都会在前拼接 一般这样的用于单服务的情况
	dynamicRoot: 'http://127.0.0.1', // 动态URL根目录
	pathMaping: {
		security: {
			regex: /^security/i,
			matchs: [{ // 可以是一个固定的字符串 例:127.0.0.1:8089，也可以是一个数组[{urlReg:'', path:''}]
				urlReg: /\w*/, // 可以是正则 也可以是字符串
				path: ''
			}] // matchs会按照数组的顺序进行匹配替换，如果一个url符合urlReg的规则就会被替换成相应的path，但若下一个match也符合就会被重新替换
		},
		system: {
			regex: /^system/i,
			matchs: [{
				urlReg: /\w*/,
				path: ''
			}]
		},
		files: {
			regex: /^files/i,
			matchs: [{
				urlReg: /\w*/,
				path: ''
			}]
		},
		ofim: {
			regex: /^ofim/i,
			matchs: [{
				urlReg: /\w*/,
				path: ''
			}]
		}
	}
};

function getMatchUrl(matchObj, targetUrl){
	// 如果不存在 或urlReg和path为空时返回targetUrl
	if (!matchObj || !matchObj.urlReg || !matchObj.path) {
		return targetUrl;
	}

	// urlReg是正则
	if(matchObj.urlReg.test){
		if(matchObj.urlReg.test(targetUrl)){
			targetUrl = (matchObj.path + targetUrl);
		} else {
			return null;
		}
	} else {
		// urlReg是字符串直接判断是否相等
		if(matchObj.urlReg === targetUrl){
			targetUrl = (matchObj.path + targetUrl);
		} else {
			return null;
		}
	}
	return targetUrl;
}

export default {
	name: 'Wbfc-ActionPath',
	defaults: defaultsOptions,
	install(Vue, options){
		this.options = $.extend({}, defaultsOptions, options || {});
		if(Vue.$wbfc){
			Vue.$wbfc.ActionPath = this;
		}
	},
	setRoot(rootPath){
		// 设置根目录
		this.options.dynamicRoot = rootPath;
	},
	get(url){
		// 动态的url必须以'xxx:'开头
		var subIndex = url.indexOf(':');
		if(url && subIndex < 0){
			return url;
		}
		var contextType = url.substring(0, subIndex);
		var targetUrl = url.substring(subIndex + 1);
		if(targetUrl){
			// 动态的需要重新计算
			if(this.options.dynamicPath){
				for(var i in this.options.pathMaping) {
					var regex = this.options.pathMaping[i].regex;
					var matchs = this.options.pathMaping[i].matchs;
					// 正则和匹配表必须存在的情况下再进行匹配算法
					if(regex && matchs){
						// contextPath符合就跳出循环
						if (regex.test(contextType)) {
							var mcType = typeof matchs;
							// 如果时候字符串就直接拼接返回
							if (mcType === 'string') {
								targetUrl = (matchs + targetUrl);
								break;
							} else if (WbfcUtils.isArray(matchs)) {
								// 如果是数组就遍历
								var tempTarUrl = targetUrl;
								matchs.forEach((n, i) => {
									var tmpUrl = getMatchUrl(n, targetUrl);
									if(tmpUrl){
										tempTarUrl = tmpUrl;
									}
								});
								// 覆盖原Url
								targetUrl = tempTarUrl;
							} else if (WbfcUtils.isObj(matchs)){
								// 如果直接是match对象就直接用
								var tmpUrl = getMatchUrl(matchs, targetUrl);
								if(tmpUrl){
									targetUrl = tmpUrl;
								}
							}
							break;
						}
					}
				}
				// 如果没有匹配到任何结果，就用根目录
				if(!targetUrl){
					// 默认的转发是根目录
					targetUrl = (this.options.dynamicRoot + targetUrl);
				}
			} else {
				// 静态的需要拼接staticPath
				if(this.options.staticPath){
					targetUrl = (this.options.staticPath + targetUrl);
				}
			}
		}
		return targetUrl;
	},
	addMapping(type, mapingObj) { // 添加mapping映射
		if(type && mapingObj){
			this.options.pathMaping[type] = mapingObj;
		} else {
			// 如果是对象的话
			if(WbfcUtils.isObj(type)){
				for(var i in type){
					var mapObj = type[i];
					if(WbfcUtils.isObj(mapObj)){
						this.addMapping(i, mapObj);
					}
				}
			}
		}
	},
	deleleMapping(type){ // 删除mapping映射
		if(type) delete this.options.pathMaping[type];
	},
	setMatchs(type, matchs){ // 设置某个mapping的匹配规则
		if(type && matchs){
			var mapping = this.options.pathMaping[type];
			if(mapping && mapping.regex){
				this.options.pathMaping[type].matchs = matchs;
			}
		}
	},
	addMatch(type, match){ // 为某个mapping添加匹配规则(matchs必须是数组)
		if(type && match){
			var mapping = this.options.pathMaping[type] || {};
			if(mapping && mapping.regex && WbfcUtils.isArray(mapping.matchs)){
				this.options.pathMaping[type].matchs.push(match);
			}
		} else {
			// 如果是对象的话
			if(WbfcUtils.isObj(type)){
				for(var i in type){
					var matchObj = type[i];
					if(WbfcUtils.isObj(matchObj)){
						this.addMatch(i, matchObj);
					} else if(WbfcUtils.isArray(matchObj)){
						matchObj.forEach((n, j) =>{
							this.addMatch(i, n);
						});
					}
					
				}
			}
		}
	},
	deleteMatch(type, matchValOrIndex){ // 删除某个mapping的匹配规则 若matchs为数组则matchValOrIndex必填
		if(type){
			var mapping = this.options.pathMaping[type];
			if(mapping && mapping.matchs){
				if (WbfcUtils.isArray(mapping.matchs)) {
					if(matchValOrIndex){
						// 按值或下标删除
						WbfcUtils.removeArrayItem(this.options.pathMaping[type].matchs, matchValOrIndex);
					}
				} else {
					this.options.pathMaping[type].matchs = null;
				}
			}
		}
	}
}