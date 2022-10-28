import Axios from 'axios'

const axios = Axios.create({
  baseURL: process.env.apiUrl,
})

axios.interceptors.request.use((config) => {
  const newConfig = { ...config }

  // Set headers
  newConfig.headers['app-id'] = process.env.apiToken

  return newConfig
})

export default axios
