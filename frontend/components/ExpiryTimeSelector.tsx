"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar } from "lucide-react";

interface ExpiryTimeSelectorProps {
    selectedHours: number;
    onExpiryChange: (hours: number) => void;
    tier: string;
    disabled?: boolean;
}

const EXPIRY_OPTIONS = [
    { value: 1, label: "1 hour", description: "Quick sharing" },
    { value: 6, label: "6 hours", description: "Short term" },
    { value: 24, label: "1 day", description: "Daily sharing" },
    { value: 72, label: "3 days", description: "Weekend sharing" },
    { value: 168, label: "1 week", description: "Weekly sharing" },
    { value: 336, label: "2 weeks", description: "Bi-weekly sharing" },
    { value: 720, label: "30 days", description: "Maximum duration" },
];

const CUSTOM_OPTION = { value: "custom", label: "Custom", description: "Set your own duration" };

export default function ExpiryTimeSelector({
    selectedHours,
    onExpiryChange,
    tier,
    disabled = false
}: ExpiryTimeSelectorProps) {
    const [isCustom, setIsCustom] = useState(false);
    const [customHours, setCustomHours] = useState(720); // Default to 30 days

    // Check if current selection is a predefined option
    useEffect(() => {
        const isPredefined = EXPIRY_OPTIONS.some(option => option.value === selectedHours);
        setIsCustom(!isPredefined);
        if (!isPredefined) {
            setCustomHours(selectedHours);
        }
    }, [selectedHours]);

    const handlePresetChange = (value: string) => {
        if (value === "custom") {
            setIsCustom(true);
            onExpiryChange(customHours);
        } else {
            setIsCustom(false);
            const hours = parseInt(value);
            onExpiryChange(hours);
        }
    };

    const handleCustomChange = (value: string) => {
        const hours = parseInt(value) || 1;
        setCustomHours(hours);
        onExpiryChange(hours);
    };

    const formatDuration = (hours: number) => {
        if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''}`;
        } else if (hours < 168) {
            const days = Math.floor(hours / 24);
            return `${days} day${days !== 1 ? 's' : ''}`;
        } else if (hours < 8760) {
            const weeks = Math.floor(hours / 168);
            return `${weeks} week${weeks !== 1 ? 's' : ''}`;
        } else {
            const years = Math.floor(hours / 8760);
            return `${years} year${years !== 1 ? 's' : ''}`;
        }
    };

    const getExpiryDate = (hours: number) => {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + hours);
        return expiryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Don't show for non-Pro users
    if (tier !== 'pro') {
        return null;
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Expiry Time
                </CardTitle>
                <CardDescription>
                    Choose how long your file will be available for download
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="expiry-preset">Quick Selection</Label>
                    <Select
                        value={isCustom ? "custom" : selectedHours.toString()}
                        onValueChange={handlePresetChange}
                        disabled={disabled}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select expiry time" />
                        </SelectTrigger>
                        <SelectContent>
                            {EXPIRY_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{option.label}</span>
                                        <span className="text-sm text-gray-500">{option.description}</span>
                                    </div>
                                </SelectItem>
                            ))}
                            <SelectItem value="custom">
                                <div className="flex flex-col">
                                    <span className="font-medium">{CUSTOM_OPTION.label}</span>
                                    <span className="text-sm text-gray-500">{CUSTOM_OPTION.description}</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isCustom && (
                    <div className="space-y-2">
                        <Label htmlFor="custom-hours">Custom Duration (hours)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="custom-hours"
                                type="number"
                                min="1"
                                max="720"
                                value={customHours}
                                onChange={(e) => handleCustomChange(e.target.value)}
                                disabled={disabled}
                                className="flex-1"
                            />
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                hours
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Minimum: 1 hour, Maximum: 30 days (720 hours)
                        </p>
                    </div>
                )}

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-purple-900">
                            File will expire: {formatDuration(selectedHours)}
                        </span>
                    </div>
                    <p className="text-xs text-purple-700 mt-1">
                        {getExpiryDate(selectedHours)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
