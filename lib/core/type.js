/* eslint-disable no-new-func */
const { isPrimitive } = require('./compare')

function ConstructorNotAllowedError (name) {
  const self = new.target
    ? this
    : Object.setPrototypeOf({}, ConstructorNotAllowedError.prototype)
  self.code = 'ERR_CONSTRUCTOR_NOT_ALLOWED'
  self.message = `${name} cannot be instantiated with \`new\``
  return self
}
ConstructorNotAllowedError.prototype = Object.create(Error.prototype)

const factoryTemplate = `${function __name__ (...args) {
  if (new.target) {
    throw ConstructorNotAllowedError('__name__')
  }
  const instance = __name__.construct(...args)
  return instance
}.toString()}; return __name__`

const Factory = (name, construct) => {
  // todo: validate name
  const factoryString = factoryTemplate.replace(/__name__/g, name)
  const factory = (new Function(factoryString))()
  factory.construct = construct
  Factory.instances.add(factory)
  return factory
}
Factory.instances = new WeakSet()
Object.defineProperty(Factory, Symbol.hasInstance, {
  value: (v) => Factory.instances.has(v),
})

const constructorTemplate = `${function __name__ (...args) {
  const self = new.target
    ? this
    : Object.setPrototypeOf({}, __name__.prototype)
  __name__.init(self, ...args)
  return self
}.toString()}; return __name__`

const Constructor = (name, init, extend) => {
  // todo: validate name
  const constructorString = constructorTemplate.replace(/__name__/g, name)
  const constructor = (new Function(constructorString))()
  constructor.init = init
  if (extend) {
    // todo: validate extend
    constructor.prototype = Object.create(extend.prototype)
  }
  Constructor.instances.add(constructor)
  return constructor
}
Constructor.instances = new WeakSet()
Object.defineProperty(Constructor, Symbol.hasInstance, {
  value: (v) => Constructor.instances.has(v),
})

const unbox = (value) =>
  value === null
    ? () => null
    : (typeof value) === 'number'
        ? (hint) => hint === 'string' ? String(value) : value
        : (typeof value) === 'string'
            ? (hint) => hint === 'number' ? Number(value) : value
            : () => value
const boxed = (Symbol.granule || (Symbol.granule = {})).boxed = Symbol('granule.boxed')
const Box = Factory(
  'Box',
  (value) => isPrimitive(value)
    ? { [boxed]: value, [Symbol.toPrimitive]: unbox(value) }
    : value,
)

module.exports = {
  ConstructorNotAllowedError,
  Factory,
  Constructor,
  boxed,
  Box,
}
