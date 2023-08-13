import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import EmptyState from "~/components/empty-state";

const EmployerAvailabilities: FC = () => {
  return (
    <>
      <h1>Escala</h1>
      <EmptyState
        title="Escala ainda não está disponível"
        subtitle="Estamos trabalhando o mais rápido possível para terminá-la"
        icon={WrenchScrewdriverIcon}
      />
    </>
  );
};

export default EmployerAvailabilities;
