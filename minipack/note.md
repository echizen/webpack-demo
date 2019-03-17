
打包过程：

- 提供一个入口文件
- babylon分析这个入口文件
    - 提取依赖
    - 获得babel转成es5后的兼容代码
    - 确定个全局标识符id
- 再对入口文件的依赖进行递归处理，进行上述分析，得到依赖图graph
- 生成bundle
  - 将graph的每个片段都插入一些代码，成为 { id: [func(require, module, exports){ origin code}, dependenceMap]}的结构
  - 定义自己的依赖加载函数require
  - 2部分字符串代码片段合成

```javascript
(function(modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    function localRequire(name) {
      return require(mapping[name]);
    }

    const module = { exports: {} };

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(0);
})({
  0: [
    function(require, module, exports) {
      "use strict";

      var _message = require("./message.js");

      var _message2 = _interopRequireDefault(_message);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      console.log(_message2.default);
    }
    , { "./message.js": 1 }
  , ]
  , 1: [
    function(require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _name = require("./name.js");

      exports.default = "hello " + _name.name + "!";
    }
    , { "./name.js": 2 }
  , ]
  , 2: [
    function(require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var name = exports.name = 'world';
    }
    , {}
  , ]
, })

```

递归。require里创造的module变量来记录fn调用后返回的结果，babel转完后，如果有返回值会挂到exports的变量上，着这里被module.exports接收，并作为require函数的返回，所以require函数的返回是执行对应的文件后所获得的该文件export出来的内容，localRequire里将这个值返回出来也就是原文件import 得到的值，供原文件引用

真实的webpack打包出来的文件：installedModules记录缓存，也是自定义了一个require的实现`__webpack_require__`，和nimipack基本一致。然后还定义了一群常用的功能函数：

- __webpack_require__.d: define getter function for harmony exports，使用Object.defineProperty来定义对象上指定属性的getter函数
- __webpack_require__.r: define __esModule on exports
- __webpack_require__.t: create a fake namespace object，根据不同的mode做不同的处理
- __webpack_require__.n: getDefaultExport function for compatibility with non-harmony modules
- __webpack_require__.o: object.prototype.hasOwnProperty.call

modules列表用了Scope Hoisting作用域提升合并成了一个。好处：
- 代码体积更小，因为函数申明语句会产生大量代码；
- 代码在运行时因为创建的函数作用域更少了，内存开销也随之变小。

Scope Hoisting 的实现原理其实很简单：分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。 因此只有那些被引用了一次的模块才能被合并。


```javascript
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/name.js
const name_name = 'world';

// CONCATENATED MODULE: ./src/message.js


/* harmony default export */ var message = (`hello ${name_name}!`);
// CONCATENATED MODULE: ./src/index.js


console.log(message);


/***/ })
/******/ ]);
```

## bundle的几种模式

### var (默认)

```javascript
(function(modules) { // webpackBootstrap
  // __webpack_require__ 相关定义
})([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
  // module code
  })
])
```

### amd

```javascript
define("modName", [], function() {
  return /******/ (function(modules) { // webpackBootstrap
      // webpackBootstrap
    })([
      // modules code
    ])
})
```

### commonjs2

```javascript
module.exports = (function(modules) { // webpackBootstrap
  // webpackBootstrap
})([
  // modules code
])
```

### umd

`output.library`指定为modName时：
```javascript
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["modName"] = factory();
	else
		root["modName"] = factory();
})(window, function() {
  return /******/ (function(modules) { // webpackBootstrap
      // webpackBootstrap
    })([
      // modules code
    ])
})
```

`output.library`未指定时：

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
  return /******/ (function(modules) { // webpackBootstrap
      // webpackBootstrap
    })([
      // modules code
    ])
})
```

### window || global

`output.library`指定为modName时：

```javascript
window["modName"] = (function(modules) { // webpackBootstrap
  // __webpack_require__ 相关定义
})([
  // modules code
])
```

`output.library`未指定时：

```javascript
(function(e, a) { 
  for(var i in a) e[i] = a[i]; 
}(window, /******/ (function(modules) { // webpackBootstrap
  // __webpack_require__ 相关定义
})([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
    // module code
    })
  ])
))
```

### this

`output.library`指定为modName时：

```javascript
this["modName"] = (function(modules) { // webpackBootstrap
  // __webpack_require__ 相关定义
})([
  // modules code
])
```

`output.library`未指定时：

```javascript
(function(e, a) { 
  for(var i in a) e[i] = a[i]; 
}(this, /******/ (function(modules) { // webpackBootstrap
  // __webpack_require__ 相关定义
})([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
    // module code
    })
  ])
))
```

### commonjs

`output.library`指定为modName时：

```javascript
exports["modName"] = (function(modules) { // webpackBootstrap
  // __webpack_require__ 相关定义
})([
  // modules code
])
```

`output.library`未指定时：

```javascript
(function(e, a) { 
  for(var i in a) e[i] = a[i]; 
}(exports, /******/ (function(modules) { // webpackBootstrap
  // __webpack_require__ 相关定义
})([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
    // module code
    })
  ])
))
```


模块：
[https://juejin.im/post/5a2e5f0851882575d42f5609](https://juejin.im/post/5a2e5f0851882575d42f5609)
