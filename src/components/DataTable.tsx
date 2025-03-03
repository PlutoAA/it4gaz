import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";
import { getSensorDataByPage } from "@/api";

export function DataTable({ page, limit, onPageChange, sensorId, dateRange }) {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          sensor_id: sensorId,
          ...(dateRange?.from && { start_date: dateRange.from }),
          ...(dateRange?.to && { end_date: dateRange.to }),
        };

        const { data: response, totalPages } = await getSensorDataByPage(
          page,
          limit,
          params
        );
        setData(response.data);
        setTotalPages(totalPages);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, sensorId, dateRange]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Время</TableHead>
            <TableHead>ID датчика</TableHead>
            <TableHead>Значение</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>
                <Skeleton className="h-[20px] w-full" />
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={`${item.timestamp}-${item.sensor_id}`}>
                <TableCell>
                  {new Date(item.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{item.sensor_id}</TableCell>
                <TableCell>{item.value.toFixed(2)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
