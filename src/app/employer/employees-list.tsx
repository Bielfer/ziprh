"use client";
import { useMemo, type FC } from "react";
import { ChevronRightIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useOrganization, useUser } from "@clerk/nextjs";
import { ClockIcon } from "@heroicons/react/20/solid";
import Container from "~/components/container";
import Link from "next/link";
import LoadingWrapper from "~/components/loading-wrapper";
import EmptyState from "~/components/empty-state";
import { trpc } from "~/services/trpc";
import { endOfMonth, startOfMonth } from "date-fns";

type Props = {
  href: (employeeId: string) => string;
};

const EmployeesList: FC<Props> = ({ href }) => {
  const today = new Date();
  const { user } = useUser();
  const { membershipList } = useOrganization({
    membershipList: { limit: 20 },
  });
  const { data: employeesHoursWorked } =
    trpc.clockIns.employeesHoursWorked.useQuery({
      startDate: startOfMonth(today),
      endDate: endOfMonth(today),
    });

  const filteredMembershipList = useMemo(
    () =>
      membershipList?.filter((item) => item.publicUserData.userId !== user?.id),
    [membershipList, user?.id]
  );

  return (
    <Container className="pt-8">
      <LoadingWrapper isLoading={!membershipList} className="py-16">
        <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
          {filteredMembershipList && filteredMembershipList.length > 0 ? (
            filteredMembershipList?.map((employee) => (
              <li key={employee.publicUserData.userId}>
                <Link
                  className="relative flex w-full cursor-pointer items-center space-x-6 rounded-lg px-4 py-6 text-left hover:bg-gray-50 xl:static"
                  href={{
                    pathname: href(employee.publicUserData.userId ?? ""),
                    query: {
                      employeeName: `${employee.publicUserData.firstName} ${employee.publicUserData.lastName}`,
                    },
                  }}
                >
                  {employee.publicUserData.imageUrl && (
                    <img
                      src={employee.publicUserData.imageUrl}
                      alt=""
                      className="h-14 w-14 flex-none rounded-full"
                    />
                  )}
                  <div className="flex-auto">
                    <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                      {employee.publicUserData.firstName}{" "}
                      {employee.publicUserData.lastName}
                    </h3>
                    <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                      <div className="flex items-start space-x-3">
                        <dt className="mt-0.5">
                          <span className="sr-only">Horas Trabalhadas</span>
                          <ClockIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd>
                          {(!!employeesHoursWorked &&
                            employeesHoursWorked[
                              employee.publicUserData.userId ?? ""
                            ]) ??
                            0}{" "}
                          Horas Trabalhadas no Mês
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <ChevronRightIcon className="h-6 text-gray-400" />
                </Link>
              </li>
            ))
          ) : (
            <EmptyState
              icon={UsersIcon}
              title="Você ainda não adicionou nenhum funcionário a essa organização"
              subtitle="Para adicionar um novo funcionário basta clicar no nome da sua organização na barra à esquerda"
            />
          )}
        </ol>
      </LoadingWrapper>
    </Container>
  );
};

export default EmployeesList;
