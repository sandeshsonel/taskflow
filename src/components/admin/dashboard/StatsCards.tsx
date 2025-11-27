import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string | number;
  change: string;
  positive?: boolean;
}

const stats: StatItem[] = [
  { label: "Total Users", value: "1,482", change: "+1.5%", positive: true },
  { label: "Active Tasks", value: 312, change: "+5.2%", positive: true },
  { label: "Completed This Week", value: 89, change: "-2.1%" },
  { label: "New Sign-ups", value: 15, change: "+10%", positive: true },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {s.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{s.value}</p>
            <p
              className={`text-sm ${
                s.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {s.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
