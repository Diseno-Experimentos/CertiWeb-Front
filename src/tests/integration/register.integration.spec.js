import { mount } from '@vue/test-utils'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mocks for router and i18n
vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
// Stub language switcher to avoid mounting the real component (uses vue-i18n runtime)
vi.mock('../../public/components/language-switcher/language-switcher.component.vue', () => ({ default: { template: '<div/>' } }))
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k) => k }) }))

// We'll mock authService per-test using vi.doMock and dynamic import to avoid vi.mock hoisting issues

// Stubs for PrimeVue components used inside the register component
const PvInputText = {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
}
const PvPassword = PvInputText
const PvButton = {
  props: ['label', 'icon', 'class', 'ariaLabel', 'type'],
  template: `<button :type="type || 'button'">{{ label }}</button>`
};
const PvMessage = { props: ['severity'], template: '<div><slot/></div>' }
const PvSteps = { props: ['model', 'activeIndex'], template: '<div />' }
const PvCard = { template: '<div><slot name="header"/><slot name="content"/></div>' }

// Import component using relative path (avoid alias issues in test resolution)
describe('Register integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('successful free-plan registration updates localStorage and shows success', async () => {
    vi.resetModules()
    const mockRegister = vi.fn().mockResolvedValue({ success: true, user: { id: 123 } })
    vi.doMock('../../public/services/auth.service', () => ({ authService: { register: mockRegister } }))

    const { default: RegisterPage } = await import('../../public/pages/register/register.component.vue')

    const wrapper = mount(RegisterPage, {
      global: {
        components: {
          'pv-inputText': PvInputText,
          'pv-password': PvPassword,
          'pv-button': PvButton,
          'pv-message': PvMessage,
          'pv-steps': PvSteps,
          'pv-card': PvCard,
          LanguageSwitcherComponent: { template: '<div/>' }
        }
      }
    })

    // fill personal info
    await wrapper.find('input[id="name"]').setValue('Test User')
    await wrapper.find('input[id="email"]').setValue('a@a.com')
    await wrapper.find('input[id="password"]').setValue('pwd')

    // go to next step (validateStep0)
    await wrapper.vm.nextStep()

    // select Free plan
    wrapper.vm.selectedPlan = 'Free'
    await wrapper.vm.nextStep()

    // submit registration (should call authService.register)
    await wrapper.find('form').trigger('submit.prevent')
    await new Promise(r => setTimeout(r, 0))

    expect(mockRegister).toHaveBeenCalled()
    // successMessage should be set
    expect(wrapper.vm.successMessage).toBe('registerPage.success')
    // localStorage should contain the new user
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    expect(users.length).toBe(1)
    expect(users[0].email).toBe('a@a.com')
  })

  it('registration failure shows error message', async () => {
    vi.resetModules()
    const mockRegister = vi.fn().mockResolvedValue({ success: false, message: 'exists' })
    vi.doMock('../../public/services/auth.service', () => ({ authService: { register: mockRegister } }))

    const { default: RegisterPage } = await import('../../public/pages/register/register.component.vue')

    const wrapper = mount(RegisterPage, {
      global: {
        components: {
          'pv-inputText': PvInputText,
          'pv-password': PvPassword,
          'pv-button': PvButton,
          'pv-message': PvMessage,
          'pv-steps': PvSteps,
          'pv-card': PvCard,
          LanguageSwitcherComponent: { template: '<div/>' }
        }
      }
    })

    // populate and advance steps
    await wrapper.find('input[id="name"]').setValue('X')
    await wrapper.find('input[id="email"]').setValue('x@x.com')
    await wrapper.find('input[id="password"]').setValue('p')
    await wrapper.vm.nextStep()
    wrapper.vm.selectedPlan = 'Free'
    await wrapper.vm.nextStep()

    await wrapper.find('form').trigger('submit.prevent')
    await new Promise(r => setTimeout(r, 0))

    expect(mockRegister).toHaveBeenCalled()
    expect(wrapper.vm.errorMessage).toBe('exists')
  })
})
