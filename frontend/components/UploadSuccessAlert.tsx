import { CheckCircle2, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface UploadSuccessAlertProps {
  onClose?: () => void;
}

const UploadSuccessAlert = ({ onClose }: UploadSuccessAlertProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-[320px] animate-in slide-in-from-right-5 duration-300">
      <Alert className="border-green-200 bg-green-50">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 w-40">
              <AlertTitle className="text-green-900 font-semibold">
                Upload Successful!
              </AlertTitle>
              <AlertDescription className="text-green-700 mt-1">
                Your file was uploaded successfully and is ready to share.
              </AlertDescription>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};

export default UploadSuccessAlert;
