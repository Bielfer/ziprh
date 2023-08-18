import clsx from "clsx";
import { type FC } from "react";
import Spinner from "../spinner";

interface Props {
  isLoading: boolean;
  children: JSX.Element;
  className?: string;
  hiddenChildren?: boolean;
}

const LoadingWrapper: FC<Props> = ({
  isLoading,
  children,
  className,
  hiddenChildren = false,
}) => {
  if (isLoading)
    return (
      <>
        <div className={clsx("flex justify-center", className)}>
          <Spinner size="lg" />
        </div>
        {hiddenChildren && <div className="hidden">{children}</div>}
      </>
    );

  return children;
};

export default LoadingWrapper;
