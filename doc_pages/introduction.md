---
title: 'Introduction'
sidebar: 'auto'
prev: '/'
editLink: true
---

# Introduction

This is plugin for vue, which allows dependency injection.

```js
import VueDIC from 'vue-dic'
import { getContext } from 'dic-js'

Vue.use(VueDIC, {
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
