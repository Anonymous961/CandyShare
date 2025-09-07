"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";

interface PasswordProtectionProps {
    password: string;
    onPasswordChange: (password: string) => void;
    tier: string;
    disabled?: boolean;
}

export default function PasswordProtection({
    password,
    onPasswordChange,
    tier,
    disabled = false
}: PasswordProtectionProps) {
    const [isEnabled, setIsEnabled] = useState(!!password);
    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = (checked: boolean) => {
        setIsEnabled(checked);
        if (!checked) {
            onPasswordChange("");
        }
    };

    const handlePasswordChange = (value: string) => {
        onPasswordChange(value);
    };

    // Don't show for non-Pro users
    if (tier !== 'pro') {
        return null;
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                    Password Protection
                </CardTitle>
                <CardDescription>
                    Add an extra layer of security to your file
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="password-toggle" className="text-base">
                            Enable password protection
                        </Label>
                        <p className="text-sm text-gray-500">
                            Require a password to download this file
                        </p>
                    </div>
                    <Switch
                        id="password-toggle"
                        checked={isEnabled}
                        onCheckedChange={handleToggle}
                        disabled={disabled}
                    />
                </div>

                {isEnabled && (
                    <div className="space-y-2">
                        <Label htmlFor="file-password">Password</Label>
                        <div className="relative">
                            <Input
                                id="file-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                disabled={disabled}
                                placeholder="Enter a secure password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={disabled}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Choose a strong password that others can easily share
                        </p>
                    </div>
                )}

                {isEnabled && password && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Lock className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-purple-900">
                                File will be password protected
                            </span>
                        </div>
                        <p className="text-xs text-purple-700 mt-1">
                            Recipients will need to enter the password to download
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
