'use strict';
import jQuery from 'jQuery';

function isObj(object) {
    return object && typeof(object) === 'object' && Object.prototype.toString.call(object).toLowerCase() === "[object object]";
}

function isArray(object) {
    return object && typeof(object) === 'object' && object.constructor === Array;
}

function getLength(object) {
    var count = 0;
    for(var i in object) count++;
    return count;
}

function compare(obj1, obj2){
	var t1 = typeof obj1;
	var t2 = typeof obj2;
	// 类型不同返回false
	if (t1 !== t2) {
		return false;
	}
	// 字符串或数字直接判断就行
	if (t1 === 'string' || t1 === 'number') {
		return obj1 === obj2;
	}
	// 如果是对象有两种情况
	if (t1 === 'object') {
		var l1 = getLength(obj1);
		var l2 = getLength(obj2);
		if (l1 !== l2) {
			return false;
		}
		var a1 = isArray(obj1);
		var a2 = isArray(obj2);
		// 数组需要递归判断
		if(a1 && a2){
			var lpRec = true;
			for (var i = 0; i < obj1.length; i++) {
				lpRec = compare(obj1[i], obj2[i]);
				if(!lpRec){
					break;
				}
			}
			return lpRec;
		} else {
			// JSON需要递归全部属性才能判断是否相同
			var lpRec = true;
			for (var i in obj1) {
				lpRec = compare(obj1[i], obj2[i]);
				if(!lpRec){
					break;
				}
			}
			return lpRec;
		}
	}
	return obj1 === obj2;
}

function removeArrayItem(array, val){
	// 如果是数字 就按下标删除
	if (typeof val === 'number') {
		array.splice(val, 1);
	} else {
		var res = array;
		var delIdx;
		for(var line in res){
			if(compare(val, res[line])){
				delIdx = line;
				break;
			}
		}
		if(delIdx){
			array.splice(delIdx, 1);
		}
	}
}

function generateId() {
  return Math.floor(Math.random() * 10000);
}

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase  */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode  */
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s) {
	return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}

function b64_md5(s) {
	return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}

function str_md5(s) {
	return binl2str(core_md5(str2binl(s), s.length * chrsz));
}

function hex_hmac_md5(key, data) {
	return binl2hex(core_hmac_md5(key, data));
}

function b64_hmac_md5(key, data) {
	return binl2b64(core_hmac_md5(key, data));
}

function str_hmac_md5(key, data) {
	return binl2str(core_hmac_md5(key, data));
}
/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test() {
	return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
	/* append padding */
	x[len >> 5] |= 0x80 << ((len) % 32);
	x[(((len + 64) >>> 9) << 4) + 14] = len;
	var a = 1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d = 271733878;
	for (var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;
		a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
		d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
		c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
		b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
		a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
		d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
		c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
		b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
		a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
		d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
		c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
		b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
		a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
		d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
		c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
		b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
		a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
		d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
		c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
		b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
		a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
		d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
		c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
		b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
		a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
		d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
		c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
		b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
		a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
		d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
		c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
		b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
		a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
		d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
		c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
		b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
		a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
		d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
		c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
		b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
		a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
		d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
		c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
		b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
		a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
		d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
		c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
		b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
		a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
		d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
		c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
		b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
		a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
		d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
		c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
		b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
		a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
		d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
		c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
		b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
		a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
		d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
		c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
		b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
	}
	return Array(a, b, c, d);
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
	return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}

function md5_ff(a, b, c, d, x, s, t) {
	return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function md5_gg(a, b, c, d, x, s, t) {
	return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function md5_hh(a, b, c, d, x, s, t) {
	return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5_ii(a, b, c, d, x, s, t) {
	return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}
/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
	var bkey = str2binl(key);
	if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
	var ipad = Array(16),
		opad = Array(16);
	for (var i = 0; i < 16; i++) {
		ipad[i] = bkey[i] ^ 0x36363636;
		opad[i] = bkey[i] ^ 0x5C5C5C5C;
	}
	var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
	return core_md5(opad.concat(hash), 512 + 128);
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xFFFF);
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
	return (num << cnt) | (num >>> (32 - cnt));
}
/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
	var bin = Array();
	var mask = (1 << chrsz) - 1;
	for (var i = 0; i < str.length * chrsz; i += chrsz)
		bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
	return bin;
}
/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin) {
	var str = "";
	var mask = (1 << chrsz) - 1;
	for (var i = 0; i < bin.length * 32; i += chrsz)
		str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
	return str;
}
/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
	var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	var str = "";
	for (var i = 0; i < binarray.length * 4; i++) {
		str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
			hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
	}
	return str;
}
/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
	var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var str = "";
	for (var i = 0; i < binarray.length * 4; i += 3) {
		var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
		for (var j = 0; j < 4; j++) {
			if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
			else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
		}
	}
	return str;
}

//设置cookie
function setCookie(name, value) {
    var hours = 12;
    var exp = new Date();
    exp.setTime(exp.getTime() + hours * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() +"; path=/";//"; path=/"是为了保证不会出现多个key
};

//获取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};

//检查cookies
function checkCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start > 0)
            var arr = new Array();
        arr = document.cookie.split(";");
        return arr.length
    }
};


//删除cookies
function delCookie(name) {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
};

 // 日期格式化函数
function dateFormat(date, fmt) {
	if(date){
		if(!fmt){ // 格式化默认值
			fmt = 'yyyy-MM-dd HH:mm:ss';
		}
		var o = {   
	    "M+" : date.getMonth()+1,                 //月份   
	    "d+" : date.getDate(),                    //日   
	    "H+" : date.getHours(),                   //小时   
	    "m+" : date.getMinutes(),                 //分   
	    "s+" : date.getSeconds(),                 //秒   
	    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
	    "S"  : date.getMilliseconds()             //毫秒   
	  };   
	  if(/(y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;  
	}
}

String.prototype.startWith = function(str){
	if(str==null || str=="" || this.length == 0 ||str.length > this.length){	
		return false;
	}
	if(this.substring(0, str.length) === str){
	 	return true;
	} else {
	 	return false;
	}
}

String.prototype.endWith = function(str){
	if(str==null || str=="" || this.length == 0 ||str.length > this.length){	
		return false;
	}
	if(this.substring(this.length - str.length) === str){
	 	return true;
	} else {
	 	return false;
	}
}

jQuery.extend({
	// 同步锁(锁对象，锁表达式)
	syncLock : function(expressOrOptions, callback, options, timeoutHandler) {
		var opt = null;
		if(jQuery.isFunction(expressOrOptions, callback)){
			var loopCount = -1;
			if(timeoutHandler){
				loopCount = jQuery.syncLock.defaults.maxItera
			}
			opt = jQuery.extend(jQuery.syncLock.defaults, {
				'maxItera': loopCount,
				'express': expressOrOptions,
				'callBack': callback,
				'timeoutHandler': timeoutHandler
			}, options);
		} else {
			opt = jQuery.extend({}, jQuery.syncLock.defaults, expressOrOptions);
		}
		
		// 表达式和回调不能为空
		if(opt.express && opt.callBack && jQuery.isFunction(opt.express) && jQuery.isFunction(opt.callBack)){
			var reTryMax = opt.maxItera;
			var retry = 0;
			// 校验表达式 表达式为真加载停止
			if(!opt.express()){
				var intVel = null;
				intVel = setInterval(function(){
					// 超过等待次数停止
					if(reTryMax >= 0 && retry >= reTryMax){
						clearInterval(intVel);
						// 超时回调
						if(opt.timeoutHandler){
							opt.timeoutHandler();
						}
						return;
					}
					// 校验表达式 表达式为真加载停止
					if(opt.express()){
						clearInterval(intVel);
						// 回调
						opt.callBack();
					}
					retry++;
				}, opt.flush);
			} else {
				// 回调
				opt.callBack();
			}
		}
	}
});

// express表达式函数，callBack回调函数，flush刷新频率，maxItera 迭代次数
jQuery.syncLock.defaults = {
	"express" : null, // 表达式函数 返回false继续等待，返回非null,undefined和"" 都会认为等待结束，进行callBack回调
	"callBack" : null,// 回调函数
	"timeoutHandler" : null,// 超时回调函数 超时时间=flush*maxItera
	"flush" : 500, // 同步周期(单位:毫秒)
	"maxItera" : 6 // 最大重试次数 若maxItera<0 则会无限等待，直到express有返回值
};


export default {
	install(Vue, options) {
		if(Vue.$wbfc){
			Vue.$wbfc.Utils = this;
		}
	},
    isObj,
    isArray,
    getLength,
    compare,
    removeArrayItem,
    generateId,
    hex_md5,
    dateFormat,
    getCookie,
    setCookie,
    delCookie,
    jQuery,
    syncLock: jQuery.syncLock
}