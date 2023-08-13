import '~/styles/globals.css';
import { type FC } from 'react';
import ClientProviders from '~/app/client-providers';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

type Props = {
  children: React.ReactNode;
};

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: 'black',
          colorText: 'black',
        },
      }}
    >
      <html lang="en" className={inter.className}>
        <body>
          <ClientProviders>{children}</ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
