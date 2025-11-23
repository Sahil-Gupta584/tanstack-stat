import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { FaCheck, FaPencil } from "react-icons/fa6";
import { GoGrabber } from "react-icons/go";
import { TFunnelStep } from "../customEvents/funnelChart";

export function SortableItem({
  step,
  onRemove,
  index,
  setSteps,
}: {
  setSteps: React.Dispatch<React.SetStateAction<TFunnelStep[]>>;
  step: TFunnelStep;
  onRemove: (id: string) => void;
  index: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(step.name);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: step.$id || "",
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="relative flex items-center justify-between text-base-400 p-3 rounded-lg shadow-lg bg-content2 border border-content2 "
      role="listitem"
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          aria-label="drag-handle"
          className="p-2 rounded-md hover:bg-surface-100"
          style={{ cursor: "grab" }}
        >
          <GoGrabber className="text-foreground-900!" />
        </button>
        <div>
          {isEditing ? (
            <Input
              value={name}
              onValueChange={setName}
              placeholder="Edit a step name"
              variant="bordered"
              className="mb-2 text-base-50"
            />
          ) : (
            <div className="font-semibold text-foreground-500">
              {index + 1}.{" "}
              <span className="text-foreground-900">{step.name}</span>
            </div>
          )}
          <div className="text-xs text-foreground-500 mt-2">
            {step.kind === "page" ? "Page" : "Goal"} ·{" "}
            {step.descriptor.split(":")[0]}&nbsp;: &nbsp;
            <span className="bg-content2 border border-content4 text-foreground-800 p-1 px-2 border/10 rounded-md">
              {step.descriptor.split(":")[1]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 absolute right-1 top-1 ">
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="min-w-px w-fit h-fit p-1 "
          onPress={() => {
            if (isEditing) {
              setSteps((prev) =>
                prev.map((s) => (s.$id === step.$id ? { ...s, name } : s))
              );
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? <FaCheck size={10} /> : <FaPencil size={10} />}
        </Button>
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="min-w-px w-fit h-fit p-1 text-[10px] py-[3px] px-[5px]"
          onPress={() =>
            isEditing ? setIsEditing(false) : onRemove(step?.$id || "")
          }
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
