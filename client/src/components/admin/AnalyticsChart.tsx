import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsChartProps {
  title: string;
  data: ChartDataPoint[];
  type: "bar" | "line" | "pie";
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  data,
  type,
  trend,
  className,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    return trend.value > 0 ? "text-green-600" : "text-red-600";
  };

  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-20 text-sm text-gray-600 truncate">
            {item.label}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                item.color || 'bg-primary'
              }`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-16 text-sm font-medium text-right">
            {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="h-40 flex items-end justify-between gap-2 border-b border-gray-200">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-primary rounded-t transition-all duration-500"
            style={{ height: `${(item.value / maxValue) * 120}px` }}
          />
          <div className="text-xs text-gray-600 mt-2 text-center truncate w-full">
            {item.label}
          </div>
          <div className="text-xs font-medium text-gray-900">
            {item.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="space-y-3">
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.color || 'bg-primary'
                    }`}
                  />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <div className="text-sm font-medium">
                  {percentage}% ({item.value.toLocaleString()})
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return renderBarChart();
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {trend && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          renderChart()
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
