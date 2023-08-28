import { type Metadata } from "next";
import { type FC } from "react";
import FormUser from "~/components/forms/user";

export const metadata: Metadata = {
  title: "Altere seu perfil | ZipRH",
  description: "Você pode alterar seu nome e sobrenomes",
};

type Props = {
  searchParams: {
    isEmployee: string;
  };
};

const EditUser: FC<Props> = ({ searchParams }) => {
  const { isEmployee } = searchParams;

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <FormUser isEmployee={isEmployee === "yes"} />
    </div>
  );
};

export default EditUser;
