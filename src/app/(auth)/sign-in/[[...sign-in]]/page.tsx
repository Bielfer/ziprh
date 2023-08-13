import { SignIn } from "@clerk/nextjs";
import { type Metadata } from "next";
import { type FC } from "react";
import { paths } from "~/constants/paths";

export const metadata: Metadata = {
  title: "Faça seu login | ZipRH",
  description:
    "Faça seu login e tenha a melhor gestão de funcionários com ZipRH",
};

type Props = {
  searchParams: {
    afterSignUpUrl: string;
    afterSignInUrl: string;
  };
};

const SignInPage: FC<Props> = ({ searchParams }) => {
  const { afterSignInUrl, afterSignUpUrl } = searchParams;
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        afterSignInUrl={afterSignInUrl ?? paths.home}
        afterSignUpUrl={afterSignUpUrl ?? paths.home}
      />
    </div>
  );
};

export default SignInPage;
