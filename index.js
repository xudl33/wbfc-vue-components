import WbfcUtils from './WbfcUtils.js';
import WbfcActionPath from './WbfcActionPath.js';
import WbfcDefaults from './WbfcDefaults.js';
import WbfcErrors from './WbfcErrors.js';
import WbfcBase from './WbfcBase.js';
import WbfcForm from './WbfcForm.js';
import WbfcHttps from './WbfcHttps.js';
import WbfcTable from './WbfcTable.js';
import WbfcTablePage from './WbfcTablePage.js';
import WbfcDicts from './WbfcDicts.js';

export default {
	version: '1.0.0',
	name: 'WbfcVueComponents',
	install(Vue, options) {
		options = options || {};
		Vue.$wbfc = {};
		Vue.use(WbfcUtils, options.WbfcUtils);
		Vue.use(WbfcActionPath, options.WbfcActionPath);
		Vue.use(WbfcErrors, options.WbfcErrors);
		Vue.use(WbfcHttps, options.WbfcHttps);
		Vue.use(WbfcDicts, options.WbfcDicts);
	}
}