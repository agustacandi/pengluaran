/**
 * Reusable Bar Chart Component
 * Displays data in bar chart format with customizable options
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { CHART_COLORS } from '@/lib/constants'

interface BarChartCardProps {
  title: string
  data: any[]
  xAxisKey: string
  bars: {
    dataKey: string
    name: string
    color?: string
  }[]
  height?: number
  formatValue?: (value: number) => string
}

export function BarChartCard({
  title,
  data,
  xAxisKey,
  bars,
  height = 300,
  formatValue = formatCurrency,
}: BarChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
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
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value: number) => formatValue(value)}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Legend />
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.color || CHART_COLORS.balance}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
