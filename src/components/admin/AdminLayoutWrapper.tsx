import { AdminSidebar } from '@/components/admin/Sidebar';

export default function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-muted/10">
                    {children}
                </main>
            </div>
        </div>
    );
}
