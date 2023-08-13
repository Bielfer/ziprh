import type { FC, ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";

type Props = {
  children: ReactNode;
};

const EmployerLayout: FC<Props> = ({ children }) => {
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default EmployerLayout;
