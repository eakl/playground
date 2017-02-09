'use strict'

const Natural = require('natural')
// const Nlp = require('nlp_compromise')


// Installation
// Tokenizers
// String Distance
// Stemmers
// Classifiers
// Phonetics
// Inflectors
// N-Grams
// tf-idf
// Tries
// EdgeWeightedDigraph
// ShortestPathTree
// LongestPathTree
// WordNet
// Spellcheck
// POS Tagger
// Acknowledgements/references
// Development
// License


const data = [
  'Prepare content and prepare launch of new features coming Monday',
  'Check on Intercom integration if all is there what we need (display name missing, paid plans)',
  'Provide Dashboard Data on weekly basis to key people so that they can\'t mis-understand data '
]
/*
* Tokenization
*/

{
  const tokenizer = new Natural.TreebankWordTokenizer()

  const token = tokenizer.tokenize(data[2])
  console.log(token)
}

/*
* String Distance
*/

{
  const perfect = Natural.JaroWinklerDistance('perfect', 'perfect')
  const high = Natural.JaroWinklerDistance('melt', 'meet')
  const low = Natural.JaroWinklerDistance('archive', 'olive')
  const different = Natural.JaroWinklerDistance('exact', 'different')
  const mistake = Natural.JaroWinklerDistance('mistake', 'mitsake')

  console.log(`
    perfect -- perfect...: ${perfect}
    melt -- meet.........: ${high}
    archive -- olive.....: ${low}
    exact -- different...: ${different}
    mistake -- mitsake...: ${mistake}
    `)
}

/*
* Stemmers
*/

{
  const porterStem = Natural.PorterStemmer.stem('cried')
  const lancasterStem = Natural.LancasterStemmer.stem('cried')

  const tokenizer = new Natural.TreebankWordTokenizer()
  const stem = tokenizer
  .tokenize(data[2])
  .map(x => {
    // return Natural.PorterStemmer.stem(x)
    return Natural.LancasterStemmer.stem(x)
  })
  console.log(stem)

  console.log(`
    cry: ${porterStem}
    cry: ${lancasterStem}
    `)
}

/*
* Classifiers
*/

{
  const bayes = new Natural.BayesClassifier()  // Instanciate

  bayes.addDocument(data[0], 'development') // Add data and label
  bayes.addDocument(data[1], 'monitoring')
  bayes.addDocument(data[2], 'analytics')
  bayes.train() // Train

  console.log('Classify:', bayes.classify('I\'m working with data')) // Classify
  console.log('Classify:', bayes.classify('Tomorrow we will launch a new feature'))
  // Get model weight
  console.log('Get Classification:', bayes.getClassifications('Tomorrow we will launch a new feature'))
  // bayes.save('./bayes_classifer.json'[, callback (classifier)]) // Save the classifier
  // Natural.BayesClassifier.load('bayes_classifier.json', null[, callback (classifier)]) // load the classifier

  /**************/

  const logistic = new Natural.LogisticRegressionClassifier()

  logistic.addDocument(data[0], 'development')
  logistic.addDocument(data[1], 'monitoring')
  logistic.addDocument(data[2], 'analytics')
  logistic.train()

  console.log('Classify:', logistic.classify('I\'m working with data'))
  console.log('Classify:', logistic.classify('Tomorrow we will launch a new feature'))
  console.log('Get Classification:', logistic.getClassifications('Tomorrow we will launch a new feature'))
  // logistic.save('./logistic_classifer.json') // Save model weight
  // Natural.BayesClassifier.load('logistic_classifier.json', null[, callback (classifier)]) // load the classifier
}

/*
* Phonetics
*/

{
  const meta = Natural.Metaphone

  const compare = meta.compare('olives', 'au leave z')
  const phonetic1 = meta.process('olives')
  const phonetic2 = meta.process('auleavez')
  console.log('Metaphone Same phonetic?:', compare)
  console.log('Metaphone Raw phonetic:', phonetic1)
  console.log('Metaphone Raw phonetic:', phonetic2)

  console.log('Metaphone Phonetic distance:', Natural.JaroWinklerDistance(phonetic1, phonetic2))
}

/****************************/

{
  const dmeta = Natural.DoubleMetaphone

  const compare = dmeta.compare('matrix', 'mattrics')
  const phonetic1 = dmeta.process('matrix')
  const phonetic2 = dmeta.process('mattrics')
  console.log('DoubleMetaphone Same phonetic?:', compare)
  console.log('DoubleMetaphone Raw phonetic:', phonetic1)
  console.log('DoubleMetaphone Raw phonetic:', phonetic2)

  console.log('DoubleMetaphone Phonetic distance:', Natural.JaroWinklerDistance(phonetic1[0], phonetic2[0]))
}

/****************************/

{
  const sound = Natural.SoundEx

  const compare = sound.compare('matrix', 'mattrics')
  const phonetic1 = sound.process('matrix')
  const phonetic2 = sound.process('mattrics')
  console.log('SoundEx Same phonetic?:', compare)
  console.log('SoundEx Raw phonetic:', phonetic1)
  console.log('SoundEx Raw phonetic:', phonetic2)

  console.log('DoubleMetaphone Phonetic distance:', Natural.JaroWinklerDistance(phonetic1, phonetic2))
}

/*
* Inflectors
*/

{
  const noun = new Natural.NounInflector()

  const plurNoun = noun.pluralize('battle')
  const singNoun = noun.singularize('pens')
  console.log('Plurial:', plurNoun)
  console.log('Singular:', singNoun)

}

/*
* N-Grams
*/

{
  const ngram = Natural.NGrams

  const bi1 = ngram.bigrams('I\'m learning programming in Javasdcript')
  console.log('Bi-gram:', bi1)

  const tri1 = ngram.trigrams('I\'m learning programming in Javasdcript')
  console.log('Tri-gram:', tri1)

  const n1 = ngram.ngrams('I\'m learning programming in Javascript', 5)
  console.log('N-gram:', n1)
}

/*
* TF-IDF
*/

{
  const tfidf = new Natural.TfIdf()

  tfidf.addDocument('this document is about node.')
  tfidf.addDocument('this document is about ruby.')
  tfidf.addDocument('this document is about ruby and node.')
  tfidf.addDocument('this document is about node. it has node examples')

  console.log('---------------- node ----------------')
  tfidf.tfidfs('node', (i, measure) => {
    console.log(`document #${i} is ${measure}`)
  })

  console.log('---------------- ruby ----------------')
  tfidf.tfidfs('ruby', (i, measure) => {
    console.log(`document #${i} is ${measure}`)
  })

  console.log('------------- node & ruby ------------')
  tfidf.tfidfs('node ruby', (i, measure) => {
    console.log(`document #${i} is ${measure}`)
  })

}
