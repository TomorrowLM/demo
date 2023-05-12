/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/@theia/core/electron-shared/electron/index.js":
/*!************************************************************************!*\
  !*** ../../node_modules/@theia/core/electron-shared/electron/index.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! @theia/electron/shared/electron */ "../../node_modules/@theia/electron/shared/electron/index.js");


/***/ }),

/***/ "../../node_modules/@theia/core/lib/common/array-utils.js":
/*!****************************************************************!*\
  !*** ../../node_modules/@theia/core/lib/common/array-utils.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArrayUtils = void 0;
var ArrayUtils;
(function (ArrayUtils) {
    ArrayUtils.TailImpl = {
        tail() {
            return this[this.length - 1];
        },
    };
    ArrayUtils.HeadAndChildrenImpl = {
        head() {
            return this[0];
        },
        children() {
            return Object.assign(this.slice(1), ArrayUtils.TailImpl);
        }
    };
    function asTail(array) {
        return Object.assign(array, ArrayUtils.TailImpl);
    }
    ArrayUtils.asTail = asTail;
    function asHeadAndTail(array) {
        return Object.assign(array, ArrayUtils.HeadAndChildrenImpl, ArrayUtils.TailImpl);
    }
    ArrayUtils.asHeadAndTail = asHeadAndTail;
    let Sort;
    (function (Sort) {
        Sort[Sort["LeftBeforeRight"] = -1] = "LeftBeforeRight";
        Sort[Sort["RightBeforeLeft"] = 1] = "RightBeforeLeft";
        Sort[Sort["Equal"] = 0] = "Equal";
    })(Sort = ArrayUtils.Sort || (ArrayUtils.Sort = {}));
    // Copied from https://github.com/microsoft/vscode/blob/9c29becfad5f68270b9b23efeafb147722c5feba/src/vs/base/common/arrays.ts
    /**
     * Performs a binary search algorithm over a sorted collection. Useful for cases
     * when we need to perform a binary search over something that isn't actually an
     * array, and converting data to an array would defeat the use of binary search
     * in the first place.
     *
     * @param length The collection length.
     * @param compareToKey A function that takes an index of an element in the
     *   collection and returns zero if the value at this index is equal to the
     *   search key, a negative number if the value precedes the search key in the
     *   sorting order, or a positive number if the search key precedes the value.
     * @return A non-negative index of an element, if found. If not found, the
     *   result is -(n+1) (or ~n, using bitwise notation), where n is the index
     *   where the key should be inserted to maintain the sorting order.
     */
    function binarySearch2(length, compareToKey) {
        let low = 0;
        let high = length - 1;
        while (low <= high) {
            const mid = ((low + high) / 2) | 0;
            const comp = compareToKey(mid);
            if (comp < 0) {
                low = mid + 1;
            }
            else if (comp > 0) {
                high = mid - 1;
            }
            else {
                return mid;
            }
        }
        return -(low + 1);
    }
    ArrayUtils.binarySearch2 = binarySearch2;
    function partition(array, filter) {
        const pass = [];
        const fail = [];
        array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
        return [pass, fail];
    }
    ArrayUtils.partition = partition;
    /**
     * @returns New array with all falsy values removed. The original array IS NOT modified.
     */
    function coalesce(array) {
        return array.filter(e => !!e);
    }
    ArrayUtils.coalesce = coalesce;
})(ArrayUtils = exports.ArrayUtils || (exports.ArrayUtils = {}));
//# sourceMappingURL=array-utils.js.map

/***/ }),

/***/ "../../node_modules/@theia/core/lib/common/cancellation.js":
/*!*****************************************************************!*\
  !*** ../../node_modules/@theia/core/lib/common/cancellation.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation and others. All rights reserved.
 *  Licensed under the MIT License. See https://github.com/Microsoft/vscode/blob/master/LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkCancelled = exports.isCancelled = exports.cancelled = exports.CancellationTokenSource = exports.CancellationError = exports.CancellationToken = void 0;
const event_1 = __webpack_require__(/*! ./event */ "../../node_modules/@theia/core/lib/common/event.js");
const types_1 = __webpack_require__(/*! ./types */ "../../node_modules/@theia/core/lib/common/types.js");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shortcutEvent = Object.freeze(Object.assign(function (callback, context) {
    const handle = setTimeout(callback.bind(context), 0);
    return { dispose() { clearTimeout(handle); } };
}, {
    get maxListeners() { return 0; },
    set maxListeners(maxListeners) { }
}));
var CancellationToken;
(function (CancellationToken) {
    CancellationToken.None = Object.freeze({
        isCancellationRequested: false,
        onCancellationRequested: event_1.Event.None
    });
    CancellationToken.Cancelled = Object.freeze({
        isCancellationRequested: true,
        onCancellationRequested: shortcutEvent
    });
    function is(value) {
        return (0, types_1.isObject)(value) && (value === CancellationToken.None
            || value === CancellationToken.Cancelled
            || ((0, types_1.isBoolean)(value.isCancellationRequested) && !!value.onCancellationRequested));
    }
    CancellationToken.is = is;
})(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
class CancellationError extends Error {
    constructor() {
        super('Canceled');
        this.name = this.message;
    }
}
exports.CancellationError = CancellationError;
class MutableToken {
    constructor() {
        this._isCancelled = false;
    }
    cancel() {
        if (!this._isCancelled) {
            this._isCancelled = true;
            if (this._emitter) {
                this._emitter.fire(undefined);
                this._emitter = undefined;
            }
        }
    }
    get isCancellationRequested() {
        return this._isCancelled;
    }
    get onCancellationRequested() {
        if (this._isCancelled) {
            return shortcutEvent;
        }
        if (!this._emitter) {
            this._emitter = new event_1.Emitter();
        }
        return this._emitter.event;
    }
}
class CancellationTokenSource {
    get token() {
        if (!this._token) {
            // be lazy and create the token only when
            // actually needed
            this._token = new MutableToken();
        }
        return this._token;
    }
    cancel() {
        if (!this._token) {
            // save an object by returning the default
            // cancelled token when cancellation happens
            // before someone asks for the token
            this._token = CancellationToken.Cancelled;
        }
        else if (this._token !== CancellationToken.Cancelled) {
            this._token.cancel();
        }
    }
    dispose() {
        this.cancel();
    }
}
exports.CancellationTokenSource = CancellationTokenSource;
const cancelledMessage = 'Cancelled';
function cancelled() {
    return new Error(cancelledMessage);
}
exports.cancelled = cancelled;
function isCancelled(err) {
    return !!err && err.message === cancelledMessage;
}
exports.isCancelled = isCancelled;
function checkCancelled(token) {
    if (!!token && token.isCancellationRequested) {
        throw cancelled();
    }
}
exports.checkCancelled = checkCancelled;
//# sourceMappingURL=cancellation.js.map

/***/ }),

/***/ "../../node_modules/@theia/core/lib/common/disposable.js":
/*!***************************************************************!*\
  !*** ../../node_modules/@theia/core/lib/common/disposable.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.disposableTimeout = exports.DisposableGroup = exports.DisposableCollection = exports.Disposable = void 0;
const event_1 = __webpack_require__(/*! ./event */ "../../node_modules/@theia/core/lib/common/event.js");
const types_1 = __webpack_require__(/*! ./types */ "../../node_modules/@theia/core/lib/common/types.js");
var Disposable;
(function (Disposable) {
    function is(arg) {
        return (0, types_1.isObject)(arg) && (0, types_1.isFunction)(arg.dispose);
    }
    Disposable.is = is;
    function create(func) {
        return { dispose: func };
    }
    Disposable.create = create;
})(Disposable = exports.Disposable || (exports.Disposable = {}));
/**
 * Ensures that every reference to {@link Disposable.NULL} returns a new object,
 * as sharing a disposable between multiple {@link DisposableCollection} can have unexpected side effects
 */
Object.defineProperty(Disposable, 'NULL', {
    configurable: false,
    enumerable: true,
    get() {
        return { dispose: () => { } };
    }
});
class DisposableCollection {
    constructor(...toDispose) {
        this.disposables = [];
        this.onDisposeEmitter = new event_1.Emitter();
        this.disposingElements = false;
        toDispose.forEach(d => this.push(d));
    }
    /**
     * This event is fired only once
     * on first dispose of not empty collection.
     */
    get onDispose() {
        return this.onDisposeEmitter.event;
    }
    checkDisposed() {
        if (this.disposed && !this.disposingElements) {
            this.onDisposeEmitter.fire(undefined);
            this.onDisposeEmitter.dispose();
        }
    }
    get disposed() {
        return this.disposables.length === 0;
    }
    dispose() {
        if (this.disposed || this.disposingElements) {
            return;
        }
        this.disposingElements = true;
        while (!this.disposed) {
            try {
                this.disposables.pop().dispose();
            }
            catch (e) {
                console.error(e);
            }
        }
        this.disposingElements = false;
        this.checkDisposed();
    }
    push(disposable) {
        const disposables = this.disposables;
        disposables.push(disposable);
        const originalDispose = disposable.dispose.bind(disposable);
        const toRemove = Disposable.create(() => {
            const index = disposables.indexOf(disposable);
            if (index !== -1) {
                disposables.splice(index, 1);
            }
            this.checkDisposed();
        });
        disposable.dispose = () => {
            toRemove.dispose();
            disposable.dispose = originalDispose;
            originalDispose();
        };
        return toRemove;
    }
    pushAll(disposables) {
        return disposables.map(disposable => this.push(disposable));
    }
}
exports.DisposableCollection = DisposableCollection;
var DisposableGroup;
(function (DisposableGroup) {
    function canPush(candidate) {
        return Boolean(candidate && candidate.push);
    }
    DisposableGroup.canPush = canPush;
    function canAdd(candidate) {
        return Boolean(candidate && candidate.add);
    }
    DisposableGroup.canAdd = canAdd;
})(DisposableGroup = exports.DisposableGroup || (exports.DisposableGroup = {}));
function disposableTimeout(...args) {
    const handle = setTimeout(...args);
    return { dispose: () => clearTimeout(handle) };
}
exports.disposableTimeout = disposableTimeout;
//# sourceMappingURL=disposable.js.map

/***/ }),

/***/ "../../node_modules/@theia/core/lib/common/event.js":
/*!**********************************************************!*\
  !*** ../../node_modules/@theia/core/lib/common/event.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AsyncEmitter = exports.WaitUntilEvent = exports.Emitter = exports.Event = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const disposable_1 = __webpack_require__(/*! ./disposable */ "../../node_modules/@theia/core/lib/common/disposable.js");
var Event;
(function (Event) {
    const _disposable = { dispose() { } };
    function getMaxListeners(event) {
        const { maxListeners } = event;
        return typeof maxListeners === 'number' ? maxListeners : 0;
    }
    Event.getMaxListeners = getMaxListeners;
    function setMaxListeners(event, maxListeners) {
        if (typeof event.maxListeners === 'number') {
            return event.maxListeners = maxListeners;
        }
        return maxListeners;
    }
    Event.setMaxListeners = setMaxListeners;
    function addMaxListeners(event, add) {
        if (typeof event.maxListeners === 'number') {
            return event.maxListeners += add;
        }
        return add;
    }
    Event.addMaxListeners = addMaxListeners;
    Event.None = Object.assign(function () { return _disposable; }, {
        get maxListeners() { return 0; },
        set maxListeners(maxListeners) { }
    });
    /**
     * Given an event and a `map` function, returns another event which maps each element
     * through the mapping function.
     */
    function map(event, mapFunc) {
        return Object.assign((listener, thisArgs, disposables) => event(i => listener.call(thisArgs, mapFunc(i)), undefined, disposables), {
            get maxListeners() { return 0; },
            set maxListeners(maxListeners) { }
        });
    }
    Event.map = map;
})(Event = exports.Event || (exports.Event = {}));
class CallbackList {
    get length() {
        return this._callbacks && this._callbacks.length || 0;
    }
    add(callback, context = undefined, bucket) {
        if (!this._callbacks) {
            this._callbacks = [];
            this._contexts = [];
        }
        this._callbacks.push(callback);
        this._contexts.push(context);
        if (Array.isArray(bucket)) {
            bucket.push({ dispose: () => this.remove(callback, context) });
        }
    }
    remove(callback, context = undefined) {
        if (!this._callbacks) {
            return;
        }
        let foundCallbackWithDifferentContext = false;
        for (let i = 0; i < this._callbacks.length; i++) {
            if (this._callbacks[i] === callback) {
                if (this._contexts[i] === context) {
                    // callback & context match => remove it
                    this._callbacks.splice(i, 1);
                    this._contexts.splice(i, 1);
                    return;
                }
                else {
                    foundCallbackWithDifferentContext = true;
                }
            }
        }
        if (foundCallbackWithDifferentContext) {
            throw new Error('When adding a listener with a context, you should remove it with the same context');
        }
    }
    // tslint:disable-next-line:typedef
    [Symbol.iterator]() {
        if (!this._callbacks) {
            return [][Symbol.iterator]();
        }
        const callbacks = this._callbacks.slice(0);
        const contexts = this._contexts.slice(0);
        return callbacks.map((callback, i) => (...args) => callback.apply(contexts[i], args))[Symbol.iterator]();
    }
    invoke(...args) {
        const ret = [];
        for (const callback of this) {
            try {
                ret.push(callback(...args));
            }
            catch (e) {
                console.error(e);
            }
        }
        return ret;
    }
    isEmpty() {
        return !this._callbacks || this._callbacks.length === 0;
    }
    dispose() {
        this._callbacks = undefined;
        this._contexts = undefined;
    }
}
class Emitter {
    constructor(_options) {
        this._options = _options;
        this._disposed = false;
        this._leakWarnCountdown = 0;
    }
    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    get event() {
        if (!this._event) {
            this._event = Object.assign((listener, thisArgs, disposables) => {
                if (!this._callbacks) {
                    this._callbacks = new CallbackList();
                }
                if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
                    this._options.onFirstListenerAdd(this);
                }
                this._callbacks.add(listener, thisArgs);
                const removeMaxListenersCheck = this.checkMaxListeners(Event.getMaxListeners(this._event));
                const result = {
                    dispose: () => {
                        if (removeMaxListenersCheck) {
                            removeMaxListenersCheck();
                        }
                        result.dispose = Emitter._noop;
                        if (!this._disposed) {
                            this._callbacks.remove(listener, thisArgs);
                            result.dispose = Emitter._noop;
                            if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) {
                                this._options.onLastListenerRemove(this);
                            }
                        }
                    }
                };
                if (disposable_1.DisposableGroup.canPush(disposables)) {
                    disposables.push(result);
                }
                else if (disposable_1.DisposableGroup.canAdd(disposables)) {
                    disposables.add(result);
                }
                return result;
            }, {
                maxListeners: Emitter.LEAK_WARNING_THRESHHOLD
            });
        }
        return this._event;
    }
    checkMaxListeners(maxListeners) {
        if (maxListeners === 0 || !this._callbacks) {
            return undefined;
        }
        const listenerCount = this._callbacks.length;
        if (listenerCount <= maxListeners) {
            return undefined;
        }
        const popStack = this.pushLeakingStack();
        this._leakWarnCountdown -= 1;
        if (this._leakWarnCountdown <= 0) {
            // only warn on first exceed and then every time the limit
            // is exceeded by 50% again
            this._leakWarnCountdown = maxListeners * 0.5;
            let topStack;
            let topCount = 0;
            this._leakingStacks.forEach((stackCount, stack) => {
                if (!topStack || topCount < stackCount) {
                    topStack = stack;
                    topCount = stackCount;
                }
            });
            // eslint-disable-next-line max-len
            console.warn(`Possible Emitter memory leak detected. ${listenerCount} listeners added. Use event.maxListeners to increase the limit (${maxListeners}). MOST frequent listener (${topCount}):`);
            console.warn(topStack);
        }
        return popStack;
    }
    pushLeakingStack() {
        if (!this._leakingStacks) {
            this._leakingStacks = new Map();
        }
        const stack = new Error().stack.split('\n').slice(3).join('\n');
        const count = (this._leakingStacks.get(stack) || 0);
        this._leakingStacks.set(stack, count + 1);
        return () => this.popLeakingStack(stack);
    }
    popLeakingStack(stack) {
        if (!this._leakingStacks) {
            return;
        }
        const count = (this._leakingStacks.get(stack) || 0);
        this._leakingStacks.set(stack, count - 1);
    }
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    fire(event) {
        if (this._callbacks) {
            this._callbacks.invoke(event);
        }
    }
    /**
     * Process each listener one by one.
     * Return `false` to stop iterating over the listeners, `true` to continue.
     */
    async sequence(processor) {
        if (this._callbacks) {
            for (const listener of this._callbacks) {
                if (!await processor(listener)) {
                    break;
                }
            }
        }
    }
    dispose() {
        if (this._leakingStacks) {
            this._leakingStacks.clear();
            this._leakingStacks = undefined;
        }
        if (this._callbacks) {
            this._callbacks.dispose();
            this._callbacks = undefined;
        }
        this._disposed = true;
    }
}
exports.Emitter = Emitter;
Emitter.LEAK_WARNING_THRESHHOLD = 175;
Emitter._noop = function () { };
var WaitUntilEvent;
(function (WaitUntilEvent) {
    /**
     * Fire all listeners in the same tick.
     *
     * Use `AsyncEmitter.fire` to fire listeners async one after another.
     */
    async function fire(emitter, event, timeout, token = cancellation_1.CancellationToken.None) {
        const waitables = [];
        const asyncEvent = Object.assign(event, {
            token,
            waitUntil: (thenable) => {
                if (Object.isFrozen(waitables)) {
                    throw new Error('waitUntil cannot be called asynchronously.');
                }
                waitables.push(thenable);
            }
        });
        try {
            emitter.fire(asyncEvent);
            // Asynchronous calls to `waitUntil` should fail.
            Object.freeze(waitables);
        }
        finally {
            delete asyncEvent['waitUntil'];
        }
        if (!waitables.length) {
            return;
        }
        if (timeout !== undefined) {
            await Promise.race([Promise.all(waitables), new Promise(resolve => setTimeout(resolve, timeout))]);
        }
        else {
            await Promise.all(waitables);
        }
    }
    WaitUntilEvent.fire = fire;
})(WaitUntilEvent = exports.WaitUntilEvent || (exports.WaitUntilEvent = {}));
const cancellation_1 = __webpack_require__(/*! ./cancellation */ "../../node_modules/@theia/core/lib/common/cancellation.js");
class AsyncEmitter extends Emitter {
    /**
     * Fire listeners async one after another.
     */
    fire(event, token = cancellation_1.CancellationToken.None, promiseJoin) {
        const callbacks = this._callbacks;
        if (!callbacks) {
            return Promise.resolve();
        }
        const listeners = [...callbacks];
        if (this.deliveryQueue) {
            return this.deliveryQueue = this.deliveryQueue.then(() => this.deliver(listeners, event, token, promiseJoin));
        }
        return this.deliveryQueue = this.deliver(listeners, event, token, promiseJoin);
    }
    async deliver(listeners, event, token, promiseJoin) {
        for (const listener of listeners) {
            if (token.isCancellationRequested) {
                return;
            }
            const waitables = [];
            const asyncEvent = Object.assign(event, {
                token,
                waitUntil: (thenable) => {
                    if (Object.isFrozen(waitables)) {
                        throw new Error('waitUntil cannot be called asynchronously.');
                    }
                    if (promiseJoin) {
                        thenable = promiseJoin(thenable, listener);
                    }
                    waitables.push(thenable);
                }
            });
            try {
                listener(event);
                // Asynchronous calls to `waitUntil` should fail.
                Object.freeze(waitables);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                delete asyncEvent['waitUntil'];
            }
            if (!waitables.length) {
                return;
            }
            try {
                await Promise.all(waitables);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}
exports.AsyncEmitter = AsyncEmitter;
//# sourceMappingURL=event.js.map

/***/ }),

/***/ "../../node_modules/@theia/core/lib/common/prioritizeable.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/@theia/core/lib/common/prioritizeable.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Prioritizeable = void 0;
var Prioritizeable;
(function (Prioritizeable) {
    async function toPrioritizeable(rawValue, getPriority) {
        if (rawValue instanceof Array) {
            return Promise.all(rawValue.map(v => toPrioritizeable(v, getPriority)));
        }
        const value = await rawValue;
        const priority = await getPriority(value);
        return { priority, value };
    }
    Prioritizeable.toPrioritizeable = toPrioritizeable;
    function toPrioritizeableSync(rawValue, getPriority) {
        return rawValue.map(v => ({
            value: v,
            priority: getPriority(v)
        }));
    }
    Prioritizeable.toPrioritizeableSync = toPrioritizeableSync;
    function prioritizeAllSync(values, getPriority) {
        const prioritizeable = toPrioritizeableSync(values, getPriority);
        return prioritizeable.filter(isValid).sort(compare);
    }
    Prioritizeable.prioritizeAllSync = prioritizeAllSync;
    async function prioritizeAll(values, getPriority) {
        const prioritizeable = await toPrioritizeable(values, getPriority);
        return prioritizeable.filter(isValid).sort(compare);
    }
    Prioritizeable.prioritizeAll = prioritizeAll;
    function isValid(p) {
        return p.priority > 0;
    }
    Prioritizeable.isValid = isValid;
    function compare(p, p2) {
        return p2.priority - p.priority;
    }
    Prioritizeable.compare = compare;
})(Prioritizeable = exports.Prioritizeable || (exports.Prioritizeable = {}));
//# sourceMappingURL=prioritizeable.js.map

/***/ }),

/***/ "../../node_modules/@theia/core/lib/common/types.js":
/*!**********************************************************!*\
  !*** ../../node_modules/@theia/core/lib/common/types.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unreachable = exports.nullToUndefined = exports.isStringArray = exports.isArray = exports.isUndefined = exports.isObject = exports.isFunction = exports.isErrorLike = exports.isError = exports.isNumber = exports.isString = exports.isBoolean = exports.Prioritizeable = exports.ArrayUtils = void 0;
var array_utils_1 = __webpack_require__(/*! ./array-utils */ "../../node_modules/@theia/core/lib/common/array-utils.js");
Object.defineProperty(exports, "ArrayUtils", ({ enumerable: true, get: function () { return array_utils_1.ArrayUtils; } }));
var prioritizeable_1 = __webpack_require__(/*! ./prioritizeable */ "../../node_modules/@theia/core/lib/common/prioritizeable.js");
Object.defineProperty(exports, "Prioritizeable", ({ enumerable: true, get: function () { return prioritizeable_1.Prioritizeable; } }));
function isBoolean(value) {
    return value === true || value === false;
}
exports.isBoolean = isBoolean;
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
exports.isString = isString;
function isNumber(value) {
    return typeof value === 'number' || value instanceof Number;
}
exports.isNumber = isNumber;
function isError(value) {
    return value instanceof Error;
}
exports.isError = isError;
function isErrorLike(value) {
    return isObject(value) && isString(value.name) && isString(value.message) && (isUndefined(value.stack) || isString(value.stack));
}
exports.isErrorLike = isErrorLike;
// eslint-disable-next-line space-before-function-paren
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
function isObject(value) {
    // eslint-disable-next-line no-null/no-null
    return typeof value === 'object' && value !== null;
}
exports.isObject = isObject;
function isUndefined(value) {
    return typeof value === 'undefined';
}
exports.isUndefined = isUndefined;
/**
 * @param value value to check.
 * @param every optional predicate ran on every element of the array.
 * @param thisArg value to substitute `this` with when invoking in the predicate.
 * @returns whether or not `value` is an array.
 */
function isArray(value, every, thisArg) {
    return Array.isArray(value) && (!isFunction(every) || value.every(every, thisArg));
}
exports.isArray = isArray;
function isStringArray(value) {
    return isArray(value, isString);
}
exports.isStringArray = isStringArray;
/**
 * Creates a shallow copy with all ownkeys of the original object that are `null` made `undefined`
 */
function nullToUndefined(nullable) {
    const undefinable = Object.assign({}, nullable);
    for (const key in nullable) {
        // eslint-disable-next-line no-null/no-null
        if (nullable[key] === null && Object.prototype.hasOwnProperty.call(nullable, key)) {
            undefinable[key] = undefined;
        }
    }
    return undefinable;
}
exports.nullToUndefined = nullToUndefined;
/**
 * Throws when called and statically makes sure that all variants of a type were consumed.
 */
function unreachable(_never, message = 'unhandled case') {
    throw new Error(message);
}
exports.unreachable = unreachable;
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "../../node_modules/@theia/core/lib/electron-browser/preload.js":
/*!**********************************************************************!*\
  !*** ../../node_modules/@theia/core/lib/electron-browser/preload.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.preload = void 0;
// *****************************************************************************
// Copyright (C) 2023 STMicroelectronics and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
//
const disposable_1 = __webpack_require__(/*! ../common/disposable */ "../../node_modules/@theia/core/lib/common/disposable.js");
const electron_api_1 = __webpack_require__(/*! ../electron-common/electron-api */ "../../node_modules/@theia/core/lib/electron-common/electron-api.js");
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer, contextBridge } = __webpack_require__(/*! electron */ "electron");
// a map of menuId => map<handler id => handler>
const commandHandlers = new Map();
let nextHandlerId = 0;
const mainMenuId = 0;
let nextMenuId = mainMenuId + 1;
function convertMenu(menu, handlerMap) {
    if (!menu) {
        return undefined;
    }
    return menu.map(item => {
        let handlerId = undefined;
        if (item.execute) {
            handlerId = nextHandlerId++;
            handlerMap.set(handlerId, item.execute);
        }
        return {
            id: item.id,
            submenu: convertMenu(item.submenu, handlerMap),
            accelerator: item.accelerator,
            label: item.label,
            handlerId: handlerId,
            checked: item.checked,
            enabled: item.enabled,
            role: item.role,
            type: item.type,
            visible: item.visible
        };
    });
}
const api = {
    setMenuBarVisible: (visible, windowName) => ipcRenderer.send(electron_api_1.CHANNEL_SET_MENU_BAR_VISIBLE, visible, windowName),
    setMenu: (menu) => {
        commandHandlers.delete(mainMenuId);
        const handlers = new Map();
        commandHandlers.set(mainMenuId, handlers);
        ipcRenderer.send(electron_api_1.CHANNEL_SET_MENU, mainMenuId, convertMenu(menu, handlers));
    },
    getSecurityToken: () => ipcRenderer.invoke(electron_api_1.CHANNEL_GET_SECURITY_TOKEN),
    focusWindow: (name) => ipcRenderer.send(electron_api_1.CHANNEL_FOCUS_WINDOW, name),
    showItemInFolder: fsPath => {
        ipcRenderer.send(electron_api_1.CHANNEL_SHOW_ITEM_IN_FOLDER, fsPath);
    },
    attachSecurityToken: (endpoint) => ipcRenderer.invoke(electron_api_1.CHANNEL_ATTACH_SECURITY_TOKEN, endpoint),
    popup: async function (menu, x, y, onClosed) {
        const menuId = nextMenuId++;
        const handlers = new Map();
        commandHandlers.set(menuId, handlers);
        const handle = await ipcRenderer.invoke(electron_api_1.CHANNEL_OPEN_POPUP, menuId, convertMenu(menu, handlers), x, y);
        const closeListener = () => {
            ipcRenderer.removeListener(electron_api_1.CHANNEL_ON_CLOSE_POPUP, closeListener);
            commandHandlers.delete(menuId);
            onClosed();
        };
        ipcRenderer.on(electron_api_1.CHANNEL_ON_CLOSE_POPUP, closeListener);
        return handle;
    },
    closePopup: function (handle) {
        ipcRenderer.send(electron_api_1.CHANNEL_CLOSE_POPUP, handle);
    },
    getTitleBarStyleAtStartup: function () {
        return ipcRenderer.invoke(electron_api_1.CHANNEL_GET_TITLE_STYLE_AT_STARTUP);
    },
    setTitleBarStyle: function (style) {
        ipcRenderer.send(electron_api_1.CHANNEL_SET_TITLE_STYLE, style);
    },
    minimize: function () {
        ipcRenderer.send(electron_api_1.CHANNEL_MINIMIZE);
    },
    isMaximized: function () {
        return ipcRenderer.sendSync(electron_api_1.CHANNEL_IS_MAXIMIZED);
    },
    maximize: function () {
        ipcRenderer.send(electron_api_1.CHANNEL_MAXIMIZE);
    },
    unMaximize: function () {
        ipcRenderer.send(electron_api_1.CHANNEL_UNMAXIMIZE);
    },
    close: function () {
        ipcRenderer.send(electron_api_1.CHANNEL_CLOSE);
    },
    onWindowEvent: function (event, handler) {
        const h = (_event, evt) => {
            if (event === evt) {
                handler();
            }
        };
        ipcRenderer.on(electron_api_1.CHANNEL_ON_WINDOW_EVENT, h);
        return disposable_1.Disposable.create(() => ipcRenderer.off(electron_api_1.CHANNEL_ON_WINDOW_EVENT, h));
    },
    setCloseRequestHandler: function (handler) {
        ipcRenderer.on(electron_api_1.CHANNEL_REQUEST_CLOSE, async (event, stopReason, confirmChannel, cancelChannel) => {
            try {
                if (await handler(stopReason)) {
                    event.sender.send(confirmChannel);
                    return;
                }
                ;
            }
            catch (e) {
                console.warn('exception in close handler ', e);
            }
            event.sender.send(cancelChannel);
        });
    },
    toggleDevTools: function () {
        ipcRenderer.send(electron_api_1.CHANNEL_TOGGLE_DEVTOOLS);
    },
    getZoomLevel: function () {
        return ipcRenderer.invoke(electron_api_1.CHANNEL_GET_ZOOM_LEVEL);
    },
    setZoomLevel: function (desired) {
        ipcRenderer.send(electron_api_1.CHANNEL_SET_ZOOM_LEVEL, desired);
    },
    isFullScreenable: function () {
        return ipcRenderer.sendSync(electron_api_1.CHANNEL_IS_FULL_SCREENABLE);
    },
    isFullScreen: function () {
        return ipcRenderer.sendSync(electron_api_1.CHANNEL_IS_FULL_SCREEN);
    },
    toggleFullScreen: function () {
        ipcRenderer.send(electron_api_1.CHANNEL_TOGGLE_FULL_SCREEN);
    },
    requestReload: () => ipcRenderer.send(electron_api_1.CHANNEL_REQUEST_RELOAD),
    restart: () => ipcRenderer.send(electron_api_1.CHANNEL_RESTART),
    applicationStateChanged: state => {
        ipcRenderer.send(electron_api_1.CHANNEL_APP_STATE_CHANGED, state);
    },
    readClipboard() {
        return ipcRenderer.sendSync(electron_api_1.CHANNEL_READ_CLIPBOARD);
    },
    writeClipboard(text) {
        ipcRenderer.send(electron_api_1.CHANNEL_WRITE_CLIPBOARD, text);
    },
    onKeyboardLayoutChanged(handler) {
        return createDisposableListener(electron_api_1.CHANNEL_KEYBOARD_LAYOUT_CHANGED, (event, layout) => { handler(layout); });
    },
    onData: handler => createDisposableListener(electron_api_1.CHANNEL_IPC_CONNECTION, (event, data) => { handler(data); }),
    sendData: data => {
        ipcRenderer.send(electron_api_1.CHANNEL_IPC_CONNECTION, data);
    },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createDisposableListener(channel, handler) {
    ipcRenderer.on(channel, handler);
    return disposable_1.Disposable.create(() => ipcRenderer.off(channel, handler));
}
function preload() {
    console.log('exposing theia core electron api');
    ipcRenderer.on(electron_api_1.CHANNEL_INVOKE_MENU, (_, menuId, handlerId) => {
        const map = commandHandlers.get(menuId);
        if (map) {
            const handler = map.get(handlerId);
            if (handler) {
                handler();
            }
        }
    });
    contextBridge.exposeInMainWorld('electronTheiaCore', api);
}
exports.preload = preload;
//# sourceMappingURL=preload.js.map

/***/ }),

/***/ "../../node_modules/@theia/core/lib/electron-common/electron-api.js":
/*!**************************************************************************!*\
  !*** ../../node_modules/@theia/core/lib/electron-common/electron-api.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 STMicroelectronics and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CHANNEL_IPC_CONNECTION = exports.CHANNEL_KEYBOARD_LAYOUT_CHANGED = exports.CHANNEL_WRITE_CLIPBOARD = exports.CHANNEL_READ_CLIPBOARD = exports.CHANNEL_APP_STATE_CHANGED = exports.CHANNEL_RESTART = exports.CHANNEL_REQUEST_RELOAD = exports.CHANNEL_REQUEST_CLOSE = exports.CHANNEL_TOGGLE_FULL_SCREEN = exports.CHANNEL_IS_FULL_SCREEN = exports.CHANNEL_IS_FULL_SCREENABLE = exports.CHANNEL_SET_ZOOM_LEVEL = exports.CHANNEL_GET_ZOOM_LEVEL = exports.CHANNEL_TOGGLE_DEVTOOLS = exports.CHANNEL_ON_WINDOW_EVENT = exports.CHANNEL_UNMAXIMIZE = exports.CHANNEL_IS_MAXIMIZED = exports.CHANNEL_MAXIMIZE = exports.CHANNEL_MINIMIZE = exports.CHANNEL_CLOSE = exports.CHANNEL_SET_TITLE_STYLE = exports.CHANNEL_GET_TITLE_STYLE_AT_STARTUP = exports.CHANNEL_ATTACH_SECURITY_TOKEN = exports.CHANNEL_SHOW_ITEM_IN_FOLDER = exports.CHANNEL_SHOW_SAVE = exports.CHANNEL_SHOW_OPEN = exports.CHANNEL_FOCUS_WINDOW = exports.CHANNEL_GET_SECURITY_TOKEN = exports.CHANNEL_CLOSE_POPUP = exports.CHANNEL_ON_CLOSE_POPUP = exports.CHANNEL_OPEN_POPUP = exports.CHANNEL_INVOKE_MENU = exports.CHANNEL_SET_MENU_BAR_VISIBLE = exports.CHANNEL_SET_MENU = void 0;
exports.CHANNEL_SET_MENU = 'SetMenu';
exports.CHANNEL_SET_MENU_BAR_VISIBLE = 'SetMenuBarVisible';
exports.CHANNEL_INVOKE_MENU = 'InvokeMenu';
exports.CHANNEL_OPEN_POPUP = 'OpenPopup';
exports.CHANNEL_ON_CLOSE_POPUP = 'OnClosePopup';
exports.CHANNEL_CLOSE_POPUP = 'ClosePopup';
exports.CHANNEL_GET_SECURITY_TOKEN = 'GetSecurityToken';
exports.CHANNEL_FOCUS_WINDOW = 'FocusWindow';
exports.CHANNEL_SHOW_OPEN = 'ShowOpenDialog';
exports.CHANNEL_SHOW_SAVE = 'ShowSaveDialog';
exports.CHANNEL_SHOW_ITEM_IN_FOLDER = 'ShowItemInFolder';
exports.CHANNEL_ATTACH_SECURITY_TOKEN = 'AttachSecurityToken';
exports.CHANNEL_GET_TITLE_STYLE_AT_STARTUP = 'GetTitleStyleAtStartup';
exports.CHANNEL_SET_TITLE_STYLE = 'SetTitleStyle';
exports.CHANNEL_CLOSE = 'Close';
exports.CHANNEL_MINIMIZE = 'Minimize';
exports.CHANNEL_MAXIMIZE = 'Maximize';
exports.CHANNEL_IS_MAXIMIZED = 'IsMaximized';
exports.CHANNEL_UNMAXIMIZE = 'UnMaximize';
exports.CHANNEL_ON_WINDOW_EVENT = 'OnWindowEvent';
exports.CHANNEL_TOGGLE_DEVTOOLS = 'ToggleDevtools';
exports.CHANNEL_GET_ZOOM_LEVEL = 'GetZoomLevel';
exports.CHANNEL_SET_ZOOM_LEVEL = 'SetZoomLevel';
exports.CHANNEL_IS_FULL_SCREENABLE = 'IsFullScreenable';
exports.CHANNEL_IS_FULL_SCREEN = 'IsFullScreen';
exports.CHANNEL_TOGGLE_FULL_SCREEN = 'ToggleFullScreen';
exports.CHANNEL_REQUEST_CLOSE = 'RequestClose';
exports.CHANNEL_REQUEST_RELOAD = 'RequestReload';
exports.CHANNEL_RESTART = 'Restart';
exports.CHANNEL_APP_STATE_CHANGED = 'ApplicationStateChanged';
exports.CHANNEL_READ_CLIPBOARD = 'ReadClipboard';
exports.CHANNEL_WRITE_CLIPBOARD = 'WriteClipboard';
exports.CHANNEL_KEYBOARD_LAYOUT_CHANGED = 'KeyboardLayoutChanged';
exports.CHANNEL_IPC_CONNECTION = 'IpcConnection';
//# sourceMappingURL=electron-api.js.map

/***/ }),

/***/ "../../node_modules/@theia/electron/shared/electron/index.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/@theia/electron/shared/electron/index.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! electron */ "electron");


/***/ }),

/***/ "../../node_modules/@theia/filesystem/lib/electron-browser/preload.js":
/*!****************************************************************************!*\
  !*** ../../node_modules/@theia/filesystem/lib/electron-browser/preload.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.preload = void 0;
// *****************************************************************************
// Copyright (C) 2023 STMicroelectronics and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
const electron_api_1 = __webpack_require__(/*! ../electron-common/electron-api */ "../../node_modules/@theia/filesystem/lib/electron-common/electron-api.js");
// eslint-disable-next-line import/no-extraneous-dependencies
const electron_1 = __webpack_require__(/*! @theia/core/electron-shared/electron */ "../../node_modules/@theia/core/electron-shared/electron/index.js");
const api = {
    showOpenDialog: (options) => electron_1.ipcRenderer.invoke(electron_api_1.CHANNEL_SHOW_OPEN, options),
    showSaveDialog: (options) => electron_1.ipcRenderer.invoke(electron_api_1.CHANNEL_SHOW_SAVE, options),
};
function preload() {
    console.log('exposing theia filesystem electron api');
    electron_1.contextBridge.exposeInMainWorld('electronTheiaFilesystem', api);
}
exports.preload = preload;
//# sourceMappingURL=preload.js.map

/***/ }),

/***/ "../../node_modules/@theia/filesystem/lib/electron-common/electron-api.js":
/*!********************************************************************************!*\
  !*** ../../node_modules/@theia/filesystem/lib/electron-common/electron-api.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 STMicroelectronics and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CHANNEL_SHOW_SAVE = exports.CHANNEL_SHOW_OPEN = void 0;
exports.CHANNEL_SHOW_OPEN = 'ShowOpenDialog';
exports.CHANNEL_SHOW_SAVE = 'ShowSaveDialog';
//# sourceMappingURL=electron-api.js.map

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./src-gen/frontend/preload.js ***!
  \*************************************/
// @ts-check

(__webpack_require__(/*! @theia/core/lib/electron-browser/preload */ "../../node_modules/@theia/core/lib/electron-browser/preload.js").preload)();
(__webpack_require__(/*! @theia/filesystem/lib/electron-browser/preload */ "../../node_modules/@theia/filesystem/lib/electron-browser/preload.js").preload)();

})();

/******/ })()
;
//# sourceMappingURL=preload.js.map