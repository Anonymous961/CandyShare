import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-500 shadow-lg backdrop-blur-md rounded-b-2xl">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="group relative w-12 h-12">
          <Image
            src="/icon.png"
            alt="CandyShare Icon"
            width={48}
            height={48}
            className="rounded-full border-2 border-white p-1 transform transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <h1 className="text-white text-3xl md:text-4xl font-bold font-sans tracking-wide select-none">
          CandyShare
        </h1>
      </div>

      {/* Optional tagline / nav */}
      <span className="text-white text-sm md:text-base italic opacity-90 hidden md:block">
        Share files securely & instantly
      </span>
    </header>
  );
}
