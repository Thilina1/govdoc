import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const AppleStoreIcon = () => (
    <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
      <path d="M19.3,4.05c-2.18-2.31-5.32-2.5-7.4-2.5C9.72,1.55,7.03,2.65,5.2,4.85c-2.3,2.7-3.2,6.5-2.2,10.2c0.9,3.3,3.3,6.2,6,6.4
	c1.2,0.1,2.5-0.5,3.6-0.5c1.1,0,2.6,0.6,3.8,0.5c2.9-0.2,5.2-2.6,6-5.5C23,10.25,21.48,6.35,19.3,4.05z M14.6,18.45
	c-0.9,2-2.6,3.2-4.1,3.2c-1.3,0-2.3-0.8-3.3-2.1c-1-1.3-1.8-3.4-1-5.4c0.8-2,2.6-3.3,4.2-3.3c1.2,0,2.4,0.7,3.3,2
	C14.7,14.05,15.6,16.45,14.6,18.45z M16.7,8.05c-0.1-2.4,1.8-3.8,3.7-3.9c0.1,1.5-0.5,2.9-1.5,3.9C18.2,8.85,17.2,9.05,16.7,8.05z" />
    </svg>
  );

  const GooglePlayIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path d="M2.7,1.55l10,5.8l-10,5.8V1.55z M14.1,8.15l-3,1.7l3,1.7l3.8-2.2L14.1,8.15z M2.7,19.35l10-5.8l-10-5.8V19.35z M17.9,11.55
	l-3.8-2.2l-3,1.7l3,1.7L17.9,11.55z M21.3,12.75l-3.2-1.8l-3.9,2.2l3.9,2.2L21.3,12.75z" fill="currentColor" />
    </svg>
  );

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-white text-lg mb-4">GovDocs LK</h3>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white">Help Centre & FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Media</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
              <li><Link href="#" className="hover:text-white">Newsroom</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1 space-y-2">
            <Button variant="outline" className="w-full bg-black text-white border-gray-600 hover:bg-gray-800 justify-start">
              <AppleStoreIcon />
              <div>
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </Button>
            <Button variant="outline" className="w-full bg-black text-white border-gray-600 hover:bg-gray-800 justify-start">
              <GooglePlayIcon />
              <div>
                <div className="text-xs">GET IT ON</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex gap-4 mb-4 md:mb-0">
              <Link href="#" className="hover:text-white">Terms of Service</Link>
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
            </div>
            <p className="text-gray-400">© 2024 GovDocs LK. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
