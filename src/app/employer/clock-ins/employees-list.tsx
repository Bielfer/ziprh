"use client";
import { type FC } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useOrganization, useUser } from "@clerk/nextjs";
import { ClockIcon } from "@heroicons/react/24/outline";
import Container from "~/components/container";
import Link from "next/link";
import { paths } from "~/constants/paths";

const EmployeesList: FC = () => {
  const { user } = useUser();
  const { membershipList } = useOrganization({ membershipList: { limit: 20 } });

  const filteredMembershipList = membershipList?.filter(
    (item) => item.publicUserData.userId !== user?.id
  );

  return (
    <Container className="pt-8">
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Funcionários
      </h2>

      <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
        {filteredMembershipList?.map((employee) => (
          <li key={employee.id}>
            <Link
              className="relative flex w-full cursor-pointer items-center space-x-6 rounded-lg px-4 py-6 text-left hover:bg-gray-50 xl:static"
              href={{
                pathname: paths.employerClockInsByUserId(employee.id),
                query: {
                  employeeName: `${employee.publicUserData.firstName} ${employee.publicUserData.lastName}`,
                },
              }}
            >
              <img
                src={employee.publicUserData.imageUrl}
                alt=""
                className="h-14 w-14 flex-none rounded-full"
              />
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
                    <dd>40 Horas Trabalhadas no Mês</dd>
                  </div>
                </dl>
              </div>
              <ChevronRightIcon className="h-6 text-gray-400" />
            </Link>
          </li>
        ))}
      </ol>
    </Container>
  );
};

export default EmployeesList;
