import { UserButton, auth } from "@clerk/nextjs";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { type FC } from "react";
import Button from "~/components/button";
import MyLink from "~/components/my-link";
import { paths } from "~/constants/paths";
import { roles } from "~/constants/roles";

export const metadata: Metadata = {
  title: "O melhor sistema de gestão de funcionários | ZipRH",
  description:
    "Acompanhe os seus funcionários, a escala e os pontos que foram batidos",
};

const Home: FC = () => {
  const { userId, orgRole } = auth();

  if (userId && orgRole === roles.basicMember)
    return redirect(paths.employeeAvailabilities);
  if (userId && orgRole === roles.admin)
    return redirect(paths.employerAvailabilities);

  return (
    <>
      <div>
        <Button variant="danger">Teste</Button>
        <Button variant="link-danger">Teste</Button>
        <Button variant="link-primary">Teste</Button>
        <Button variant="link-secondary">Teste</Button>
        <Button variant="primary">Teste</Button>
        <Button variant="secondary">Teste</Button>
        <Button variant="default">Teste</Button>
      </div>
      <div>
        {/* <MyLink href="#" variant="button-danger">
          Teste
        </MyLink>
        <MyLink href="#" variant="danger">
          Teste
        </MyLink>
        <MyLink href="#" variant="button-primary">
          Teste
        </MyLink>
        <MyLink href="#" variant="button-secondary">
          Teste
        </MyLink> */}
        <MyLink href="#" variant="primary">
          Teste
        </MyLink>
        <MyLink href="#" variant="secondary">
          Teste
        </MyLink>
        <MyLink href="#" variant="default">
          Teste
        </MyLink>
        <MyLink href={paths.employerClockIns} variant="button-primary">
          Clock Ins
        </MyLink>
        <MyLink href={paths.signIn} variant="button-secondary">
          login
        </MyLink>
        <UserButton />
      </div>
    </>
  );
};

export default Home;
