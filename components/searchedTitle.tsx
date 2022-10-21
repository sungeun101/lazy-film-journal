import React, { useEffect, useState } from "react";
import Image from "next/image";
import useMutation from "@libs/client/useMutation";
import { WatchedData } from "pages/archive";
import { useRouter } from "next/router";
import { cls } from "@libs/client/utils";
import Link from "next/link";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import useSWR from "swr";

export interface SearchedTitleProps {
  id: number;
  poster_path: string;
  original_title: string;
  release_date: string;
  overview: string;
  isLikedBefore: boolean;
  isMovie: boolean;
  ideaCount?: number;
}

export default function SearchedTitle({
  id,
  poster_path,
  original_title,
  release_date,
  overview,
  isLikedBefore,
  isMovie,
  ideaCount = 0,
}: SearchedTitleProps) {
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(isLikedBefore);
  const [openModal, setOpenModal] = useState(false);
  const [ideasAllTogether, setIdeasAllTogether] = useState(0);

  const [mutateHeart, { data: heartMutated }] =
    useMutation<WatchedData>("/api/archive");

  const { data: boardData } = useSWR(id ? `/api/archive/${id}/board` : null);

  useEffect(() => {
    if (boardData?.board?.lists) {
      const lengthOfEachList = boardData.board.lists
        .map((list: any) => list.length)
        .reduce((prev: any, current: any) => prev + current);
      setIdeasAllTogether(lengthOfEachList);
    } else {
      setIdeasAllTogether(ideaCount);
    }
  }, [boardData]);

  useEffect(() => {
    if (heartMutated?.ok) {
      setIsLiked((prev) => !prev);
    }
  }, [heartMutated]);

  const toggleHeart = () => {
    mutateHeart({
      id,
      poster_path,
      original_title,
      release_date,
      overview,
      isMovie,
    });
  };

  const onClickModalYes = () => {
    setOpenModal(false);
    toggleHeart();
    setIsLiked((prev) => !prev);
  };

  const onClickModalNo = () => {
    setOpenModal(false);
  };

  return (
    <div className="flex flex-col relative">
      <Link
        href={{
          pathname: router.pathname === "/" ? `/${id}` : `archive/${id}`,
          query: {
            id,
            poster_path,
            original_title,
            release_date,
            overview,
            isMovie: Boolean(release_date),
            isLikedBefore,
          },
        }}
      >
        <a className="cursor-pointer flex gap-2 border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md select-none h-full">
          <li className="flex gap-2 overflow-hidden">
            {poster_path ? (
              <Image
                src={`https://www.themoviedb.org/t/p/w94_and_h141_bestv2/${poster_path}`}
                width={94}
                height={141}
                alt="thumbnail"
              />
            ) : (
              <div className="flex justify-center items-center w-[94px] h-[141px] text-gray-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <div className="max-w-[80%] p-2 pl-1">
              <h1 className="text-xl font-bold text-gray-900 line-clamp-1 mr-5">
                {original_title}
              </h1>
              <div className="mb-2 flex justify-between">
                <h2 className="text-sm text-gray-400">{release_date}</h2>
                {router.pathname === "/archive" &&
                ideasAllTogether &&
                ideasAllTogether > 0 ? (
                  <span className="select-none text-sm bg-gray-200 rounded-lg px-2 py-0 absolute right-3">
                    {ideasAllTogether} idea{ideasAllTogether > 1 ? "s" : ""}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <span className="text-sm text-gray-800 line-clamp-3">
                {overview}
              </span>
            </div>
          </li>
        </a>
      </Link>

      {router.pathname === "/archive" ? (
        <>
          <button
            onClick={() => setOpenModal(true)}
            className={cls(
              isLiked
                ? "text-orange-500 hover:text-slate-300"
                : "text-slate-300",
              "rounded-full hover:text-orange-500 absolute right-2.5 top-2.5"
            )}
          >
            <svg
              className="w-6 h-6"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <Dialog
            open={openModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Would you like to delete this? Your board will also be deleted!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClickModalNo}>No</Button>
              <Button onClick={onClickModalYes} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <button
          onClick={toggleHeart}
          className={cls(
            isLiked ? "text-orange-500 hover:text-slate-300" : "text-slate-300",
            "rounded-full hover:text-orange-500 absolute right-2.5 top-2.5"
          )}
        >
          <svg
            className="w-6 h-6"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
