import { SiteFooter, SiteNavigation } from "../site-navigation";

/** Shared shell for the public portfolio routes. */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteNavigation />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
