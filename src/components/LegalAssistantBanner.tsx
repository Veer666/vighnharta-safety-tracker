
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";

const LegalAssistantBanner: React.FC = () => {
  return (
    <Card className="bg-primary/5 border-primary/20 p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              <span className="text-primary">विधि साथी</span> | VidhiSaarthi
            </h3>
            <p className="text-muted-foreground">
              Your AI legal assistant for Indian law guidance
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to="/legal-assistant">
            <MessageSquareText className="mr-2 h-4 w-4" />
            Ask Legal Questions
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default LegalAssistantBanner;
