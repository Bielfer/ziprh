import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { paths } from "~/constants/paths";
import cn from "~/helpers/cn";

type Props = {
  className?: string;
};

const Logo: FC<Props> = ({ className }) => {
  return (
    <Link href={paths.home}>
      <Image
        className={cn("block", className)}
        height={70}
        width={175}
        src="/logo-2.png"
        alt="ZipRH"
      />
    </Link>
  );
};

export default Logo;
