import Vue, { PluginFunction } from 'vue';

export interface VueIocOption {
  containers: any[];
}

declare const install: PluginFunction<VueIocOption>;
export default install;
export { install };

interface Container {
}

declare module 'vue/types/vue' {
    interface Vue {
        $container: Container;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        container?: {};
    }
}
