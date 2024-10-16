import { Sample } from "@/lib/yamcs/types/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  avg: {
    label: "Average",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function SampleChart({ samples }: { samples: Sample[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] max-h-[500px] w-full"
    >
      <LineChart accessibilityLayer data={samples}>
        <XAxis
          dataKey="time"
          tickLine={true}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value) =>
            new Date(value).toLocaleTimeString("en-US", { hour12: false })
          }
        />
        <YAxis type="number" />
        <CartesianGrid vertical={true} />
        <Line
          type={"monotone"}
          dataKey="avg"
          stroke="var(--color-avg)"
          strokeWidth={2}
          dot={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </LineChart>
    </ChartContainer>
  );
}
