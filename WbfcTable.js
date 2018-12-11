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
			// 如果使用catch的话，需要写failedFn
			if(options && !options.noCatch && failedFn){
				WbfcHttps.post(this.url, this.po, options).then((r) =>{
					this.vo.result = r.result;
					if(successFn){
						successFn.call(this, r);
					}
				}).catch((c) =>{
					failedFn.call(this, c);
				});
			} else {
				WbfcHttps.post(this.url, this.po, options).then((r) =>{
					this.vo.result = r.result;
					if(successFn){
						successFn.call(this, r);
					}
				});
			}
		}
	}
}