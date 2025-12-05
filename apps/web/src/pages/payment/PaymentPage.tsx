import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const features = [
  "Access to all hackathon sessions",
  "Networking opportunities",
  "Swag bag & goodies",
  "Meals & refreshments",
  "Certificate of participation",
];

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    toast.success("Payment successful!", {
      description: "Your ticket has been generated.",
    });
    navigate("/ticket");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Register for Innovate 2025</h1>
        <p className="text-muted-foreground mt-1">
          Secure your spot at the biggest hackathon of the year
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-bl-lg">
            Early Bird
          </div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Innovator Pass
            </CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹499</span>
              <span className="text-muted-foreground line-through ml-2">₹999</span>
            </div>
            <Badge variant="secondary" className="mt-2">50% off - Limited time</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? "Processing..." : "Pay ₹499"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Razorpay
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
