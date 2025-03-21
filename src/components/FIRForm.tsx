
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MapPin, Calendar, Clock, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// FIR categories
const incidentTypes = [
  "Theft/Burglary",
  "Assault/Battery",
  "Fraud/Cheating",
  "Vehicle Theft",
  "Harassment",
  "Cybercrime",
  "Property Damage",
  "Missing Person/Item",
  "Other"
];

const FIRForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    address: '',
    incidentDate: '',
    incidentTime: '',
    incidentType: '',
    incidentLocation: '',
    incidentDescription: '',
  });
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [caseID, setCaseID] = useState('');
  const [caseType, setCaseType] = useState<'cognizable' | 'non-cognizable' | ''>('');
  
  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address (simulated here)
          setTimeout(() => {
            setFormData({
              ...formData,
              incidentLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Auto-detected location)`
            });
            setIsLoadingLocation(false);
            toast.success("Location detected successfully");
          }, 1500);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          toast.error("Could not detect location. Please enter manually.");
        }
      );
    } else {
      setIsLoadingLocation(false);
      toast.error("Geolocation is not supported by your browser");
    }
  };
  
  // Set current date and time on initial load
  useEffect(() => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const timeString = now.toTimeString().split(' ')[0].substring(0, 5);
    
    setFormData({
      ...formData,
      incidentDate: dateString,
      incidentTime: timeString
    });
  }, []);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['fullName', 'contactNumber', 'address', 'incidentDate', 
                            'incidentTime', 'incidentType', 'incidentLocation', 'incidentDescription'];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\D/g, ''))) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    
    // Email validation (if provided)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Submit the form
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate a case ID
      const caseIDNumber = Math.floor(100000 + Math.random() * 900000);
      setCaseID(`VGH-${caseIDNumber}`);
      
      // Determine case type (simplified AI analysis simulation)
      const isCognizable = ['Theft/Burglary', 'Assault/Battery', 'Vehicle Theft'].includes(formData.incidentType);
      setCaseType(isCognizable ? 'cognizable' : 'non-cognizable');
      
      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 2000);
  };
  
  // Format the confirmation message based on case type
  const getConfirmationMessage = () => {
    if (caseType === 'cognizable') {
      return "Your case has been classified as COGNIZABLE, which requires immediate police action. An officer will be assigned to investigate this case.";
    } else {
      return "Your case has been classified as NON-COGNIZABLE, which requires magistrate approval before police investigation can begin.";
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto glass-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-medium">File a First Information Report (FIR)</CardTitle>
          <CardDescription>
            Please provide detailed information about the incident. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input 
                    id="contactNumber" 
                    name="contactNumber" 
                    value={formData.contactNumber} 
                    onChange={handleChange} 
                    placeholder="Enter your 10-digit phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="Enter your current address"
                  />
                </div>
              </div>
            </div>
            
            {/* Incident Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Incident Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incidentDate" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Date of Incident *</span>
                  </Label>
                  <Input 
                    id="incidentDate" 
                    name="incidentDate" 
                    type="date" 
                    value={formData.incidentDate} 
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incidentTime" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Time of Incident *</span>
                  </Label>
                  <Input 
                    id="incidentTime" 
                    name="incidentTime" 
                    type="time" 
                    value={formData.incidentTime} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incidentType">Type of Incident *</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('incidentType', value)}
                    value={formData.incidentType}
                  >
                    <SelectTrigger id="incidentType">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incidentLocation" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Location of Incident *</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id="incidentLocation" 
                      name="incidentLocation" 
                      value={formData.incidentLocation} 
                      onChange={handleChange} 
                      placeholder="Enter incident location"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={getCurrentLocation}
                      disabled={isLoadingLocation}
                    >
                      {isLoadingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="incidentDescription">Description of Incident *</Label>
                <Textarea 
                  id="incidentDescription" 
                  name="incidentDescription" 
                  value={formData.incidentDescription} 
                  onChange={handleChange} 
                  placeholder="Provide a detailed description of what happened..."
                  rows={5}
                />
              </div>
            </div>
            
            <CardFooter className="px-0 flex flex-col sm:flex-row gap-4">
              <Button 
                type="submit" 
                className="w-full sm:w-auto flex items-center gap-2 transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Submit FIR</span>
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => setFormData({
                  fullName: '',
                  contactNumber: '',
                  email: '',
                  address: '',
                  incidentDate: new Date().toISOString().split('T')[0],
                  incidentTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
                  incidentType: '',
                  incidentLocation: '',
                  incidentDescription: '',
                })}
              >
                Reset Form
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      
      {/* Case Registration Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="glass-card max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">FIR Registered Successfully</AlertDialogTitle>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto my-4">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <AlertDialogDescription className="text-center space-y-4">
              <p>Your FIR has been successfully registered with case ID:</p>
              <p className="text-2xl font-semibold text-foreground">{caseID}</p>
              <p className={cn(
                "text-sm font-medium py-1 px-3 rounded-full mx-auto w-fit",
                caseType === 'cognizable' 
                  ? "bg-green-100 text-green-800" 
                  : "bg-amber-100 text-amber-800"
              )}>
                {caseType.toUpperCase()}
              </p>
              <p className="text-sm">{getConfirmationMessage()}</p>
              <p className="text-sm">Please note down the case ID for future reference and tracking.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="w-full"
              onClick={() => {
                setShowConfirmation(false);
                // Redirect to track case page
                window.location.href = `/track-case?id=${caseID}`;
              }}
            >
              Track My Case
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FIRForm;
