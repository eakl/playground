'use strict'

const P = require('bluebird')

// 'yield' stops the execution of the generator.
// It can be resumed only from the outside by calling .next().
// By wrapping a generator into a Bluebird coroutine, control is returned back
// to the generator when the yielded promise settles.
// Promise.coroutine simply makes 'yield' statement wait for the promise to
// resolve and the actual yield expression will be evaluated to the resolved value.

const run = P.coroutine(function* generator() {
  // Stop the execution of the function
  // and yield a promise.
  yield getData()
  console.log('First')
})

function getData () {
  // The yielded function must return a Promise
  return new P((resolve) => {
    setTimeout(() => {
      // The Promise resolves after 2s
      resolve()
    }, 2000)
  })
}

// P.coroutine() returns a function.
// The function is called and the control will be returned back to the generator
// when the promise resolves
run()

// Call is non-blocking, 'Second' is fired first
console.log('Second')
