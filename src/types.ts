export interface DateRange {
  from?: Date
  to?: Date
}

export interface ExtremeValue {
  period: string
  sensor_id: string
  min: number
  max: number
}