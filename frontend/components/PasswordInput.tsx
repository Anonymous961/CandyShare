"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  password: string;
  onPasswordChange: (password: string) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export default function PasswordInput({
  password,
  onPasswordChange,
  enabled,
  onEnabledChange,
  disabled = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Password Protection
        </CardTitle>
        <CardDescription>
          Add a password to secure your file
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Enable/Disable Switch */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="password-enabled" className="text-sm font-medium">
              Enable password protection
            </Label>
            <p className="text-xs text-gray-500">
              Require a password to download this file
            </p>
          </div>
          <Switch
            id="password-enabled"
            checked={enabled}
            onCheckedChange={onEnabledChange}
            disabled={disabled}
          />
        </div>

        {/* Password Input */}
        {enabled && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Enter a secure password"
                disabled={disabled}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Choose a strong password that others can easily share
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
