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

const install: PluginFunction<VueIocOption|Container[]>  = (_Vue: VueConstructor, options) => {
  makeErrorIf(!options)
  let _containers: Container[] = []
  if (Array.isArray(options)) {
    _containers = options
  } else {
    let {containers} = <VueIocOption>options
    _containers = wrapArray(containers)
  }
  makeErrorIf(_containers.length < 1)
  _Vue.prototype.$container = new Resolver(_containers)

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
        makeErrorIf(true, `injector function not found!`)
      }
      if (container) {
        Object.keys(container)
          .forEach((key: string) => {
            (<any>this)[key] = this.$container.make((<any>container)[key])
          })
      }
    }
  })
}

class Resolver {

  constructor(protected containers: Container[]) {}

  make(service: string|ServiceFactory, parameters: any[] = []) {
    return this._call(service, (container) => container.make(service, parameters))
  }

  tagged(tag: string): any[] {
    return this._call(tag, (container) => container.tagged(tag))
  }

  protected _call(
    type: string|ServiceFactory,
    callback: (container: Container) => any,
    index: number = 0
  ): any|never {
    if ((index + 1) > this.containers.length) {
      throw new Error(`[vue-dic]: could not resolve '${type}' from containers`)
    }
    try {
      return callback(this.containers[index])
    } catch (e) {
      return this._call(type, callback, ++index)
    }
  }
}

function wrapArray(v: any): any[] {
  if (!Array.isArray(v)) {
    return [v]
  }
  return v
}

function makeErrorIf(
  result: boolean,
  message: string = 'containers are required!'
) {
  if (result) throw new Error(`[vue-dic]: ${message}`)
}

export default install
export {install}
