"use weex:vue";
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***********************************************************************************!*\
  !*** D:/Work/Code/MobilePos/IpadPos/main.js?{"page":"pages%2Fpopup%2FShowPopup"} ***!
  \***********************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: D:\\\\Work\\\\Code\\\\MobilePos\\\\IpadPos\\\\main.js: Unexpected token (8:19)\\n\\n   6 | import Vue from 'vue' \\n   7 | import store from './store' \\n>  8 |  import Gshow_modal.js from '@/static/js/ShowModal/Gshow_modal.js'\\n     |                    ^\\n   9 |  Vue.use(Gshow_modal.js)\\n  10 | //把vuex定义成全局组件\\n  11 | Vue.config.productionTip = false\\n    at Object._raise (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:746:17)\\n    at Object.raiseWithData (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:739:17)\\n    at Object.raise (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:733:17)\\n    at Object.unexpected (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:8807:16)\\n    at Object.expectContextual (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:8773:41)\\n    at Object.parseImport (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12527:12)\\n    at Object.parseStatementContent (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:11254:27)\\n    at Object.parseStatement (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:11156:17)\\n    at Object.parseBlockOrModuleBlockBody (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:11731:25)\\n    at Object.parseBlockBody (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:11717:10)\\n    at Object.parseTopLevel (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:11087:10)\\n    at Object.parse (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12768:10)\\n    at parse (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12796:26)\\n    at parser (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\parser\\\\index.js:54:34)\\n    at parser.next (<anonymous>)\\n    at normalizeFile (C:\\\\Users\\\\ZC_FL\\\\Downloads\\\\HBuilderX\\\\plugins\\\\uniapp-cli\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transformation\\\\normalize-file.js:93:38)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiIwLmpzIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ })
/******/ ]);