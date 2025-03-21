
import React from 'react';
import VidhiSaarthi from '@/components/VidhiSaarthi';

const LegalAssistantPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">विधि साथी (VidhiSaarthi)</h1>
        <p className="text-muted-foreground">
          Ask questions about Indian law, including IPC and CrPC sections. Get simple explanations for legal procedures and advice for common situations.
        </p>
      </div>
      <VidhiSaarthi />
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Disclaimer: VidhiSaarthi provides general legal information based on Indian law. This is not a substitute for professional legal advice.</p>
      </div>
    </div>
  );
};

export default LegalAssistantPage;
