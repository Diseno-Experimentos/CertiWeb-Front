import MockAdapter from 'axios-mock-adapter'
import axios from '../config/axios.config.js'
import { carService } from '../certifications/services/car.service.js'
import { reservationService } from '../certifications/services/reservation.service.js'
import { userService } from '../certifications/services/user.service.js'
import { ImgbbApiService } from '../shared/services/imgbb-api.service.js'

describe('carService', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
    localStorage.clear()
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAllCars returns array when API returns array', async () => {
    const data = [{ id: 1, brand: 'Toyota' }]
    mock.onGet('/cars').reply(200, data)

    const res = await carService.getAllCars()
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(1)
    expect(res[0].brand).toBe('Toyota')
  })

  it('createCar returns created data on success', async () => {
    const payload = { brand: 'Ford', model: 'Focus' }
    const created = { id: 2, ...payload }
    mock.onPost('/cars').reply(201, created)

    const res = await carService.createCar(payload)
    expect(res.id).toBe(2)
    expect(res.brand).toBe('Ford')
  })

  it('createCar throws friendly message on network error', async () => {
    mock.onPost('/cars').networkError()

    await expect(carService.createCar({})).rejects.toThrow(/Could not connect to server|Network Error|Error configuring request/i)
  })

  it('createCar throws server message when response contains message', async () => {
    mock.onPost('/cars').reply(400, { message: 'Bad request' })
    await expect(carService.createCar({})).rejects.toThrow(/Bad request/)
  })

  it('getAllCars handles error and returns empty array', async () => {
    mock.onGet('/cars').reply(500)
    const res = await carService.getAllCars()
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(0)
  })

  it('reservationService basic flows', async () => {
    mock.onPost('/reservations').reply(201, { id: 3 })
    mock.onGet('/reservations').reply(200, [{ id: 1 }])
    mock.onGet('/reservations/9').reply(200, { id: 9 })
    mock.onPut('/reservations/7').reply(200, { id: 7, status: 'ok' })

    const c = await reservationService.createReservation({ userId: 1 })
    expect(c.id).toBe(3)
    const all = await reservationService.getAllReservations()
    expect(Array.isArray(all)).toBe(true)
    const one = await reservationService.getReservationById(9)
    expect(one.id).toBe(9)
    const up = await reservationService.updateReservation(7, { status: 'ok' })
    expect(up.status).toBe('ok')
  })

  it('userService getCurrentUser branches', async () => {
    localStorage.setItem('currentSession', JSON.stringify({ userId: 42 }))
    mock.onGet('/users/42').reply(200, { id: 42, name: 'X' })
    const u = await userService.getCurrentUser()
    expect(u.id).toBe(42)
  })

  it('userService no session throws', async () => {
    localStorage.clear()
    await expect(userService.getCurrentUser()).rejects.toThrow(/No active session found/)
  })

  it('userService returns cached session if API fails', async () => {
    localStorage.setItem('currentSession', JSON.stringify({ userId: 3, name: 'S' }))
    mock.onGet('/users/3').reply(500)
    const res = await userService.getCurrentUser()
    expect(res.name).toBe('S')
  })

  it('userService logout clears storage', async () => {
    localStorage.setItem('currentSession', JSON.stringify({ userId: 100 }))
    await userService.logout()
    expect(localStorage.getItem('currentSession')).toBeNull()
  })

  it('ImgbbApiService upload and failure', async () => {
    const svc = new ImgbbApiService()
    const fake = { data: { url: 'http://a' } }
    global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve(fake) })
    const r = await svc.uploadImage(new Blob(['x']))
    expect(r.url).toBe('http://a')
    global.fetch = () => Promise.resolve({ ok: false, statusText: 'ERR' })
    await expect(svc.uploadImage(new Blob(['x']))).rejects.toThrow(/Error al subir imagen/i)
  })
})
