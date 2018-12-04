<template>
  <div>
    <el-row>
      <el-col><h2>设置JWT Token</h2></el-col>
    </el-row>
    <el-input v-model="token" placeholder="Bearer xxxxxxx"></el-input>
    <el-button @click="setToken">设置token</el-button>
    <hr/>
    <el-row>
      <el-col><h2>Table列表组件</h2></el-col>
    </el-row>
    <Table-Test ref="tableTest"></Table-Test>
    <el-button @click="flushTable">刷新列表</el-button>
    <el-button @click="cleanTable">清空列表</el-button>
    <hr/>
    <el-row>
      <el-col><h2>PageTable列表组件</h2></el-col>
    </el-row>
    <Page-Test ref="pageTest"></Page-Test>
    <el-button @click="flushPage">刷新Page列表</el-button>
    <el-button @click="cleanPage">清空Page列表</el-button>
    <hr/>
    <el-row>
      <el-col><h2>Form表单组件</h2></el-col>
    </el-row>
    <Form-Test ref="formTest"></Form-Test>
    <el-button @click="resetForm">重置表单</el-button>
    <el-button @click="cleanForm">清空校验</el-button>
    <el-button @click="validForm">校验表单</el-button>
    <el-button @click="submitForm">提交表单</el-button>
    <el-button @click="noValidSubmitForm">提交表单(JS不校验)</el-button>
    <el-button @click="submitFormDiy">提交表单并自定义处理函数</el-button>
  </div>
</template>

<script>
import Vue from 'vue';
import TableTest from './TableTest';
import PageTest from './PageTest';
import FormTest from './FormTest';
export default {
  name: 'index',
  components: {
    TableTest,
    PageTest,
    FormTest
  },
  data () {
    return {
      token:''
    };
  },
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
      Vue.$wbfc.Utils.setCookie('userInfo', tokenStr);
    },
    flushTable() {
      this.$refs.tableTest.flush();
    },
    cleanTable() {
      this.$refs.tableTest.clean();
    },
    flushPage() {
      this.$refs.pageTest.flush();
    },
    cleanPage() {
      this.$refs.pageTest.clean();
    },
    resetForm() {
      this.$refs.formTest.reset();
    },
    cleanForm() {
      this.$refs.formTest.clean();
    },
    validForm() {
      this.$refs.formTest.valid();
    },
    submitForm(){
      this.$refs.formTest.submit();
    },
    noValidSubmitForm(){
      this.$refs.formTest.noValidSubmit();
    },
    submitFormDiy(){
      // 默认的情况下异常会被统一处理，若想自定义处理异常，必须传递noCatch = false参数
      this.$refs.formTest.submit({noCatch: false}, (r) => {
        console.log(r);
        alert('Submit success!');
      }, (e) => {
        console.log(e);
        alert('Submit exception!');
      });
    },
  },
  created(){
    var cookieStr = Vue.$wbfc.Utils.getCookie('userInfo');
    if(cookieStr){
      this.token = JSON.parse(cookieStr).accessToken;
    }
    // 自定义错误映射
    Vue.$wbfc.Errors.addMapping({'999':'自定义错误'});
    // 自定义转发路径
    Vue.$wbfc.ActionPath.addMatch({
      'security': {
        urlReg: '/swaggerTest',
        path: 'http://192.168.20.188:1105/security'
      }
    });

    //console.log("Vue = %o", Vue.$wbfc);
  }
}
</script>