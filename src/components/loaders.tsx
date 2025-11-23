import { Card, CardBody, CardHeader, Divider, Skeleton } from "@heroui/react";
import { Loader2 } from "lucide-react";

export function GraphLoader({
  length,
  className,
}: {
  length: number;
  className?: string;
}) {
  return (
    <Card
      className={`border border-neutral-200 dark:border-[#373737] ${className}`}
    >
      <CardHeader className="gap-2">
        {Array.from({ length }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-12 rounded-md" />
        ))}
      </CardHeader>
      <Divider />
      <CardBody className="flex justify-center items-center">
        <Skeleton className="h-72 w-full rounded-lg grow" />
      </CardBody>
    </Card>
  );
}

export function MainGraphLoader() {
  return (
    <Card className=" border border-neutral-200 dark:border-[#373737] md:col-span-2">
      <CardHeader className="h-24">
        <div className="grid grid-cols-3 md:grid-cols-6 items-center w-full h-full gap-4">
          {Array.from({ length: 5 }).map((d, i) => (
            <Skeleton key={i} className="grow rounded-lg w-full h-full" />
          ))}
        </div>
      </CardHeader>
      <CardBody className="h-96">
        <Skeleton className="grow rounded-lg" />
      </CardBody>
    </Card>
  );
}

export function FunnelChartLoader() {
  return (
    <div className="flex h-full w-full">
      {/* Main Chart Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Funnel Chart Skeleton */}
        <div className="h-[85%] flex items-center justify-center p-4">
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Step 1 - widest */}
            <Skeleton className=" h-[90%] grow  rounded-xl" />

            {/* Step 2 */}
            <Skeleton className=" h-[75%] grow  rounded-xl" />

            {/* Step 3 */}
            <Skeleton className=" h-[50%] grow  rounded-xl" />

            {/* Step 4 - thinnest */}
            <Skeleton className=" h-[25%] grow rounded-xl" />
          </div>
        </div>

        {/* Step Info Below */}
        <div className="grid grid-cols-4 grow">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="text-center border-l dark:border-base-700 border-base-300 p-3 flex flex-col gap-2 items-center justify-center"
            >
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Loader */}
      <div className="w-[25%] border-l border-neutral-200 dark:border-[#373737] bg-content2 dark:bg-content4 flex flex-col justify-between">
        <div className="p-4 space-y-3 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 rounded-lg">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
        <div className="p-2">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <Loader2 className="animate-spin" />
    </div>
  );
}
