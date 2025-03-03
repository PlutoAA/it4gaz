import { useEffect, useState } from "react";

const AlertComponent = () => {
  const [alert, setAlert] = useState(null);
  const [ws, setWs] = useState(null);

  // Дебаунс для обычных запросов
  const debouncedCheck = useDebouncedCallback(async () => {
    const params = new URLSearchParams({ sensor_id: "T1_K_1" });
    const response = await fetch(`/check-alert?${params}`);
    setAlert(await response.json());
  }, 30000); // 30 секунд

  return (
    <div>{alert?.message && <div className="alert">{alert.message}</div>}</div>
  );
};
