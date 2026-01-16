
import { createClient } from "@/lib/supabase/server";

export default async function TestSupabase() {
    const supabase = await createClient();

    return (
        <div className="p-10 font-sans">
            <h1 className="text-3xl font-bold mb-6">Supabase Connection Status</h1>

            <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50/50 border-green-200">
                    <h2 className="font-semibold text-green-900">Environment Variables</h2>
                    <ul className="list-disc ml-6 mt-2 text-green-800">
                        <li>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Loaded' : '❌ Missing'}</li>
                        <li>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing'}</li>
                    </ul>
                </div>

                <p className="text-gray-600">
                    If both checks above are green, your application is successfully configured to talk to Supabase!
                </p>
            </div>
        </div>
    )
}
