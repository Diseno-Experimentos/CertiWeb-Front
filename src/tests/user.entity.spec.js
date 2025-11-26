import { User } from '../certifications/model/user.entity.js'

describe('User entity', () => {
  it('has default empty properties', () => {
    const u = new User()
    expect(u.name).toBe('')
    expect(u.email).toBe('')
    expect(u.password).toBe('')
    expect(u.plan).toBe('')
  })
})
