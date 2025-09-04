import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Lock, Clock, Users, ArrowRight } from "lucide-react";

const tiers = [
  {
    id: "anonymous",
    name: "Anonymous",
    description: "Quick & simple sharing",
    icon: Zap,
    features: ["No registration required", "24 hours expiry", "Basic file sharing"],
    color: "bg-gray-50 border-gray-200",
    textColor: "text-gray-700",
    maxSize: "10MB",
    price: "Free",
    popular: false
  },
  {
    id: "free",
    name: "Free",
    description: "Perfect for personal use",
    icon: Shield,
    features: ["User account", "7 days expiry", "Password protection", "Better security"],
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
    maxSize: "100MB",
    price: "Free",
    popular: true
  },
  {
    id: "pro",
    name: "Pro",
    description: "Advanced features for power users",
    icon: Lock,
    features: ["User account", "30 days expiry", "Password protection", "Analytics", "Priority support"],
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-700",
    maxSize: "1GB",
    price: "$9.99/month",
    popular: false
  }
];

export default function TierInfoSection() {
      return (
      <section className="py-16 bg-white" id="pricing">
        <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Sharing Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with our free anonymous sharing, or upgrade for more features and security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <Card 
                key={tier.id} 
                className={`relative ${tier.color} ${tier.popular ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tier.color}`}>
                      <Icon className={`w-6 h-6 ${tier.textColor}`} />
                    </div>
                  </div>
                  
                  <CardTitle className={`text-xl ${tier.textColor}`}>
                    {tier.name}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600">
                    {tier.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                    {tier.price !== "Free" && (
                      <span className="text-gray-500 ml-1">/month</span>
                    )}
                  </div>
                  
                  <Badge variant="outline" className="mt-2">
                    Up to {tier.maxSize}
                  </Badge>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-900'}`}
                    variant={tier.popular ? "default" : "default"}
                  >
                    {tier.id === "anonymous" ? "Start Sharing" : "Coming Soon"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Currently, all users start with <strong>Anonymous</strong> sharing
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              No registration required
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              24h auto-expiry
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Secure & private
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
