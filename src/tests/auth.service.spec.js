import MockAdapter from 'axios-mock-adapter'
import axios from '../config/axios.config.js'
import { authService } from '../public/services/auth.service.js'

describe('authService', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
    localStorage.clear()
  })

  afterEach(() => {
    mock.restore()
  })

  it('login stores token and user on success', async () => {
    const payload = { id: 1, name: 'Juan', email: 'juan@example.com', plan: 'Premium', token: 'abc123' }
    mock.onPost('/auth/login').reply(200, payload)

    const res = await authService.login('juan@example.com', 'password')

    expect(res.success).toBe(true)
    expect(localStorage.getItem('authToken')).toBe('abc123')
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    expect(currentUser.email).toBe('juan@example.com')
    expect(authService.isAuthenticated()).toBe(true)
  })

  it('login returns failure on 401', async () => {
    mock.onPost('/auth/login').reply(401, { message: 'Invalid credentials' })

    const res = await authService.login('juan@example.com', 'wrong')

    expect(res.success).toBe(false)
    expect(res.message).toBe('Invalid credentials')
    expect(authService.isAuthenticated()).toBe(false)
  })

  it('logout clears storage', () => {
    localStorage.setItem('authToken', 'x')
    localStorage.setItem('currentUser', JSON.stringify({ id: 1 }))

    authService.logout()

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('currentUser')).toBeNull()
  })

  it('register stores token and user on success', async () => {
    const payload = { id: 11, name: 'R', email: 'r@x', plan: 'free', token: 't1' }
    mock.onPost('/auth').reply(201, payload)
    const out = await authService.register({ name: 'R' })
    expect(out.success).toBe(true)
    expect(localStorage.getItem('authToken')).toBe('t1')
  })

  it('loginAdmin stores admin when role is admin', async () => {
    const payload = { id: 2, name: 'A', email: 'a@', role: 'admin', token: 'adm' }
    mock.onPost('/admin_user/login').reply(200, payload)
    const out = await authService.loginAdmin('a','b')
    expect(out.success).toBe(true)
    expect(out.isAdmin).toBe(true)
    expect(localStorage.getItem('adminToken')).not.toBeNull()
  })
})
