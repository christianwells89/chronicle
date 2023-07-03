import { Metadata } from 'next';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Chronicle',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en">
    <body>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
