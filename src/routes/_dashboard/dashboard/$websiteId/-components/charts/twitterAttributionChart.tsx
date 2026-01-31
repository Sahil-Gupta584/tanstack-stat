import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RiTwitterXFill } from "react-icons/ri";
import { LuExternalLink } from "react-icons/lu";

interface TwitterAttributionProps {
  websiteId: string;
  duration: string;
}

interface TwitterPost {
  postUrl: string;
  postId?: string;
  visitors: number;
  clickCount: number;
}

export function TwitterAttributionChart({
  websiteId,
  duration,
}: TwitterAttributionProps) {
  const twitterAttributionQuery = useQuery({
    queryKey: ["twitterAttribution", websiteId, duration],
    queryFn: async () => {
      try {
        const res = await axios("/api/analytics/twitter-attribution", {
          params: { websiteId, duration },
        });
        return res.data;
      } catch (error) {
        console.error("Error fetching Twitter attribution:", error);
        return { ok: false, posts: [], total: 0 };
      }
    },
    enabled: !!websiteId,
  });

  const posts = (twitterAttributionQuery.data?.posts || []) as TwitterPost[];
  const total = twitterAttributionQuery.data?.total || 0;

  if (twitterAttributionQuery.isLoading) {
    return (
      <Card className="md:col-span-1 bg-white dark:bg-[#161619] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <CardHeader className="bg-gray-50/50 dark:bg-[#1a1a1d]/50 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl flex items-center gap-2">
          <RiTwitterXFill className="text-xl" />
          <span className="text-sm font-semibold">Twitter Attribution</span>
        </CardHeader>
        <CardBody className="py-6">
          <div className="text-center text-gray-400">Loading...</div>
        </CardBody>
      </Card>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card className="md:col-span-1 bg-white dark:bg-[#161619] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <CardHeader className="bg-gray-50/50 dark:bg-[#1a1a1d]/50 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl flex items-center gap-2">
          <RiTwitterXFill className="text-xl" />
          <span className="text-sm font-semibold">Twitter Attribution</span>
        </CardHeader>
        <CardBody className="py-6">
          <div className="text-center text-gray-400">
            No Twitter referrals yet
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-1 bg-white dark:bg-[#161619] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
      <CardHeader className="bg-gray-50/50 dark:bg-[#1a1a1d]/50 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RiTwitterXFill className="text-xl" />
          <span className="text-sm font-semibold">Twitter Attribution</span>
        </div>
        <span className="text-xs font-bold text-primary">{total}</span>
      </CardHeader>
      <CardBody className="py-4 space-y-3 max-h-96 overflow-y-auto">
        {posts.map((post, idx) => (
          <div
            key={post.postId || idx}
            className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-[#1a1a1d]/50 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-gray-500">
                    {post.postId ? `Tweet #${post.postId.slice(-6)}` : "Link"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {post.postUrl}
                </p>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="shrink-0"
                as="a"
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuExternalLink className="text-sm" />
              </Button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {post.visitors}
                </span>{" "}
                unique
              </span>
              <span className="text-gray-400">
                {post.clickCount} clicks
              </span>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
