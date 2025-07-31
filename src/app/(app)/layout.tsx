import AppNav from '@/components/app-nav';
import { SubjectProvider } from '@/context/SubjectContext';
import { SettingsProvider } from '@/context/SettingsContext';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SettingsProvider>
      <SubjectProvider>
        <div className="flex min-h-screen flex-col">
          <AppNav />
          <main className="flex-1">
            <div className="container py-4 sm:py-6 lg:py-8">{children}</div>
          </main>
        </div>
      </SubjectProvider>
    </SettingsProvider>
  );
}
