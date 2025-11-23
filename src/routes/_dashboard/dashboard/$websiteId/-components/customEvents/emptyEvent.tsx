import LinkComponent from "@/components/link";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  UseDisclosureProps,
} from "@heroui/react";
import { Link } from "lucide-react";
import { useTheme } from "next-themes";
import AddFunnel from "../funnel/funnelCommonModal";

export type THeroUIDisclosure = UseDisclosureProps & {
  onOpenChange: (isOpen: boolean) => void;
};
function EmptyEvent({
  chartType,
  websiteId,
  refetchFunnels,
  disclosure,
}: {
  chartType: "commonChart" | "goals" | "funnels";
  websiteId: string;
  refetchFunnels?: () => void;
  disclosure?: THeroUIDisclosure;
}) {
  const { theme } = useTheme();
  const emptyEventsUI = {
    goals: {
      header: (
        <>
          Track what visitors do on your site
          <Button
            color="primary"
            startContent={"✕"}
            as={Link}
            href="/docs/custom-goals"
          >
            ✚ Add Goals
          </Button>
        </>
      ),
      footer: (
        <>
          Revenue-related goals are automatically tracked with{" "}
          <LinkComponent
            text="revenue attribution"
            blank
            href="/docs/revenue-attribution-guide"
          />
        </>
      ),
    },
    funnels: {
      header: (
        <>
          Track user journey funnels
          {disclosure && (
            <AddFunnel
              colorPrimary
              websiteId={websiteId}
              refetchFunnels={refetchFunnels || (() => {})}
              disclosure={disclosure}
            />
          )}
        </>
      ),
      footer: (
        <>
          Monitor the steps users take through your funnel to identify drop-off
          points
        </>
      ),
    },
    commonChart: {
      header: (
        <>
          Track what visitors do on your site
          <Button
            color="primary"
            startContent={"✕"}
            as={Link}
            href="/docs/custom-goals"
          >
            ✚ Add Goals
          </Button>
        </>
      ),
      footer: (
        <>
          Revenue-related goals are automatically tracked with{" "}
          <LinkComponent
            text="revenue attribution"
            blank
            href="/docs/revenue-attribution-guide"
          />
        </>
      ),
    },
  };
  return (
    <div className="relative flex h-full">
      <img
        src={`/images/goals${theme === "light" ? "-light" : ""}.png`}
        alt=""
        className="grow opacity-[0.25]"
      />

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Card isBlurred className="p-4">
          <CardHeader className="flex-col items-center justify-center gap-4 font-bold">
            {emptyEventsUI[chartType].header}
          </CardHeader>
          <CardFooter className="text-sm text-secondary">
            {emptyEventsUI[chartType].footer}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default EmptyEvent;
