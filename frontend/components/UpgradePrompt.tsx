"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock } from "lucide-react";
import PaymentModal from "./PaymentModal";
import { useAuth } from "@/hooks/useAuth";

interface UpgradePromptProps {
    feature: string;
    description: string;
    onUpgrade?: () => void;
}

export default function UpgradePrompt({ feature, description, onUpgrade }: UpgradePromptProps) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { user } = useAuth();

    const handleUpgrade = () => {
        if (onUpgrade) {
            onUpgrade();
        } else {
            setShowPaymentModal(true);
        }
    };

    const handlePaymentSuccess = () => {
        // Refresh user data or redirect
        window.location.reload();
    };

    return (
        <>
            <Card className="border-2 border-dashed border-purple-200 bg-purple-50/50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Lock className="w-4 h-4 text-purple-600" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-semibold text-gray-900">{feature}</h3>
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Pro
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{description}</p>
                            <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                                onClick={handleUpgrade}
                            >
                                <Crown className="w-3 h-3 mr-1" />
                                Upgrade to Pro
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {showPaymentModal && user && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                    userId={user.id}
                />
            )}
        </>
    );
}
