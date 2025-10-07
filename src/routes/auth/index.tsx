import { Suspense, useEffect, useState } from "react";

import { account } from "@/appwrite/clientConfig";
import Logo from "@/components/logo";
import { Button, Card, CardBody } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { OAuthProvider } from "appwrite";
import { FcGoogle } from "react-icons/fc";

export const Route = createFileRoute("/auth/")({
  component: Auth,
  validateSearch: (search) => ({ redirect: search.redirect }),
});
function Auth() {
  const [domain, setDomain] = useState("");
  const { redirect } = Route.useSearch();

  useEffect(() => {
    if (redirect && typeof redirect === "string") {
      const redirectParams = new URLSearchParams(redirect.split("?")[1]);

      setDomain(redirectParams.get("domain") || "");
    }
  }, [redirect]);

  function handleAuth() {
    console.log({ redirect, type: typeof redirect });

    const success = new URL(
      typeof redirect === "string" ? redirect : "/dashboard",
      window.location.origin
    ).toString();
    account.createOAuth2Session({
      provider: OAuthProvider.Google,
      failure: window.location.origin + "/auth",
      success,
      scopes: ["profile"],
    });
  }
  return (
    <section className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Card className=" w-fit p-4 transition border border-neutral-200 dark:border-neutral-500 hover:border-primary/50">
          <CardBody>
            <ul className="space-y-4 mb-4">
              <li>
                <Link
                  to="/"
                  className="flex gap-2 items-center font-bold   text-lg leading-normal"
                >
                  <Logo className="h-9" />
                </Link>
              </li>
              <li className="font-extrabold text-2xl">Welcome to Insightly</li>
              <li className="text-lg text-gray-400 ">
                Create a free account to discover
                <p className="flex">
                  {domain?.trim() ? (
                    <p className="font-semibold flex items-center gap-[1px]  ">
                      <img
                        className="size-2 mx-1"
                        src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
                        alt=""
                      />
                      {domain}
                    </p>
                  ) : (
                    " your business"
                  )}
                  's best marketing channels.
                </p>
              </li>
            </ul>
            <Button
              variant="shadow"
              startContent={<FcGoogle />}
              onPress={handleAuth}
            >
              Sign up with Google
            </Button>
          </CardBody>
        </Card>{" "}
      </Suspense>
    </section>
  );
}

const metadata = {
  title: "Login to Insightly",
};
