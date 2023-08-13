import clsx from 'clsx';
import type { FC } from 'react';

type Props = {
  className?: string;
};

const Logo: FC<Props> = ({ className }) => {
  return (
    <img
      className={clsx('h-8 w-auto', className)}
      src="https://tailwindui.com/img/logos/mark.svg?color=primary&shade=600"
      alt="Your Company"
    />
  );
};

export default Logo;
