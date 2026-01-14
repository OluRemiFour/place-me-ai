import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase } from "lucide-react";
import { UserRole } from "@/contexts/AuthContext";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (role: UserRole) => void;
}

export function RoleSelectionModal({ isOpen, onClose, onSelect }: RoleSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Select Your Role</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Please choose how you would like to use SkillSync to complete your registration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => onSelect('student')}
            className="group p-6 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-200 border-gray-200 bg-white hover:border-black hover:bg-gray-50"
          >
            <GraduationCap className="h-10 w-10 mb-3 text-gray-900" />
            <div className="text-lg font-bold">Student</div>
            <p className="text-xs mt-1 text-center font-medium text-gray-500">
              Find matching roles
            </p>
          </button>

          <button
            onClick={() => onSelect('industry')}
            className="group p-6 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-200 border-gray-200 bg-white hover:border-black hover:bg-gray-50"
          >
            <Briefcase className="h-10 w-10 mb-3 text-gray-900" />
            <div className="text-lg font-bold">Recruiter</div>
            <p className="text-xs mt-1 text-center font-medium text-gray-500">
              Find top talent
            </p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
