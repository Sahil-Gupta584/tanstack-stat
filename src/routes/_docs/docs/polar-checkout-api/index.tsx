import ChipComponent from "@/components/chip";
import { Snippet } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
//@ts-expect-error dont install types
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//@ts-expect-error dont install types
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const Route = createFileRoute("/_docs/docs/polar-checkout-api/")({
  component: Page,
});

const codeSamples: Record<string, string> = {
  javascript: `// app/api/create-checkout/route.js
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  // If you're using Next.js 15+, use this instead:
  // const cookieStore = await cookies();
  
  const result = await polar.checkouts.create({
    products: [...],
    metadata: {
      insightly_visitor_id: cookieStore.get('insightly_visitor_id')?.value,
      insightly_session_id: cookieStore.get('insightly_session_id')?.value,
    },
  });
}`,
  python: `# app/api/create_checkout.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
import polar

app = FastAPI()

# Initialize Polar client
polar.api_key = os.getenv("POLAR_API_KEY")

@app.post("/api/create-checkout")
async def create_checkout(request: Request):
    cookies = request.cookies
    visitor_id = cookies.get("insightly_visitor_id")
    session_id = cookies.get("insightly_session_id")

    try:
        result = polar.checkouts.create(
            products=[
                {
                    "id": "prod_xxxxx",  # Replace with your Polar product ID
                    "quantity": 1,
                }
            ],
            metadata={
                "insightly_visitor_id": visitor_id,
                "insightly_session_id": session_id,
            },
        )
        return JSONResponse({"checkoutId": result.id})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)`,
};

const languages = Object.keys(codeSamples);

function Page() {
  const [selectedLang, setSelectedLang] = useState("javascript");

  return (
    <section className="space-y-4">
      <h2 className="font-bold text-3xl ">
        Attribute revenue with Polar Checkout API
      </h2>
      <li className="text-gray-400! mb-6">
        Pass metadata with
        <ChipComponent
          child="insightly_visitor_id"
          isMargin={true}
          classname="text-sm p-1 text-gray-200"
        />
        and
        <ChipComponent
          child="insightly_session_id"
          isMargin={true}
          classname="text-sm p-1 text-gray-200"
        />
        (cookies from DataFast) when creating a checkout session:
      </li>
      <div className="w-full rounded-xl border border-gray-700 bg-gray-900 shadow-lg overflow-hidden">
        {/* Language Switch Tabs */}
        <div className="flex space-x-2 border-b border-gray-700 bg-gray-800 px-3 py-2 text-sm">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1 rounded-md capitalize transition ${
                selectedLang === lang
                  ? "bg-primary  "
                  : "text-gray-400 hover:  hover:bg-gray-700"
              } cursor-pointer`}
            >
              {lang}
            </button>
          ))}
          <div className="ml-auto">
            <Snippet
              title=""
              symbol=""
              className="block p-0 px-1"
              copyButtonProps={{}}
            />
          </div>
        </div>

        {/* Code Block */}
        <SyntaxHighlighter
          language={selectedLang}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: "0 0 0.75rem 0.75rem",
            padding: "1rem",
          }}
        >
          {codeSamples[selectedLang]}
        </SyntaxHighlighter>
      </div>
      <p className="text-gray-400!">
        Once connected and metadata is properly passed, DataFast will
        automatically attribute revenue to the correct marketing channels.
        <b className="font-bold  "> No webhook setup is required.</b>
      </p>
    </section>
  );
}
