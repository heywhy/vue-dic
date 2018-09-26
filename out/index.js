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
    // throw new Error(`[vue-ioc]: plugin registered already, tell plugins authors to export their container.`)
    var containers = options.containers;
    if (!containers) {
        throw new Error("[vue-ioc]: containers are required!");
    }
    if (containers && !Array.isArray(containers)) {
        containers = [containers];
    }
    _Vue.prototype.$container = new Resolver(containers);
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
                throw new Error("Injector function not found!");
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
        return this._get(service, parameters);
    };
    Resolver.prototype._get = function (type, parameters, index) {
        if (parameters === void 0) { parameters = []; }
        if (index === void 0) { index = 0; }
        if ((index + 1) > this.containers.length) {
            throw new Error("[vue-ioc]: could not resolve '" + type + "' from containers");
        }
        try {
            return this.containers[index].make(type, parameters);
        }
        catch (e) {
            return this._get(type, parameters, ++index);
        }
    };
    return Resolver;
}());
exports.default = install;
