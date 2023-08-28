import { type Metadata } from "next";
import { type FC } from "react";
import Wrapper from "./wrapper";

export const metadata: Metadata = {
  title: "Assinatura bem sucedida | ZipRH",
  description: "Sua assinatura mensal foi concluída com sucesso",
};

const SubscriptionSuccess: FC = () => {
  return (
    <>
      <Wrapper />
    </>
  );
};

export default SubscriptionSuccess;
