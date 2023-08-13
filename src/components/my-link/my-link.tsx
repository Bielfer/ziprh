import type { FC, ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { type Concat, type IconType } from "~/types/core";
import { type Url } from "url";
import Spinner from "../spinner";
import { buttonAndLinkSizes, buttonAndLinkStyles } from "~/constants/styles";

export type MyLinkProps = {
  className?: string;
  variant?:
    | Concat<["button-", keyof (typeof buttonAndLinkStyles)["button" | "link"]]>
    | keyof (typeof buttonAndLinkStyles)["button" | "link"];
  size?: keyof typeof buttonAndLinkSizes;
  iconLeft?: IconType;
  iconRight?: IconType;
  href: string | Partial<Url>;
  children: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

const MyLink: FC<MyLinkProps> = ({
  className,
  children,
  variant = "white",
  href,
  size = "md",
  iconLeft: IconLeft,
  iconRight: IconRight,
  isLoading,
  disabled,
  ...props
}) => {
  const isButton = variant.includes("button");
  const linkStyles = !isButton ? "" : "rounded-lg shadow-sm";
  const [buttonOrLink, variantStyle] = variant.split("-");

  return (
    <Link
      href={href}
      passHref
      className={clsx(
        "inline-flex items-center whitespace-nowrap font-medium transition duration-200",
        linkStyles,
        buttonAndLinkStyles[isButton ? "button" : "link"][
          (variantStyle ?? buttonOrLink) as keyof (typeof buttonAndLinkStyles)[
            | "button"
            | "link"]
        ],
        buttonAndLinkSizes[size],
        disabled && "pointer-events-none",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" color="inherit" />
      ) : (
        <>
          {IconLeft && (
            <IconLeft className="-ml-0.5 mr-2 h-5 w-5 flex-shrink-0" />
          )}
          {children}
          {IconRight && (
            <IconRight className="-mr-0.5 ml-2 h-5 w-5 flex-shrink-0" />
          )}
        </>
      )}
    </Link>
  );
};
export default MyLink;
