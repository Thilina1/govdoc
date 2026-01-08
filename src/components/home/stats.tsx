'use client';

import { Building, Briefcase, Server } from 'lucide-react';

const stats = [
  { name: 'Government Agencies', value: 150, icon: Building },
  { name: 'Private Businesses', value: 300, icon: Briefcase },
  { name: 'Services Covered', value: 1000, icon: Server },
];

export default function Stats() {
  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your Guide to Sri Lankan Services
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Access comprehensive documentation guides for services from hundreds of government agencies and private sector businesses, all at your fingertips.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-10 text-center md:grid-cols-3 md:gap-x-8">
          {stats.map((stat) => (
            <div key={stat.name} className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-full shadow-lg">
                <stat.icon className="h-10 w-10 text-primary-foreground" aria-hidden="true" />
              </div>
              <dt className="mt-4 text-lg font-medium leading-6 text-muted-foreground">{stat.name}</dt>
              <dd className="mt-2 text-4xl font-bold tracking-tight text-accent">
                {stat.value}+
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
