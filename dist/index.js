/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 610:
/***/ ((module) => {



/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

module.exports = isObject;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__nccwpck_require__.r(__webpack_exports__);
/* harmony export */ __nccwpck_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var isobject__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(610);
/* harmony import */ var isobject__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nccwpck_require__.n(isobject__WEBPACK_IMPORTED_MODULE_0__);
/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */

const join = (segs, joinChar, options) => {
    if (typeof options.join === 'function') {
        return options.join(segs);
    }
    return segs[0] + joinChar + segs[1];
};
const split = (path, splitChar, options) => {
    if (typeof options.split === 'function') {
        return options.split(path);
    }
    return path.split(splitChar);
};
const isValid = (key, target, options) => {
    if (typeof options.isValid === 'function') {
        return options.isValid(key, target);
    }
    return true;
};
const isValidObject = (val) => {
    return isobject__WEBPACK_IMPORTED_MODULE_0___default()(val) || Array.isArray(val) || typeof val === 'function';
};
// eslint-disable-next-line complexity
const getValue = (target, path, options = {}) => {
    if (!isobject__WEBPACK_IMPORTED_MODULE_0___default()(options)) {
        options = { default: options };
    }
    if (!isValidObject(target)) {
        return typeof options.default !== 'undefined' ? options.default : target;
    }
    if (typeof path === 'number') {
        path = String(path);
    }
    const pathIsArray = Array.isArray(path);
    const pathIsString = typeof path === 'string';
    const splitChar = options.separator || '.';
    const joinChar = options.joinChar || (typeof splitChar === 'string' ? splitChar : '.');
    if (!pathIsString && !pathIsArray) {
        return target;
    }
    if (pathIsString && path in target) {
        return isValid(path, target, options) ? target[path] : options.default;
    }
    const segs = pathIsArray ? path : split(path, splitChar, options);
    const len = segs.length;
    let idx = 0;
    do {
        let prop = segs[idx];
        if (typeof prop === 'number') {
            prop = String(prop);
        }
        while (prop && prop.slice(-1) === '\\') {
            prop = join([prop.slice(0, -1), segs[++idx] || ''], joinChar, options);
        }
        if (prop in target) {
            if (!isValid(prop, target, options)) {
                return options.default;
            }
            target = target[prop];
        }
        else {
            let hasProp = false;
            let n = idx + 1;
            while (n < len) {
                prop = join([prop, segs[n++]], joinChar, options);
                if ((hasProp = prop in target)) {
                    if (!isValid(prop, target, options)) {
                        return options.default;
                    }
                    target = target[prop];
                    idx = n - 1;
                    break;
                }
            }
            if (!hasProp) {
                return options.default;
            }
        }
    } while (++idx < len && isValidObject(target));
    if (idx === len) {
        return target;
    }
    return options.default;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getValue);

})();

module.exports = __webpack_exports__;
/******/ })()
;