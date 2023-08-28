import { type Metadata } from "next";
import { type FC } from "react";
import CalendarWrapper from "./calendar-wrapper";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { paths } from "~/constants/paths";

export const metadata: Metadata = {
  title: "Sua Escala | ZipRH",
  description: "Acompanhe seus horários de trabalho no mês",
};

const EmployeeAvailabilities: FC = () => {
  const { userId } = auth();

  if (!userId) redirect(paths.unauthorized);

  return (
    <>
      <h1>Sua Escala</h1>
      <CalendarWrapper userId={userId} />
    </>
  );
};

export default EmployeeAvailabilities;
