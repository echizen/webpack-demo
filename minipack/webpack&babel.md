源码：
```javascript
/*global define*/
;(function() {

    var vueTouch = {};

    if (typeof exports == 'object') {

        module.exports = vueTouch;
    } else if (typeof define == 'function' && define.amd) {
        define([], function() {
            return vueTouch;
        });
    } else if (window.Vue) {
        window.VueTouch = vueTouch;
        window.Vue.use(vueTouch);
    }

})();

```

引入babel，报错

```javascript
"MHTBJiDEACqH6301n4RLtg==!aV6YJ3VDLlinbXS3zJ8DJA==":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__ = __webpack_require__("TDU52wZgMcR6nKbDKPdgjg==");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__);

/*global define*/
;(function () {

    var vueTouch = {};

    if ((typeof exports === 'undefined' ? 'undefined' : __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default()(exports)) == 'object') {
        module.exports = vueTouch;
    } else if (typeof define == 'function' && define.amd) {
        define([], function () {
            return vueTouch;
        });
    } else if (window.Vue) {
        window.VueTouch = vueTouch;
        window.Vue.use(vueTouch);
    }
})();
})()
})
```


不引入babel

```javascript
// 调用方：
// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
```

```javascript
/***/ "aV6YJ3VDLlinbXS3zJ8DJA==":
/***/ (function(module, exports, __webpack_require__) {

/*global define*/
;(function() {
    var vueTouch = {};

    if (true) {
        module.exports = vueTouch;
    } else if (typeof define == 'function' && define.amd) {
        define([], function() {
            return vueTouch;
        });
    } else if (window.Vue) {
        window.VueTouch = vueTouch;
        window.Vue.use(vueTouch);
    }

})();
```

[https://juejin.im/post/5a5ef47c6fb9a01cb13929f5](https://juejin.im/post/5a5ef47c6fb9a01cb13929f5)

经测试，commonjs的模块转化后引入时是

```javascript
(function(module, exports, __webpack_require__) {})
```

而es6 模块是：

```javascript
(function(module, __webpack_exports__, __webpack_require__) {})
```
```

// babel是将es6格式 转成了commonjs，所以加了babel会被透出为exports，正好

exports命中了umd模块原有的判断逻辑让其有透出的模块变量，所以可用