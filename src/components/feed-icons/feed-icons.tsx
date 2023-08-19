import { type FC } from "react";
import cn from "~/helpers/cn";
import { type IconType } from "~/types/core";

type Props = {
  className?: string;
  items: {
    id: number;
    content: string;
    date: string;
    icon: IconType;
    iconBackground: string;
  }[];
};

const FeedIcons: FC<Props> = ({ items, className }) => {
  return (
    <div className={cn("flow-root", className)}>
      <ul role="list" className="-mb-8">
        {items.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== items.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white",
                      event.iconBackground
                    )}
                  >
                    <event.icon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">{event.content}</p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={event.date}>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedIcons;
