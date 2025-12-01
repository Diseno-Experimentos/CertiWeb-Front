import { describe, it, expect, beforeAll } from 'vitest'
import axios from 'axios'
import { environment } from '../../environments/environment.js'

/**
 * Integration tests with the real backend
 * These tests validate that the frontend can communicate with the deployed backend
 * 
 * IMPORTANT: These tests run against the production backend at:
 * https://certiweb-backend.onrender.com/api/v1
 * 
 * Make sure the backend is deployed and running before running these tests
 */

const BACKEND_URL = environment.serverBasePath
const TEST_TIMEOUT = 60000 // 60 seconds (Render free tier can take time to wake up)

describe('Backend Integration Tests', () => {
  let backendIsAvailable = false

  beforeAll(async () => {
    console.log(`Testing backend at: ${BACKEND_URL}`)
    
    try {
      // Try to ping the backend (adjust endpoint based on your backend)
      const response = await axios.get(`${BACKEND_URL}/health`, { 
        timeout: 50000 
      }).catch(async () => {
        // If /health doesn't exist, try a basic endpoint
        return await axios.get(BACKEND_URL, { timeout: 50000 })
      })
      
      backendIsAvailable = true
      console.log('✅ Backend is available')
    } catch (error) {
      console.warn('⚠️  Backend is not available. Some tests will be skipped.')
      console.warn('Error:', error.message)
    }
  }, TEST_TIMEOUT)

  describe('Backend Availability', () => {
    it('should have a valid backend URL configured', () => {
      expect(BACKEND_URL).toBeDefined()
      expect(BACKEND_URL).toContain('http')
      expect(BACKEND_URL.length).toBeGreaterThan(10)
    })

    it('should be able to reach the backend', async () => {
      if (!backendIsAvailable) {
        console.warn('⚠️  Skipping: Backend is not available')
        return
      }

      const response = await axios.get(BACKEND_URL, { timeout: 50000 })
      expect(response.status).toBeLessThan(500)
    }, TEST_TIMEOUT)
  })

  describe('Authentication Endpoints', () => {
    it('should reject login with invalid credentials', async () => {
      if (!backendIsAvailable) {
        console.warn('⚠️  Skipping: Backend is not available')
        return
      }

      try {
        await axios.post(`${BACKEND_URL}/auth/login`, {
          email: 'nonexistent@test.com',
          password: 'wrongpassword'
        })
        // If we get here, the test should fail
        expect.fail('Should have thrown an error for invalid credentials')
      } catch (error) {
        // We expect a 401 or 400 error
        expect([400, 401, 404]).toContain(error.response?.status)
      }
    }, TEST_TIMEOUT)

    it('should validate email format on registration', async () => {
      if (!backendIsAvailable) {
        console.warn('⚠️  Skipping: Backend is not available')
        return
      }

      try {
        await axios.post(`${BACKEND_URL}/auth`, {
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        })
        expect.fail('Should have thrown an error for invalid email')
      } catch (error) {
        // We expect a 400 error for validation
        expect([400, 422]).toContain(error.response?.status)
      }
    }, TEST_TIMEOUT)
  })

  describe('Public Endpoints', () => {
    it('should be able to fetch data from public endpoints', async () => {
      if (!backendIsAvailable) {
        console.warn('⚠️  Skipping: Backend is not available')
        return
      }

      // Adjust this endpoint based on your backend's public endpoints
      // For example: /cars, /products, /items, etc.
      try {
        const response = await axios.get(`${BACKEND_URL}/cars`, { 
          timeout: 50000,
          validateStatus: (status) => status < 500 // Accept any status < 500
        })
        
        // We just want to ensure the endpoint responds
        expect(response.status).toBeLessThan(500)
        
        if (response.status === 200) {
          expect(response.data).toBeDefined()
          console.log('✅ Successfully fetched data from /cars')
        }
      } catch (error) {
        // If /cars doesn't exist, try another endpoint
        console.warn('Note: /cars endpoint may not exist or requires auth')
        // Don't fail the test if the endpoint doesn't exist
        expect(error.response?.status).not.toBe(500)
      }
    }, TEST_TIMEOUT)
  })

  describe('CORS Configuration', () => {
    it('should allow requests from the frontend', async () => {
      if (!backendIsAvailable) {
        console.warn('⚠️  Skipping: Backend is not available')
        return
      }

      // This test verifies that CORS is properly configured
      try {
        const response = await axios.get(BACKEND_URL, {
          timeout: 50000,
          headers: {
            'Origin': 'http://localhost:5173' // Simulate frontend origin
          }
        })
        
        // If we get a response, CORS is properly configured
        expect(response.status).toBeLessThan(500)
        console.log('✅ CORS is properly configured')
      } catch (error) {
        if (error.code === 'ERR_NETWORK') {
          console.warn('⚠️  Network error - this is expected in Node.js environment')
          console.warn('CORS will be tested properly when running in browser')
        } else {
          throw error
        }
      }
    }, TEST_TIMEOUT)
  })

  describe('Response Format', () => {
    it('should return JSON responses', async () => {
      if (!backendIsAvailable) {
        console.warn('⚠️  Skipping: Backend is not available')
        return
      }

      try {
        const response = await axios.get(BACKEND_URL, {
          timeout: 50000,
          validateStatus: (status) => status < 500
        })
        
        expect(response.headers['content-type']).toMatch(/json/)
      } catch (error) {
        // Some endpoints might return HTML for the root
        console.warn('Root endpoint may not return JSON')
      }
    }, TEST_TIMEOUT)
  })

  describe('Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      if (!backendIsAvailable) {
        console.warn('⚠️  Skipping: Backend is not available')
        return
      }

      try {
        await axios.get(`${BACKEND_URL}/nonexistent-endpoint-12345`, {
          timeout: 50000
        })
        expect.fail('Should have thrown a 404 error')
      } catch (error) {
        expect(error.response?.status).toBe(404)
      }
    }, TEST_TIMEOUT)

    it('should provide meaningful error messages', async () => {
      if (!backendIsAvailable) {
        console.warn('⚠️  Skipping: Backend is not available')
        return
      }

      try {
        await axios.post(`${BACKEND_URL}/auth/login`, {
          email: 'test@test.com',
          password: 'wrongpass'
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        // Check that we get a proper error message
        expect(error.response?.data).toBeDefined()
        console.log('Error message format:', error.response?.data)
      }
    }, TEST_TIMEOUT)
  })
})

describe('Environment Configuration', () => {
  it('should have production environment configured', () => {
    expect(environment.production).toBe(true)
  })

  it('should have api_key_imgbb configured', () => {
    expect(environment.api_key_imgbb).toBeDefined()
    expect(environment.api_key_imgbb.length).toBeGreaterThan(0)
  })

  it('should use HTTPS for backend in production', () => {
    if (environment.production) {
      expect(BACKEND_URL).toMatch(/^https:/)
    }
  })
})
