---
title: 'Introduction'
sidebar: 'auto'
prev: '/'
editLink: true
---

# Introduction

This is plugin for vue, which allows dependency injection.

```js
import VueIOC from 'vue-ioc'
import { getContext } from 'dic-js'

Vue.use(VueIOC, {
  containers: [getContext()]
})

```

```js
export default {
  container: {
    auth: 'auth-service'
  }
}
```

```js
import AnotherDep from '...'

export default {
  container: ['auth-service', AnotherDep],
  injector(authService) {

  }
}
```
