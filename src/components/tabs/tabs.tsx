"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type FC } from "react";
import cn from "~/helpers/cn";
import { type IconType } from "~/types/core";

type Props = {
  items: {
    name: string;
    href: string;
    icon?: IconType;
  }[];
  className?: string;
};

const Tabs: FC<Props> = ({ items, className }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={className}>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Selecione uma aba
        </label>

        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          defaultValue={items.find((tab) => tab.href === pathname)?.name}
          onChange={(tab) => router.push(tab.target.value)}
        >
          {items.map((tab) => (
            <option key={tab.name} value={tab.href}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {items.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  tab.href === pathname
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium"
                )}
                aria-current={tab.href === pathname ? "page" : undefined}
              >
                {!!tab.icon && (
                  <tab.icon
                    className={cn(
                      tab.href === pathname
                        ? "text-primary-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "-ml-0.5 mr-2 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                )}
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
