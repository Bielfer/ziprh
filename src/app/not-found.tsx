import MyLink from "~/components/my-link";
import { paths } from "~/constants/paths";

const Page404 = () => (
  <div className="flex h-screen flex-col bg-white pb-12 pt-16">
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            Erro 404
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Página não encontrada
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Desculpa, mas não foi possível encontrar a página que você estava
            procurando.
          </p>
          <div className="mt-6">
            <MyLink
              href={paths.home}
              className="text-base font-medium text-primary-600 hover:text-primary-500"
            >
              Página Inicial<span aria-hidden="true"> &rarr;</span>
            </MyLink>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default Page404;
