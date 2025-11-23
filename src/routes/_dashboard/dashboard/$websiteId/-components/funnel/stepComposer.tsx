import {
  addToast,
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { ID } from "appwrite";
import { useCallback, useState } from "react";
import { FaEye, FaStar } from "react-icons/fa6";
import { GoGoal } from "react-icons/go";
import { TFunnelStep } from "../customEvents/funnelChart";

type TTab = "page" | "goal";
type TGoalMode = "completes" | "notCompletes";

function beautifyOperation(op: string) {
  return op
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

const defaultOps = [
  "startsWith",
  "equals",
  "contains",
  "endsWith",
  "doesNotEqual",
  "doesNotContains",
  "wildCardPattern",
];

export function StepComposer({
  onAdd,
  funnelId,
  stepsLength,
}: {
  onAdd: (s: TFunnelStep) => void;
  funnelId: string;
  stepsLength: number;
}) {
  const [tab, setTab] = useState<TTab>("page");
  const [name, setName] = useState("");
  const [op, setOp] = useState(defaultOps[0]);
  const [url, setUrl] = useState("");
  const [goalMode, setGoalMode] = useState<TGoalMode>("completes");
  const [goalValue, setGoalValue] = useState("");

  const makeAndAdd = useCallback(() => {
    if (tab === "page" && !url.startsWith("/")) {
      addToast({
        color: "warning",
        title: "Invalid page",
        description: "page value should start with /",
      });
      return;
    }
    const step: TFunnelStep =
      tab === "page"
        ? {
            $id: ID.unique(),
            name: name || `Page: ${url || "/"}`,
            kind: "page",
            descriptor: `${op}:${url || "/"}`,
            funnelId,
            order: stepsLength + 1,
          }
        : {
            $id: ID.unique(),
            name: name || `Goal: ${goalValue || "unnamed"}`,
            kind: "goal",
            descriptor: `${goalMode}:${goalValue || "unknown"}`,
            funnelId,
            order: stepsLength + 1,
          };
    onAdd(step);
    // reset small fields (keep last operation for convenience)
    setName("");
    setUrl("");
    setGoalValue("");
  }, [tab, name, op, url, goalMode, goalValue, onAdd]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Create a step</h3>

      <Input
        value={name}
        onValueChange={(v) => setName(v)}
        label="Step title"
        placeholder={tab === "page" ? "Visit pricing page" : "Sign up complete"}
        variant="bordered"
        labelPlacement="outside-top"
      />

      <Tabs
        variant="underlined"
        selectedKey={tab}
        onSelectionChange={(k) => setTab(k as TTab)}
      >
        <Tab
          key="page"
          title={
            <div className="flex items-center gap-2">
              <FaEye /> Page visit
            </div>
          }
        >
          <div className="mt-2 space-y-2">
            <label className="text-xs text-muted-foreground">Match</label>
            <div className="flex gap-2">
              <Select
                variant="bordered"
                value={op}
                className="min-w-[160px]"
                defaultSelectedKeys={["startsWith"]}
                onChange={(v) => setOp(v.target.value)}
                aria-label="Match operation"
              >
                {defaultOps.map((o) => (
                  <SelectItem key={o}>{beautifyOperation(o)}</SelectItem>
                ))}
              </Select>
              <Input
                onValueChange={(v) => setUrl(v)}
                placeholder={
                  op === "wildCardPattern" ? "/*,/auth/*" : "/pricing"
                }
                variant="bordered"
                value={url}
              />
            </div>
          </div>
        </Tab>

        <Tab
          key="goal"
          title={
            <div className="flex items-center gap-2">
              <GoGoal /> Goal
            </div>
          }
        >
          <div className="mt-2 space-y-2">
            <label className="text-xs text-muted-foreground">
              Visitor condition
            </label>
            <div className="flex gap-2">
              <Select
                variant="bordered"
                className="min-w-[160px]"
                defaultSelectedKeys={["completes"]}
                onChange={(e) => setGoalMode(e.target.value as TGoalMode)}
                aria-label="Visitor condition"
              >
                <SelectItem key="completes">Completes</SelectItem>
                <SelectItem key="notCompletes">Does NOT complete</SelectItem>
              </Select>
              <Input
                onValueChange={(v) => setGoalValue(v)}
                placeholder="e.g., signup, create_checkout"
                variant="bordered"
                value={goalValue}
              />
            </div>
          </div>
        </Tab>
      </Tabs>

      <Button className="w-full" onPress={makeAndAdd} color="primary">
        ✚ Add step
      </Button>

      <Divider />

      <div>
        <div className="flex items-center gap-2 mb-2 text-sm">
          <FaStar />
          <div className="font-medium">Suggested</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="p-2 border border-dashed rounded-md text-sm cursor-pointer hover:opacity-70"
            type="button"
            onClick={() =>
              onAdd({
                $id: ID.unique(),
                name: "Visit Landing Page",
                kind: "page",
                descriptor: "startsWith:/",
                funnelId,
                order: stepsLength + 1,
              })
            }
          >
            👋 Visit Landing Page
          </button>

          <Link
            to="/docs/revenue-attribution-guide"
            className="no-underline p-2 border border-dashed rounded-md text-sm"
            target="_blank"
          >
            💰 Make a payment
          </Link>

          <Link
            target="_blank"
            to="/docs/custom-goals"
            className="no-underline p-2 border border-dashed rounded-md text-sm"
          >
            ⚙️ Configure goals
          </Link>
        </div>
      </div>
    </div>
  );
}
