"use client";
import { type FC, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import MyLink from "~/components/my-link";
import { paths } from "~/constants/paths";
import Container from "~/components/container";
import Logo from "~/components/logo";

const links = [
  {
    text: "Como Funciona?",
    route: paths.features,
  },
  {
    text: "Preços",
    route: paths.pricing,
  },
];

type Props = {
  userId: string | null;
};

const Header: FC<Props> = ({ userId }) => (
  <header className="py-10">
    <Container>
      <nav className="relative z-50 text-sm">
        <ul className="flex items-center">
          <li>
            <Logo />
          </li>
          {links.map((link) => (
            <li key={link.route} className="ml-6 hidden first:ml-12 md:block">
              <MyLink href={link.route} variant="secondary">
                {link.text}
              </MyLink>
            </li>
          ))}

          <li className="ml-auto hidden md:block">
            {userId ? (
              <MyLink href={paths.chooseRole} variant="button-secondary">
                Dashboard
              </MyLink>
            ) : (
              <MyLink href={paths.signIn} variant="button-secondary">
                Fazer Login
              </MyLink>
            )}
          </li>
          <li className="-mr-1 ml-auto md:hidden">
            <MobileNavigation userId={userId} />
          </li>
        </ul>
      </nav>
    </Container>
  </header>
);

const MobileNavigation: FC<Props> = ({ userId }) => (
  <Popover>
    {({ open, close }) => (
      <>
        <Popover.Button className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none">
          <span className="sr-only">Abrir/Fechar Menu</span>
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path
              d="M0 1H14M0 7H14M0 13H14"
              className={clsx("origin-center transition", {
                "scale-90 opacity-0": open,
              })}
            />
            <path
              d="M2 2L12 12M12 2L2 12"
              className={clsx("origin-center transition", {
                "scale-90 opacity-0": !open,
              })}
            />
          </svg>
        </Popover.Button>
        <Transition.Root>
          <Transition.Child
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              as="ul"
              className="absolute inset-x-0 top-full mt-4 origin-top space-y-4 rounded-2xl bg-white p-6 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
            >
              {links.map((link) => (
                <li key={link.route}>
                  <MyLink
                    href={link.route}
                    className="block w-full"
                    onClick={() => close()}
                  >
                    {link.text}
                  </MyLink>
                </li>
              ))}
              <li className="border-t border-slate-300/40 pt-4">
                {userId ? (
                  <MyLink href={paths.chooseRole} className="block w-full">
                    Dashboard
                  </MyLink>
                ) : (
                  <MyLink href={paths.signIn} className="block w-full">
                    Fazer Login
                  </MyLink>
                )}
              </li>
            </Popover.Panel>
          </Transition.Child>
        </Transition.Root>
      </>
    )}
  </Popover>
);

export default Header;
