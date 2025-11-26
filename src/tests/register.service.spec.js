import MockAdapter from 'axios-mock-adapter'
import axios from '../config/axios.config.js'
import { registerService } from '../public/services/register.service.js'

describe('registerService', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  it('registerUser returns created user on success', async () => {
    const payload = { name: 'A', email: 'a@a.com', password: 'p' }
    const created = { id: 10, ...payload }
    mock.onPost(/\/users/).reply(201, created)

    const res = await registerService.registerUser(payload)
    expect(res).toEqual(created)
  })

  it('registerUser throws when API fails', async () => {
    mock.onPost(/\/users/).reply(400, { message: 'exists' })
    await expect(registerService.registerUser({})).rejects.toBeDefined()
  })
})
