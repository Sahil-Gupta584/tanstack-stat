import { HiExternalLink } from "react-icons/hi";

import { type TClassName } from "@/lib/types";
import { Link } from "@tanstack/react-router";
export default function LinkComponent({
  href,
  text,
  isBold,
  isIcon,
  className = "",
  blank,
}: {
  href: string;
  text: string;
  isBold?: boolean;
  isIcon?: boolean;
  className?: TClassName;
  blank?: true;
}) {
  return (
    <Link
      to={href}
      className={`underline   inline items-center gap-1 ${isBold ? "font-medium" : ""} text-nowrap mx-2 text-black dark:text-white hover:text-primary transition decoration-gray-500 ${className} `}
      target={blank ? "_blank" : "_self"}
    >
      {text}
      {isIcon && <HiExternalLink className="inline mb-1" />}
    </Link>
  );
}
