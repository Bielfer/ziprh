"use client";
import { CheckIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { type FC } from "react";
import { paths } from "~/constants/paths";
import cn from "~/helpers/cn";

const frequencies = [
  { value: "monthly", label: "Mensal", priceSuffix: "/mês por funcionário" },
];

const tiers = [
  {
    name: "Plano Básico",
    id: "tier-basic",
    href: paths.signIn,
    price: { monthly: "R$10", annually: "R$100" },
    description: "Um plano que encaixa perfeitamente com sua empresa",
    features: [
      "Funcionários ilimitados",
      "Gestão de escala",
      "Histórico de pontos",
      "Batedor de ponto no celular",
    ],
    mostPopular: true,
  },
];

const Pricing: FC = () => {
  return (
    <div className="bg-white pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Preços
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Sem trocadilhos
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Você paga todo mês um valor fixo pelo número de funcionários
          cadastrados
        </p>
        <div className="isolate mx-auto mt-10 flex max-w-sm justify-center">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                tier.mostPopular
                  ? "ring-2 ring-primary-600"
                  : "ring-1 ring-gray-200",
                "rounded-3xl p-8 xl:p-10"
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={cn(
                    tier.mostPopular ? "text-primary-600" : "text-gray-900",
                    "text-lg font-semibold leading-8"
                  )}
                >
                  {tier.name}
                </h3>
                {/* {tier.mostPopular ? (
                  <p className="rounded-full bg-primary-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary-600">
                    Most popular
                  </p>
                ) : null} */}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {
                    tier.price[
                      frequencies?.[0]?.value as keyof typeof tier.price
                    ]
                  }
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  {frequencies?.[0]?.priceSuffix}
                </span>
              </p>
              <Link
                href={tier.href}
                aria-describedby={tier.id}
                className={cn(
                  tier.mostPopular
                    ? "bg-primary-600 text-white shadow-sm hover:bg-primary-500"
                    : "text-primary-600 ring-1 ring-inset ring-primary-200 hover:ring-primary-300",
                  "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                )}
              >
                Comprar
              </Link>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-primary-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
