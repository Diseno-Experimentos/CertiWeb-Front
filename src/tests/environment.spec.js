import { environment } from '../environments/environment.js'

describe('environment constants', () => {
  it('exports expected keys', () => {
    expect(environment).toBeDefined()
    expect(typeof environment.production).toBe('boolean')
    expect(typeof environment.serverBasePath).toBe('string')
    expect(environment.serverBasePath.length).toBeGreaterThan(0)
  })
})
