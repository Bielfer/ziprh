import { paths } from "~/constants/paths";
import { type FC } from "react";
import MyLink from "~/components/my-link";

const CallToAction: FC = () => (
  <section className="bg-white">
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 ">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Melhore a gestão do seu negócio
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Você pode testar nosso produto por 7 dias sem custo nenhum
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <MyLink href={paths.signUp} variant="button-primary">
            Começar Teste
          </MyLink>
        </div>
      </div>
    </div>
  </section>
);

export default CallToAction;
