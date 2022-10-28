import axios from '../axios'

export const getUserList = (params) => {
  return new Promise((resolve, reject) => {
    axios
      .get('/user', { params })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/user/${id}`)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const createUser = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post('/user/create', data)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const updateUser = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`/user/${data.id}`, data)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const deleteUse = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/user/${id}`)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
