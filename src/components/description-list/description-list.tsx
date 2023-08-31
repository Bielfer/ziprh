/* eslint react/no-array-index-key:off */

import { type FC, Fragment } from "react";
import cn from "~/helpers/cn";

type Props = {
  items: (
    | {
        label?: string | null;
        value?: string | number | null | JSX.Element | boolean;
        buttonsOrLinks?: (JSX.Element | undefined | boolean)[];
      }
    | false
    | undefined
  )[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  className?: string;
  linkOrButton?: JSX.Element;
};

const DescriptionList: FC<Props> = ({
  items,
  title,
  subtitle,
  loading,
  className,
  linkOrButton,
}) => (
  <div className={className}>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        {title && (
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
        )}
        {!!subtitle && (
          <p className="max-w-2xl text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {linkOrButton}
    </div>
    <dl className="divide-y divide-gray-200">
      {items.map(
        (item, idx) =>
          !!item && (
            <div className="flex items-center py-4 sm:gap-4 sm:py-5" key={idx}>
              <div className="grid flex-grow items-center sm:grid-cols-5">
                <dt className="flex items-center text-sm font-medium text-gray-500 sm:col-span-2">
                  {item.label}
                </dt>
                <dd
                  className={cn(
                    "flex items-center text-sm text-gray-900 sm:mt-0",
                    !item.buttonsOrLinks && "col-span-3"
                  )}
                >
                  {loading ? (
                    <span className="h-2 w-2/3 animate-pulse rounded-full bg-slate-200">
                      {" "}
                    </span>
                  ) : (
                    <span className="flex-grow">{item.value}</span>
                  )}
                </dd>
              </div>
              {!!item.buttonsOrLinks && (
                <div className="flex flex-shrink-0 items-center gap-x-2">
                  {item.buttonsOrLinks.map(
                    (buttonOrLink, buttonIdx) =>
                      buttonOrLink && (
                        <Fragment key={buttonIdx}>
                          <span
                            className="text-gray-300 first:hidden"
                            aria-hidden="true"
                          >
                            |
                          </span>
                          {buttonOrLink}
                        </Fragment>
                      )
                  )}
                </div>
              )}
            </div>
          )
      )}
    </dl>
  </div>
);

export default DescriptionList;
