import { Container } from 'dic-js'
import { ServiceFactory } from 'dic-js/out/contracts'
import Vue, { VueConstructor, PluginFunction } from 'vue'

export type Dependencies = Dictionary<string|ServiceFactory>|Array<string|ServiceFactory>

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
    container?: Dependencies
    injector?: (...args: any[]) => void
  }
}

export interface VueIocOption {
  containers: Container[]|Container
}

const install: PluginFunction<VueIocOption>  = (_Vue: VueConstructor, options) => {
  // throw new Error(`[vue-ioc]: plugin registered already, tell plugins authors to export their container.`)
  let {containers} = <VueIocOption>options
  if (!containers) {
    throw new Error(`[vue-ioc]: containers are required!`)
  }
  if (containers && !Array.isArray(containers)) {
    containers = [containers]
  }

  _Vue.prototype.$container = new Resolver(containers)

  _Vue.mixin({
    beforeCreate() {
      const {container, injector} = this.$options
      if (Array.isArray(container)) {
        const results = []
        for (const dependency of container) {
          results.push(this.$container.make(dependency))
        }
        if (injector) {
          injector.apply(this, results)
          return
        }
        throw new Error(`Injector function not found!`)
      }
      if (container) {
        Object.keys(container)
          .forEach((key: string) => {
            (<any>this)[key] = this.$container.make(container[key])
          })
      }
    }
  })
}

class Resolver {

  constructor(protected containers: Container[]) {}

  make(service: string|ServiceFactory, parameters: any[] = []) {
    return this._get(service, parameters)
  }

  protected _get(
    type: string|ServiceFactory,
    parameters: any = [],
    index: number = 0
  ): any {
    if ((index + 1) > this.containers.length) {
      throw new Error(`[vue-ioc]: could not resolve '${type}' from containers`)
    }
    try {
      return this.containers[index].make(type, parameters)
    } catch (e) {
      return this._get(type, parameters, ++index)
    }
  }
}

export default install
export {install}
