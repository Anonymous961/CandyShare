"use client";

import { useMemo } from "react";

interface FileTypeChartProps {
    data: Record<string, number>;
}

const COLORS = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
];

export default function FileTypeChart({ data }: FileTypeChartProps) {
    const chartData = useMemo(() => {
        if (!data || Object.keys(data).length === 0) return [];

        const entries = Object.entries(data)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8); // Show top 8 file types

        const total = entries.reduce((sum, [, count]) => sum + count, 0);

        let currentAngle = 0;

        return entries.map(([type, count], index) => {
            const percentage = (count / total) * 100;
            const angle = (count / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            currentAngle += angle;

            return {
                type,
                count,
                percentage,
                angle,
                startAngle,
                endAngle,
                color: COLORS[index % COLORS.length]
            };
        });
    }, [data]);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-500">
                <p>No file type data available</p>
            </div>
        );
    }

    const radius = 60;
    const centerX = 80;
    const centerY = 80;

    const createArcPath = (startAngle: number, endAngle: number) => {
        const start = polarToCartesian(centerX, centerY, radius, endAngle);
        const end = polarToCartesian(centerX, centerY, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", centerX, centerY,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-center mb-6">
                <svg width="160" height="160" className="transform -rotate-90">
                    {chartData.map((item) => (
                        <path
                            key={item.type}
                            d={createArcPath(item.startAngle, item.endAngle)}
                            fill={item.color}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                    ))}
                </svg>
            </div>

            {/* Legend */}
            <div className="space-y-2">
                {chartData.map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-600">
                                .{item.type}
                            </span>
                        </div>
                        <div className="text-sm text-gray-900 font-medium">
                            {item.count}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
