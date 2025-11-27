import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BellOff } from "lucide-react";

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <BellOff className="w-10 h-10 mb-2" />
        <p>No new activity</p>
        <p className="text-xs text-muted-foreground mt-1">
          Recent user actions will appear here.
        </p>
      </CardContent>
    </Card>
  );
}
