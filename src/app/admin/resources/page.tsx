'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, GraduationCap, BookOpen, Calendar, Briefcase, FileCheck } from 'lucide-react';
import Link from 'next/link';

const resourceTypes = [
    {
        title: 'Gazette',
        slug: 'gazette',
        description: 'Official government gazettes',
        icon: FileText,
        color: 'text-blue-600',
    },
    {
        title: 'Past Papers',
        slug: 'past-papers',
        description: 'Exam past papers',
        icon: FileCheck,
        color: 'text-green-600',
    },
    {
        title: 'Model Papers',
        slug: 'model-papers',
        description: 'Model exam papers',
        icon: FileCheck,
        color: 'text-yellow-600',
    },
    {
        title: 'Syllabus',
        slug: 'syllabus',
        description: 'Curriculum syllabuses',
        icon: BookOpen,
        color: 'text-purple-600',
    },
    {
        title: 'Teacher Guides',
        slug: 'teacher-guides',
        description: 'Guides for teachers',
        icon: GraduationCap,
        color: 'text-orange-600',
    },
    {
        title: 'Text Books',
        slug: 'text-books',
        description: 'School text books',
        icon: BookOpen,
        color: 'text-pink-600',
    },
    {
        title: 'Exam Calendars',
        slug: 'exam-calendars',
        description: 'Examination schedules',
        icon: Calendar,
        color: 'text-red-600',
    },
    {
        title: 'Jobs',
        slug: 'jobs',
        description: 'Government job vacancies',
        icon: Briefcase,
        color: 'text-indigo-600',
    },
    // Add other types as needed
];

export default function ResourcesDashboard() {
    return (
        <AdminLayoutWrapper>
            <div className="flex flex-col h-full bg-gray-50/50">
                <AdminHeader title="Resources Management" />
                <div className="p-8 max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {resourceTypes.map((resource) => (
                            <Link key={resource.slug} href={`/admin/resources/${resource.slug}`}>
                                <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50 h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-bold">
                                            {resource.title}
                                        </CardTitle>
                                        <resource.icon className={`h-6 w-6 ${resource.color}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {resource.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayoutWrapper>
    );
}
