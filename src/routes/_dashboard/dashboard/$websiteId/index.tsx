import { account } from "@/configs/appwrite/clientConfig";
import type { TWebsite } from "@/lib/types";
import { Dashboard } from "@/routes/-components/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/_dashboard/dashboard/$websiteId/")({
  component: Page,
  loader: async ({ params }) => {
    try {
      const user = await account.get();
      const res = await axios("/api/website", {
        params: { userId: user.$id },
      });
      const websites = res.data?.websites as TWebsite[];
      const currentWebsite = websites?.find((w) => w.$id === params.websiteId);
      return { currentWebsite };
    } catch {
      return { currentWebsite: null };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.currentWebsite?.domain
          ? `${loaderData.currentWebsite.domain} - Dashboard`
          : "Dashboard",
      },
      {
        name: "description",
        content: loaderData?.currentWebsite?.domain
          ? `Analytics dashboard for ${loaderData.currentWebsite.domain}`
          : "Analytics dashboard for your website",
      },
    ],
  }),
});

function Page() {
  const { websiteId } = Route.useParams();
  return <Dashboard isDemo={false} websiteId={websiteId as string} />;
}
