"use client";

import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Crown } from "lucide-react";

interface FileSizeErrorAlertProps {
    error: string;
    onClose: () => void;
    onUpgrade?: () => void;
}

export default function FileSizeErrorAlert({ error, onClose, onUpgrade }: FileSizeErrorAlertProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                File Too Large
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {error}
                            </p>
                            <div className="flex gap-3">
                                {onUpgrade && (
                                    <Button
                                        onClick={onUpgrade}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                                    >
                                        <Crown className="w-4 h-4" />
                                        Upgrade to Pro
                                    </Button>
                                )}
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

