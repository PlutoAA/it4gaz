import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import { DataTable } from "./components/DataTable";
import { DatePickerWithRange } from "./components/DateRangePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ChartComponent } from "./components/ChartComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { getAvailableSensors } from "./api";
import { Loader2 } from "lucide-react";

export default function App() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [selectedSensor, setSelectedSensor] = useState<string>("");
  const [availableSensors, setAvailableSensors] = useState<string[]>([]);
  const [sensorsLoading, setSensorsLoading] = useState(true);

  useEffect(() => {
    const loadSensors = async () => {
      try {
        const sensors = await getAvailableSensors();
        setAvailableSensors(sensors);
      } catch (error) {
        console.error("Ошибка загрузки датчиков:", error);
      } finally {
        setSensorsLoading(false);
      }
    };

    loadSensors();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex gap-2">
        <DatePickerWithRange onDateChange={setDateRange} />
        <Select
          onValueChange={setSelectedSensor}
          value={selectedSensor}
          disabled={sensorsLoading}
        >
          <SelectTrigger className="w-[200px]">
            {sensorsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Загрузка...</span>
              </div>
            ) : (
              <SelectValue placeholder="Все датчики" />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все датчики</SelectItem>
            {availableSensors.map((sensor) => (
              <SelectItem key={sensor} value={sensor}>
                {sensor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="chart">
        <TabsList>
          <TabsTrigger value="chart">График</TabsTrigger>
          <TabsTrigger value="table">Таблица</TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
          <ChartComponent dateRange={dateRange} sensorId={selectedSensor} />
        </TabsContent>
        <TabsContent value="table">
          <DataTable
            page={page}
            limit={limit}
            onPageChange={setPage}
            sensorId={selectedSensor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
