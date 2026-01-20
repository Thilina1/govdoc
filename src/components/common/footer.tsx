import Link from 'next/link';
import Image from 'next/image';
import { Apple, Smartphone, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Main Links */}
          <div className="md:col-span-8">
            <Link href="/" className="mb-8 inline-block">
              <span className="font-bold text-2xl">GovDocs LK</span>
            </Link>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">About</h4>
                <ul className="space-y-3 text-neutral-300">
                  <li><Link href="#" className="hover:text-white">About Us</Link></li>
                  <li><Link href="#" className="hover:text-white">Careers</Link></li>
                  <li><Link href="#" className="hover:text-white">Security</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Support</h4>
                <ul className="space-y-3 text-neutral-300">
                  <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
                  <li>
                    <Link href="#" className="flex items-center gap-2 hover:text-white">
                      Help Centre & FAQs <ExternalLink size={16} />
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Media</h4>
                <ul className="space-y-3 text-neutral-300">
                  <li>
                    <Link href="#" className="flex items-center gap-2 hover:text-white">
                      Blog <ExternalLink size={16} />
                    </Link>
                  </li>
                  <li><Link href="#" className="hover:text-white">Newsroom</Link></li>
                </ul>
              </div>
            </div>
          </div>
          {/* App Store Links */}
          <div className="md:col-span-4 flex flex-col items-start md:items-end">
            <div className="flex flex-col space-y-4 w-48">
              <a href="#" className="flex items-center bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 hover:bg-neutral-700">
                <Apple className="w-6 h-6 mr-3" />
                <div>
                  <p className="text-xs">Download on the</p>
                  <p className="text-lg font-semibold">App Store</p>
                </div>
              </a>
              <a href="#" className="flex items-center bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 hover:bg-neutral-700">
                <Smartphone className="w-6 h-6 mr-3" />
                <div>
                  <p className="text-xs">GET IT ON</p>
                  <p className="text-lg font-semibold">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 md:mb-0">
               <Link href="#" className="flex items-center gap-2 hover:text-white">
                  Terms of Service <ExternalLink size={14} />
                </Link>
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
               <Link href="#" className="flex items-center gap-2 hover:text-white">
                  Report Vulnerability <ExternalLink size={14} />
                </Link>
            </div>
            <p className="text-center md:text-right">
              &copy; {currentYear} GovDocs LK. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
