import { tryCatchWrapper } from "@/lib/utils/client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { BsThreeDotsVertical, BsTrash } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";
import { deleteFunnel } from "../funnel/actions";
import FunnelCommonModal from "../funnel/funnelCommonModal";
import { TFunnelData, TFunnelStep } from "./funnelChart";

export const PRIMARY_COLORS = [
  "#b3204b",
  "#cc2757",
  "#e62e63",
  "#fd366e",
  "#ff4d7b",
  "#ff80a1",
  "#ffb3c7",
  "#ffe4ec",
];

export type TFunnelPrevData = {
  $id: string;
  steps: TFunnelStep[];
  name: string;
};
export function FunnelDropDown({
  websiteId,
  prevData,
  refetchFunnels,
  setFunnels,
  isCollapsed,
}: {
  websiteId: string;
  prevData?: TFunnelPrevData;
  refetchFunnels: () => void;
  setFunnels: Dispatch<SetStateAction<TFunnelData[]>>;
  isCollapsed: boolean;
}) {
  const modal = useDisclosure();
  async function handleDeleteFunnel() {
    tryCatchWrapper({
      callback: async () => {
        if (!prevData?.$id) return;
        const shouldDelete = confirm(
          "Are you sure you want to delete this funnel?"
        );
        if (!shouldDelete) return;
        await deleteFunnel({ data: { funnelId: prevData?.$id } });
        setFunnels((prev) => prev.filter((f) => f.$id !== prevData?.$id));
      },
    });
  }
  return (
    <div>
      {/* Dropdown */}
      <Dropdown>
        <DropdownTrigger>
          {isCollapsed ? (
            ""
          ) : (
            <Button className="border-0" variant="ghost" isIconOnly size="sm">
              <BsThreeDotsVertical />
            </Button>
          )}
        </DropdownTrigger>

        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="edit"
            onPress={modal.onOpen}
            startContent={<TbEdit />}
          >
            Edit
          </DropdownItem>

          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={<BsTrash />}
            onPress={handleDeleteFunnel}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Place modal OUTSIDE dropdown */}
      <FunnelCommonModal
        websiteId={websiteId}
        prevData={prevData}
        disclosure={modal}
        refetchFunnels={refetchFunnels}
      />
    </div>
  );
}
