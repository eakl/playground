'use strict'

const P = require('bluebird')
const Util = require('util')
const WordNet = require('wordnet-magic')
const W = WordNet(null, true)

// const dbPath = '../node_modules/wordnet-magic/data/sqlite-31.db'

run()

function run () {
  (P.coroutine(function* () {
    const types = yield type('claims')
    const words = yield wordToSynset('claims')
    const antonyms = yield wordToAntonym('blacked')
    const synset = yield getSynset('dog', 'n', 1)

    console.log(types)
    console.log(words)
    console.log(antonyms)
    console.log(synset)
  }))()
}

function type (lemma) {
  return (P.coroutine(function* () {
    try {
      if (!lemma) {
        throw new Error()
      }

      return {
        isNoun: yield W.isNoun(lemma),
        isVerb: yield W.isVerb(lemma),
        isAdjective: yield W.isAdjective(lemma),
        isAdverb: yield W.isAdverb(lemma)
      }
    }
    catch(e) {
      throw e
    }
  }))()
}

function wordToSynset (lemma, pos = null) {
  return (P.coroutine(function* () {
    try {
      if (!lemma) {
        throw new Error()
      }

      const morphems = yield W.morphy(lemma)

      const morphem = morphems.reduce((acc, x) => {
        acc.lemma.push(x.lemma)
        acc.pos.push(x.part_of_speech)
        return acc
      }, {
        lemma: [ ],
        pos: [ ]
      })

      const base = morphems.reduce((acc, x) => {
        if (acc.pos.indexOf(x.part_of_speech) === -1) {
          acc.lemmas.push(x.lemma)
          acc.pos.push(x.part_of_speech)
        }
        return acc
      }, { lemmas: [ ], pos: [ ] })

      base.lemmas = base.lemmas.reduce((acc, x) => {
        if (acc.indexOf(x) === -1) {
          acc.push(x)
        }
        return acc
      }, [ ])

      const word = new W.Word(base.lemmas[0], pos)
      const synsets = yield word.getSynsets()

      return synsets.map(x => ({
        synsetId: x.synsetid,
        lemmas: x.words.map(x => x.lemma),
        PoS: x.lexdomain.split('.')[0],
        domain: x.lexdomain.split('.')[1],
        definition: x.definition
      }))
    }
    catch(e) {
      throw e
    }
  }))()
}

function wordToAntonym (lemma, pos = null) {
  return (P.coroutine(function* () {
    try {
      if (!lemma) {
        throw new Error()
      }

      const morphems = yield W.morphy(lemma, pos)

      const base = morphems.reduce((acc, x) => {
        if (acc.pos.indexOf(x.part_of_speech) === -1) {
          acc.lemmas.push(x.lemma)
          acc.pos.push(x.part_of_speech)
        }
        return acc
      }, { lemmas: [ ], pos: [ ] })

      base.lemmas = base.lemmas.reduce((acc, x) => {
        if (acc.indexOf(x) === -1) {
          acc.push(x)
        }
        return acc
      }, [ ])

      const word = new W.Word(base.lemmas[0], pos)
      const antonym = yield word.getAntonyms()

      return antonym.reduce((acc, x) => {
        if (acc.lemmas.indexOf(x.lemma) === -1) {
          acc.lemmas.push(x.lemma)
        }

        if (acc.antonyms.indexOf(x.antonym) === -1) {
          acc.antonyms.push(x.antonym)
        }

        acc.synsets.push(x.synset)

        return acc
      }, {
        lemmas: [ ],
        antonyms: [ ],
        synsets: [ ]
      })
    }
    catch(e) {
      throw e
    }
  }))()
}

function getSynset (lemma, pos, n) {
  return (P.coroutine(function* () {
    try {
      if (!lemma) {
        throw new Error()
      }
      const query = `${lemma}.${pos}.${n}`
      const synset = yield W.fetchSynset(query)
      const lemmas = yield synset.getLemmas()
      const hypernyms = yield synset.getHypernymsTree()
      return Util.inspect(hypernyms, null, 5)
    }
    catch(e) {
      throw e
    }
  }))()
}
