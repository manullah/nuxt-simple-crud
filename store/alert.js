export const state = () => ({
  open: false,
  text: '',
  type: '',
})

// export const getters = {
//   getCounter(state) {
//     return state.counter
//   },
// }

export const mutations = {
  triggerAlert(state) {
    state.open = true
  },
  setText(state, data) {
    state.text = data
  },
  setType(state, data) {
    state.type = data
  },
}

export const actions = {
  setAlert({ commit }, payload) {
    commit('triggerAlert')
    commit('setText', payload.text)
    commit('setType', payload.type)
  },
}
