import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ExtremeValuesCard({
  data,
  sensorId,
  dateRange,
}: {
  data?: { min: number; max: number };
  sensorId?: string;
  dateRange?: { from?: Date; to?: Date };
}) {
  const formatDate = (date?: Date) =>
    date ? date.toLocaleDateString("ru-RU") : "";

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Экстремальные значения</CardTitle>
        <div className="text-sm text-muted-foreground">
          {sensorId || "Все датчики"} •{" "}
          {dateRange?.from && dateRange?.to
            ? `${formatDate(dateRange.from)} — ${formatDate(dateRange.to)}`
            : "Весь период"}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        {data ? (
          <>
            <div>
              <div className="text-2xl font-bold text-blue-600">{data.min}</div>
              <div className="text-sm text-muted-foreground">
                Минимальное значение
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{data.max}</div>
              <div className="text-sm text-muted-foreground">
                Максимальное значение
              </div>
            </div>
          </>
        ) : (
          <>
            <Skeleton className="h-[50px] w-full" />
            <Skeleton className="h-[50px] w-full" />
          </>
        )}
      </CardContent>
    </Card>
  );
}
