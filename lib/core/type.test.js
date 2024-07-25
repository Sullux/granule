const {
  ConstructorNotAllowedError,
  Factory,
  Constructor,
  boxed,
  Box,
  Type,
} = require('./type')

describe('Box', () => {
  it('should box', () => {
    const n = Box(40)
    expect(n + 2).toBe(42)
  })
})
