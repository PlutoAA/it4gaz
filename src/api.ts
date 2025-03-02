// src/api.ts
export interface SensorReading {
  timestamp: string;
  pipe_number: string;
  sensor_type: string;
  sensor_number: number;
  value: number;
}

export interface TransformedData {
  timestamp: string;
  [sensorKey: string]: number | string;
}

export const fetchSensorData = async (): Promise<TransformedData[]> => {
  const response = await fetch('http://26.148.34.69:8000/data');
  if (!response.ok) throw new Error('Ошибка загрузки данных');
  const data: SensorReading[] = await response.json();
  
  // Трансформируем данные в нужный формат
  const transformedData: { [key: string]: TransformedData } = {};

  data.forEach((item) => {
    const sensorKey = `${item.pipe_number}_${item.sensor_type}_${item.sensor_number}`;
    if (!transformedData[item.timestamp]) {
      transformedData[item.timestamp] = {
        timestamp: item.timestamp,
      };
    }
    transformedData[item.timestamp][sensorKey] = item.value;
  });

  return Object.values(transformedData);
};

export const getSensorOptions = (data: TransformedData[]): string[] => {
  const sensors = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== 'timestamp') sensors.add(key);
    });
  });
  return Array.from(sensors);
};