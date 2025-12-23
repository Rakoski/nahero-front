import "./globals.css";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
