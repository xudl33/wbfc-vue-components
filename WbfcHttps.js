import axios from 'Axios'               // 引入axios
import { Message } from 'element-ui';                    // 引入ele-ui的消息提示部分
import $ from 'jQuery';
import WbfcUtils from './WbfcUtils';
import WbfcErrors from './WbfcErrors'
import WbfcActionPath from './WbfcActionPath'

var instanceAxios = axios.create();

let baseUrl = ''; //设置你的baseUrl
let promiseArr = {}; // 重复请求栈
let errorMessage; // 错误消息提示窗
const CancelToken = axios.CancelToken;

var defaultsOptions = {
    routes: {
      'root': 'index', // 首页路由
      'login' : 'login', // 登录页路由
      '404': 'notFound' // 404路由
    },
    config: {
      headers: {
        "content-type": "application/json",           // 设置传输类型(json,form表单)
      },
      withCredentials: true, // 允许携带证书(cookie信息)
      withJwt: false, // 允许使用cookie中的JWT Token
      timeout: 10000, // 超时时间
      useActionPath: true, // 使用动态Url插件 url必须以'xxx:'开头
      ignoreRepeat: true, // 忽略重复的请求 key = md5(url + data)
      withRoute: false, // 使用路由器进行跳转
      router: null, // 路由器
      showErrorMessage: true, // 遇到错误时弹出提示
      concurrentMessage: false, // 并发多个请求时，是否允许多个Message显示框
      noCatch: true, // 请求返回的Promise可以不使用catch函数(因为拦截器有通用的错误处理方式，如果需要自处理异常信息，则可以在入参option中设置该值为false)
      showLog: false // 打印debug日志
    }
  };

//封装请求方法
function formatReq(type, url, data, options) {
  var tep = data || {};
  var cancelSource = CancelToken.source();
  var opts = $.extend({}, defaultsOptions.config, {method: type, url: url, data: JSON.stringify(tep), cancelSource: cancelSource, cancelToken: cancelSource.token}, options);
  // 如果需要过滤重复请求就进行拦截
  if(opts.ignoreRepeat){
    // 请求制作唯一标识key = md5(url + data)
    var repeatToken = WbfcUtils.hex_md5(opts.url + opts.data);
    opts.repeatToken = repeatToken;
  }
  var res = new Promise((reslove, reject) => {
    if(opts.showLog){
      console.log('Prepare to action with url = %s , options = %o', opts.url, opts);
    }
    instanceAxios(opts)
      .then(r => {
        reslove(r);
      })
      .catch(e => {
        if(opts.ignoreRepeat){
          delete promiseArr[opts.repeatToken];
        }
        // 如果是取消的直接return
        if (axios.isCancel(e)) {
          return;
        }
        // 不使用catch的直接return
        if(e.config && e.config.noCatch){
          if(e.config.showLog){
            console.log('%s Skip catch function with %o config: %o', e.config.url, e, e.config);
          }
          return;
        }
        reject(e);
      });
  });
  return res;
}

export default {
  name: 'Wbfc-Https',
  defaults: defaultsOptions,
  install(vue, options) {
    defaultsOptions.config = $.extend(defaultsOptions.config, options);
    //console.log("WbfcHttps's WbfcErrors", vue.WbfcErrors);
    //设置全局默认请求头
    /*instanceAxios.defaults.headers = defaultsOptions.headers; // header
    instanceAxios.defaults.withCredentials = defaultsOptions.withCredentials;// 允许携带证书
    instanceAxios.defaults.timeout = defaultsOptions.timeout;// 设置超时时间*/

    // 请求拦截器,过滤重复的请求
    instanceAxios.interceptors.request.use(config => {
      // 如果需要过滤重复请求就进行拦截
      if(config.ignoreRepeat){
        // 如果已经请求过了就取消当前
        if (promiseArr[config.repeatToken]) {
          if(config.showLog){
            console.log('RepeatToken = %s is repeat! Request object = %o', config.repeatToken, config);
          }
          config.cancelSource.cancel('重复请求，已被取消');
          return config;
        } else {
          promiseArr[config.repeatToken] = config;
          if(config.showLog){
            console.log('Create repeatToken(%s) with url = %s , options = %o', config.repeatToken, config.url, config);
          }
        }
      }
      // 如果是动态path，需要进行转换
      if(config.useActionPath){
        var tempPath = config.url;
        config.url = WbfcActionPath.get(tempPath);
        if(config.showLog){
          console.log('Change dynamic url = %s to %s',  tempPath, config.url);
        }
      }
      
      // 允许添加JWT Token 或以/i和/w开头的url都必须带有权限
      if(config.withJwt || config.url.indexOf('/i/') >= 0 ||  config.url.indexOf('/w/') >= 0){
        //添加公用 Authorization
        var cookie = WbfcUtils.getCookie('userInfo');
        if(cookie) {
          var userInfo = JSON.parse(cookie);
          config.headers.Authorization = userInfo.tokenType + ' ' + userInfo.accessToken;
          if(config.showLog){
            console.log('Action with url = %s with header {Authorization: %s}', config.url, config.headers.Authorization);
          }
        };
      }
      return config;
    }, error => {
      //如果请求超时重复请求一次
      var originalRequest = error.config;
      if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!= -1 && !originalRequest._retry){
          originalRequest._retry = true;
          if(error.config.showLog){
            console.log('%s will be retry with %o', error.config.url, error.config);
          }
          return instanceAxios.request(originalRequest);
      }
      if (error.response) { //如果有错误信息 跳转路由到
        if(error.config.showLog){
          console.log('%s is error %o', error.config.url, error.config);
        }
        //router.app.$router.push(defaultsOptions.routes['404']); //需router配置  ，vue新建404组件
      }
      return Promise.reject(error)
    })

    // 响应拦截器即异常处理
    instanceAxios.interceptors.response.use(response => {
        if(response.config.showLog){
          console.log('Action url = %s with response = %o', response.config.url, response);
        }
        if(response && response.config.ignoreRepeat){
          delete promiseArr[response.config.repeatToken];
        }
        let data;
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if(response.data == undefined){
          data = response.request.responseText;
        } else {
          data = response.data;
        }
        // 根据返回的code值来做不同的处理（和后端约定）
        if(WbfcErrors.isSuccess(response.data.code)){
          if(response.config.showLog){
            console.log('Action url = %s with a ResultPoJo = %o', response.config.url, response.data);
          }
          return data;
        }else{
          // 若不是正确的返回code就
          // 是否显示弹出的Message
          if(response.config.showErrorMessage){
            var showMessage = WbfcErrors.mapping(data);
            if(showMessage){
              // 不允许并发message框的话
              if(errorMessage && response.config.concurrentMessage) {
                errorMessage.close(); // 就关闭上一个 避免连续的请求会弹出多个错误提示
              }
              errorMessage = Message.error(showMessage); // 错误提示
            }
          }
          var err = {};
          err.response = response;
          err.config = response.config;
          return Promise.reject(err);
        }
    }, err => {
      // console.log(err);
      if (axios.isCancel(err)) {
        //console.log('Request canceled', err.message);
        return Promise.reject(err);
      }
      // 请求的错误判断,根据不同的错误码不同消息提醒
      if (err && err.response) {
        switch (err.response.status) {
          case 400:
            err.message = '错误请求';
            break;
          case 401:
            //console.log(router);
            var errData = err.response.data;
            //if权限过期 跳转到登录页面
            var isErrInfo = errData.error_description.indexOf('Access token expired'); //权限是否过期
            var isErrInfo1 = errData.error_description.indexOf('An Authentication object was not found in the SecurityContext'); //没有token串
            if(err.config.showLog && isErrInfo >= 0){
              console.log('JWT Token:%s 已过期 with %o', err.config.headers.Authorization, err.config);
            }
            if(err.config.showLog && isErrInfo1 >= 0){
              console.log('%s 缺少权限头 Authorization: JWT Token with %o', err.config.url, err.config);
            }
            if (isErrInfo >= 0 || isErrInfo1 >= 0) {
              WbfcUtils.setCookie('userInfo', '');
              //console.log(router.app.$router.push);
              // 如果需要使用路由器 且 路由器设置必须存在时
              if(err.config.withRoute && err.config.router){
                if(err.config.showLog){
                  console.log('Route %s redirect to RouteCompontent: %s', router.app.$router.name, defaultsOptions.routes['login']);
                }
                err.config.router.app.$router.push(defaultsOptions.routes['login']);
              }
              err.message = null;
            } else {
              err.message = '您的操作权限不足';
            }
            break;
          case 403:
            if(err.config.withRoute && err.config.router){
                if(err.config.showLog){
                  console.log('Route redirect to RouteCompontent: %s', defaultsOptions.routes['login']);
                }
              err.config.router.app.$router.push(defaultsOptions.routes['login']);
            }
            err.message = '拒绝访问，请重新登录';
            break;
          case 404:
            if(err.config.withRoute && err.config.router){
                if(err.config.showLog){
                  console.log('Route redirect to RouteCompontent: %s', defaultsOptions.routes['404']);
                }
              err.config.router.app.$router.push(defaultsOptions.routes['404']);
            }
            err.message = '请求错误,未找到该资源';
            break;
          case 405:
            err.message = '请求方法未允许';
            break;
          case 408:
            err.message = '请求超时';
            break;
          case 500:
            err.message = '无法连接服务器';
            break;
          case 501:
            err.message = '网络未实现';
            break;
          case 502:
            err.message = '网络错误';
            break;
          case 503:
            err.message = '服务不可用';
            break;
          case 504:
            err.message = '网络超时';
            break;
          case 505:
            err.message = 'http版本不支持该请求';
            break;
          default:
            err.message = `连接错误${err.response.status}`;
        }
      } else {
        // 其实上面的403也会走到这里，失败的请求不会有response，上面的判断无效
        err.message = "连接到服务器失败";
      }
      // 是否显示弹出的Message
      if(err.config.showErrorMessage){
        if(err.message){
          // 不允许并发message框的话
          if(errorMessage && err.config.concurrentMessage) {
            errorMessage.close(); // 就关闭上一个 避免连续的请求会弹出多个错误提示
          }
          errorMessage = Message.error(err.message); // 错误提示
        }
      }
      // catch回调
      return Promise.reject(err);
    });
  },
  get(url, data, options) {
    return formatReq('get', url, data, options);
  },
  post(url, data, options){
    return formatReq('post', url, data, options);
  }
};