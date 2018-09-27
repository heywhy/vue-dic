"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var install = function (_Vue, options) {
    makeErrorIf(!options);
    var _containers = [];
    if (Array.isArray(options)) {
        _containers = options;
    }
    else {
        var containers = options.containers;
        _containers = wrapArray(containers);
    }
    makeErrorIf(_containers.length < 1);
    _Vue.prototype.$container = new Resolver(_containers);
    _Vue.mixin({
        beforeCreate: function () {
            var _this = this;
            var e_1, _a;
            var _b = this.$options, container = _b.container, injector = _b.injector;
            if (Array.isArray(container)) {
                var results = [];
                try {
                    for (var container_1 = __values(container), container_1_1 = container_1.next(); !container_1_1.done; container_1_1 = container_1.next()) {
                        var dependency = container_1_1.value;
                        results.push(this.$container.make(dependency));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (container_1_1 && !container_1_1.done && (_a = container_1.return)) _a.call(container_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (injector) {
                    injector.apply(this, results);
                    return;
                }
                makeErrorIf(true, "injector function not found!");
            }
            if (container) {
                Object.keys(container)
                    .forEach(function (key) {
                    _this[key] = _this.$container.make(container[key]);
                });
            }
        }
    });
};
exports.install = install;
var Resolver = /** @class */ (function () {
    function Resolver(containers) {
        this.containers = containers;
    }
    Resolver.prototype.make = function (service, parameters) {
        if (parameters === void 0) { parameters = []; }
        return this._call(service, function (container) { return container.make(service, parameters); });
    };
    Resolver.prototype.tagged = function (tag) {
        return this._call(tag, function (container) { return container.tagged(tag); });
    };
    Resolver.prototype._call = function (type, callback, index) {
        if (index === void 0) { index = 0; }
        if ((index + 1) > this.containers.length) {
            throw new Error("[vue-dic]: could not resolve '" + type + "' from containers");
        }
        try {
            return callback(this.containers[index]);
        }
        catch (e) {
            return this._call(type, callback, ++index);
        }
    };
    return Resolver;
}());
function wrapArray(v) {
    if (!Array.isArray(v)) {
        return [v];
    }
    return v;
}
function makeErrorIf(result, message) {
    if (message === void 0) { message = 'containers are required!'; }
    if (result)
        throw new Error("[vue-dic]: " + message);
}
exports.default = install;
