import Image from "next/image";
import type { FC } from "react";
import cn from "~/helpers/cn";

type Props = {
  className?: string;
};

const Logo: FC<Props> = ({ className }) => {
  return (
    <>
      {/* <Image
        className={cn("lg:hidden", className)}
        width={80}
        height={80}
        src="/logo-icon.png"
        alt="ZipRH"
      /> */}
      <Image
        className={cn("block", className)}
        height={70}
        width={140}
        src="/logo.png"
        alt="ZipRH"
      />
    </>
  );
};

export default Logo;
