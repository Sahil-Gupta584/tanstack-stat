import type { TClassName } from "@/lib/types";
import { Button, Link } from "@heroui/react";
import { IoIosArrowRoundUp } from "react-icons/io";

const BackBtn = ({
  text,
  pathname,
  className,
}: {
  text: string;
  pathname: string;
  className?: TClassName;
}) => {
  return (
    <Button
      className={`self-start mb-5 ${className}`}
      variant="ghost"
      startContent={<IoIosArrowRoundUp className="-rotate-90 size-6" />}
      as={Link}
      href={pathname}
    >
      {text}
    </Button>
  );
};

export default BackBtn;
