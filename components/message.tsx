import { titleState } from "@libs/client/states";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import { Idea } from "@prisma/client";
import { WatchedData } from "pages/archive";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
// import Button from "./button";
import { SearchedTitleProps } from "./searchedTitle";

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
  const [title, setTitle] = useState<SearchedTitleProps>();
  const [openModal, setOpenModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (openModal) {
      onClickBookmark();
    }
  }, [openModal]);

  const { mutate } = useSWRConfig();

  const [bookmark, { data: bookmarkResult, loading }] =
    useMutation<MutationResult>("/api/ideas");

  const [uploadWatched, { data: watchedMutated }] =
    useMutation<WatchedData>("/api/archive");
  const { data: bookmarkedIdeas } = useSWR(`/api/ideas/bookmark`);
  // console.log(bookmarkedIdeas);
  useEffect(() => {
    if (title && watchedMutated && watchedMutated.ok) {
      bookmark({
        commentId,
        message,
        titleId: title.id,
      });
      setIsBookmarked((prev) => !prev);
    }
  }, [watchedMutated, title]);

  useEffect(() => {
    if (bookmarkResult && bookmarkResult.ok) {
      mutate("/api/ideas");
    }
  }, [bookmarkResult, mutate]);

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
  console.log("bookmarkedIdeas", bookmarkedIdeas);

  const onClickBookmark = () => {
    if (loading) return;
    const title = sessionStorage.getItem("title");
    if (title) {
      const parsedTitle = JSON.parse(title);
      setTitle(parsedTitle);
    }
  };

  const onClickModalYes = () => {
    setOpenModal(false);
    uploadWatched(title);
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
      <div>
        <button
          onClick={() => setOpenModal(true)}
          className={cls(
            isBookmarked ? "text-orange-500" : "text-slate-300",
            "flex items-center rounded-full hover:text-orange-500 "
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
        <Dialog
          open={openModal}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* <DialogTitle id="alert-dialog-title">
              {"Use Google's location service?"}
            </DialogTitle> */}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Would you like to add this to{" "}
              <strong>{title?.original_title}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>No</Button>
            <Button onClick={onClickModalYes} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
