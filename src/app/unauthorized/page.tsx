import { type Metadata } from "next";
import { type FC } from "react";
import GoBackButton from "./go-back-button";

export const metadata: Metadata = {
  title: "Você não possui permissão | ZipRH",
  description:
    "Você não possui permissão para acessar esse conteúdo, caso acredite que isso seja um erro fale conosco pelo chat",
};

const UnauthorizedPage: FC = () => {
  return (
    <div className="flex h-screen flex-col bg-white pb-12 pt-16">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Erro 403
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Não Autorizado.
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Você não possui permissão para acessar esse conteúdo, caso
              acredite que isso seja um erro fale conosco pelo chat
            </p>
            <div className="mt-6">
              <GoBackButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnauthorizedPage;
