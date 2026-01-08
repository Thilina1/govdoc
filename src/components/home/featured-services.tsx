import { ServiceCard, type ServiceCardProps } from './service-card';
import { BadgeInfo, BookUser, Landmark, ShieldCheck } from 'lucide-react';

const services: ServiceCardProps[] = [
  {
    title: 'National ID (NIC)',
    description: 'The 2026 Digital ID process and ICAO photo requirements.',
    href: '#',
    icon: <BadgeInfo className="size-12 text-primary" />,
  },
  {
    title: 'Passport (K-35 A)',
    description: 'Online application and regional biometric centers.',
    href: '#',
    icon: <BookUser className="size-12 text-primary" />,
  },
  {
    title: 'Banking',
    description: 'Digital account opening and personal loans (Video KYC).',
    href: '#',
    icon: <Landmark className="size-12 text-primary" />,
  },
  {
    title: 'e-Locker',
    description: 'The new 2026 government digital document vault.',
    href: '#',
    icon: <ShieldCheck className="size-12 text-primary" />,
  },
];

export function FeaturedServices() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Featured Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Quick access to essential documentation services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
