'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Lock, ShieldCheck, Clock } from 'lucide-react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { useEffect, useRef } from 'react';

export default function Home() {
  const servicesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // This is a workaround to pass the refs to the Header component
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      (header as any).servicesRef = servicesRef;
      (header as any).featuresRef = featuresRef;
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header scrollTo={scrollTo} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="text-center py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Secure Document Access for Every Citizen
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Your reliable gateway to official government services, simplified and secured.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
               <Button size="lg" className="bg-primary hover:bg-primary/90">
                 <Image src="/singpass.svg" alt="Singpass" width={24} height={24} className="mr-2" />
                Login with Singpass
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="py-20 px-4 bg-muted/30" id="services">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-foreground mb-12">
              Digital Services at Your Fingertips
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <FileText className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Apply for Permits</CardTitle>
                  <CardDescription>
                    Easily apply for various government permits through our streamlined digital process.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Lock className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Access Official Records</CardTitle>
                  <CardDescription>
                    Securely view and manage your official records and documents from one central place.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                   <FileText className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Submit Applications</CardTitle>
                  <CardDescription>
                    Submit applications for government services with ease and track their status in real-time.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 px-4 bg-white" id="features">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-foreground mb-12">
              A Platform You Can Trust
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Lock className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>End-to-End Encryption</CardTitle>
                  <CardDescription>
                    Your data is protected with the highest level of security to ensure your privacy.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <ShieldCheck className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Verified Identity</CardTitle>
                  <CardDescription>
                    Login with Singpass ensures that your identity is verified and secure.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>24/7 Availability</CardTitle>
                  <CardDescription>
                    Access government services anytime, anywhere, with our platform available 24/7.
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
