"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Clock, Lock, Eye, EyeOff } from "lucide-react";

interface ExtendExpiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (hours: number) => Promise<void>;
    fileName: string;
    currentExpiry: string;
}

export function ExtendExpiryModal({ isOpen, onClose, onConfirm, fileName, currentExpiry }: ExtendExpiryModalProps) {
    const [hours, setHours] = useState(24);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (hours <= 0) return;

        setIsLoading(true);
        try {
            await onConfirm(hours);
            onClose();
        } catch (error) {
            console.error("Error extending expiry:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <CardTitle>Extend File Expiry</CardTitle>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>
                        Extend the expiry time for &quot;{fileName}&quot;
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="current-expiry">Current Expiry</Label>
                            <Input
                                id="current-expiry"
                                value={new Date(currentExpiry).toLocaleString()}
                                disabled
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="additional-hours">Additional Hours</Label>
                            <Input
                                id="additional-hours"
                                type="number"
                                min="1"
                                max="720"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                className="mt-1"
                                placeholder="Enter hours to extend"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Maximum 720 hours (30 days) extension
                            </p>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading || hours <= 0} className="flex-1">
                                {isLoading ? "Extending..." : "Extend Expiry"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

interface SetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => Promise<void>;
    fileName: string;
    hasPassword: boolean;
}

export function SetPasswordModal({ isOpen, onClose, onConfirm, fileName, hasPassword }: SetPasswordModalProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return;

        setIsLoading(true);
        try {
            await onConfirm(password);
            onClose();
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error setting password:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemovePassword = async () => {
        setIsLoading(true);
        try {
            await onConfirm(""); // Empty string to remove password
            onClose();
        } catch (error) {
            console.error("Error removing password:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-purple-600" />
                            <CardTitle>
                                {hasPassword ? "Update File Password" : "Set File Password"}
                            </CardTitle>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>
                        {hasPassword ? "Update password for" : "Add password protection to"} &quot;{fileName}&quot;
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative mt-1">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password (min 4 characters)"
                                    minLength={4}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="mt-1"
                            />
                            {password && confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                            )}
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                Cancel
                            </Button>
                            {hasPassword && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleRemovePassword}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? "Removing..." : "Remove Password"}
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={isLoading || password.length < 4 || password !== confirmPassword}
                                className="flex-1"
                            >
                                {isLoading ? "Setting..." : hasPassword ? "Update Password" : "Set Password"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
