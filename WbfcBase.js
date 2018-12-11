import WbfcDicts from './WbfcDicts'
export default {
	filters: {
		lal2Val: function(typ, lab, options){ // 数据字典标签转值
			return WbfcDicts.getVal(typ, lab, options);
		},
		val2Lab: function(typ, val, options){ // 数据字典值转标签
			return WbfcDicts.getLabel(typ, val, options);
		}
	}
}