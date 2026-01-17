import { Card, CardBody, CardHeader } from "@heroui/react";
import { CopyBlock, dracula } from "react-code-blocks";

export function AddScriptCard({
  Btn,
  title,
  websiteId,
  domain,
}: {
  title: string;
  websiteId: string;
  Btn?: React.ReactNode;
  domain: string;
}) {
  return (
    <Card className="w-full bg-white dark:bg-[#161619] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
      <CardHeader className="block p-6 bg-gray-50/50 dark:bg-[#1a1a1d]/50 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl">
        <p className="text-lg font-bold text-ink dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Paste the snippet in the {"<head>"} of your site.
        </p>
      </CardHeader>
      <CardBody className="w-full">
        <div className="p-4 md:text-sm text-xs">
          <CopyBlock
            text={`<script
  defer
  data-website-id="${websiteId}"
  data-domain="${domain}"
  src="https://${window.location.hostname === "localhost" ? "localhost:3000" : window.location.hostname}/script.js">
  </script>`}
            language="html"
            theme={dracula}
            wrapLongLines={true}
          />
        </div>
        {Btn ? Btn : ""}
      </CardBody>
    </Card>
  );
}
