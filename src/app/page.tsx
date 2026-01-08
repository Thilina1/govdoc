'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, CreditCard, FileText, Banknote, ShieldCheck, Lock, FolderLock } from 'lucide-react';
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
        <section className="relative text-center py-20 px-4 h-[500px] flex flex-col items-center justify-center text-white">
          <Image
            src="https://picsum.photos/seed/govdocs/1200/500"
            alt="Hero background"
            fill
            className="object-cover absolute inset-0 z-0"
            data-ai-hint="cityscape building"
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="relative z-20 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold">
              Secure Document Access for Every Citizen
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">
              Your reliable gateway to official government services, simplified and secured.
            </p>
            <div className="mt-8 max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for a service..."
                  className="w-full pl-12 pr-4 py-6 rounded-md border-2 border-transparent focus:border-primary focus:ring-primary/50 text-foreground"
                />
              </div>
            </div>
             <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 px-8 rounded-full">
                <Link href="/login">Login with GovDocs</Link>
             </Button>
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
