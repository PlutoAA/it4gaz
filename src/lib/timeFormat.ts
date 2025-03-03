import { add } from "date-fns";

const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds

export const formatStartDate = (start_date: Date) => {
  return new Date(start_date.valueOf() - tzoffset).toISOString().slice(0, -1);
}

export const formatEndDate = (end_date: Date) => {
  return add(new Date(end_date.valueOf() - tzoffset), {
    hours: 23,
    minutes: 59,
    seconds: 59,
  })
  .toISOString()
  .slice(0, -1);
}