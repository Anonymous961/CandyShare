"use client";

import { useMemo } from "react";

interface DailyActivityData {
    date: string;
    uploads: number;
    downloads: number;
}

interface DailyActivityChartProps {
    data: DailyActivityData[];
}

export default function DailyActivityChart({ data }: DailyActivityChartProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return null;

        const maxValue = Math.max(
            ...data.map(d => Math.max(d.uploads, d.downloads))
        );
        const chartHeight = 200;
        const barWidth = 40;
        const spacing = 20;

        return {
            maxValue,
            chartHeight,
            barWidth,
            spacing,
            totalWidth: data.length * (barWidth + spacing) - spacing
        };
    }, [data]);

    if (!chartData || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-500">
                <p>No activity data available</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full">
            {/* Chart Container */}
            <div className="relative" style={{ height: chartData.chartHeight + 40 }}>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                    <span>{chartData.maxValue}</span>
                    <span>{Math.floor(chartData.maxValue * 0.75)}</span>
                    <span>{Math.floor(chartData.maxValue * 0.5)}</span>
                    <span>{Math.floor(chartData.maxValue * 0.25)}</span>
                    <span>0</span>
                </div>

                {/* Chart Area */}
                <div className="ml-8 relative" style={{ height: chartData.chartHeight }}>
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                            <div
                                key={index}
                                className="absolute w-full border-t border-gray-100"
                                style={{ top: `${ratio * 100}%` }}
                            />
                        ))}
                    </div>

                    {/* Bars */}
                    <div className="relative h-full flex items-end gap-5">
                        {data.map((day) => {
                            const uploadHeight = (day.uploads / chartData.maxValue) * chartData.chartHeight;
                            const downloadHeight = (day.downloads / chartData.maxValue) * chartData.chartHeight;

                            return (
                                <div key={day.date} className="flex flex-col items-center">
                                    {/* Bars Container */}
                                    <div className="flex items-end gap-1 mb-2" style={{ height: chartData.chartHeight }}>
                                        {/* Uploads Bar */}
                                        <div
                                            className="bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                                            style={{
                                                width: chartData.barWidth,
                                                height: Math.max(uploadHeight, 2),
                                                minHeight: day.uploads > 0 ? 4 : 0
                                            }}
                                            title={`${day.uploads} uploads`}
                                        />

                                        {/* Downloads Bar */}
                                        <div
                                            className="bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600"
                                            style={{
                                                width: chartData.barWidth,
                                                height: Math.max(downloadHeight, 2),
                                                minHeight: day.downloads > 0 ? 4 : 0
                                            }}
                                            title={`${day.downloads} downloads`}
                                        />
                                    </div>

                                    {/* Value Labels */}
                                    <div className="text-center">
                                        <div className="text-xs font-medium text-gray-900">
                                            {day.uploads + day.downloads}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(day.date)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span className="text-sm text-gray-600">Uploads</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-sm text-gray-600">Downloads</span>
                </div>
            </div>
        </div>
    );
}
