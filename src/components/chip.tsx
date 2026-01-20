import type { TClassName } from "@/lib/types";
import { addToast, Chip, } from "@heroui/react";

export default function ChipComponent({
  child,
  isMargin,
  classname,
}: {
  child: React.ReactNode | string;
  isMargin?: boolean;
  classname?: TClassName;
}) {
  return (
    <Chip
      size="sm"
      radius="sm"
      className={`bg-base-100 px-px border-[1px] cursor-pointer hover:border-base-500 border-base-300 pl-0 ${isMargin ? "mx-2" : ""} ${classname}`}
      variant="bordered"
      onClick={() => {
        navigator.clipboard.writeText(child as string);
        addToast({
          title: "Copied to clipboard",
          color: "success",
        })
      }}
    >
      {child}
    </Chip>
  );
}
