/**
 * Reusable Line Chart Component
 * Displays trend data in line chart format
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { CHART_COLORS } from '@/lib/constants'

interface LineChartCardProps {
  title: string
  data: Record<string, unknown>[]
  xAxisKey: string
  lines: {
    dataKey: string
    name: string
    color?: string
  }[]
  height?: number
  formatValue?: (value: number) => string
}

export function LineChartCard({
  title,
  data,
  xAxisKey,
  lines,
  height = 350,
  formatValue = formatCurrency,
}: LineChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-gray-500">
            Belum ada data untuk ditampilkan
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value: number) => formatValue(value)}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color || CHART_COLORS.balance}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
