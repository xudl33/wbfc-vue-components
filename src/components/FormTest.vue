<template>
	<div>
		<div>
			<el-form :model="po" :rules="rules" ref="dataForm" label-width="100px">
				<el-form-item label="长度域" prop="lgt">
					<el-input v-model="po.lgt"></el-input>
				</el-form-item>
				<el-form-item label="有效性" prop="lva">
					<el-input v-model="po.lva"></el-input>
				</el-form-item>
				<el-form-item label="混合长度最大" prop="mixMax">
					<el-input v-model="po.mixMax"></el-input>
				</el-form-item>
				<el-form-item label="混合长度最小" prop="mixMin">
					<el-input v-model="po.mixMin"></el-input>
				</el-form-item>
				<el-form-item label="混合长度域包含" prop="mixRangeCnt">
					<el-input v-model="po.mixRangeCnt"></el-input>
				</el-form-item>
				<el-form-item label="混合长度域左包含右不包含" prop="mixRangeLCnt">
					<el-input v-model="po.mixRangeLCnt"></el-input>
				</el-form-item>
				<el-form-item label="混合长度域右包含左不包含" prop="mixRangeRCnt">
					<el-input v-model="po.mixRangeRCnt"></el-input>
				</el-form-item>
				<el-form-item label="混合长度域不包含" prop="mixRangeRej">
					<el-input v-model="po.mixRangeRej"></el-input>
				</el-form-item>
				<el-form-item label="正则表达式" prop="reg">
					<el-input v-model="po.reg"></el-input>
				</el-form-item>
				<el-form-item label="必填" prop="req">
					<el-input v-model="po.req"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import WbfcForm from '../../WbfcForm';
import { generateId } from 'element-ui/lib/utils/util';
export default {
	name: 'FormTest',
	mixins: [WbfcForm],
	data() {
		return {
			id: generateId() + '_' + 'FormTest', // id
			url: 'security:/swaggerTest', // 接口地址
			po: {
				lgt: '', // 长度域
				lva: '', // 有效性
				mixMax: '', // 混合长度最大
				mixMin: '', // 混合长度最小
				mixRangeCnt: '', // 混合长度域包含
				mixRangeLCnt: '', // 混合长度域左包含右不包含
				mixRangeRCnt: '', // 混合长度域右包含左不包含
				mixRangeRej: '', // 混合长度域不包含
				reg: '', // 正则表达式
				req: '' // 必填
			},
			rules: {
				lgt: [
					{ min:1, max:4, message:'长度域长度在1到4个字符', trigger: 'blur'}
				],
				lva: [
					{ pattern:/^[1|2|3]$/g, message:'有效性的值不合法', trigger: 'blur'}
				],
				mixMax: [
					{ validator: this.validMixLength, param: {  label:'混合长度最大',  max: 4 }, trigger: 'blur'}
				],
				mixMin: [
					{ validator: this.validMixLength, param: {  label:'混合长度最小', min: 1 }, trigger: 'blur'}
				],
				mixRangeCnt: [
					{ validator: this.validMixLength, param: {  label:'混合长度域包含', min: 1, max: 4 }, trigger: 'blur'}
				],
				mixRangeLCnt: [
					{ validator: this.validMixLength, param: {  label:'混合长度域左包含右不包含', min: 1, max: 3 }, trigger: 'blur'}
				],
				mixRangeRCnt: [
					{ validator: this.validMixLength, param: {  label:'混合长度域右包含左不包含', min: 2, max: 4 }, trigger: 'blur'}
				],
				mixRangeRej: [
					{ validator: this.validMixLength, param: {  label:'混合长度域不包含', min: 2, max: 3 }, trigger: 'blur'}
				],
				reg: [
					{ pattern:/^(-?\d+)(.\d+)?$/, message:'正则表达式的值不合法', trigger: 'blur'}
				],
				req: [
					{ required:true, message: '必填必填', trigger: 'blur'}
				]
			},
			vo: {
				code: '', // 返回码，默认000，为正常。其他参见返回码表。
				msg: '', // 返回消息，默认为null。一般会返回错误消息提示。
				result: {} // 返回结果，默认为null。
			}
		};
	}
}
</script>