const Vue = require('vue')
const {bind, getContext} = require('dic-js')
const {install} = require('./out')

const container = getContext()
Vue.use(install, [container])

bind('hello').factory(() => 'love me')
container.tag(['hello'], 'world')

const vue = new Vue({
  container: {
    $hey: 'hello',
    $hey1: 'hello'
  },
  methods: {
    hello() {
      console.log(this.$container.tagged('world'))
    }
  }
})

// console.log(vue.$container)
console.log(vue.$hey)
vue.hello()
