
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Search, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import SOSButton from '@/components/SOSButton';
import VidhiSaarthi from '@/components/VidhiSaarthi';

const Index = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 text-center"
        >
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight mb-2">Vighnharta</h1>
          <p className="text-xl text-muted-foreground">FIR Management System</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md"
        >
          <AuthForm onSuccess={() => setAuthenticated(true)} />
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-block rounded-full bg-primary/10 p-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Welcome to Vighnharta</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A streamlined FIR management system designed for the digital age
          </p>
        </motion.div>
        
        {/* VidhiSaarthi AI Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12"
        >
          <h2 className="text-2xl font-medium text-center mb-6">Your Legal Assistant</h2>
          <VidhiSaarthi />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={FileText}
            title="File an FIR"
            description="Submit a First Information Report to report an incident or crime"
            buttonText="Start Filing"
            onClick={() => navigate('/file-fir')}
            delay={0.1}
          />
          
          <FeatureCard
            icon={Search}
            title="Track Your Case"
            description="Check the status of your filed case using the case ID"
            buttonText="Track Now"
            onClick={() => navigate('/track-case')}
            delay={0.2}
          />
          
          <FeatureCard
            icon={AlertTriangle}
            title="Emergency Assistance"
            description="Get immediate help in case of emergency situations"
            buttonText="SOS"
            onClick={() => navigate('/emergency')}
            variant="destructive"
            delay={0.3}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vighnharta aims to make the FIR filing and tracking process transparent, efficient, and citizen-friendly.
          </p>
        </motion.div>
      </main>
      
      <SOSButton />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  delay?: number;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onClick, 
  variant = 'default',
  delay = 0 
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Card className="h-full glass-card glass-card-hover">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="mb-4">
            <div className={`inline-block rounded-full p-2 ${variant === 'destructive' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
              <Icon className={`h-6 w-6 ${variant === 'destructive' ? 'text-destructive' : 'text-primary'}`} />
            </div>
          </div>
          
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
          
          <Button 
            variant={variant} 
            onClick={onClick}
            className="w-full group"
          >
            <span>{buttonText}</span>
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Index;
