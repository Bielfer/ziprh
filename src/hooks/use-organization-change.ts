import { useOrganization } from "@clerk/nextjs";
import { useEffect } from "react";

const useOrganizationChange = (refetch: () => void) => {
  const { organization } = useOrganization();

  useEffect(() => {
    refetch();
  }, [organization?.id, refetch]);

  return null;
};

export default useOrganizationChange;
