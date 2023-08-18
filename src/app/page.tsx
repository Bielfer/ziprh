"use client";
import { UserButton } from "@clerk/nextjs";
import Button from "~/components/button";
import MyLink from "~/components/my-link";
import { paths } from "~/constants/paths";
import { trpc } from "~/services/trpc";

export default function Home() {
  const { data } = trpc.test.create.useQuery({});
  console.log(data);

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
}
