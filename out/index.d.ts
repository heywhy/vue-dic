import { Container } from 'dic-js';
import { ServiceFactory } from 'dic-js/out/contracts';
import Vue, { PluginFunction } from 'vue';
export declare type Dependencies = Dictionary<string | ServiceFactory> | Array<string | ServiceFactory>;
export interface Dictionary<T> {
    [key: string]: T;
}
declare module 'vue/types/vue' {
    interface Vue {
        readonly $container: Resolver;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        container?: Dependencies;
        injector?: (...args: any[]) => void;
    }
}
export interface VueIocOption {
    containers: Container[] | Container;
}
declare const install: PluginFunction<VueIocOption | Container[]>;
declare class Resolver {
    protected containers: Container[];
    constructor(containers: Container[]);
    make(service: string | ServiceFactory, parameters?: any[]): any;
    tagged(tag: string): any[];
    protected _call(type: string | ServiceFactory, callback: (container: Container) => any, index?: number): any | never;
}
export default install;
export { install };
