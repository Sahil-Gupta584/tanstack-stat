import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
} from "@heroui/react";
import { ID } from "appwrite";
import { useCallback, useMemo, useState } from "react";
import { THeroUIDisclosure } from "../customEvents/emptyEvent";
import { TFunnelStep } from "../customEvents/funnelChart";
import { TFunnelPrevData } from "../customEvents/funnelDropdown";
import {
  createOrUpdateFunnelSteps,
  createOrUpdateWebsiteFunnel,
  deleteFunnelSteps,
} from "./actions";
import { SortableItem } from "./sortableItem";
import { StepComposer } from "./stepComposer";

export default function FunnelCommonModal({
  colorPrimary,
  websiteId,
  prevData,
  disclosure,
  refetchFunnels,
  variant,
  isCollapsed,
}: {
  websiteId: string;
  colorPrimary?: boolean;
  prevData?: TFunnelPrevData;
  refetchFunnels: () => void;
  disclosure: THeroUIDisclosure;
  variant?: "bordered";
  isCollapsed?: boolean;
}) {
  const [funnelName, setFunnelName] = useState(prevData?.name || "");
  const [steps, setSteps] = useState<TFunnelStep[]>(prevData?.steps || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleAdd = useCallback((s: TFunnelStep) => {
    setSteps((prev) => [...prev, s]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setSteps((prev) => prev.filter((p) => p.$id !== id));
  }, []);

  const onDragEnd = useCallback((ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over) return;
    if (active.id !== over.id) {
      setSteps((prev) => {
        const oldIndex = prev.findIndex((p) => p.$id === String(active.id));
        const newIndex = prev.findIndex((p) => p.$id === String(over.id));
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  const pageCount = useMemo(
    () => steps.filter((s) => s.kind === "page").length,
    [steps]
  );
  const goalCount = useMemo(
    () => steps.filter((s) => s.kind === "goal").length,
    [steps]
  );

  async function handleFunnelForm() {
    try {
      setIsSubmitting(true);
      const name = funnelName.trim();
      if (!name) {
        setIsSubmitting(false);
        return addToast({
          color: "warning",
          title: "Funnel",
          description: "Please set a valid funnel name",
        });
      }

      if (steps.length < 2) {
        setIsSubmitting(false);
        return addToast({
          color: "warning",
          title: "Funnel",
          description: "Please add at least 2 steps",
        });
      }
      const funnel = await createOrUpdateWebsiteFunnel({
        data: { name, websiteId, funnelId: prevData?.$id },
      });
      console.log({ steps });

      for (const [index, rest] of steps.entries()) {
        delete rest.visitors;
        delete rest.dropoff;
        await createOrUpdateFunnelSteps({
          data: { ...rest, funnelId: funnel.$id, order: index },
        });
      }
      const stepsToBeDeleted = prevData?.steps?.filter(
        (s) => !steps.some((p) => p.$id === s.$id)
      );
      console.log({ stepsToBeDeleted });

      if (stepsToBeDeleted && prevData) {
        await deleteFunnelSteps({
          data: {
            stepIds: stepsToBeDeleted.map((s) => s.$id || ""),
            funnelId: prevData.$id,
          },
        });
      }
      setIsSubmitting(false);
      if (disclosure.onClose) {
        disclosure.onClose();
      }
      refetchFunnels();
    } catch (error) {
      setIsSubmitting(false);
      console.log("Failed to add Funnel", error);
      addToast({
        color: "danger",
        title: "Failed to save funnel",
        description: (error as Error).message,
      });
    }
  }
  return (
    <>
      {prevData?.name ? (
        ""
      ) : (
        <Button
          color={colorPrimary ? "primary" : "default"}
          onPress={disclosure.onOpen}
          variant={variant || "solid"}
          className={
            colorPrimary
              ? ""
              : "w-full hover:bg-base-300 hover:text-foreground-200"
          }
          isIconOnly={isCollapsed}
        >
          {isCollapsed ? "✚" : "✚ Create funnel"}
        </Button>
      )}

      <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
        <ModalContent className="max-w-4xl">
          {(close) => (
            <>
              <ModalHeader>
                <Input
                  placeholder="My onboarding funnel"
                  label="Funnel name: "
                  labelPlacement="outside-left"
                  variant="bordered"
                  classNames={{ label: "text-lg" }}
                  value={funnelName}
                  onValueChange={setFunnelName}
                />
              </ModalHeader>

              <Divider />

              <form onSubmit={(e) => e.preventDefault()}>
                <ModalBody className="grid grid-cols-2 p-0">
                  <div className="p-2">
                    <StepComposer
                      onAdd={handleAdd}
                      //funnelId is been handled in form submission handler
                      funnelId={prevData?.$id || ""}
                      stepsLength={steps.length}
                    />
                  </div>

                  <div className="bg-content4 p-2">
                    <div className="flex items-center justify-between mb-3 bg-content1 p-2 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">Funnel steps</div>
                        <div className="text-xs text-muted-foreground">
                          {steps.length} steps — {pageCount} pages · {goalCount}{" "}
                          goals
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="light"
                          onPress={() =>
                            setSteps((prev) => [
                              ...prev,
                              {
                                $id: ID.unique(),
                                visitors: 0,
                                name: "Visit Landing",
                                kind: "page",
                                descriptor: "startsWith:/",
                                funnelId: prevData?.$id || "",
                                order: steps.length + 1,
                              },
                            ])
                          }
                        >
                          + Default
                        </Button>
                      </div>
                    </div>

                    <div role="list" className="space-y-3">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={onDragEnd}
                      >
                        <SortableContext
                          items={steps.map((s) => s.$id || "")}
                          strategy={verticalListSortingStrategy}
                        >
                          {steps.length === 0 && (
                            <div className="p-4 rounded-md border-dashed border text-center text-sm text-muted-foreground">
                              No steps yet — add from the left or use
                              suggestions.
                            </div>
                          )}

                          <div className="space-y-2">
                            {steps.map((st, i) => (
                              <SortableItem
                                key={st.$id}
                                step={st}
                                onRemove={() => handleRemove(st.$id || "")}
                                index={i}
                                setSteps={setSteps}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                </ModalBody>

                <Divider />

                <ModalFooter>
                  <div className="flex w-full justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Pro tip: reorder steps by dragging the handle.
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="light"
                        color="danger"
                        onPress={() => close()}
                        isDisabled={isSubmitting}
                      >
                        Close
                      </Button>
                      <Button
                        color="primary"
                        isDisabled={isSubmitting}
                        isLoading={isSubmitting}
                        onPress={handleFunnelForm}
                      >
                        {prevData?.name ? "Save" : "Create"} funnel
                      </Button>
                    </div>
                  </div>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
