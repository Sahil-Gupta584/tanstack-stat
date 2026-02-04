import {
    Avatar,
    Button,
    Card,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from '@heroui/react';
import { FaLink, FaRegComment } from 'react-icons/fa6';
import { HiCheckBadge } from 'react-icons/hi2';
import { RiTwitterXFill } from 'react-icons/ri';

export interface TTwitterMention {
    id: string;
    tweetId: string;
    username: string;
    handle: string;
    content: string;
    image: string;
    timestamp: string;
    inReplyToUserHandle?: string;
    inReplyToTweetId?: string;
    isVerified?: boolean;
}

function TwitterMentionsModal({ isOpen, onOpenChange, selectedMentions }: { isOpen: boolean, onOpenChange: (open: boolean) => void, selectedMentions: TTwitterMention[] }) {

    const firstMentionDate = selectedMentions.length > 0
        ? new Date(selectedMentions[0].timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()
        : '';

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="2xl"
            backdrop="blur"
            scrollBehavior="inside"
            hideCloseButton
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex justify-between items-center py-6 px-8">
                            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm tracking-widest">
                                {firstMentionDate}
                            </span>
                            <Button
                                isIconOnly
                                variant="light"
                                onPress={onClose}
                                className="min-w-10 w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800"
                            >
                                <span className="text-xl">✕</span>
                            </Button>
                        </ModalHeader>
                        <ModalBody className="pb-8 px-8">
                            <div className="flex flex-col gap-4">
                                {selectedMentions.map((mention) => {

                                    const handleCopyLink = async () => {
                                        let tweetUrl = `https://x.com/${mention.handle}/status/${mention.tweetId}`;
                                        try {
                                            if (!mention.tweetId?.trim()) {
                                                tweetUrl = 'https://x.com/sahil_builds'
                                            }
                                            await navigator.clipboard.writeText(tweetUrl);
                                        } catch (err) {
                                            console.error('Failed to copy: ', err);
                                        }
                                    };

                                    return (
                                        <Card
                                            key={mention.id || mention.tweetId}
                                            className="p-4 border-base-800 hover:bg-base-100 relative group"
                                            radius='lg'
                                        >
                                            {/* X Logo in corner */}
                                            <div className="absolute top-6 right-6 text-xl text-black dark:text-white">
                                                <RiTwitterXFill />
                                            </div>

                                            <div className="flex gap-3">
                                                <Avatar
                                                    src={mention.image}
                                                    name={mention.username}
                                                    className="w-10 h-10 rounded-full ring-2 ring-gray-50 dark:ring-gray-800"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col mb-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <a
                                                                href={`https://x.com/${mention.handle}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="font-bold text-[14px] hover:underline cursor-pointer truncate"
                                                            >
                                                                {mention.username}
                                                            </a>
                                                            {mention.isVerified && <HiCheckBadge className="text-[#1D9BF0] text-lg shrink-0" />}
                                                        </div>
                                                        <span className="text-gray-500 text-[13px]">
                                                            @{mention.handle}
                                                        </span>
                                                    </div>

                                                    {mention.inReplyToUserHandle && (
                                                        <p className="text-[#656d73] dark:text-gray-400 text-[13px] mb-1">
                                                            Replying to <a href={`https://x.com/${mention.inReplyToUserHandle}`} target="_blank" rel="noreferrer" className="text-[#1D9BF0] hover:underline cursor-pointer">@{mention.inReplyToUserHandle}</a>
                                                        </p>
                                                    )}

                                                    <p className="text-[14px] leading-relaxed mb-3 text-black dark:text-white whitespace-pre-wrap">
                                                        {mention.content.split(/(@\w+|#\w+|https?:\/\/\S+)/g).map((part, i) => {
                                                            if (part.startsWith('@')) return <a key={i} href={`https://x.com/${part.slice(1)}`} target="_blank" rel="noreferrer" className="text-[#1D9BF0] hover:underline cursor-pointer">{part}</a>;
                                                            if (part.startsWith('#')) return <a key={i} href={`https://x.com/hashtag/${part.slice(1)}`} target="_blank" rel="noreferrer" className="text-[#1D9BF0] hover:underline cursor-pointer">{part}</a>;
                                                            if (part.startsWith('http')) return <a key={i} href={part} target="_blank" rel="noreferrer" className="text-[#1D9BF0] hover:underline cursor-pointer">{part}</a>;
                                                            return part;
                                                        })}
                                                    </p>

                                                    <div className="text-[13px] text-gray-500 mb-4 flex items-center gap-1">
                                                        <span>{new Date(mention.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                                                        <span>·</span>
                                                        <span>{new Date(mention.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>

                                                    <div className="flex items-center gap-6 pt-3 border-t border-gray-50 dark:border-gray-800">
                                                        <a
                                                            href={`https://x.com/intent/tweet?in_reply_to=${mention.tweetId}`}
                                                            target="_blank"
                                                            className="flex items-center gap-2 group/btn text-gray-500 hover:text-[#1D9BF0] transition-colors"
                                                        >
                                                            <div className="p-1.5 rounded-full group-hover/btn:bg-[#1D9BF0]/10">
                                                                <FaRegComment className="text-base" />
                                                            </div>
                                                            <span className="text-xs font-medium">Reply</span>
                                                        </a>

                                                        <button
                                                            onClick={handleCopyLink}
                                                            className="flex items-center gap-2 group/btn text-gray-500 hover:text-[#1D9BF0] transition-colors"
                                                        >
                                                            <div className="p-1.5 rounded-full group-hover/btn:bg-[#1D9BF0]/10">
                                                                <FaLink className="text-base" />
                                                            </div>
                                                            <span className="text-xs font-medium">Copy link</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default TwitterMentionsModal;
