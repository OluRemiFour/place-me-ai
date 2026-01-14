import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  missingFields: string[];
}

export function ProfileCompletionModal({ isOpen, missingFields }: ProfileCompletionModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] bg-white text-black border-2 border-black shadow-[8px_8px_0_0_#000]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            You need to complete your profile before you can access all features of SkillSync.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm font-semibold mb-2">Missing Information:</p>
          <ul className="list-disc pl-5 space-y-1">
            {missingFields.map((field, idx) => (
              <li key={idx} className="text-sm text-gray-700 capitalize">
                {field.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={() => navigate('/complete-profile')}
            className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-all font-bold group"
          >
            Go to Settings
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
