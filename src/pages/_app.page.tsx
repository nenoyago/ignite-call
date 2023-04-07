import '@lib/dayjs';

import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@lib/react-query';
import { theme } from '@neno-ignite-ui/react';
import { globalStyles } from '@styles/global';
import { DefaultSeo } from 'next-seo';
import { Toaster } from 'react-hot-toast';

globalStyles();

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            url: 'https://ignite-call.com.br/',
            siteName: 'Ignite Call'
          }}
        />
        <Component {...pageProps} />
        <Toaster
          gutter={8}
          toastOptions={{
            style: {
              background: theme.colors.gray700.value,
              color: theme.colors.gray100.value,
              borderRadius: theme.radii.md.value,
              border: `1px solid ${theme.colors.gray600.value}`,
              padding: theme.space[3].value,
              fontSize: theme.fontSizes.md.value
            }
          }}
        />
      </SessionProvider>
    </QueryClientProvider>
  );
}
