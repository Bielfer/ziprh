'use client';
import { ToastContainer } from '~/components/toast';
import { TrpcProvider } from './trpc-provider';
import { type FC } from 'react';

type Props = {
  children: React.ReactNode;
};

const ClientProviders: FC<Props> = ({ children }) => {
  return (
    <TrpcProvider>
      {children}
      <ToastContainer />
    </TrpcProvider>
  );
};

export default ClientProviders;
