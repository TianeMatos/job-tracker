import { Bookmark } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Metric } from "@/lib/types/dashboard";

export default function MetricCard({
  item,
}: {
  item: Metric;
}) {
  return (
    <Card className="rounded-2xl p-5 border border-border bg-card shadow-card xl:p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-base font-medium text-foreground/65 leading-tight tracking-tight">
          {item.label}
        </CardTitle>

        <CardAction className="p-1.5 rounded-lg" style={{ backgroundColor: item.iconBg }}>
          <item.icon color={item.iconColor} fill={item.iconFilled ? item.iconColor : "transparent"} size={18} aria-hidden="true" />
        </CardAction>
      </CardHeader>
      <CardContent className="p-0 items-start">
        <p className="text-2xl font-semibold text-card-foreground tabular-nums lg:text-3xl">
          {item.value}
        </p>
      </CardContent>
      <CardFooter className="p-0 text-sm text-muted-foreground">
        <p>{item.detail}</p>
      </CardFooter>
    </Card>
  );
}
