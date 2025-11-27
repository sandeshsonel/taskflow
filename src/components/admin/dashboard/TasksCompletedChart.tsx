import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const values = [20, 35, 45, 15, 30, 38, 50];

export function TasksCompletedChart() {
  const maxValue = Math.max(...values);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Tasks Completed Over Time</CardTitle>
        <p className="text-sm text-muted-foreground">Last 30 Days</p>
      </CardHeader>

      <CardContent>
        <div className="flex items-end gap-3 h-48">
          {values.map((v, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <div
                className={`w-6 rounded-md ${
                  i === 2 || i === 6
                    ? "bg-blue-600"
                    : "bg-blue-300"
                }`}
                style={{ height: `${(v / maxValue) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
