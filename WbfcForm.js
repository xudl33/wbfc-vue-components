import $ from 'jQuery';
import WbfcDef from './WbfcDefaults';
import WbfcUtils from './WbfcUtils';
import WbfcHttps from './WbfcHttps';
export default {
	data() {
		return { // 定义接口规范
			url: '',
			po: WbfcDef.DefaultObjectVal(),
			vo: WbfcDef.ResultPojo(),
		}
	},
	watch:{
	},
	methods: {
		validMixLength(rule, value, callback) { // 校验混合字符串长度
			if(!value){
				callback();
				return;
			}
			// 混合字符串长度
			var len = value.match(/[^ -~]/g) == null ? value.length : value.length + value.match(/[^ -~]/g).length;
			var params = rule.param || {};
			var label = params.label || rule.field;
			var minLength = params.min || 0;
			var maxLength = params.max || 0;
			var mess = label + '长度';
			if(minLength > 0 && maxLength > 0){
				mess += ('在' + minLength + '到' + maxLength + '个字符')
			} else if(minLength > 0){
				mess += ('最小为' + minLength +  '个字符');
			} else {
				mess += ('最大为' + maxLength +  '个字符');
			}
			var isError = false;
			if(minLength > 0 && maxLength > 0){
				if(len < minLength || len > maxLength){
					isError = true;
				}
			} else if(minLength > 0){
				if(len < minLength){
					isError = true;
				}
			} else if(maxLength > 0){
				if(len > maxLength){
					isError = true;
				}
			}
			if(isError){
				callback(new Error(mess));
			} else {
				callback();
			}
			//console.log(rule);
		},
		valid(successFn, failedFn) { // 校验表单
			var _this = this;
			this.$refs.dataForm.validate((v) => {
				if (v) {
					if(successFn){
						successFn.call(_this, v);
					}
				} else {
					if(failedFn){
						failedFn.call(_this, v);
					}
					return false;
				}
			});

		},
		reset() { // 重置表单
			this.$refs.dataForm.resetFields();
		},
		clean(){ // 清除表单
			this.$refs.dataForm.clearValidate();
		},
		noValidSubmit(options, successFn, failedFn){
			var _this = this;
			// 如果使用catch的话，需要写failedFn
			if(options && !options.noCatch && failedFn){
				WbfcHttps.post(_this.url, _this.po, options).then((r) =>{
					_this.vo = r;
					if(successFn){
						successFn.call(_this, r);
					}
				}).catch((c) =>{
					failedFn.call(_this, c);
				});
			} else {					
				WbfcHttps.post(_this.url, _this.po, options).then((r) =>{
					_this.vo = r;
					if(successFn){
						successFn.call(_this, r);
					}
				});
			}
		},
		submit(options, successFn, failedFn){ // 提交表单
			var _this = this;
			if(options && options.noValid){
				_this.noValidSubmit(options, successFn, failedFn);
			} else {
				// 提交之前要先做校验
				_this.valid((v) => {
					_this.noValidSubmit(options, successFn, failedFn);
				});
			}
		}
	}
}