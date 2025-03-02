import { Checkbox } from "./ui/checkbox";

export const SensorSidebar = ({
  selectedSensors,
  setSelectedSensors,
  sensorOptions,
}: {
  selectedSensors: string[];
  setSelectedSensors: (sensors: string[]) => void;
  sensorOptions: string[];
}) => {
  const handleSensorSelect = (sensor: string) => {
    setSelectedSensors(
      selectedSensors.includes(sensor)
        ? selectedSensors.filter((s) => s !== sensor)
        : [...selectedSensors, sensor]
    );
  };

  return (
    <div className="w-64 p-4 border-r h-screen fixed left-0 top-0 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Выбор датчиков</h2>
      <div className="space-y-2">
        {sensorOptions.map((sensor) => (
          <label key={sensor} className="flex items-center gap-2">
            <Checkbox
              checked={selectedSensors.includes(sensor)}
              onCheckedChange={() => handleSensorSelect(sensor)}
            />
            <span className="text-sm">{sensor}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
