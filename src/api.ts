import axios from 'axios'
import { formatEndDate, formatStartDate } from './lib/timeFormat'

const API_BASE = 'http://26.148.34.69:8000'

interface ExtremeValues {
  min: number
  max: number
}

export const getSensorDataByDate = async (
  start: Date, 
  end: Date, 
  sensorId?: string
) => {

  const response = await axios.get(`${API_BASE}/data/by-date`, {
    params: { 
      start_date: formatStartDate(start), 
      end_date: formatEndDate(end),
      sensor_id: sensorId 
    }
  })
  console.log("RESPONSE ",response)
  return response.data
}

export const getSensorDataByPage = async (
  page: number,
  limit: number,
  params?: {
    sensor_id?: string
    start_date?: Date
    end_date?: Date
  }
) => {
  const response = await axios.get(`${API_BASE}/data/by-page`, {
    params: {
      page,
      limit,
      start_date: params?.start_date ? formatStartDate(params.start_date) : undefined,
      end_date: params?.end_date ? formatEndDate(params.end_date) : undefined,
      ...params
    }
  })
  return {
    data: response.data,
    totalPages: Math.ceil(response.headers['x-total-count'] / limit)
  }
}

export const getExtremeValues = async (
  start: Date, 
  end: Date, 
  sensorId?: string
): Promise<ExtremeValues> => {
  const response = await axios.get(`${API_BASE}/data/extremes`, { params: { 
    start_date: formatStartDate(start), 
    end_date: formatEndDate(end),
    sensor_id: sensorId 
  } })
  return response.data
}

export const getAvailableSensors = async () => {
  const response = await axios.get(`${API_BASE}/data/sensors`)
  return response.data.sensors
}