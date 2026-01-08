import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Stats from '@/components/home/stats';
import { FeaturedServices } from '@/components/home/featured-services';
import Header from '@/components/common/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative h-[calc(100vh-4rem)] w-full">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src="https://picsum.photos/seed/1/1200/800"
            alt="Hero background"
            fill
            className="object-cover"
            priority
            data-ai-hint="sri lanka landscape"
          />
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Your Digital Gateway to Sri Lankan Services
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl">
              GovDocs.lk is the centralized digital directory for Sri Lankan government and private sector documentation services.
            </p>
            <div className="mt-8 w-full max-w-2xl relative">
              <Input
                type="search"
                placeholder="Search for NIC, Passport, or Bank Loans..."
                className="w-full h-14 pl-6 pr-16 rounded-full text-lg text-black"
              />
              <Button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 h-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
        <Stats />
        <FeaturedServices />
      </main>
    </div>
  );
}
