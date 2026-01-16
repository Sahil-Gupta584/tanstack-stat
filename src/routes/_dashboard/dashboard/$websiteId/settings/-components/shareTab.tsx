import CodeBlock from "@/components/codeBlock";
import { Card, CardBody, Input, Select, SelectItem, Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ShareTab({ websiteId }: { websiteId: string }) {
    const { resolvedTheme } = useTheme();
    const [chartType] = useState("location");
    const [duration, setDuration] = useState("last_7_days");
    const [primaryColor, setPrimaryColor] = useState("#FF003C");
    const [bgColor, setBgColor] = useState("#0d0d0f");
    const [showLive, setShowLive] = useState(false);

    // Synchronize default bgColor with theme once on mount or theme change
    useEffect(() => {
        setBgColor(resolvedTheme === "light" ? "#ffffff" : "#0d0d0f");
    }, [resolvedTheme]);

    const durations = [
        { label: "Last 24 Hours", value: "last_24_hours" },
        { label: "Last 7 Days", value: "last_7_days" },
        { label: "Last 30 Days", value: "last_30_days" },
        { label: "All Time", value: "all_time" },
    ];

    const getEmbedUrl = (includeColors = true) => {
        const baseUrl = window.location.origin;
        if (!includeColors) {
            return `${baseUrl}/share/${websiteId}/${chartType}?duration=${duration}&showLive=${showLive}`;
        }
        const colorParam = encodeURIComponent(primaryColor);
        const bgParam = encodeURIComponent(bgColor);
        return `${baseUrl}/share/${websiteId}/${chartType}?duration=${duration}&primaryColor=${colorParam}&bgColor=${bgParam}&showLive=${showLive}`;
    };

    // Send messages to iframe for non-reloading updates
    useEffect(() => {
        const iframe = document.querySelector("iframe");
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
                type: "updateStyles",
                primaryColor,
                bgColor
            }, "*");
        }
    }, [primaryColor, bgColor]);

    const getEmbedCode = () => {
        const height = "400px";
        return `<iframe
  src="${getEmbedUrl()}"
  width="100%"
  height="${height}"
></iframe>`;
    };

    return (
        <div className="space-y-6">
            <Card className="max-w-xl p-0 bg-transparent" shadow="none">
                <CardBody className="p-0 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold ">Embed Chart</h3>
                        <p className="text-sm  mt-1">
                            Customize the appearance and data for your embedded analytics.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Duration"
                            variant="bordered"
                            selectedKeys={[duration]}
                            onSelectionChange={(keys) => setDuration(Array.from(keys)[0] as string)}
                            classNames={{
                                label: "text-gray-600 dark:text-gray-300 font-medium",
                                trigger: "bg-white dark:bg-[#161619] border-gray-200 dark:border-gray-800 hover:border-primary shadow-sm",
                            }}
                        >
                            {durations.map((d) => (
                                <SelectItem key={d.value}>
                                    {d.label}
                                </SelectItem>
                            ))}
                        </Select>

                        <div className="flex items-center gap-4 bg-white dark:bg-[#161619] p-2 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                            <Switch
                                isSelected={showLive}
                                onValueChange={setShowLive}
                                color="danger"
                            />
                            <div>
                                <p className="text-sm font-medium">Live Visitor Count</p>
                                <p className="text-xs text-gray-500">Show real-time active users</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Primary Color</p>
                            <div className="flex gap-2">
                                <Input
                                    value={primaryColor}
                                    onValueChange={setPrimaryColor}
                                    variant="bordered"
                                    placeholder="#FF003C"
                                    classNames={{
                                        inputWrapper: "bg-white dark:bg-[#161619] border-gray-200 dark:border-gray-800 hover:border-primary shadow-sm h-[42px]",
                                    }}
                                />
                                <div className="relative size-[42px] shrink-0 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Background Color</p>
                            <div className="flex gap-2">
                                <Input
                                    value={bgColor}
                                    onValueChange={setBgColor}
                                    variant="bordered"
                                    placeholder="#0d0d0f"
                                    classNames={{
                                        inputWrapper: "bg-white dark:bg-[#161619] border-gray-200 dark:border-gray-800 hover:border-primary shadow-sm h-[42px]",
                                    }}
                                />
                                <div className="relative size-[42px] shrink-0 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <p className="text-sm font-medium">Embed Code</p>
                        <CodeBlock
                            compact
                            codeSamples={{
                                "HTML": getEmbedCode()
                            }}
                        />
                    </div>
                </CardBody>
            </Card>

            <div className="space-y-3 w-4xl">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preview</p>
                <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300" style={{ backgroundColor: bgColor }}>
                    <iframe
                        key={`${websiteId}-${chartType}-${duration}-${showLive}`} // Only reload on data/type changes
                        src={getEmbedUrl()}
                        width="100%"
                        height="400px"
                        className="w-full"
                        frameBorder="0"
                    />
                </div>
            </div>
        </div>
    );
}

