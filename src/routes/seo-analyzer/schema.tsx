import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";
import type { SchemaType } from "@/lib/seo-types";
import { SCHEMA_TYPES } from "@/lib/seo-types";
import { seo } from "@/lib/utils/client";
import { addToast, Button, Card, CardBody, Input, Tab, Tabs, Textarea } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaCode, FaCopy, FaDownload } from "react-icons/fa";
import { SEOFooter } from "./-components/SEOFooter";

export const Route = createFileRoute("/seo-analyzer/schema")({
  head: () => ({
    meta: [
      ...seo({
        title: "Schema Generator | Insightly - JSON-LD Structured Data",
        description:
          "Generate JSON-LD schema markup for your website. Support for Organization, Article, Product, LocalBusiness, FAQ, and more.",
        image: "https://www.insightly.live/images/open-graph.png",
        url: "https://www.insightly.live/seo-analyzer/schema",
      }),
    ],
  }),
  component: SchemaGeneratorPage,
});

function SchemaNav() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-premium bg-white/80 dark:bg-[#0a0a0c]/80 border-b border-gray-200/80 dark:border-gray-800/80 shadow-premium-md"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="flex items-center gap-3 font-bold text-xl text-ink dark:text-white transition-premium hover:opacity-80"
          >
            <Logo className="h-6" />
            <span className="tracking-tight">Insightly</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/seo-analyzer"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              SEO Analyzer
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/seo-analyzer/bulk"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              Bulk Scan
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/seo-analyzer/compare"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              Compare
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/seo-analyzer/schema"
              className="text-sm font-medium text-cipher-red relative group"
            >
              Schema
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cipher-red" />
            </Link>
            <Link
              to="/seo-analyzer/serp"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              SERP Preview
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              as={Link}
              to="/"
              className="glow-effect bg-cipher-red hover:bg-cipher-dark text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-premium shadow-premium-sm hover:shadow-premium-md"
            >
              Analytics
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function SchemaForm({
  schemaType,
  onGenerate,
}: {
  schemaType: SchemaType;
  onGenerate: (schema: object) => void;
}) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Check required fields
    for (const field of schemaType.fields) {
      if (field.required && !formData[field.name]) {
        addToast({
          color: "danger",
          title: "Error",
          description: `${field.label} is required`,
        });
        return;
      }
    }

    // Generate schema based on type
    let schema: object;

    switch (schemaType.type) {
      case "Organization":
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: formData.name,
          url: formData.url,
          ...(formData.logo && { logo: formData.logo }),
          ...(formData.description && { description: formData.description }),
        };
        break;

      case "Article":
        schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: formData.headline,
          author: {
            "@type": "Person",
            name: formData.author,
          },
          datePublished: formData.datePublished,
          ...(formData.image && { image: formData.image }),
          ...(formData.description && { description: formData.description }),
        };
        break;

      case "Product":
        schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: formData.name,
          description: formData.description,
          ...(formData.image && { image: formData.image }),
          ...(formData.price && {
            offers: {
              "@type": "Offer",
              price: formData.price,
              priceCurrency: formData.currency || "USD",
            },
          }),
        };
        break;

      case "LocalBusiness":
        schema = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: formData.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: formData.address,
          },
          ...(formData.telephone && { telephone: formData.telephone }),
          ...(formData.url && { url: formData.url }),
        };
        break;

      case "FAQPage":
        try {
          const questions = JSON.parse(formData.questions || "[]");
          schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: questions.map(
              (q: { question: string; answer: string }) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: q.answer,
                },
              })
            ),
          };
        } catch {
          addToast({
            color: "danger",
            title: "Error",
            description: "Invalid JSON format for questions",
          });
          return;
        }
        break;

      case "BreadcrumbList":
        try {
          const items = JSON.parse(formData.items || "[]");
          schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map(
              (item: { name: string; url: string }, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: item.url,
              })
            ),
          };
        } catch {
          addToast({
            color: "danger",
            title: "Error",
            description: "Invalid JSON format for breadcrumb items",
          });
          return;
        }
        break;

      default:
        schema = { "@context": "https://schema.org" };
    }

    onGenerate(schema);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {schemaType.description}
      </p>

      {schemaType.fields.map((field) => (
        <div key={field.name}>
          {field.type === "textarea" ? (
            <Textarea
              label={`${field.label}${field.required ? " *" : ""}`}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field.name]: e.target.value })
              }
              classNames={{
                inputWrapper:
                  "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
              }}
            />
          ) : (
            <Input
              type={field.type === "date" ? "date" : "text"}
              label={`${field.label}${field.required ? " *" : ""}`}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field.name]: e.target.value })
              }
              classNames={{
                inputWrapper:
                  "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
              }}
            />
          )}
        </div>
      ))}

      <Button
        onPress={handleSubmit}
        className="w-full mt-4 glow-effect bg-cipher-red hover:bg-cipher-dark text-white py-6 rounded-xl font-semibold text-base transition-premium"
        startContent={<FaCode />}
      >
        Generate Schema
      </Button>
    </div>
  );
}

function SchemaGeneratorPage() {
  const [generatedSchema, setGeneratedSchema] = useState<object | null>(null);
  const [selectedType, setSelectedType] = useState<string>("Organization");

  const copyToClipboard = () => {
    if (generatedSchema) {
      const scriptTag = `<script type="application/ld+json">\n${JSON.stringify(generatedSchema, null, 2)}\n</script>`;
      navigator.clipboard.writeText(scriptTag);
      addToast({
        color: "success",
        description: "Schema copied to clipboard!",
      });
    }
  };

  const downloadSchema = () => {
    if (generatedSchema) {
      const scriptTag = `<script type="application/ld+json">\n${JSON.stringify(generatedSchema, null, 2)}\n</script>`;
      const blob = new Blob([scriptTag], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `schema-${selectedType.toLowerCase()}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <main className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      <SchemaNav />

      <section className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-extrabold text-4xl md:text-5xl text-ink dark:text-white mb-4">
              Schema <span className="gradient-text">Generator</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Generate JSON-LD structured data markup for rich search results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="glass-card border border-gray-200 dark:border-gray-800 shadow-premium-xl">
              <CardBody className="p-6">
                <Tabs
                  aria-label="Schema Types"
                  color="danger"
                  variant="underlined"
                  selectedKey={selectedType}
                  onSelectionChange={(key) => {
                    setSelectedType(key as string);
                    setGeneratedSchema(null);
                  }}
                  classNames={{
                    tabList: "gap-4 flex-wrap",
                    cursor: "bg-cipher-red",
                    tab: "px-2 h-10",
                  }}
                >
                  {SCHEMA_TYPES.map((type) => (
                    <Tab key={type.type} title={type.label}>
                      <div className="mt-6">
                        <SchemaForm
                          schemaType={type}
                          onGenerate={setGeneratedSchema}
                        />
                      </div>
                    </Tab>
                  ))}
                </Tabs>
              </CardBody>
            </Card>

            {/* Output */}
            <Card className="glass-card border border-gray-200 dark:border-gray-800 shadow-premium-xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-ink dark:text-white">
                    Generated Schema
                  </h3>
                  {generatedSchema && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="bordered"
                        onPress={copyToClipboard}
                        startContent={<FaCopy />}
                        className="border-gray-300 dark:border-gray-700"
                      >
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="bordered"
                        onPress={downloadSchema}
                        startContent={<FaDownload />}
                        className="border-gray-300 dark:border-gray-700"
                      >
                        Download
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-[500px]">
                  {generatedSchema ? (
                    <pre className="text-sm text-green-400 font-mono">
                      <code>
                        {`<script type="application/ld+json">\n${JSON.stringify(generatedSchema, null, 2)}\n</script>`}
                      </code>
                    </pre>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Fill in the form to generate your schema markup
                    </p>
                  )}
                </div>

                {generatedSchema && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
                      How to use
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Paste this script tag in the{" "}
                      <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                        &lt;head&gt;
                      </code>{" "}
                      section of your HTML page. Test it with Google's Rich
                      Results Test tool.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <SEOFooter />
    </main>
  );
}
