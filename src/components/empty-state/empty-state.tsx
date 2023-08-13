import { type IconType } from '~/types/core';
import clsx from 'clsx';
import type { FC, ReactElement } from 'react';

type Props = {
  icon?: IconType;
  title: string;
  subtitle?: string;
  buttonOrLink?: ReactElement;
};

const EmptyState: FC<Props> = ({
  icon: Icon,
  title,
  subtitle,
  buttonOrLink,
}) => (
  <div className="text-center">
    {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400" />}
    <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
    {subtitle && (
      <p className={clsx('mt-1 text-sm text-gray-500', buttonOrLink && 'mb-4')}>
        {subtitle}
      </p>
    )}
    {buttonOrLink}
  </div>
);

export default EmptyState;
