import { motion } from "framer-motion";
import { Calendar, MapPin, Download, Share2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function TicketPage() {
  const { user } = useAuthStore();

  const handleDownload = () => {
    toast.success("Ticket downloaded!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://innovate2025.com/ticket/ABC123");
    toast.success("Ticket link copied!");
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Your Ticket</h1>
        <p className="text-muted-foreground">Show this at the venue</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
            <h2 className="text-2xl font-bold">INNOVATE 2025</h2>
            <p className="text-primary-foreground/80">Innovator Pass</p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* QR Code Placeholder */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed">
                <QrCode className="w-24 h-24 text-muted-foreground" />
              </div>
            </div>

            {/* Attendee Info */}
            <div className="text-center">
              <p className="font-semibold text-lg">{user?.name || "Attendee"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="font-mono text-xs mt-2 bg-muted px-3 py-1 rounded inline-block">
                #INV2025-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </p>
            </div>

            <Separator />

            {/* Event Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">January 15-17, 2025</p>
                  <p className="text-muted-foreground">9:00 AM - 9:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tech Convention Center</p>
                  <p className="text-muted-foreground">Bangalore, India</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
