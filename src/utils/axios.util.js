import axios from 'axios'

export default (url, failover) => {
  // Create instance
  const axiosApi = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Response interceptor failover for API calls
  axiosApi.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      const config = error.config

      if (!config.retry) {
        config.retry = true
        config.baseURL = failover

        return axiosApi(config)
      }

      return Promise.reject(error)
    }
  )

  return axiosApi
}
