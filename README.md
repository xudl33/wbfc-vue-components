# wbfc-vue-components

> 智源云组件库

`wbfc-vue-components`是一个基于`Wbfc`云服务架构的Vue框架，它提供了一些常用的工具函数以及基础表格和表单的共通封装。并且它还提供了网络请求的统一封装，可以对`wbfc`架构中使用的权限、返回值、错误码进行解析和自定义的操作。另外它还为网络请求提供了一个既可以统一访问，又可以自定义访问服务器的功能，更便于开发者对接口的调试和应对更为复杂的网络请求。
## 安装
```javascript
npm install wbfc-vue-components
```
## 使用Demo
```javascript
import WbfcVueComponents from 'wbfc-vue-components';
Vue.use(WbfcVueComponents);
// ...
// 添加一个错误码映射 999:系统异常
Vue.$wbfc.Errors.addMapping('999', '系统异常');
// 为system接口添加一个自定义映射
Vue.$wbfc.ActionPath.addMatch({
  'system': {
    urlReg: '/area/linkageList',
    path: 'http://192.168.20.5:1106/system'
  }
});
```

## 组件功能
### WbfcDefaults
定义了一些基于`wbfc`标准的常量，但由于Vue的特性(常量值引用)，这些常量最后被定义为`funtion`，因此必须要被调用才能成为一个变量。

#### Demo
```javascript
import WbfcDef from 'wbfc-vue-components/WbfcDefaults';
export default {
	data() {
		return { // 定义接口规范
			po: WbfcDef.DefaultObjectVal(), // PO常量
			vo: WbfcDef.ResultPojo(), // VO常量
		}
	},
   // ...
}
```

常量函数名 | 默认值 | 说明    
---------- |--------|------
DefaultTableVal|[]|Table值常量
DefaultObjectVal|{}|Object值常量
PagePo|{pageInfo:{见下文PageInfo}}|PagePo常量
ResultPojo|见下文ResultPojo|ResultPojo常量

#### PageInfo

名称|默认值|说明
----|----|----
count|0|数据总数
pageNo|0|当前页码
pageSize|20|分页大小(每页条数)
orderBy|''|排序规则

#### ResultPojo
名称|默认值|说明
----|----|----
code|''|返回码
msg|''|返回消息
result|{}|返回值

### WbfcErrors
定义了一些基于`wbfc`标准的错误码。可用于`WbfcHttps`返回值的解析或自定义操作。

#### Demo
添加一个错误码

```javascript
import Vue from 'vue';
Vue.$wbfc.Errors.addMapping('921', '找不到对应项');
```

添加多个错误码

```javascript
Vue.$wbfc.Errors.addMapping({
	'921':'找不到对应项',
	'922':'链接已失效',
	'999':'自定义错误'
});
```

#### 默认错误码

错误码|说明
----|----
001|参数类型不正确
002|参数有效性不正确
003|必填项为空或信息不全
004|数据错误，操作对象不存在
005|参数校验未通过
009|数据已被修改，请刷新后重试
901|没有系统权限
904|验证码错误或已过期
999|操作失败，请刷新后重试


#### API

函数名|参数|返回值|说明
----------|----------|---------|---------
install|Vue:Vue对象,Options(见下文Options)|-|初始化配置
isSuccess|code:String|boolean|请求是否成功
mapping|resultPoJo(见上文WbfcErrors.ResultPojo)|string|解析ResultPojo
addMapping|code:String或JSON Object,msg:String|-|添加或覆盖错误码

#### Options：

名称|默认值|说明
----|----|----
showLog|false|是否打印debug日志

### WbfcActionPath
用于接口转发管理，它会按照统一或自定义的转发规则，在进行网络请求时进行URL的转换。默认情况下通过`WbfcHttps`组件发起的网络请求，都会使用`WbfcActionPath`。

#### Demo
增加一个服务器对于的转发规则
```javascript
import Vue from 'vue';
// 为system服务添加整体转发规则
Vue.$wbfc.ActionPath.addMatch('system', {
	urlReg: /\w*/i,// 匹配一个单字字符(字母、数字或者下划线) /i大小写不敏感
	path: 'http://192.168.20.5:1106/system' // 转发到system服务
});
```

为某个服务添加一个自定义的转发规则

```javascript
import Vue from 'vue';
Vue.$wbfc.ActionPath.addMatch('system', {
	urlReg: '/area/linkageList',
	path: 'http://192.168.20.188:8090'
});
```

> 如果在上面的转发规则都生效的前提下，这个新增的规则会被添加到转发堆栈的最后。也就是说所有以`system:`开头的请求，都会转发到`http://192.168.20.5:1106/system`,但只有`/area/linkageList`这个请求会被转发到`http://192.168.20.188:8090`

一次添加多个服务器对应的转发规则
```javascript
import Vue from 'vue';
Vue.$wbfc.ActionPath.addMatch({
	security: {
		regex: /^security/i,
		matchs: [{ // 可以是一个固定的字符串 例:127.0.0.1:8089，也可以是一个数组[{urlReg:'', path:''}]
			urlReg: /\w*/i, // 可以是正则 也可以是字符串
			path: 'http://192.168.20.5:1106/security'
		}] // matchs会按照数组的顺序进行匹配替换，如果一个url符合urlReg的规则就会被替换成相应的path，但若下一个match也符合就会被重新替换
	},
	system: {
		regex: /^system/i,
		matchs: [{
			urlReg: /\w*/i,
			path: 'http://192.168.20.5:1106/system'
		}]
	},
	files: {
		regex: /^files/i,
		matchs: [{
			urlReg: /\w*/i,
			path: 'http://192.168.20.5:1106/files'
		}]
	},
	ofim: {
		regex: /^ofim/i,
		matchs: [{
			urlReg: /\w*/i,
			path: 'http://192.168.20.5:1106/ofim'
		}]
	}
});

```

#### API
函数名|参数|返回值|说明
----------|----------|---------|---------
install|Vue:Vue对象,Options(见下文Options)|-|初始化配置
get|url:String|String|转换URL 动态url必须以'xxx:'开头
addMapping|type:String, mapingObj:见下文PathMaping|-|添加一个服务器转发规则
deleleMapping|type:String|-|删除服务器转发规则
setMatchs|type:String, matchs:array[见下文matchs]|-|添加或修改某个服务器转发规则
addMatch|type:String, match:见下文matchs|-| 为某个服务器转发规则添加规则(该服务器对应matchs必须是数组不能是字符串)
deleteMatch|type:String, matchValOrIndex: matchs:array[见下文matchs]或数组下标|-|删除某个服务器转发规则的Matchs 若matchs为数组则matchValOrIndex必填，若为字符串则matchValOrIndex可不填写

#### Options：

名称|默认值|说明
----|----|----
dynamicPath|true|动态URL true时会更加pathMaping动态生成url 一般用于多服务的情况
staticPath|http://127.0.0.1|静态URL配置如果dynamicPaths=false则全部的path都会在前拼接 一般这样的用于单服务的情况
pathMaping|{xxx:见下文pathMaping}|映射关系 xxx:服务名
showLog|false|是否打印debug日志

#### PathMaping
名称|默认值|说明
----|----|----
regex|''|服务器匹配 必须是一个正则表达式
matchs|null|可以是一个固定的字符串 例:127.0.0.1:8089，也可以是一个数组[{urlReg:'', path:''}] 说明见下文Matchs

#### Matchs
名称|默认值|说明
----|----|----
urlReg|null|匹配规则 可以是一个正则表达式，也可以是一个字符串
path|null|转发路径
_** matchs会按照数组的顺序进行匹配替换，如果一个url符合urlReg的规则就会被替换成相应的path，但若下一个match也符合就会被重新替换 **_

### WbfcHttps
基于`wbfc`的规则，对网络请求统一封装了权限和返回值解析。

#### Demo
发送POST请求
```javascrpit
import WbfcHttps from 'wbfc-vue-components/WbfcHttps';
WbfcHttps.post('security:/i/user/get', {id:'1'}).then((r) =>{
	this.vo.result = r.result;
});
```
发送POST请求并自定义异常处理
```javascrpit
import WbfcHttps from 'wbfc-vue-components/WbfcHttps';
WbfcHttps.post('security:/i/user/list', {noCatch: false}).then((r) =>{
	this.vo.result = r.result;
}).catch((c) =>{
	console.log(c);
});
```

发送GET请求
```javascrpit
import WbfcHttps from 'wbfc-vue-components/WbfcHttps';
WbfcHttps.get('security:/i/user/get', {id:'1'}).then((r) =>{
	this.vo.result = r.result;
});
```

#### API
函数名|参数|返回值|说明
----------|----------|---------|---------
install|Vue:Vue对象,Options(见下文Options)|-|初始化配置
get|url:String, data:JSON, options:(见下文Options) |-|发送一个Get请求
post|url:String, data:JSON, options:(见下文Options)|-|发送一个Post请求

#### Options：
`WbfcHttps`是`axios`的一个子类。除了一下这些特殊的配置项以外，可以参考 [Axios:Request Config](https://github.com/axios/axios#request-config)

名称|默认值|说明
----|----|----
headers|{"content-type": "application/json"}|请求header
withCredentials|true|允许携带证书(cookie信息)
withJwt|false|允许使用cookie中的JWT Token
timeout|10000|超时时间(毫秒)
useActionPath|true|使用动态Url插件（url必须以'xxx:'开头）
ignoreRepeat|true|忽略重复的请求
withRoute|false|使用路由器进行跳转
router|null|路由器 若withRoute=true，则需要在install时设置router或在请求的参数中传递router
showErrorMessage|true|遇到错误时弹出提示 依赖于element-ui的Message
concurrentMessage|false|并发多个请求时，是否允许多个Message显示框
noCatch|true|请求返回的Promise可以不使用catch函数(因为拦截器有通用的错误处理方式，如果需要自处理异常信息，则可以在入参option中设置该值为false)
showLog|false|是否打印debug日志

### WbfcDicts
封装了数据字典的相关函数，用来操作数据字典相关功能。

#### Demo
添加一个数据字典
```javascrpit
import Vue from 'vue';
Vue.$wbfc.Dicts.addTypes('active_flag', [{
	label: '激活',
	value: '1'
  },{
	label: '未激活',
	value: '0'
  }]
);
```

添加多个数据字典
```javascrpit
import Vue from 'vue';
Vue.$wbfc.Dicts.addTypes({
  'active_flag':[{
	label: '激活',
	value: '1'
  },{
	label: '未激活',
	value: '0'
  }]
},{
  'yes_no':[{
	label: '是',
	value: '1'
  },{
	label: '否',
	value: '0'
  }]
});
```

#### API
函数名|参数|返回值|说明
----------|----------|---------|---------
install|Vue:Vue对象,options(见下文Options)|-|初始化配置
addTypes|label:String或({{xxx:[见下文Types)}]}, types:[{xxx:见下文Types)}]|-|添加数据字典，types必须是数组格式。
getTypes|typ:String, options(见下文Options)|Array|获取某个数据字典列表
getLabel|typ:String, val:String, options(见下文Options)|String|通过字典key和值查询标签
getVal|typ:String, label:String, options(见下文Options)|String|通过字典key和标签查询值

#### Options：
名称|默认值|说明
----|----|----
datas|{}|数据字典JSON数据
mapping|{见下文mapping}|数据字典键值映射
default|-|获取某字典值或标签的默认值
converter|-|获取某字典值或标签后会调用该转换器，参数为(typ, val, res, opt)
showLog|false|是否显示debug日志

#### Mapping:
名称|默认值|说明
----|----|----
lab|label|标签
val|value|值

#### Types：
名称|默认值|说明
----|----|----


### WbfcBase
是WbfcTable和WbfcForm的基类，封装了form和table的共通函数，目前只定义了两个`filters`过滤器。

#### Demo
继承了WbfcBae、WbfcTable和WbfcForm的，都可以直接调用filters函数
```javascript
<template>
	<div>
		<div>
			<el-table :data="vo.result" border>
				<el-table-column prop="activeFlag" label="activeFlag" align="center">
					<template slot-scope="{scope}">
						{{'active_flag' | val2Lab(scope.row.activeFlag)}}
					</template>
				</el-table-column>
				<el-table-column prop="authFlag" label="authFlag" align="center"></el-table-column>
			</el-table>
		</div>
	</div>
</template>
import WbfcTable from 'wbfc-vue-components/WbfcTable';
...
```

#### Filters：
函数名|参数|返回值|说明
----------|----------|---------|---------
val2Lab|typ:String, val:String, options:(见上文WbfcDicts.Options)|String| 数据字典值转标签
lab2Val|typ:String, lab:String, options:(见上文WbfcDicts.Options)|String| 数据字典标签转值

### WbfcTable
封装了有关于Table相关组件的共通函数，并自动关联和绑定po与vo。
#### Demo
```javascript
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
	</div>
</template>
<script>
import WbfcTable from 'wbfc-vue-components/WbfcTable';
import { generateId } from 'element-ui/lib/utils/util';
export default {
	name: 'TableTest',
	mixins: [WbfcTable],
	data() {
		return {
			id: generateId() + '_' + 'TableTest', // id
			url: 'security:/i/user/userAllList', // 接口地址
			po: {
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
```
#### API
函数名|参数|返回值|说明
----------|----------|---------|---------
add|val:vo[x]|-|为Table添加一行数据
delete|val:vo[x]或数组下标|-|删除Table的一行数据 按照索引或JSON对象删除
clean|-|-|清空Table数据
set|val:vo[x]|-|修改Table的一行数据
get|-|this.vo.result|获取绑定Table的vo.result
flush|options:(见上文WbfcHttps.options), successFn:function, failedFn:function|-| 刷新Table数据

> 以上函数除flush外，均无网络请求


### WbfcTablePage
封装了有关于Table和Pagination相关组件的共通函数，并自动关联和绑定po与vo。
#### Demo
```javascript
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
import WbfcTablePage from 'wbfc-vue-components/WbfcTablePage';
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
```
#### API
函数名|参数|返回值|说明
----------|----------|---------|---------
add|val:vo[x]|-|为Table添加一行数据
delete|val:vo[x]或数组下标|-|删除Table的一行数据 按照索引或JSON对象删除
clean|-|-|清空Table数据
set|val:vo[x]|-|修改Table的一行数据
get|-|this.vo.result|获取绑定Table的vo.result
flush|options:(见上文WbfcHttps.options), successFn:function, failedFn:function|-| 刷新Table数据

> 以上函数除flush外，均无网络请求

#### 事件
事件名|说明
----------|----------
onPageChange|当翻页页码改变 刷新Table数据
onPageSizeChange|但翻页每页条数改变 刷新Table数据

### WbfcForm
封装了有关于Form相关组件的共通函数和数据校验，并自动关联和绑定po与vo。

#### Demo
```javascript
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
import WbfcForm from 'wbfc-vue-components/WbfcForm';
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
```
#### API
函数名|参数|返回值|说明
----------|----------|---------|---------
validMixLength|rule:ElementFormRule对象, value:Object, callback:function|-|校验混合长度
valid|successFn:function, failedFn:function|-|校验表单
reset|-|-|重置表单(表单输入的数据和校验消息都会重置)
clean|-|-|清除表单(只会清除校验消息)
noValidSubmit|options:(见上文WbfcHttps.options), successFn:function, failedFn:function|-|提交表单(不进行校验)
submit|options:(见上文WbfcHttps.options), successFn:function, failedFn:function|-|提交表单

> 以上函数除noValidSubmit和submit外，均无网络请求

### WbfcUtils
封装了一些比较常用的工具函数
#### Demo
```javascript
export default {
  methods: {
    setToken() {
      if(this.token){
        this.token = this.token.replace('Bearer ', '').replace('bearer ', '');
      } else {
        return;
      }
      // 设置cookie
      var token = {
        tokenType: 'bearer',
        accessToken: this.token
      };
      var tokenStr = JSON.stringify(token);
      // 使用共通工具设置cookie
      Vue.$wbfc.Utils.setCookie('userInfo', tokenStr);
    }
 }
}
```
#### API
函数名|参数|返回值|说明
----------|----------|---------|---------
isObj|obj:object|boolean|是否为对象
isArray|obj:object|boolean|是否为数组
getLength|obj:object|int|获取数组或JSON的长度(JSON时为第一层的长度)
compare|obj1:object, obj2:object|boolean|比较两个对象是否相等(String\Number\Array\JSONObject)
removeArrayItem|array:Array val:array[x]或下标|-|删除数组中的一个元素
generateId|-|number|生成一个数字型的随机id
hex_md5|s:string|string|将字符串进行md5加密
getCookie|name:string|string|获取cookies
setCookie|name:string|-|设置cookies
delCookie|name:string|-|删除cookies


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Versions
版本|更新时间|更新说明
---|---|---
1.0.0 | 2018/12/04 | 完成`wbfc-components`的基础功能
1.0.1 | 2018/12/06 | 更名为`wbfc-vue-components`
1.0.2 | 2018/12/11 | 增加`WbfcDicts`(数据字典)的相关功能