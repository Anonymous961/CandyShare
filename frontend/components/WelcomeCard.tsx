import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Lock, Clock, Users } from "lucide-react";

export default function WelcomeCard() {
  const features = [
    {
      icon: Zap,
      title: "Instant Sharing",
      description: "Upload and share files in seconds"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your files are protected and encrypted"
    },
    {
      icon: Lock,
      title: "Password Protection",
      description: "Add passwords to sensitive files"
    },
    {
      icon: Clock,
      title: "Auto Expiry",
      description: "Files automatically expire for security"
    },
    {
      icon: Users,
      title: "No Registration",
      description: "Start sharing immediately"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          Share Files Securely
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Upload your file and get a secure link to share with anyone
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Hero Image */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <Image
              src="/illustration/file4.png"
              alt="File sharing illustration"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Key Features - Compact */}
        <div className="space-y-3">
          {features.slice(0, 3).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Ready to share your first file?
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Anonymous
            </Badge>
            <Badge variant="secondary" className="text-xs">
              24h Expiry
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Up to 10MB
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
