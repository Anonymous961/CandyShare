import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
        Share files instantly & securely
      </h2>
      <Image
        src="/illustration/file4.png"
        alt="Illustration of file sharing"
        width={400}
        height={400}
        className="object-contain"
        priority
      />
      <p className="text-gray-600 max-w-md">
        Drag & drop or upload your file and generate a secure QR code link to
        share with anyone, anytime.
      </p>
    </div>
  );
};

export default HeroSection;
