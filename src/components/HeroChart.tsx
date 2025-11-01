import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { quarter: "Q1", exposure: 14.2, target: 15.5 },
  { quarter: "Q2", exposure: 12.9, target: 14.8 },
  { quarter: "Q3", exposure: 11.1, target: 14.1 },
  { quarter: "Q4", exposure: 9.6, target: 13.5 },
]

const TARGET_BAND = {
  min: 10.5,
  max: 12.5,
}

const chartConfig = {
  exposure: {
    label: (
      <span className="font-medium text-slate-800">Effective tax exposure</span>
    ),
    color: "hsl(222 84% 60%)",
  },
  target: {
    label: (
      <span className="font-medium text-slate-800/70">Strategic target</span>
    ),
    color: "hsl(162 72% 42%)",
  },
} satisfies ChartConfig

type HeroChartProps = Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
>

function HeroChart({ className, ...props }: HeroChartProps) {
  const latestPoint = chartData[chartData.length - 1]

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "h-full w-full rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white/95 via-white to-primary/10 p-6 shadow-inner",
        className
      )}
      {...props}
    >
      <AreaChart
        data={chartData}
        margin={{
          left: -20,
          right: 12,
          top: 16,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="heroTaxExposure" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-exposure)" stopOpacity={0.32} />
            <stop
              offset="95%"
              stopColor="var(--color-exposure)"
              stopOpacity={0.05}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          strokeOpacity={0.16}
          strokeDasharray="3 8"
        />
        <XAxis
          dataKey="quarter"
          tickLine={false}
          axisLine={false}
          tickMargin={16}
          tickFormatter={(value) => value.toUpperCase()}
          tick={{ fill: "#475569", fontWeight: 600 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={14}
          tickCount={4}
          domain={[8.5, 16]}
          tick={{ fill: "#475569", fontWeight: 600 }}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip
          cursor={{ strokeDasharray: "4 4" }}
          labelFormatter={(label) => `Quarter ${label}`}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <ReferenceArea
          y1={TARGET_BAND.min}
          y2={TARGET_BAND.max}
          fill="var(--color-target)"
          fillOpacity={0.08}
          strokeOpacity={0}
        />
        {latestPoint ? (
          <>
            <ReferenceLine
              x={latestPoint.quarter}
              stroke="var(--color-exposure)"
              strokeOpacity={0.25}
              strokeDasharray="6 8"
            />
            <ReferenceDot
              x={latestPoint.quarter}
              y={latestPoint.exposure}
              r={8}
              fill="var(--color-exposure)"
              stroke="#fff"
              strokeWidth={3}
              isFront
              label={{
                position: "top",
                value: `${latestPoint.exposure.toFixed(1)}%`,
                fill: "#0f172a",
                fontSize: 12,
                fontWeight: 600,
                offset: 12,
              }}
            />
          </>
        ) : null}
        <Area
          type="monotone"
          dataKey="exposure"
          name="Actual exposure"
          stroke="var(--color-exposure)"
          fill="url(#heroTaxExposure)"
          strokeWidth={4}
          strokeLinecap="round"
          animationBegin={200}
          animationDuration={900}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="var(--color-target)"
          strokeWidth={3}
          dot={false}
          strokeDasharray="10 6"
          strokeOpacity={0.7}
          animationBegin={100}
          animationDuration={1000}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export default React.memo(HeroChart)
