import type { FC, ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import { auth } from "@clerk/nextjs";
import EmptyState from "~/components/empty-state";
import { UserGroupIcon } from "@heroicons/react/24/outline";

type Props = {
  children: ReactNode;
};

const EmployerLayout: FC<Props> = ({ children }) => {
  const { orgId } = auth();

  return (
    <SidebarWrapper>
      {!orgId ? (
        <div className="pt-10">
          <EmptyState
            icon={UserGroupIcon}
            title="Nenhuma organização escolhida!"
            subtitle="Para escolher ou criar um organização basta clicar no botão espaço pessoal à esquerda!"
          />
        </div>
      ) : (
        children
      )}
    </SidebarWrapper>
  );
};

export default EmployerLayout;
