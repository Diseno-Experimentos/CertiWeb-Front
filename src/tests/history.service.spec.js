import MockAdapter from 'axios-mock-adapter'
import axios from '../config/axios.config.js'
import { historyService } from '../public/services/history.service.js'

describe('historyService', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  it('returns empty array when no userId provided', async () => {
    const res = await historyService.getReservationsByUserId(null)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(0)
  })

  it('filters reservations by userId', async () => {
    const data = [
      { id: 1, userId: 1 },
      { id: 2, userId: 2 },
      { id: 3, userId: '1' }
    ]
    // match any reservations call
    mock.onGet(/\/reservations/).reply(200, data)

    const res = await historyService.getReservationsByUserId(1)
    expect(Array.isArray(res)).toBe(true)
    // should only contain items with userId 1 (loose equality)
    expect(res.length).toBe(2)
    expect(res.find(r => r.id === 1)).toBeDefined()
    expect(res.find(r => r.id === 3)).toBeDefined()
  })

  it('throws when API request fails', async () => {
    mock.onGet(/\/reservations/).reply(500)
    await expect(historyService.getReservationsByUserId(99)).rejects.toBeDefined()
  })
})
