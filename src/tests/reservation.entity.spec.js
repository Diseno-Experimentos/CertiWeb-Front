import { Reservation } from '../certifications/model/reservation.entity.js'

describe('Reservation entity', () => {
  it('has default empty properties', () => {
    const r = new Reservation()
    expect(r.reservationName).toBe('')
    expect(r.imageUrl).toBe('')
    expect(r.brand).toBe('')
    expect(r.model).toBe('')
    expect(r.inspectionDateTime).toBe('')
    expect(r.price).toBe('')
    expect(r.status).toBe('')
    expect(r.userId).toBe('')
  })
})
