import { CommonChart } from "./commonChart";
import type { Metric } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GraphLoader } from "@/components/loaders";

export function TwitterReferrerPanel({
  websiteId,
  duration,
}: {
  websiteId: string;
  duration: string;
}) {
  const linksQuery = useQuery({
    queryKey: ["links", websiteId, duration],
    queryFn: async () => {
      const res = await axios("/api/analytics/links", {
        params: { websiteId, duration },
      });
      return res.data?.dataset || [];
    },
    enabled: !!websiteId,
  });

  if (linksQuery.isLoading) return <GraphLoader length={1} />;
  if (linksQuery.isError)
    return <div className="text-center text-gray-400 py-8">Error loading links</div>;

  const data: Metric[] = linksQuery.data || [];

  return (
    <>
      {data && data.length > 0 ? (
        <CommonChart data={data} />
      ) : (
        <div className="text-center text-gray-400 py-8">
          No referrer links found for this period.
        </div>
      )}
    </>
  );
}