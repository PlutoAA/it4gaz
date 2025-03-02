import { useEffect, useState } from "react";
import "./App.css";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SensorSidebar } from "./components/SensorSidebar";
import { fetchSensorData, getSensorOptions, TransformedData } from "./api";

function App() {
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [sensorData, setSensorData] = useState<TransformedData[]>([]);
  const [sensorOptions, setSensorOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSensorData();
        const options = getSensorOptions(data);
        setSensorData(data);
        setSensorOptions(options);
        if (options.length > 0) {
          setSelectedSensors(options.slice(0, 2));
        }
        setLoading(false);
      } catch (err) {
        setError("Ошибка загрузки данных с сервера");
        console.log(err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData = sensorData.filter((data) => {
    const date = parseISO(data.timestamp);
    return (
      date >= parseISO(startDate) && date <= parseISO(endDate + "T23:59:59")
    );
  });

  const findClosestData = () => {
    const targetTime = parseISO(selectedTime).getTime();
    return sensorData.reduce((prev, curr) => {
      const currTime = parseISO(curr.timestamp).getTime();
      const prevTime = parseISO(prev.timestamp).getTime();
      return Math.abs(currTime - targetTime) < Math.abs(prevTime - targetTime)
        ? curr
        : prev;
    }, sensorData[0]);
  };

  const calculateYAxisDomain = (data: TransformedData[], sensors: string[]) => {
    if (!data.length || !sensors.length) return [0, 1];

    let min = Infinity;
    let max = -Infinity;

    if (min === max) {
      // Если все значения одинаковые
      const center = min;
      return [center - Math.abs(center) * 0.1, center + Math.abs(center) * 0.1];
    }

    if (!isFinite(min) || !isFinite(max)) {
      // Если нет данных
      return [0, 1];
    }

    data.forEach((item) => {
      sensors.forEach((sensor) => {
        const value = item[sensor] as number;
        if (typeof value === "number") {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });

    // Добавляем 10% от диапазона для визуального комфорта
    const padding = (max - min) * 0.1 || Math.abs(min) * 0.1 || 1;
    return [min - padding, max + padding];
  };

  if (loading) return <div className="ml-64 p-8">Загрузка данных...</div>;
  if (error) return <div className="ml-64 p-8 text-red-500">{error}</div>;

  const closestData = findClosestData();

  return (
    <div className="flex">
      <SensorSidebar
        selectedSensors={selectedSensors}
        setSelectedSensors={setSelectedSensors}
        sensorOptions={sensorOptions}
      />

      <div className="p-8 flex-1">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>График показаний датчиков</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[200px]"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[200px]"
              />
            </div>

            <LineChart
              width={1200}
              height={400}
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => format(parseISO(time), "dd.MM HH:mm")}
                domain={["dataMin", "dataMax"]}
                scale="time"
                type="number"
              />
              <YAxis
                domain={calculateYAxisDomain(filteredData, selectedSensors)}
              />
              <Tooltip
                labelFormatter={(value) =>
                  format(parseISO(value), "dd.MM.yyyy HH:mm")
                }
                formatter={(value) => [Number(value).toFixed(2), "Значение"]}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              {selectedSensors.map((sensor) => (
                <Line
                  key={sensor}
                  type="monotone"
                  dataKey={sensor}
                  stroke={`hsl(${Math.random() * 360}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Показания на конкретное время</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                type="datetime-local"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-[250px]"
              />
            </div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Датчик</th>
                    <th className="px-4 py-3 text-left">Значение</th>
                    <th className="px-4 py-3 text-left">Время</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSensors.map((sensor) => (
                    <tr key={sensor} className="border-t">
                      <td className="px-4 py-2">{sensor}</td>
                      <td className="px-4 py-2">
                        {closestData?.[sensor] ?? "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {closestData
                          ? format(
                              parseISO(closestData.timestamp),
                              "dd.MM.yyyy HH:mm"
                            )
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
