import { type Metadata } from "next";
import { type FC } from "react";
import FeedWrapper from "./feed-wrapper";
import { auth } from "@clerk/nextjs";
import TabsWrapper from "./tabs-wrapper";

export const metadata: Metadata = {
  title: "Seus Pontos de Hoje | ZipRH",
  description: "Acompanhe os pontos que você bateu hoje",
};

const EmployeeClockIns: FC = () => {
  const { userId } = auth();

  return (
    <>
      <h1>Pontos Batidos Hoje</h1>
      <TabsWrapper />
      <FeedWrapper userId={userId ?? ""} />
    </>
  );
};

export default EmployeeClockIns;
