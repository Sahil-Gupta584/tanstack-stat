import LinkComponent from "@/components/link";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  useDisclosure,
} from "@heroui/react";
import { Link } from "@tanstack/react-router";
import FunnelCommonModal from "../funnel/funnelCommonModal";

function EmptyEvent({
  chartType,
  websiteId,
  refetchFunnels,
}: {
  chartType: "goals" | "funnels";
  websiteId: string;
  refetchFunnels?: () => void;
}) {
  const disclosure = useDisclosure();

  let header, footer;
  switch (chartType) {
    case "goals":
      header = (
        <>
          Track what visitors do on your site
          <Button
            color="primary"
            startContent={"+"}
            as={Link}
            to="/docs/custom-goals"
          >
            ✚ Add Goals
          </Button>
        </>
      );
      footer = (
        <>
          Revenue-related goals are automatically tracked with{" "}
          <LinkComponent
            text="revenue attribution"
            blank
            href="/docs/revenue-attribution-guide"
          />
        </>
      );
      break;
    case "funnels":
      header = (
        <>
          Track user journey funnels
          <FunnelCommonModal
            disclosure={disclosure}
            refetchFunnels={refetchFunnels || (() => { })}
            colorPrimary={true}
            websiteId={websiteId}
          />
        </>
      );
      footer = (
        <>
          Monitor the steps users take through your funnel to identify drop-off
          points
        </>
      );
      break;
  }

  return (
    <div className="relative flex h-full">
      <img
        src={`/images/${chartType === "goals" ? "goals" : "funnel"}.png`}
        alt=""
        className="grow opacity-[0.25] light:invert-100 light:hue-rotate-180"
      />

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Card isBlurred className="p-4 dark:bg-content2">
          <CardHeader className="flex-col items-center justify-center gap-4 font-bold">
            {header}
          </CardHeader>
          <CardFooter className="text-sm text-secondary">
            {footer}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default EmptyEvent;
