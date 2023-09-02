import type { FC } from "react";
import ConditionalWrapper from "../conditional-wrapper";
import "./styles.css";
import cn from "~/helpers/cn";

type Size = keyof typeof sizes;

type Color = keyof typeof colors;

interface Props {
  className?: string;
  size?: Size;
  page?: boolean;
  color?: Color;
}

const sizes = {
  sm: "h-5 w-5",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

const colors = {
  primary: "text-primary-700",
  white: "text-white",
  inherit: "",
};

const Spinner: FC<Props> = ({
  className,
  size = "md",
  color = "primary",
  page,
}) => (
  <ConditionalWrapper
    condition={page ?? false}
    renderWrapper={(children) => (
      <div className="flex h-screen w-screen items-center justify-center">
        {children}
      </div>
    )}
  >
    <svg
      className={cn(sizes[size], colors[color], className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="spinner_Wezc" fill="currentColor">
        <circle cx="12" cy="2.5" r="1.5" stroke="currentColor" opacity=".14" />
        <circle
          cx="16.75"
          cy="3.77"
          r="1.5"
          stroke="currentColor"
          opacity=".29"
          style={{ background: "green" }}
        />
        <circle
          cx="20.23"
          cy="7.25"
          r="1.5"
          stroke="currentColor"
          opacity=".43"
        />
        <circle
          cx="21.50"
          cy="12.00"
          r="1.5"
          stroke="currentColor"
          opacity=".57"
        />
        <circle
          cx="20.23"
          cy="16.75"
          r="1.5"
          stroke="currentColor"
          opacity=".71"
        />
        <circle
          cx="16.75"
          cy="20.23"
          r="1.5"
          stroke="currentColor"
          opacity=".86"
        />
        <circle cx="12" cy="21.5" r="1.5" />
      </g>
    </svg>
  </ConditionalWrapper>
);

export default Spinner;
