"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tier = "anonymous" | "free" | "pro";

interface TierSelectorProps {
  selectedTier: Tier;
  onTierChange: (tier: Tier) => void;
  disabled?: boolean;
}

const tiers = [
  {
    id: "anonymous" as Tier,
    name: "Anonymous",
    description: "Quick & simple sharing",
    icon: Zap,
    features: ["No registration", "24h expiry", "Basic sharing"],
    color: "bg-gray-100 border-gray-300",
    textColor: "text-gray-700",
    maxSize: "10MB"
  },
  {
    id: "free" as Tier,
    name: "Free",
    description: "Perfect for personal use",
    icon: Shield,
    features: ["User account", "7 days expiry", "Password protection"],
    color: "bg-blue-50 border-blue-300",
    textColor: "text-blue-700",
    maxSize: "200MB"
  },
  {
    id: "pro" as Tier,
    name: "Pro",
    description: "Advanced features",
    icon: Lock,
    features: ["User account", "30 days expiry", "Password protection", "Analytics"],
    color: "bg-purple-50 border-purple-300",
    textColor: "text-purple-700",
    maxSize: "2GB"
  }
];

export default function TierSelector({
  selectedTier,
  onTierChange,
  disabled = false
}: TierSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Choose Sharing Tier
        </CardTitle>
        <CardDescription>
          Select the level of features you need
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;

            return (
              <div
                key={tier.id}
                onClick={() => !disabled && onTierChange(tier.id)}
                className={cn(
                  "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                  tier.color,
                  isSelected && "ring-2 ring-blue-500 ring-offset-2",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className={cn("w-5 h-5 mt-0.5", tier.textColor)} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-semibold", tier.textColor)}>
                          {tier.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {tier.maxSize}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {tier.description}
                      </p>
                      <ul className="text-xs text-gray-500 mt-2 space-y-1">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
