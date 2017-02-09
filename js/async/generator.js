'use strict'

function* generator () {
  // 'yield' stops the execution of the generator.
  // It can be resumed only from the outside by calling .next().
  yield getData()
  console.log('First')
}

function getData () {
  setTimeout(() => {
    // Need to call .next() from outside the generator to give it control back
    run.next()
  }, 2000)
}

const run = generator() // Construct the iterator.
run.next() // Iterate over the generator by calling .next() first.

// Call is non-blocking, 'Second' is fired first
console.log('Second')
