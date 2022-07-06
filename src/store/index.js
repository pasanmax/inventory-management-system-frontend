import { createStore } from 'vuex'
import http from '../http-common'

export default createStore({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
  },

  mutations: {
    AUTH_REQUEST(state) {
      state.status = 'loading'
    },

    AUTH_SUCCESS(state, token) {
      state.status = 'success'
      state.token   = token
    },

    AUTH_ERROR(state) {
      state.status = 'error'
    },

    AUTH_LOGOUT(state) {
      state.status = ''
      state.token = ''
    },

  },

  actions: {
    LOGIN({ commit }, user) {

      return new Promise((resolve, reject) => {

        commit('AUTH_REQUEST')
        http.post('auth/login', {

          userName: user.userName,
          password: user.password

        })
          
        .then(response => {

            const token = response.data.token

            localStorage.setItem('token', token)

            http.defaults.headers.common['Authorization'] = "Bearer " + token
            commit('AUTH_SUCCESS', token)

            resolve(response)

        }).catch(err => { 

            commit('AUTH_ERROR')
            localStorage.removeItem('token')

            reject(err)

        })
      })
    },

    // REGISTER({ commit }, user) {

    //   return new Promise((resolve, reject) => {

    //     commit('AUTH_REQUEST')
    //     axios.post('http://laravel-jwt.test/api/register', {

    //       name: user.name,
    //       email: user.email,
    //       password: user.password

    //     })
          
    //     .then(response => {

    //         const token = response.data.token
    //         const user  = response.data.user

    //         localStorage.setItem('token', token)
    //         localStorage.setItem('user', JSON.stringify(user))

    //         axios.defaults.headers.common['Authorization'] = "Bearer" +token
    //         commit('AUTH_SUCCESS', token, user)

    //         resolve(response)

    //     }).catch(err => { 

    //         commit('AUTH_ERROR')
    //         localStorage.removeItem('token')

    //         reject(err)

    //     })
    //   })
    // },

    LOGOUT({ commit }) {
      return new Promise((resolve) => {
        commit('AUTH_LOGOUT')
        localStorage.removeItem('token')
        delete http.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },

  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },

  modules: {
  }
})