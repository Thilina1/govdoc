'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, CreditCard, FileText, Banknote, ShieldCheck, Lock, FolderLock, Apple, TabletSmartphone, Smartphone } from 'lucide-react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import Link from 'next/link';

export default function Home() {
  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header scrollTo={scrollTo} servicesRef={servicesRef} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white bg-red-600">
           <Image
            src="/Hero_landing_desktop.webp"
            alt="Hero background"
            fill
            className="object-cover absolute inset-0 z-0"
            data-ai-hint="people using phone"
          />
          <div className="container mx-auto px-4 relative z-10 flex items-center min-h-screen">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Your improved digital ID to make life easy
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  GovDocs LK is your trusted digital identity for all the secure transaction needs in your everyday life.
                </p>
                <div className="flex space-x-4 pt-4">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                     <Apple className="mr-2 h-5 w-5" /> Download on the App Store
                  </Button>
                   <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                     <Smartphone className="mr-2 h-5 w-5" /> GET IT ON Google Play
                  </Button>
                   <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                     <TabletSmartphone className="mr-2 h-5 w-5" /> EXPLORE IT ON AppGallery
                  </Button>
                </div>
              </div>
              <div>
                {/* This div is intentionally left empty to allow the background image to show through on the right side */}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="py-20 px-4 bg-white" id="services">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Digital Services at Your Fingertips
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card className="border-0 shadow-none">
                <CardHeader className="items-center">
                  <CreditCard className="w-16 h-16 text-primary mb-4" />
                  <CardTitle className="text-xl">Apply for Permits</CardTitle>
                  <CardDescription>
                    Quickly apply for permits with our streamlined online forms.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-none">
                <CardHeader className="items-center">
                  <FileText className="w-16 h-16 text-primary mb-4" />
                  <CardTitle>Access Official Records</CardTitle>
                  <CardDescription>
                    Securely view and download your official documents anytime.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-none">
                <CardHeader className="items-center">
                  <Banknote className="w-16 h-16 text-primary mb-4" />
                  <CardTitle>Submit Applications</CardTitle>
                  <CardDescription>
                    Easily submit applications for various government services.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-background" id="features">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              A Platform You Can Trust
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card className="bg-transparent border-0 shadow-none items-center">
                <CardHeader className="items-center">
                  <Lock className="w-16 h-16 text-primary mb-4" />
                  <CardTitle className="text-xl">End-to-End Encryption</CardTitle>
                  <CardDescription>
                    Your data is protected with the highest security standards.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-transparent border-0 shadow-none items-center">
                <CardHeader className="items-center">
                  <ShieldCheck className="w-16 h-16 text-primary mb-4" />
                  <CardTitle>Verified Identity</CardTitle>
                  <CardDescription>
                    We ensure that your identity is verified and secure.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-transparent border-0 shadow-none items-center">
                <CardHeader className="items-center">
                  <FolderLock className="w-16 h-16 text-primary mb-4" />
                  <CardTitle>24/7 Availability</CardTitle>
                  <CardDescription>
                    Access our services anytime, anywhere, on any device.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
