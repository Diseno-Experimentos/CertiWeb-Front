import { mount } from '@vue/test-utils'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock router and i18n
vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k) => k }) }))
// Stub language switcher to avoid mounting the real component (uses vue-i18n runtime)
vi.mock('../../public/components/language-switcher/language-switcher.component.vue', () => ({ default: { template: '<div/>' } }))

// We'll mock the authService per-test using vi.doMock and dynamic import to avoid hoisting issues.

// Simple stubs for PrimeVue components used in login
const PvInputText = { props: ['modelValue'], emits: ['update:modelValue'], template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' }
const PvPassword = PvInputText
const PvButton = {
  props: ['label', 'icon', 'class', 'ariaLabel', 'type'],
  template: `<button :type="type || 'button'">{{ label }}</button>`
}
const PvMessage = { props: ['severity'], template: '<div><slot/></div>' }
const PvCheckbox = { props: ['modelValue'], emits: ['update:modelValue'], template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />' }
const PvCard = { template: '<div><slot name="header"/><slot name="content"/></div>' }

describe('Login integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('successful user login stores session and sets successMessage', async () => {
    vi.resetModules()
    const mockLogin = vi.fn().mockResolvedValue({ success: true, user: { id: 55, email: 'u@u.com', name: 'U' } })
    const mockLoginAdmin = vi.fn()
    vi.doMock('../../public/services/auth.service', () => ({ authService: { login: mockLogin, loginAdmin: mockLoginAdmin } }))

    const { default: LoginPage } = await import('../../public/pages/login/login.component.vue')

    const wrapper = mount(LoginPage, {
      global: {
        components: {
          'pv-inputText': PvInputText,
          'pv-password': PvPassword,
          'pv-button': PvButton,
          'pv-message': PvMessage,
          'pv-checkbox': PvCheckbox,
          'pv-card': PvCard,
          LanguageSwitcherComponent: { template: '<div/>' }
        }
      }
    })

    await wrapper.find('input[id="email"]').setValue('u@u.com')
    await wrapper.find('input[id="password"]').setValue('pwd')

    await wrapper.find('form').trigger('submit.prevent')
    await new Promise(r => setTimeout(r, 0))

    expect(mockLogin).toHaveBeenCalled()
    // currentSession should be stored
    const session = JSON.parse(localStorage.getItem('currentSession') || '{}')
    expect(session.userId).toBe(55)
    expect(wrapper.vm.successMessage).toBe('¡Inicio de sesión exitoso! Redirigiendo...')
  })

  it('failed credentials set errorMessage after both login attempts', async () => {
    vi.resetModules()
    const mockLogin = vi.fn().mockResolvedValue({ success: false })
    const mockLoginAdmin = vi.fn().mockResolvedValue({ success: false })
    vi.doMock('../../public/services/auth.service', () => ({ authService: { login: mockLogin, loginAdmin: mockLoginAdmin } }))

    const { default: LoginPage } = await import('../../public/pages/login/login.component.vue')

    const wrapper = mount(LoginPage, {
      global: {
        components: {
          'pv-inputText': PvInputText,
          'pv-password': PvPassword,
          'pv-button': PvButton,
          'pv-message': PvMessage,
          'pv-checkbox': PvCheckbox,
          'pv-card': PvCard,
          LanguageSwitcherComponent: { template: '<div/>' }
        }
      }
    })

    await wrapper.find('input[id="email"]').setValue('bad@x.com')
    await wrapper.find('input[id="password"]').setValue('no')

    await wrapper.find('form').trigger('submit.prevent')
    await new Promise(r => setTimeout(r, 0))

    expect(mockLogin).toHaveBeenCalled()
    expect(mockLoginAdmin).toHaveBeenCalled()
    expect(wrapper.vm.errorMessage).toContain('Credenciales incorrectas')
  })

  it('connection error sets connection message', async () => {
    vi.resetModules()
    const mockLogin = vi.fn().mockRejectedValue(new Error('Network'))
    const mockLoginAdmin = vi.fn()
    vi.doMock('../../public/services/auth.service', () => ({ authService: { login: mockLogin, loginAdmin: mockLoginAdmin } }))

    const { default: LoginPage } = await import('../../public/pages/login/login.component.vue')

    const wrapper = mount(LoginPage, {
      global: {
        components: {
          'pv-inputText': PvInputText,
          'pv-password': PvPassword,
          'pv-button': PvButton,
          'pv-message': PvMessage,
          'pv-checkbox': PvCheckbox,
          'pv-card': PvCard,
          LanguageSwitcherComponent: { template: '<div/>' }
        }
      }
    })

    await wrapper.find('input[id="email"]').setValue('n@n.com')
    await wrapper.find('input[id="password"]').setValue('p')

    await wrapper.find('form').trigger('submit.prevent')
    await new Promise(r => setTimeout(r, 0))

    expect(wrapper.vm.errorMessage).toBe('Error de conexión. Por favor, intenta de nuevo.')
  })
})
