
import { cn } from "@/lib/utils";
import { Check, Clock, FileText, Search } from "lucide-react";

interface CaseStatusProps {
  status: 'Initiated' | 'Processing' | 'Under Investigation' | 'Done';
}

const CaseStatus = ({ status }: CaseStatusProps) => {
  // Define the status steps and their order
  const steps = [
    { id: 'Initiated', label: 'FIR Filed', icon: FileText, description: 'First Information Report has been registered successfully' },
    { id: 'Processing', label: 'Processing', icon: Clock, description: 'Your case is being processed for appropriate action' },
    { id: 'Under Investigation', label: 'Under Investigation', icon: Search, description: 'Investigation is underway by assigned officers' },
    { id: 'Done', label: 'Completed', icon: Check, description: 'Investigation has been completed and necessary actions taken' }
  ];
  
  // Find the current step index
  const currentStepIndex = steps.findIndex(step => step.id === status);
  
  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden sm:flex items-center w-full">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 relative">
            {/* Step indicator with icon */}
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center z-10",
                  index <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <step.icon className="h-5 w-5" />
              </div>
              
              <div className="text-sm font-medium mt-2">{step.label}</div>
              <div className="text-xs text-muted-foreground mt-1 text-center px-2">{step.description}</div>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-[2px]">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 ease-apple",
                    index < currentStepIndex ? "bg-primary" : "bg-secondary"
                  )}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile view */}
      <div className="sm:hidden space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-3">
            {/* Step indicator with icon */}
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5",
                index <= currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              <step.icon className="h-4 w-4" />
            </div>
            
            {/* Step content */}
            <div className="flex-1">
              <div className="text-sm font-medium">{step.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
            </div>
            
            {/* Status indicator */}
            <div className="flex-shrink-0">
              {index <= currentStepIndex ? (
                <div className="text-xs font-medium text-primary">Completed</div>
              ) : (
                <div className="text-xs font-medium text-muted-foreground">Pending</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseStatus;
