import "~/styles/globals.css";
import { type FC } from "react";
import ClientProviders from "~/app/client-providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ptBR } from "@clerk/localizations";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

type Props = {
  children: React.ReactNode;
};

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="en" className={inter.className}>
        <head>
          <link rel="icon" href="/logo-icon.png" sizes="any" />
          <link
            rel="icon"
            href="/icon?/logo-icon.png"
            type="image/png"
            sizes="any"
          />
          <link
            rel="apple-touch-icon"
            href="/apple-icon?/logo-icon.png"
            type="image/png"
            sizes="any"
          />
        </head>
        <body>
          <ClientProviders>{children}</ClientProviders>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
