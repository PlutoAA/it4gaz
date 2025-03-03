import axios from 'axios'

const API_BASE = 'http://26.148.34.69:8000'

interface ExtremeValues {
  min: number
  max: number
}

export const getSensorDataByDate = async (
  start: string, 
  end: string, 
  sensorId?: string
) => {
  const response = await axios.get(`${API_BASE}/data/by-date`, {
    params: { 
      start_date: start, 
      end_date: end,
      sensor_id: sensorId 
    }
  })
  return response.data
}

export const getSensorDataByPage = async (
  page: number,
  limit: number,
  params?: {
    sensor_id?: string
    start_date?: string
    end_date?: string
  }
) => {
  const response = await axios.get(`${API_BASE}/data/by-page`, {
    params: {
      page,
      limit,
      ...params
    }
  })
  return {
    data: response.data,
    totalPages: Math.ceil(response.headers['x-total-count'] / limit)
  }
}

export const getExtremeValues = async (
  params: {
    sensor_id?: string
    start_date?: string
    end_date?: string
  }
): Promise<ExtremeValues> => {
  const response = await axios.get(`${API_BASE}/data/extremes`, { params })
  return response.data
}

export const getAvailableSensors = async () => {
  const response = await axios.get(`${API_BASE}/data/sensors`)
  return response.data.sensors
}