/**
 * Reusable Pie Chart Component
 * Displays category breakdown in pie chart format
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface PieChartData {
  name: string
  value: number
  color: string
  percentage?: number
}

interface PieChartCardProps {
  title: string
  data: PieChartData[]
  height?: number
  showLegend?: boolean
}

export function PieChartCard({
  title,
  data,
  height = 250,
  showLegend = true,
}: PieChartCardProps) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  if (!data || data.length === 0 || totalValue === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center text-gray-500">
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={(entry) => {
                const percentage = totalValue > 0 ? (entry.value / totalValue) * 100 : 0
                return `${percentage.toFixed(0)}%`
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>

        {showLegend && (
          <div className="mt-4 space-y-2">
            {data.map((item, index) => {
              const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.value)}
                    </p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
