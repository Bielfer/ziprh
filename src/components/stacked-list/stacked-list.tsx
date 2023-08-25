import { type ReactNode, type FC } from "react";

type Props = {
  items: {
    id: string;
    imageUrl: string;
    name: string;
    subName: string;
    onRight?: ReactNode;
  }[];
};

const StackedList: FC<Props> = ({ items }) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-x-6 py-5"
        >
          <div className="flex min-w-0 gap-x-4">
            {item.imageUrl && (
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={item.imageUrl}
                alt=""
              />
            )}
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {item.subName}
              </p>
            </div>
          </div>
          {!!item.onRight && item.onRight}
        </li>
      ))}
    </ul>
  );
};

export default StackedList;
