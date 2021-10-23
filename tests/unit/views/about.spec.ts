import { mount, VueWrapper } from '@vue/test-utils'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import About from '@/views/About.vue'

const head = createHead()

const spyUnfocus = jest.spyOn(About.methods as Record<string, unknown>, 'unfocus' as never)

describe('About.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof About>>

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  beforeEach(() => {
    wrapper = mount(About, {
      attachTo: document.body,
      global: {
        plugins: [
          head,
          PrimeVue
        ]
      }
    })
  })

  describe('display control', () => {
    test('show "About" vue', () => {
      expect(wrapper.findComponent(About).exists()).toBeTruthy()
      expect(wrapper.vm.unfocus).toBeTruthy()
    })

    test('show elements', () => {
      expect(wrapper.find('.p-tabview-nav').exists()).toBeTruthy()
      expect(wrapper.find('.p-tabview-nav-link').exists()).toBeTruthy()
      expect(wrapper.find('.p-tabview-panels').exists()).toBeTruthy()
      expect(wrapper.find('.content').exists()).toBeTruthy()
    })
  })

  describe('focus control', () => {
    test('unfocus tabview nav link', async () => {
      const el = wrapper.find('.p-tabview-nav-link')
      ;(el.element as HTMLAnchorElement).focus()
      expect((document.activeElement as HTMLElement).className).toEqual('p-tabview-nav-link')

      await el.trigger('click')
      expect(spyUnfocus).toBeCalled()
      expect((document.activeElement as HTMLElement).className).not.toEqual('p-tabview-nav-link')
    })
  })
})
