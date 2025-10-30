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
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <script
          data-allow-localhost="true"
          defer
          data-website-id="68d124eb001034bd8493"
          data-domain="syncmate.xyz"
          src="http://localhost:3000/script.js"
        ></script>
      </head>
      <body>
        <div className="grid h-svh grid-rows-[auto_1fr]">
          {isFetching ? <Loader /> : <Outlet />}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
