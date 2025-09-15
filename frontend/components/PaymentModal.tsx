"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, X } from "lucide-react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
    payment_method?: {
        card?: boolean;
        paypal?: boolean;
    };
    method?: {
        netbanking?: boolean;
        wallet?: boolean;
        emi?: boolean;
        upi?: boolean;
        card?: boolean;
        paypal?: boolean;
    };
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open: () => void;
        };
    }
}

export default function PaymentModal({ isOpen, onClose, onSuccess, userId }: PaymentModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
            // Create payment order
            const orderResponse = await fetch(`${apiBaseUrl}/api/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, tier: "PRO" }),
            });

            if (!orderResponse.ok) {
                const error = await orderResponse.json();
                throw new Error(error.error || "Failed to create payment order");
            }

            const { orderId, amount, paymentId } = await orderResponse.json();

            // Load Razorpay script
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                const options: RazorpayOptions = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                    amount: amount,
                    currency: "USD",
                    name: "CandyShare Pro",
                    description: "Upgrade to Pro tier",
                    order_id: orderId,
                    handler: async function (response: RazorpayResponse) {
                        try {
                            // Verify payment
                            const verifyResponse = await fetch(`${apiBaseUrl}/api/payment/verify-payment`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                    paymentId,
                                }),
                            });

                            if (verifyResponse.ok) {
                                onSuccess();
                                onClose();
                            } else {
                                const error = await verifyResponse.json();
                                alert(`Payment verification failed: ${error.error || "Unknown error"}`);
                            }
                        } catch (error) {
                            console.error("Payment verification error:", error);
                            alert(`Payment verification failed: ${error instanceof Error ? error.message : "Please try again."}`);
                        }
                    },
                    theme: {
                        color: "#7c3aed",
                    },
                    // Enable international payment methods
                    method: {
                        netbanking: false,
                        wallet: false,
                        emi: false,
                        upi: false,
                        card: true,
                        paypal: true, // Enable PayPal
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            };
            script.onerror = () => {
                alert("Failed to load Razorpay script. Please try again.");
                setIsLoading(false);
            };
            document.body.appendChild(script);
        } catch (error) {
            console.error("Payment error:", error);
            alert(`Payment failed: ${error instanceof Error ? error.message : "Please try again."}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md mx-4">
                <Card className="border-purple-200">
                    <CardHeader className="text-center relative">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <Crown className="w-6 h-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-2xl">Pro Plan</CardTitle>
                        <CardDescription>Unlock all features</CardDescription>
                        <div className="text-3xl font-bold text-purple-600">$8.99</div>
                        <Badge className="bg-purple-100 text-purple-800">one-time payment</Badge>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>2GB file size limit</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>30 days adjustable expiry</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Password protection</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Advanced analytics</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Priority support</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>30 days access</span>
                            </li>
                        </ul>

                        <Button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            {isLoading ? "Processing..." : "Pay $8.99"}
                        </Button>

                        <p className="text-xs text-gray-500 text-center mt-2">
                            Secure payment powered by Razorpay<br />
                            <span className="text-purple-600">✓ PayPal accepted</span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}