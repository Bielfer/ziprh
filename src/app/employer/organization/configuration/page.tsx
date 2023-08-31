import { type Metadata } from "next";
import { type FC } from "react";
import ListWrapper from "./list-wrapper";

export const metadata: Metadata = {
  title: "Configurações da Organização | ZipRH",
  description: "Você pode configurar seu plano mensal por aqui",
};

const EmployerOrganizationConfigurationPage: FC = () => {
  return (
    <>
      <h1>Configurações</h1>
      <ListWrapper />
    </>
  );
};

export default EmployerOrganizationConfigurationPage;
