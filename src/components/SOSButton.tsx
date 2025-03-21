
import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SOSButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isPressTimer, setIsPressTimer] = useState(false);
  const [pressTime, setPressTime] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const PRESS_THRESHOLD = 2; // 2 seconds to activate

  // Reset press state when dialog closes
  useEffect(() => {
    if (!showConfirmation) {
      setIsPressed(false);
      setIsPressTimer(false);
      setPressTime(0);
    }
  }, [showConfirmation]);

  // Handle long press timer
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPressTimer && pressTime < PRESS_THRESHOLD) {
      interval = window.setInterval(() => {
        setPressTime((prev) => {
          const newTime = prev + 0.1;
          if (newTime >= PRESS_THRESHOLD) {
            setShowConfirmation(true);
            setIsPressTimer(false);
          }
          return newTime;
        });
      }, 100);
    } else if (!isPressTimer) {
      if (interval) clearInterval(interval);
      if (pressTime < PRESS_THRESHOLD) {
        setPressTime(0);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPressTimer, pressTime]);

  const handlePressStart = () => {
    setIsPressed(true);
    setIsPressTimer(true);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    setIsPressTimer(false);
    if (pressTime < PRESS_THRESHOLD) {
      setPressTime(0);
    }
  };

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const sendEmergencyAlert = async () => {
    setIsSending(true);
    
    try {
      // Get user's location
      const userLocation = await getLocation();
      setLocation(userLocation);
      
      // Simulate sending the alert to nearest police station and HQ
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Emergency alert sent successfully! Help is on the way.", {
        duration: 5000,
      });
      
      // Simulate receiving confirmation from police
      setTimeout(() => {
        toast("Police station has acknowledged your alert", {
          icon: <AlertCircle className="h-4 w-4 text-green-500" />,
          duration: 5000,
        });
      }, 3000);
      
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      toast.error("Failed to send emergency alert. Please try again or call emergency services directly.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className={cn(
          "relative",
          isPressed && "animate-ping-subtle"
        )}>
          {/* Ripple effect circles for the SOS button */}
          <div className={cn(
            "absolute inset-0 rounded-full bg-destructive/20 transition-all duration-1000",
            isPressed ? "scale-[2.0] opacity-100" : "scale-100 opacity-0"
          )} />
          <div className={cn(
            "absolute inset-0 rounded-full bg-destructive/40 transition-all duration-700",
            isPressed ? "scale-[1.5] opacity-100" : "scale-100 opacity-0"
          )} />
          
          {/* Main SOS button */}
          <AlertDialogTrigger asChild>
            <button
              className={cn(
                "relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200",
                "bg-gradient-to-br from-red-500 to-red-600 text-white",
                isPressed 
                  ? "scale-90 shadow-inner from-red-600 to-red-700" 
                  : "hover:scale-105 hover:shadow-xl"
              )}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
            >
              <span className="sr-only">Emergency SOS</span>
              <AlertTriangle className="h-8 w-8" />
              
              {/* Progress circle for long press */}
              {isPressTimer && (
                <svg 
                  className="absolute inset-0 w-full h-full -rotate-90" 
                  viewBox="0 0 100 100"
                >
                  <circle
                    className="text-white/20"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-white transition-all duration-100"
                    strokeWidth="4"
                    strokeDasharray={290}
                    strokeDashoffset={290 - (290 * pressTime) / PRESS_THRESHOLD}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                  />
                </svg>
              )}
            </button>
          </AlertDialogTrigger>
        </div>
        
        <span className="block text-center text-xs mt-2 font-medium text-muted-foreground">
          Hold for SOS
        </span>
      </div>
      
      {/* Emergency confirmation dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-md glass-card border-destructive/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Emergency Assistance</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This will send an emergency alert with your current location to the nearest police station and headquarters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {location && (
            <div className="my-4 p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </span>
              </div>
            </div>
          )}
          
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={sendEmergencyAlert}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Alert...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Send Emergency Alert
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SOSButton;
