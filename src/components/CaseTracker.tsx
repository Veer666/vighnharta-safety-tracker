
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Search, Loader2, FileText } from 'lucide-react';
import CaseStatus from './case/CaseStatus';
import { cn } from '@/lib/utils';

interface CaseDetails {
  id: string;
  complainantName: string;
  filingDate: string;
  incidentType: string;
  status: 'Initiated' | 'Processing' | 'Under Investigation' | 'Done';
  assignedOfficer?: string;
  lastUpdated: string;
  caseType: 'cognizable' | 'non-cognizable';
  description: string;
}

// Simulated database of cases
const MOCK_CASES: Record<string, CaseDetails> = {
  'VGH-123456': {
    id: 'VGH-123456',
    complainantName: 'Rahul Sharma',
    filingDate: '2023-10-15',
    incidentType: 'Theft/Burglary',
    status: 'Done',
    assignedOfficer: 'Inspector Vikram Singh',
    lastUpdated: '2023-10-22',
    caseType: 'cognizable',
    description: 'Theft of laptop and mobile phone from residence'
  },
  'VGH-789012': {
    id: 'VGH-789012',
    complainantName: 'Priya Patel',
    filingDate: '2023-11-05',
    incidentType: 'Harassment',
    status: 'Processing',
    assignedOfficer: 'Sub-Inspector Meera Desai',
    lastUpdated: '2023-11-10',
    caseType: 'non-cognizable',
    description: 'Harassment by neighbor regarding property dispute'
  },
  'VGH-345678': {
    id: 'VGH-345678',
    complainantName: 'Amit Kumar',
    filingDate: '2023-11-20',
    incidentType: 'Vehicle Theft',
    status: 'Under Investigation',
    assignedOfficer: 'Inspector Rajesh Verma',
    lastUpdated: '2023-11-25',
    caseType: 'cognizable',
    description: 'Theft of car from public parking area'
  }
};

const CaseTracker = () => {
  const [caseId, setCaseId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [error, setError] = useState('');
  
  // Define handleTrack function before using it in useEffect
  const handleTrack = async (id = caseId) => {
    if (!id) {
      toast.error("Please enter a valid case ID");
      return;
    }
    
    setIsSearching(true);
    setError('');
    setCaseDetails(null);
    
    // Simulate API call
    setTimeout(() => {
      const foundCase = MOCK_CASES[id];
      
      if (foundCase) {
        setCaseDetails(foundCase);
        // Update the URL with the case ID without reloading the page
        const url = new URL(window.location.href);
        url.searchParams.set('id', id);
        window.history.pushState({}, '', url);
      } else {
        setError(`No case found with ID: ${id}`);
        toast.error("Case not found. Please check the ID and try again.");
      }
      
      setIsSearching(false);
    }, 1500);
  };
  
  // Use useEffect instead of useState for initialization logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setCaseId(idFromUrl);
      handleTrack(idFromUrl);
    }
  }, []); // Empty dependency array means this runs once on mount
  
  const formatCaseIdInput = (value: string) => {
    // Format as VGH-XXXXXX
    let formatted = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    if (formatted.startsWith('VGH-') || formatted === 'V' || formatted === 'VG' || formatted === 'VGH') {
      return formatted;
    }
    
    // If the user has typed numbers directly, add the VGH- prefix
    if (/^\d+$/.test(formatted)) {
      return `VGH-${formatted}`;
    }
    
    // Otherwise, ensure the format is correct
    if (!formatted.startsWith('VGH-')) {
      return `VGH-${formatted}`;
    }
    
    return formatted;
  };
  
  const handleCaseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCaseIdInput(e.target.value);
    setCaseId(formatted);
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      <Card className="w-full glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Track Your Case</CardTitle>
          <CardDescription>
            Enter your case ID to check the current status of your FIR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="caseId" className="sr-only">Case ID</Label>
              <Input
                id="caseId"
                placeholder="Enter Case ID (e.g., VGH-123456)"
                value={caseId}
                onChange={handleCaseIdChange}
                className="h-11"
              />
            </div>
            <Button 
              onClick={() => handleTrack()} 
              className="h-11 px-6"
              disabled={isSearching || !caseId}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track Case
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground flex flex-col items-start">
          <p>Try these sample IDs: VGH-123456, VGH-789012, VGH-345678</p>
        </CardFooter>
      </Card>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
          <p className="mt-2 text-sm">
            Please verify the case ID and try again. If you continue to face issues, please contact the police station where the FIR was filed.
          </p>
        </div>
      )}
      
      {caseDetails && (
        <div className="animate-fade-in">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Case ID</div>
                  <CardTitle className="text-2xl">{caseDetails.id}</CardTitle>
                </div>
                <div className={cn(
                  "text-sm py-1 px-3 rounded-full",
                  caseDetails.caseType === 'cognizable' 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"
                )}>
                  {caseDetails.caseType.toUpperCase()}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Complainant</div>
                  <div>{caseDetails.complainantName}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Filing Date</div>
                  <div>{new Date(caseDetails.filingDate).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Incident Type</div>
                  <div>{caseDetails.incidentType}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Last Updated</div>
                  <div>{new Date(caseDetails.lastUpdated).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Assigned Officer</div>
                  <div>{caseDetails.assignedOfficer || 'Not yet assigned'}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
                <div className="text-sm">{caseDetails.description}</div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-4">Case Status</h3>
                <CaseStatus status={caseDetails.status} />
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              For any queries regarding this case, please contact the assigned officer or visit your nearest police station.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTracker;
