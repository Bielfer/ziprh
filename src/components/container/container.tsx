import type { FC, ReactNode } from 'react';
import ConditionalWrapper from '../conditional-wrapper';
import cn from '~/helpers/cn';

type Props = {
  className?: string;
  children: ReactNode;
  smallerContainer?: boolean;
  smallerContainerSize?:
    | 'max-w-xs'
    | 'max-w-sm'
    | 'max-w-md'
    | 'max-w-lg'
    | 'max-w-xl'
    | 'max-w-2xl'
    | 'max-w-3xl'
    | 'max-w-4xl'
    | 'max-w-5xl'
    | 'max-w-6xl'
    | 'max-w-7xl';
};

const Container: FC<Props> = ({
  className,
  children,
  smallerContainer = false,
  smallerContainerSize,
}) => {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      <ConditionalWrapper
        condition={smallerContainer}
        renderWrapper={(wrapperChildren) => (
          <div className={cn('mx-auto max-w-3xl', smallerContainerSize)}>
            {wrapperChildren}
          </div>
        )}
      >
        {children}
      </ConditionalWrapper>
    </div>
  );
};

export default Container;
