
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Fingerprint, ChevronRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const AuthForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [step, setStep] = useState<'input' | 'verification' | 'success'>('input');
  const [isLoading, setIsLoading] = useState(false);
  
  // Format Aadhaar number with spaces
  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const parts = [];
    
    for (let i = 0; i < digits.length && i < 12; i += 4) {
      parts.push(digits.substring(i, Math.min(i + 4, digits.length)));
    }
    
    return parts.join(' ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaarNumber(formatted);
  };

  const handleProceed = () => {
    // Validate Aadhaar number (should be 12 digits)
    const digitsOnly = aadhaarNumber.replace(/\D/g, '');
    
    if (digitsOnly.length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    
    setIsLoading(true);
    setStep('verification');
    
    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      
      // Simulate success after showing success state
      setTimeout(() => {
        toast.success("Authentication successful!");
        onSuccess();
      }, 1500);
    }, 2000);
  };

  const getStepContent = () => {
    switch (step) {
      case 'input':
        return (
          <>
            <CardHeader className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-primary/10 p-2">
                  <Fingerprint className="h-4 w-4 text-primary" />
                </span>
                <CardTitle className="text-2xl font-medium">Aadhaar Authentication</CardTitle>
              </div>
              <CardDescription>
                Please enter your 12-digit Aadhaar number to proceed with the FIR filing process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                  maxLength={14} // 12 digits + 2 spaces
                  className="text-lg tracking-wide"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Your Aadhaar details are securely encrypted and only used for verification purposes.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full group transition-all duration-300"
                onClick={handleProceed}
                disabled={aadhaarNumber.replace(/\D/g, '').length !== 12}
              >
                <span>Proceed</span>
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </>
        );
        
      case 'verification':
        return (
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Fingerprint className="h-8 w-8 text-primary animate-pulse-slow" />
            </div>
            <h3 className="text-xl font-medium mt-4">Verifying Identity</h3>
            <p className="text-muted-foreground text-center max-w-xs">
              We're authenticating your Aadhaar details with the secure database.
            </p>
            <Loader2 className="h-8 w-8 text-primary animate-spin mt-2" />
          </CardContent>
        );
        
      case 'success':
        return (
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="rounded-full bg-green-100 p-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mt-4">Authentication Successful</h3>
            <p className="text-muted-foreground text-center max-w-xs">
              Your identity has been verified. You will be redirected shortly.
            </p>
          </CardContent>
        );
    }
  };

  return (
    <Card className={cn(
      "max-w-md w-full mx-auto glass-card transition-all duration-500",
      step === 'success' ? 'border-green-300 shadow-[0_0_0_1px_rgba(74,222,128,0.2)]' : ''
    )}>
      {getStepContent()}
    </Card>
  );
};

export default AuthForm;
