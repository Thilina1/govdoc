import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white text-foreground border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
          <div className="col-span-2 md:col-span-1">
             <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="/logo.png" alt="GovDocs LK Logo" width={30} height={30} data-ai-hint="logo"/>
              <span className="font-bold text-lg">GovDocs LK</span>
            </Link>
            <p className="text-xs text-muted-foreground">Secure Document Access for Every Citizen.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Help Centre & FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Media</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary">Newsroom</Link></li>
              <li><Link href="#" className="hover:text-primary">App Gallery</Link></li>
            </ul>
          </div>
           <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Report Vulnerability</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6">
          <p className="text-center text-xs text-muted-foreground">&copy; 2024 GovDocs LK. All rights reserved. Last updated 25 Nov 2025</p>
        </div>
      </div>
    </footer>
  );
}
