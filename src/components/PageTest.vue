<template>
	<div>
		<div>
			<el-table :data="vo.result" border>
				<el-table-column prop="activeFlag" label="activeFlag" align="center"></el-table-column>
				<el-table-column prop="authFlag" label="authFlag" align="center"></el-table-column>
				<el-table-column prop="availableDate" label="availableDate" align="center"></el-table-column>
				<el-table-column prop="clientId" label="clientId" align="center"></el-table-column>
				<el-table-column prop="createDate" label="createDate" align="center"></el-table-column>
				<el-table-column prop="email" label="email" align="center"></el-table-column>
				<el-table-column prop="loginFlag" label="loginFlag" align="center"></el-table-column>
				<el-table-column prop="loginName" label="loginName" align="center"></el-table-column>
				<el-table-column prop="mobile" label="mobile" align="center"></el-table-column>
				<el-table-column prop="newExtend" label="newExtend" align="center"></el-table-column>
				<el-table-column prop="openId" label="openId" align="center"></el-table-column>
				<el-table-column prop="parentId" label="parentId" align="center"></el-table-column>
				<el-table-column prop="remarks" label="remarks" align="center"></el-table-column>
				<el-table-column prop="updateDate" label="updateDate" align="center"></el-table-column>
				<el-table-column prop="userType" label="userType" align="center"></el-table-column>
			</el-table>
		</div>
		<div v-if = "po.pageInfo.count > 0">
			<el-pagination
				@size-change="onPageSizeChange"
				@current-change="onPageChange"
				:current-page.sync="po.pageInfo.pageNo"
				:page-size="po.pageInfo.pageSize"
				layout="prev, pager, next, jumper"
				:total="po.pageInfo.count">
			</el-pagination>
		</div>
	</div>
</template>
<script>
import WbfcTablePage from '../../WbfcTablePage';
import { generateId } from 'element-ui/lib/utils/util';
export default {
	name: 'PageTest',
	mixins: [WbfcTablePage],
	data() {
		return {
			id: generateId() + '_' + 'PageTest', // id
			url: 'security:/i/user/userList', // 接口地址
			po: {
				pageInfo: {
					pageSize: 5, // 分页大小 默认一页20条
				},
				activeFlag: '', // 是否激活 0:否 1:是
				authFlag: '', // 是否通过审核 0:否 1:是
				availableDateEnd: '', // 有效期结束
				availableDateStart: '', // 有效期开始
				email: '', // 邮箱
				loginFlag: '', // 是否允许登陆 0:否 1:是
				loginName: '', // 登录名
				mobile: '', // 手机号
				remarks: '', // 备注
				userType: '' // 用户类型 0:管理员 1:用户帐户 2:用户子账户 3:客服4:采样人员
			},
			vo: {
				code: '', // 返回码，默认000，为正常。其他参见返回码表。
				msg: '', // 返回消息，默认为null。一般会返回错误消息提示。
				result: [{
					activeFlag: '',
					authFlag: '',
					availableDate: '',
					clientId: '',
					createDate: '',
					email: '',
					extend: {},
					id: '',
					loginFlag: '',
					loginName: '',
					mobile: '',
					newExtend: '',
					openId: '',
					parentId: '',
					remarks: '',
					updateDate: '',
					userType: ''
				}].splice(1, 1) // 返回结果，默认为null。
			}
		};
	}
}
</script>