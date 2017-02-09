'use strict'

const async = require('asyncawait/async')
const await = require('asyncawait/await')
const P = require('bluebird')


const asyncFunc = async (function generator() {
  await (getData())
  console.log('First')
})

function getData () {
  return new P((resolve) => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}

asyncFunc()

console.log('Second')
