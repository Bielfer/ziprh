import type { FC } from "react";
import Spinner from "~/components/spinner";

const BaseLoading: FC = () => {
  return <Spinner page size="lg" />;
};

export default BaseLoading;
