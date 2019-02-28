import $ from 'jQuery';
import WbfcDef from './WbfcDefaults';
import WbfcUtils from './WbfcUtils';
import WbfcHttps from './WbfcHttps';
import WbfcTable from './WbfcTable';

export default {
	mixins: [WbfcTable],
	data() {
		return { // 定义接口规范
			url: '',
			po: WbfcDef.PagePo(), // 分页PO
			vo: WbfcDef.ResultPojo(), // 返回结果
		}
	},
	watch:{
		// 监控vo.result的值变化
		'vo.result': {
			handler(val){
				this.vo.result = val || WbfcDef.DefaultTableVal();
			}
		},
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
			// 清除result
			this.vo.result = WbfcDef.DefaultTableVal();
			// 清除数据总数
			this.po.pageInfo.count = WbfcDef.PagePo().pageInfo.count;
			// 清除每页多少条
			this.po.pageInfo.pageSize = WbfcDef.PagePo().pageInfo.pageSize;
		},
		set(val) {
			if (val) this.vo.result = val;
		},
		get() {
			return this.vo.result || WbfcDef.DefaultTableVal();
		},
		onPageChange(val, options) {
			this.flush(options);
		},
		onPageSizeChange(val, options){
			this.flush(options);
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
					// 刷新list
					_this.vo.result = r.result.list;
					// 刷新翻页总数
					_this.po.pageInfo.count = Number(r.result.count);
					// 刷新每页多少条
					_this.po.pageInfo.pageSize = Number(r.result.pageSize);
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
					// 刷新list
					_this.vo.result = r.result.list;
					// 刷新翻页总数
					_this.po.pageInfo.count = Number(r.result.count);
					// 刷新每页多少条
					_this.po.pageInfo.pageSize = Number(r.result.pageSize);
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