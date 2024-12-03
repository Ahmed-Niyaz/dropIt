import Navbar from "@/components/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}


export default async function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
        <body className="flex flex-col min-h-screen"
        >
          <Navbar />
          {children}
        </body>
    </html>
  );
}
