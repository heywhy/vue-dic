---
title: 'Introduction'
sidebar: 'auto'
prev: '/'
editLink: true
---

# Introduction

This is plugin for vue, which helps with dependency injection, it assumes the provided container implements [**dic-js**](https://heywhy.github.com/dic-js) container interface.

## Installation

Install the plugin using `yarn add vue-dic` or `npm install vue-dic`.

```js
import VueDIC from 'vue-dic'
import { getContext } from 'dic-js'

const containers = [
  getContext(),
  getContext('a-library-container-id')
]

Vue.use(VueDIC, {
  // dependencies are resolved in the order of the containers,
  // if a dependency is not found in the first container, it trys the
  // other containers in the list before giving up.
  containers
})

// it also accepts an array of containers.
Vue.use(VueDic, containers)
```

## Resolving Dependencies

You can resolve dependencies from the containers in vue components and a property `$container` is being injected in vue instances.

```js
export default {
  container: {
    // the dependency `auth-service` will be
    // resolved and binded to the object key.
    auth: 'auth-service'
  }
}

import AnotherDep from '...'

// if the value is an array, a injector has to be provided
export default {
  container: ['auth-service', AnotherDep],
  injector(authService) {

  }
}
```
You might decide to resolve dependencies when you need them;
```js
export default {
  methods: {
    doSomething() {
      const api = this.$container.make('dependency')
      api.callAMethod()
    }
  }
}

```

## Vendor's Dependencies

For instance there is a plugin/library you use in your project, and has dependencies you depend on, you can add the library's container instance when installing `vue-dic`.

```js
import containerInstance from 'library'

Vue.use(VueDic, {
  // any dependency not found in the first container
  // will checked in other containers until no
  // container is left, then throws an error.
  containers: [getContext(), containerInstance]
})

export default {
  // the dependency will be resolved from the other container
  // if not found in the first conatiner
  container: {
    dep: 'dependency from a vendor container'
  }
}
```

:::tip
The order of the containers is important, e.g. if two containers has the the same binding, the first container (in the list) result will be returned.
:::

## Api Documentation

### `$container` methods

#### Method `make`
This resolves a dependency from the list of containers.

* parameters:
  * dependency: `string`|`any` parameter accepted by **dic-js**
* returns: `any`

#### Method `resolve`

The resolves tagged dependencies.

* parameter
  * tagId: `string`
* returns: `any[]`
