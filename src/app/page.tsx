'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, CreditCard, FileText, Banknote, ShieldCheck, Lock, FolderLock } from 'lucide-react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

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
        <section className="text-center py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              Streamlining Sri Lanka's Documentation
            </h1>
            <p className="mt-4 text-lg md:text-xl text-foreground/80">
              Your central hub for government and private sector document services.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for a service (e.g., 'Passport', 'NIC', 'Loan')..."
                  className="w-full pl-12 pr-4 py-6 rounded-full border-2 border-primary/20 focus:border-primary focus:ring-primary/50 shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="py-20 px-4 bg-white" id="services">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-primary mb-12">
              Our Service Guides
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-md hover:shadow-xl transition-shadow rounded-xl">
                <CardHeader>
                  <CreditCard className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>National ID (NIC)</CardTitle>
                  <CardDescription>
                    Guide to the 2026 Digital ID and ICAO photo requirements.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-xl transition-shadow rounded-xl">
                <CardHeader>
                  <FileText className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Passport (K-35 A)</CardTitle>
                  <CardDescription>
                    Online application process and regional biometric center info.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-xl transition-shadow rounded-xl">
                <CardHeader>
                  <Banknote className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Banking Guide</CardTitle>
                  <CardDescription>
                    Digital account opening, personal loans, and Video KYC.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4" id="features">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-primary mb-12">
              A Platform Built on Trust
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-transparent border-0 shadow-none text-center items-center">
                <CardHeader>
                  <div className="flex justify-center">
                    <Lock className="w-12 h-12 text-accent mb-4" />
                  </div>
                  <CardTitle>Document Checklists</CardTitle>
                  <CardDescription>
                    Clear and concise lists of required documents for every service.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-transparent border-0 shadow-none text-center items-center">
                <CardHeader>
                  <div className="flex justify-center">
                    <ShieldCheck className="w-12 h-12 text-accent mb-4" />
                  </div>
                  <CardTitle>Step-by-Step Trackers</CardTitle>
                  <CardDescription>
                    Visually track your application progress from start to finish.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-transparent border-0 shadow-none text-center items-center">
                <CardHeader>
                  <div className="flex justify-center">
                    <FolderLock className="w-12 h-12 text-accent mb-4" />
                  </div>
                  <CardTitle>e-Locker 2026</CardTitle>
                  <CardDescription>
                    Learn about the upcoming government digital document vault.
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
