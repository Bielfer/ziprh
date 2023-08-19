import { type Metadata } from "next";
import { type FC } from "react";
import FeedWrapper from "./feed-wrapper";
import { auth } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Seus Pontos | ZipRH",
  description: "Acompanhe os pontos que você bateu nesse mês",
};

const EmployeeClockIns: FC = () => {
  const { userId } = auth();

  return (
    <>
      <h1 className="mb-8">Pontos Batidos Hoje</h1>
      <FeedWrapper userId={userId ?? ""} />
    </>
  );
};

export default EmployeeClockIns;
