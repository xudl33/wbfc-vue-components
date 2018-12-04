function DefaultTableVal(){
	return [];
}
function DefaultObjectVal(){
	return {};
}
function PagePo(){
	return {
		pageInfo: {
			count: 0, // 数据总数
			pageNo: 0, // 当前页码
			pageSize: 20, // 分页大小 默认一页20条
			orderBy: '' // 排序
		}
	};
}
function ResultPojo(){
	return {
		code: "", // 返回码，默认000，为正常。其他参见返回码表，(部分接口会返回20000也是正常的)
		msg: "", // 返回消息，默认为null。一般会返回错误消息提示，这种消息只用于开发者提示，不可用于页面显示
		result: {}
	};
}
export default {
	DefaultTableVal,
	DefaultObjectVal,
	PagePo,
	ResultPojo
}