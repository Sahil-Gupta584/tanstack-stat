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
      <ul className="text- text-default-400 w-full space-y-1.5">
        {data?.prevStepName && (
          <li className="flex justify-between items-center ">
            <p className="flex gap-1 w-fit">
              <FiCornerDownRight />
              {data?.prevStepName}
            </p>
            <span>{data?.prevStepVisitors}</span>
          </li>
        )}
        <li className="flex gap-2 items-center  justify-between">
          <p>Dropoff</p>
          <span className="text-danger-500 font-semibold">
            -{data?.dropoff}
          </span>
        </li>
        <li className="pl-4 flex gap-2 items-center text-base-100 justify-between">
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
    <Card className="min-w-3xs bg-content4 border-medium border-default">
      <CardBody>
        {label || data?.prevStepName ? (
          <>
            <CardHeader className="text-sm font-medium p-0">
              {data?.prevStepName ? dropOffHeader() : label}
            </CardHeader>
            <Divider className="my-2" />
          </>
        ) : (
          ""
        )}
        <ul className="text-sm flex justify-between">
          <li className="flex gap-2 items-center">
            <div className="size-5 bg-primary rounded-sm" />
            Visitors
          </li>
          <li>{data?.visitors}</li>
        </ul>

        {data?.revenue && data.revenue > 0 ? (
          <>
            <Divider className="my-2" />
            <ul className="text-sm flex justify-between">
              <li className="flex gap-2 items-center">
                <div className="size-5 bg-[#e78468] rounded-sm" />
                Revenue
              </li>
              <li>${data?.revenue}</li>
            </ul>
            <Divider className="my-2" />
            <ul className=" flex justify-between text-xs">
              <li>Revenue/visitor</li>
              <li>${(data?.revenue / data?.visitors).toFixed(2)}</li>
            </ul>
            <ul className=" flex justify-between text-xs">
              <li>Conversion rate</li>
              <li>{(Number(data?.customers) || 0).toFixed(2)}%</li>
            </ul>
          </>
        ) : (
          ""
        )}
        {data?.conversionRate ? (
          <>
            <Divider className="my-2" />
            <ul className="text-sm flex justify-between">
              <li className="flex gap-2 items-center">
                <div className="size-5 bg-success rounded-sm" />
                Conversion Rate
              </li>
              <li className="font-semibold text-success">
                {(data?.conversionRate || 0)?.toFixed(2)}%
              </li>
            </ul>
          </>
        ) : (
          ""
        )}
      </CardBody>
    </Card>
  );
}

export default CommonTooltip;
