import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">GovDocs LK</h3>
            <p className="text-sm">Your reliable gateway to official government services, simplified and secured.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Help Centre & FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Media</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary">Newsroom</Link></li>
              <li><Link href="#" className="hover:text-primary">App Gallery</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex gap-4 mb-4 md:mb-0">
              <Link href="#" className="hover:text-primary">Terms of Service</Link>
              <Link href="#" className="hover:text-primary">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary">Report Vulnerability</Link>
            </div>
            <p className="text-gray-500">© 2024 GovDocs LK. All rights reserved. Last updated 25 Nov 2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
