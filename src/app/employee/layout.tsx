import type { FC, ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import { auth } from "@clerk/nextjs";
import EmptyState from "~/components/empty-state";
import { UserGroupIcon } from "@heroicons/react/24/outline";

type Props = {
  children: ReactNode;
};

const EmployeeLayout: FC<Props> = ({ children }) => {
  const { orgId } = auth();

  return (
    <SidebarWrapper>
      {!orgId ? (
        <div className="pt-16">
          <EmptyState
            className="mx-auto max-w-md"
            icon={UserGroupIcon}
            title="Nenhuma organização escolhida!"
            subtitle="Para escolher uma organização basta clicar no botão nenhuma organização selecionada. Se nenhuma estiver disponível, peça para seu gestor enviar outro convite"
          />
        </div>
      ) : (
        children
      )}
    </SidebarWrapper>
  );
};

export default EmployeeLayout;
