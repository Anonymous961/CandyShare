import { Github, Mail, Twitter, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              CandyShare
            </h3>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              Secure, fast, and simple file sharing. Upload your files and share them 
              instantly with secure temporary links and QR codes.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Anonymous961"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@candyshare.xyz"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/ark845613"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Status
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                DMCA
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by</span>
              <a
                href="https://github.com/Anonymous961"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Anil
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            © 2025 CandyShare. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
