import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const UploadSuccessAlert = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[300px]">
      <Alert>
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>Upload Successful!</AlertTitle>

        <AlertDescription>
          Your file was uploaded successfully!.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UploadSuccessAlert;
