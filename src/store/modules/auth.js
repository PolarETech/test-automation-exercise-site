export default {
  namespaced: true,
  state: {
    token: ''
  },
  getters: {
    isLogin: state => !!state.token
  }
}
