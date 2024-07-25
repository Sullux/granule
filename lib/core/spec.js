/* eslint-disable valid-typeof */
const symbol = Symbol.granule || (Symbol.granule = {})
const specSymbols = symbol.spec || (symbol.spec = {})

const onSpecDefineMeta = (name) => {
  const existing = specSymbols[name]
  if (existing) {
    return existing
  }
  const symbol = specSymbols[name] = Symbol.for(`granule.spec.${name}`)
  return symbol
}

[
  'typeof',
  'constructor',
  'some',
  'every',
].map(onSpecDefineMeta)

const defaultMergeInclusive = () => {} // todo

const defaultMergeExclusive = () => {} // todo

function Spec (
  test,
  mergeInclusive = defaultMergeInclusive,
  mergeExclusive = defaultMergeExclusive,
) {
  const self = new.target
    ? this
    : Object.setPrototypeOf({}, Spec.prototype)
  self.test = test
  self.and = function specAnd (test2) {
    return mergeInclusive(test, test2)
  }
  self.or = function specOr (test2) {
    return mergeExclusive(test, test2)
  }
  return self
}

let analyzers = []

const onSpecAnalyze = (test, analyze) => {
  const analyzer = { test, analyze }
  analyzers = [analyzer, ...analyzers]
  return analyzer
}

Spec.analyze = (value) =>
  analyzers.find(({ test }) => test(value)).analyze(value)

Spec.undefined = Spec((v) => v === undefined)
Spec.null = Spec((v) => v === null)
Spec.type = (type, constructor) => Spec((v) =>
  ((typeof v) === type) && ((!constructor) || v.constructor === constructor))

// catch-all
onSpecAnalyze(() => true, function defaultSpecAnalyzer (value) {
  if (value === undefined) {
    return Spec.undefined
  }
  if (value === null) {
    return Spec.null
  }
  const type = typeof value
  if (type !== 'object') {
    return Spec.type(type)
  }
  return Spec.type(type, value.constructor)
})

onSpecAnalyze(
  (v) => v && ((typeof v) === 'object'),
  function defaultSpecObjectAnalyzer (value) {
    // todo
  },
)

module.exports = {
  onSpecDefineMeta,
  Spec,
  onSpecAnalyze,
}
