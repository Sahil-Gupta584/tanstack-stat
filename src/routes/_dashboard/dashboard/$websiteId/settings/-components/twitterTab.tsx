import { tryCatchWrapper } from "@/lib/utils/client";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Input,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { getWebsite, updateWebsite } from "../../-actions";

export default function TwitterTab({ websiteId }: { websiteId: string }) {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchKeywords() {
            setIsLoading(true);
            try {
                const website = await getWebsite({ data: { websiteId } });
                setKeywords(website.twitterKeywords || []);
            } catch (error) {
                console.error("Failed to fetch website keywords:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchKeywords();
    }, [websiteId]);

    const addKeyword = () => {
        if (inputValue.trim() && !keywords.includes(inputValue.trim())) {
            setKeywords([...keywords, inputValue.trim()]);
            setInputValue("");
        }
    };

    const removeKeyword = (keywordToRemove: string) => {
        setKeywords(keywords.filter((k) => k !== keywordToRemove));
    };

    const handleSave = async () => {
        await tryCatchWrapper({
            callback: async () => {
                setIsSaving(true);
                await updateWebsite({
                    data: {

                        websiteId,
                        twitterKeywords: keywords,
                    }
                });
                setIsSaving(false);
                return true;
            },
            successMsg: "Twitter keywords updated successfully",
            errorMsg: "Failed to update Twitter keywords",
            errorCallback: () => setIsSaving(false),
        });
    };

    return (
        <div className="space-y-6">
            <Card className="bg-white dark:bg-[#161619] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                <CardHeader className="font-bold bg-gray-50/50 dark:bg-[#1a1a1d]/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl">
                    Track X (Twitter) Mentions
                </CardHeader>
                <CardBody className="p-6 space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add brand names, product names, or hashtags to track mentions on your analytics graph.
                    </p>
                    <div className="flex gap-2">
                        <Input
                            variant="bordered"
                            placeholder="e.g. #DataFast, @datafast_"
                            value={inputValue}
                            onValueChange={setInputValue}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") addKeyword();
                            }}
                            classNames={{
                                inputWrapper: "bg-white dark:bg-[#161619] border-gray-200 dark:border-gray-800 hover:border-primary shadow-sm",
                            }}
                        />
                        <Button color="primary" onPress={addKeyword} isDisabled={!inputValue.trim()}>
                            Add
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {keywords.length === 0 && !isLoading && (
                            <p className="text-xs text-gray-400 italic">No keywords added yet.</p>
                        )}
                        {keywords.map((keyword) => (
                            <Chip
                                key={keyword}
                                onClose={() => removeKeyword(keyword)}
                                variant="flat"
                                color="secondary"
                            >
                                {keyword}
                            </Chip>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            color="primary"
                            variant="solid"
                            onPress={handleSave}
                            isLoading={isSaving}
                            isDisabled={isLoading}
                        >
                            Save Changes
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
