import { type IconType } from "~/types/core";
import type { FC } from "react";
import {} from "../button";
import Spinner from "../spinner";
import { type Concat } from "~/types/core";
import { buttonAndLinkStyles } from "~/constants/styles";
import cn from "~/helpers/cn";

type Props = {
  icon: IconType;
  className?: string;
  variant?:
    | Concat<["link-", keyof (typeof buttonAndLinkStyles)["button" | "link"]]>
    | keyof (typeof buttonAndLinkStyles)["button" | "link"];
  size?: keyof typeof buttonPaddings;
  loading?: boolean;
  onClick?: () => void;
};

const iconSizes = {
  xs: "h-5 w-5",
  sm: "h-5 w-5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-6 w-6",
};

const buttonPaddings = {
  xs: "p-1",
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2",
  xl: "p-3",
};

const IconButton: FC<Props> = ({
  icon: Icon,
  className,
  variant = "white",
  size = "md",
  loading,
  onClick,
}) => {
  const isButton = !variant.includes("link");
  const buttonStyles = isButton ? "shadow-sm" : "";
  const [buttonOrLink, variantStyle] = variant.split("-");

  return (
    <button
      type="button"
      className={cn(
        "inline-flex flex-shrink-0 items-center rounded-full",
        buttonStyles,
        buttonAndLinkStyles[isButton ? "button" : "link"][
          (variantStyle ?? buttonOrLink) as keyof (typeof buttonAndLinkStyles)[
            | "button"
            | "link"]
        ],
        buttonPaddings[size],
        className
      )}
      onClick={onClick}
    >
      {loading ? (
        <Spinner size="sm" color="inherit" />
      ) : (
        <Icon
          className={cn(iconSizes[size], "flex-shrink-0")}
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default IconButton;
