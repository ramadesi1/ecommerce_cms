import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:3000'
})

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    access_token: localStorage.getItem('access_token') || '',
    user: {
      id: '',
      name: '',
      email: '',
      role: ''
    },
    products: [],
    categories: []
  },
  mutations: {
    LOGIN (state, data) {
      state.access_token = data.access_token
      state.user = data.user
    },
    LOGOUT (state) {
      state.access_token = ''
      state.user = {
        id: '',
        name: '',
        email: '',
        role: ''
      }
      localStorage.clear()
    },
    SET_PRODUCTS (state, data) {
      state.products = data
    },
    SET_CATEGORIES (state, categories) {
      state.categories = categories
    },
    ADD_CATEGORIES (state, category) {
      state.categories.push(category)
    },
    EDIT_CATEGORIES (state, category) {
      state.categories = [
        ...state.categories.filter(el => {
          return el.id !== category.id
        }),
        category
      ]
    },
    DELETE_CATEGORIES (state, id) {
      state.categories = [...state.categories.filter(el => {
        return el.id !== id
      })]
    },
    ADD_PRODUCT (state, product) {
      state.products.push(product)
    },
    EDIT_PRODUCT (state, product) {
      state.products = [...state.products.filter(el => {
        return el.id !== product.id
      },
      product
      )]
    },
    DELETE_PRODUCT (state, id) {
      state.products = [...state.products.filter(el => {
        return el.id !== id
      })]
    }
  },
  actions: {
    login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        client.post('/login', data)
          .then(({ data }) => {
            console.log(data)
            localStorage.setItem('access_token', data.access_token)
            commit('LOGIN', data)
            resolve('/')
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve) => {
        commit('LOGOUT')
        resolve('/login')
      })
    },
    getProducts ({ commit, state }) {
      client.get('/products', {
        headers: {
          access_token: state.access_token
        }
      })
        .then(({ data }) => {
          console.log(data)
          commit('SET_PRODUCTS', data.products)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCategories ({ commit, state }) {
      client.get('/categories', {
        headers: {
          access_token: state.access_token
        }
      })
        .then(({ data }) => {
          commit('SET_CATEGORIES', data.categories)
        })
        .catch(err => {
          console.log(err)
        })
    },
    addCategories ({ commit, state }, name) {
      const data = {
        name
      }
      client.post('/categories', data, {
        headers: {
          access_token: state.access_token
        }
      })
        .then(({ data }) => {
          console.log(data)
          commit('ADD_CATEGORIES', data.category)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCategory ({ state }, id) {
      return new Promise((resolve, reject) => {
        client.get(`/categories/${id}`, {
          headers: {
            access_token: state.access_token
          }
        })
          .then(({ data }) => {
            resolve(data.category)
          })
          .catch(err => {
            reject(err)
            console.log(err)
          })
      })
    },
    editCategories ({ commit, state }, data) {
      client.put(`/categories/${data.id}`, data, {
        headers: {
          access_token: state.access_token
        }
      })
        .then(({ data }) => {
          commit('EDIT_CATEGORIES', data.category)
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteCategory ({ commit, state }, id) {
      client.delete(`/categories/${id}`, {
        headers: {
          access_token: state.access_token
        }
      })
        .then(({ data }) => {
          commit('DELETE_CATEGORIES', id)
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    addProduct ({ commit, state }, data) {
      client.post('/products', data, {
        headers: {
          access_token: state.access_token
        }
      })
        .then(({ data }) => {
          console.log(data)
          commit('ADD_PRODUCT', data.product)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getProduct ({ state }, id) {
      return new Promise((resolve, reject) => {
        client.get(`/products/${id}`, {
          headers: {
            access_token: state.access_token
          }
        })
          .then(({ data }) => {
            resolve(data.product)
          })
          .catch(err => {
            reject(err)
            console.log(err)
          })
      })
    },
    editProduct ({ commit, state }, data) {
      console.log(data.id)
      client.put(`/products/${data.id}`, data.formData, {
        headers: {
          access_token: state.access_token
        }
      })
        .then(({ data }) => {
          commit('EDIT_PRODUCT', data.product)
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteProduct ({ commit, state }, id) {
      client.delete(`/products/${id}`, {
        headers: {
          access_token: state.access_token
        }
      })
        .then(({ data }) => {
          commit('DELETE_PRODUCT', id)
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  getters: {
    isLogin (state) {
      return !!state.access_token
    }
  }
})

export default store
