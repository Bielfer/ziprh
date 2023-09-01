"use client";

import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { type FC, useEffect } from "react";
import { paths } from "~/constants/paths";

type Props = {
  error: Error;
  reset: () => void;
};

const Error: FC<Props> = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="flex justify-center text-base font-semibold text-primary-600">
            <WrenchScrewdriverIcon className="h-16 w-16" />
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Erro Inesperado
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Já enviamos esse erro para nosso suporte, por favor clique abaixo
            para tentar de novo
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-x-6 gap-y-5 sm:flex-row">
            <button
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              onClick={() => reset()}
            >
              Tentar Novamente
            </button>
            <Link
              href={paths.home}
              className="text-sm font-semibold text-gray-900"
            >
              Página Inicial <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Error;
