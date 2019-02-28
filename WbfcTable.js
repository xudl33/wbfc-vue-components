import $ from 'jQuery';
import WbfcBase from './WbfcBase';
import WbfcDef from './WbfcDefaults';
import WbfcUtils from './WbfcUtils';
import WbfcHttps from './WbfcHttps';
export default {
	mixins: [WbfcBase],
	data() {
		return { // 定义接口规范
			url: '',
			po: WbfcDef.DefaultObjectVal(),
			vo: WbfcDef.ResultPojo(),
		}
	},
	props:{
		beforeChange: {
			type: Function,
			default: null,
			required: false
		}
	},
	watch:{
		// 监控vo.result的值变化
		'vo.result': {
			handler(val){
				this.vo.result = val || WbfcDef.DefaultTableVal();
			}
		}
	},
	methods: {
		add(val) {
			if (val) this.vo.result.push(val);
		},
		delete(val) {
			// 按照索引或JSON对象删除
			if (val) WbfcUtils.removeArrayItem(this.vo.result, val);
		},
		clean(){
			this.vo.result = WbfcDef.DefaultTableVal();
		},
		set(val) {
			if (val) this.vo.result = val;
		},
		get() {
			return this.vo.result || WbfcDef.DefaultTableVal();
		},
		flush(options, successFn, failedFn) {
			var _this = this;
			var beforeChangeEvent = _this.beforeChange;
			if(options && options.beforeChange){
				beforeChangeEvent = options.beforeChange;
			}
			// 如果有beforeChange事件 需要先执行
			if(beforeChangeEvent){
				var res = beforeChangeEvent.call(_this, options);
				// 如果返回了false 则不继续进行
				if(res === false){
					if(options && !options.noCatch && failedFn){
						failedFn.call(_this, new Error("beforeChange return false"));
					}
					return;
				}
			}
			// 如果使用catch的话，需要写failedFn
			if(options && !options.noCatch && failedFn){
				WbfcHttps.post(_this.url, _this.po, options).then((r) =>{
					_this.vo.result = r.result;
					if(successFn){
						successFn.call(_this, r);
					}
					// 触发change事件
					_this.$emit('change', _this, options, _this.po, r);
				}).catch((c) =>{
					failedFn.call(_this, c);
				});
			} else {
				WbfcHttps.post(_this.url, _this.po, options).then((r) =>{
					_this.vo.result = r.result;
					if(successFn){
						successFn.call(_this, r);
					}
					// 触发change事件
					_this.$emit('change', _this, options, _this.po, r);
				});
			}
		}
	}
}