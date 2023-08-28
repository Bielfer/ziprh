import { HeartIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import EmptyState from "~/components/empty-state";

const Wrapper: FC = () => {
  return (
    <>
      <h1>Sucesso no pagamento</h1>
      <EmptyState
        className="mx-auto mt-10 max-w-sm"
        title="Obrigado por confiar no nosso serviço"
        subtitle="Qualquer dúvida ou problema que possa surgir não hesite em falar conosco!"
        icon={HeartIcon}
      />
    </>
  );
};

export default Wrapper;
