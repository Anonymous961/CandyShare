import QRCode from "react-qr-code";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

type Props = {
  link: string;
  handleCopy: (txt: string) => void;
};

const QRSection = ({ link, handleCopy }: Props) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 border rounded-xl shadow-sm bg-white">
      <div className="w-full md:w-48 flex flex-col items-center">
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={link}
          viewBox="0 0 256 256"
        />
        <p className="text-sm text-gray-500 mt-3 text-center">
          Scan to download
        </p>
      </div>

      <div className="flex flex-col w-full gap-4">
        <div className="bg-gray-100 rounded-lg px-4 py-3 break-all text-sm text-gray-800">
          {link}
        </div>
        <Button
          variant="outline"
          className="w-max bg-gray-500"
          onClick={() => handleCopy(link)}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
      </div>
    </div>
  );
};

export default QRSection;
