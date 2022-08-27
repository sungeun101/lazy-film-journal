import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { Idea } from "@prisma/client";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
  commentId: string;
}
interface MutationResult {
  ok: boolean;
  idea: Idea;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
  commentId,
}: MessageProps) {
  const [addBookmark, { data: ideaResult, loading }] =
    useMutation<MutationResult>("/api/ideas");

  const [isBookmarked, setIsBookmarked] = useState(false);

  const { mutate } = useSWRConfig();

  const { data: bookmarkedIdeas } = useSWR(`/api/ideas/bookmark`);
  // console.log(bookmarkedIdeas);

  useEffect(() => {
    if (ideaResult && ideaResult.ok) {
      mutate("/api/ideas");
    }
  }, [ideaResult, mutate]);

  useEffect(() => {
    // const bookmarkedIdea = ideas.ideas.filter(
    //   (idea: any) => idea.commentId === commentId
    // );
    if (bookmarkedIdeas && bookmarkedIdeas.ok) {
      const isBookmarkedComment = bookmarkedIdeas.data.some(
        (idea: any) => idea.commentId === commentId
      );
      // console.log(isBookmarkedComment);
      if (isBookmarkedComment) setIsBookmarked(true);
    }
  }, [commentId, bookmarkedIdeas]);

  const handleBookmark = () => {
    console.log("loading", loading);
    if (loading) return;
    setIsBookmarked((prev) => !prev);
    addBookmark({ commentId, message });
  };

  return (
    <div
      className={cls(
        "flex items-start space-x-2",
        reversed ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      <div className="w-8 h-8 rounded-full bg-slate-400" />
      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md">
        <p>{message}</p>
      </div>
      <button
        onClick={handleBookmark}
        className={cls(
          isBookmarked ? "text-orange-500" : "text-slate-300",
          "flex items-center rounded-full hover:text-orange-500"
        )}
      >
        <svg
          className="w-6 h-6"
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>
    </div>
  );
}
