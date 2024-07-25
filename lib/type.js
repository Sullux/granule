const { context } = require('./core/context')
const { Constructor } = require('./core/type')
const { isArray, isObject, typeName } = require('./core/compare')

const symbol = Symbol.granule || (Symbol.granule = {})
const missingArg = symbol.missingArg ||
  (symbol.missingArg = Symbol.for('granule.missingArg'))

const InvalidRecordSpecificationError = Constructor(
  'InvalidRecordSpecificationError',
  (self, name, spec) => {
    self.code = 'ERR_INVALID_RECORD_SPECIFICATION'
    self.message =
    `defining record '${name}': expected specification of type Object; got ${typeName(spec)}`
    self.spec = spec
  },
  Error,
)

const Type = Constructor('Type', (type, name, spec) => {
  const isAnonymous = (spec === missingArg)
  if (isAnonymous) {
    spec = name
    name = '<anonymous>'
  }
  context.enter(
    Symbol(name),
    () => {
      // todo
    },
  )
  context.push({ [name]: type })
})

const Record = Constructor(
  'Record',
  (record, name, spec = missingArg) => {
    if (spec === missingArg) {
      spec = name
      name = '<anonymous>'
    }
    if (!isObject(spec)) {
      throw new InvalidRecordSpecificationError(name, spec)
    }
    context.enter(
      Symbol(name),
      () => {
        Object.entries(spec).forEach(([k, v]) => {
          record[k] = (v instanceof Type)
            ? v
            : isObject(v)
              ? Record(k, v)
              : isArray(v)
                ? Tuple(k, v)
                : Type(k, v)
        })
      },
    )
    context.push({ [name]: record })
  },
  Type,
)

const Tuple = Constructor(
  'Tuple',
  (tuple, name, spec) => {
  // todo
  },
  Type,
)

module.exports = {
  Record,
  InvalidRecordSpecificationError,
  Type,
}
