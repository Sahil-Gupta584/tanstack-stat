import { Tab, Tabs } from "@heroui/react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoSettingsSharp, IoShareSocialSharp } from "react-icons/io5";
import BackBtn from "../-components/backBtn";
import RevenueConnectTab from "../../new/-components/revenueConnectTab";
import GeneralTab from "./-components/generalTab";
import ShareTab from "./-components/shareTab";
import { useEffect, useState } from "react";

export const Route = createFileRoute(
  "/_dashboard/dashboard/$websiteId/settings/",
)({
  component: Settings,
  validateSearch: (search) => ({ domain: String(search.domain) }),
});

function Settings() {
  const { websiteId } = Route.useParams();
  const { domain } = useSearch({
    from: "/_dashboard/dashboard/$websiteId/settings/",
  });

  // Track if we're on mobile for tab orientation
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <BackBtn
        pathname={`/dashboard/${websiteId}`}
        text="Back"
        className="mb-1 py-2"
      />
      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold mb-4 sm:mb-6">
        Settings for {(domain && domain.trim()) || websiteId}
      </h2>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6 w-full">
        <Tabs
          aria-label="Options"
          isVertical={!isMobile}
          classNames={{
            base: "w-full",
            tabList: isMobile
              ? "bg-transparent w-full flex-wrap gap-1"
              : "bg-transparent lg:w-52 flex-shrink-0",
            tab: isMobile
              ? "font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              : "font-medium justify-start",
            tabWrapper: "flex-1 min-w-0",
            panel: "w-full",
          }}
        >
          <Tab
            key="General"
            title={
              <div className="flex items-center gap-1.5 sm:gap-2">
                <IoSettingsSharp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>General</span>
              </div>
            }
          >
            <div className="max-w-lg flex-1 space-y-4 pt-4 lg:pt-0">
              <GeneralTab domain={domain} websiteId={websiteId} />
            </div>
          </Tab>
          <Tab
            key="Revenue"
            title={
              <div className="flex items-center gap-1.5 sm:gap-2">
                <AiFillDollarCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Revenue</span>
              </div>
            }
          >
            <div className="max-w-lg flex-1 space-y-4 pt-4 lg:pt-0">
              <RevenueConnectTab websiteId={websiteId} />
            </div>
          </Tab>
          <Tab
            key="Share"
            className="w-full"
            title={
              <div className="flex items-center gap-1.5 sm:gap-2">
                <IoShareSocialSharp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Share</span>
              </div>
            }
          >
            <div className="max-w-4xl flex-1 space-y-4 pt-4 lg:pt-0">
              <ShareTab websiteId={websiteId} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
