import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";
import { FiCornerDownRight } from "react-icons/fi";

function CommonTooltip({
  data,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  label: string | React.ReactNode | null;
}) {
  function dropOffHeader() {
    return (
      <ul className="text-[#86868b] dark:text-[#8e8e93] w-full space-y-1.5">
        {data?.prevStepName && (
          <li className="flex justify-between items-center">
            <p className="flex gap-1 w-fit">
              <FiCornerDownRight />
              {data?.prevStepName}
            </p>
            <span>{data?.prevStepVisitors}</span>
          </li>
        )}
        <li className="flex gap-2 items-center justify-between">
          <p>Dropoff</p>
          <span className="text-[#ff3b30] font-semibold">
            -{data?.dropoff}
          </span>
        </li>
        <li className="pl-4 flex gap-2 items-center text-[#1d1d1f] dark:text-[#f5f5f7] justify-between">
          <p className="flex gap-1 w-fit">
            <FiCornerDownRight />
            {data?.name}
          </p>
          <span>{data?.visitors}</span>
        </li>
      </ul>
    );
  }

  return (
    <Card className="min-w-[200px] bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#3a3a3c] shadow-apple-lg rounded-xl">
      <CardBody className="p-4">
        {label || data?.prevStepName ? (
          <>
            <CardHeader className="text-sm font-medium p-0 text-[#1d1d1f] dark:text-[#f5f5f7]">
              {data?.prevStepName ? dropOffHeader() : label}
            </CardHeader>
            <Divider className="my-3 bg-[#e8e8ed] dark:bg-[#3a3a3c]" />
          </>
        ) : null}
        <ul className="text-sm flex justify-between items-center">
          <li className="flex gap-2 items-center text-[#1d1d1f] dark:text-[#f5f5f7]">
            <div className="w-3 h-3 bg-[#0071e3] dark:bg-[#0a84ff] rounded" />
            Visitors
          </li>
          <li className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{data?.visitors}</li>
        </ul>

        {data?.revenue && data.revenue > 0 ? (
          <>
            <Divider className="my-3 bg-[#e8e8ed] dark:bg-[#3a3a3c]" />
            <ul className="text-sm flex justify-between items-center">
              <li className="flex gap-2 items-center text-[#1d1d1f] dark:text-[#f5f5f7]">
                <div className="w-3 h-3 bg-[#34c759] dark:bg-[#30d158] rounded" />
                Revenue
              </li>
              <li className="font-semibold text-[#34c759] dark:text-[#30d158]">${data?.revenue}</li>
            </ul>
            <Divider className="my-3 bg-[#e8e8ed] dark:bg-[#3a3a3c]" />
            <ul className="flex justify-between text-xs text-[#86868b] dark:text-[#8e8e93]">
              <li>Revenue/visitor</li>
              <li className="font-medium">${(data?.revenue / data?.visitors).toFixed(2)}</li>
            </ul>
            <ul className="flex justify-between text-xs text-[#86868b] dark:text-[#8e8e93] mt-1">
              <li>Conversion rate</li>
              <li className="font-medium">{(Number(data?.customers) || 0).toFixed(2)}%</li>
            </ul>
          </>
        ) : null}
        {data?.conversionRate ? (
          <>
            <Divider className="my-3 bg-[#e8e8ed] dark:bg-[#3a3a3c]" />
            <ul className="text-sm flex justify-between items-center">
              <li className="flex gap-2 items-center text-[#1d1d1f] dark:text-[#f5f5f7]">
                <div className="w-3 h-3 bg-[#34c759] dark:bg-[#30d158] rounded" />
                Conversion Rate
              </li>
              <li className="font-semibold text-[#34c759] dark:text-[#30d158]">
                {(data?.conversionRate || 0)?.toFixed(2)}%
              </li>
            </ul>
          </>
        ) : null}
      </CardBody>
    </Card>
  );
}

export default CommonTooltip;
