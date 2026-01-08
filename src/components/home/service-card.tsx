import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}

export function ServiceCard({ title, description, href, icon }: ServiceCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2 border-transparent hover:border-primary/20 bg-card">
        <CardHeader className="flex flex-col items-start gap-4 pb-4">
          {icon}
          <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 h-20">{description}</p>
          <div className="flex items-center font-semibold text-primary">
            Learn More
            <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
