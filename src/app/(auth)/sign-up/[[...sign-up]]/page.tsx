import { SignUp } from "@clerk/nextjs";
import { type Metadata } from "next";
import { type FC } from "react";
import { paths } from "~/constants/paths";

export const metadata: Metadata = {
  title: "Faça seu cadastro | ZipRH",
  description:
    "Faça seu cadastro e tenha a melhor gestão de funcionários com ZipRH",
};

type Props = {
  params: {
    afterSignUpUrl: string;
    afterSignInUrl: string;
  };
};

const SignUpPage: FC<Props> = ({ params }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp
        afterSignInUrl={params.afterSignInUrl ?? paths.chooseRole}
        afterSignUpUrl={params.afterSignUpUrl ?? paths.chooseRole}
      />
    </div>
  );
};

export default SignUpPage;
