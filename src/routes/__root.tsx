import Loader from "@/components/loaders";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";

//@ts-expect-error not getting type
import "../styles.css";
import { Providers } from "./-components/providers";

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title:
          "Insightly |  Understand who’s visiting, where they come from and what keeps them engaged.",
      },
    ],
  }),

  component: RootDocument,
  notFoundComponent: () => <div>404 Not Found</div>,
});

function RootDocument() {
  const isFetching = useRouterState({ select: (s) => s.isLoading });
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          defer
          data-website-id="690f5c93001de3d190b7"
          data-domain="insightly.appwrite.network"
          // src="https://insightly.appwrite.network/script.js"
          src="/script.js"
        // data-allow-localhost="true"
        ></script>
        <script
          src="https://cdn.databuddy.cc/databuddy.js"
          data-client-id="HmG0wou5QqbmFpayioQd3"
          data-enable-batching="true"
          crossOrigin="anonymous"
          async
        ></script>
        <script
          data-enable-batching="true"
          defer
          data-website-id="dfid_kBI2QGsIF6CRn7NtChUUi"
          data-domain="insightly.appwrite.network"
          src="https://datafa.st/js/script.js"
        ></script>
      </head>
      <body>
        <div className="grid h-svh grid-rows-[auto_1fr]">
          <Providers>{isFetching ? <Loader /> : <Outlet />}</Providers>
        </div>
      </body>
      <Scripts />
    </html>
  );
}
