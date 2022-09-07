import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TitleInfo } from "pages/explore";
import useMutation from "@libs/client/useMutation";
import { WatchedData } from "pages/archive";
import { useRouter } from "next/router";
import { cls } from "@libs/client/utils";
import Link from "next/link";

export interface SearchedTitleProps extends TitleInfo {
  isLikedBefore: boolean;
}

export default function SearchedTitle({
  id,
  poster_path,
  original_name,
  original_title,
  first_air_date,
  release_date,
  overview,
  isLikedBefore,
}: SearchedTitleProps) {
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(isLikedBefore);

  const [uploadWatched, { data: watchedMutated }] =
    useMutation<WatchedData>("/api/archive");

  useEffect(() => {
    if (watchedMutated) {
      setIsLiked((prev) => !prev);
    }
  }, [watchedMutated]);

  const addToArchive = (title: TitleInfo) => {
    uploadWatched({ ...title, isMovie: Boolean(title.release_date) });
  };

  return (
    <Link
      href={{
        pathname:
          router.pathname === "/explore" ? `/explore/${id}` : `archive/${id}`,
        query: {
          id,
          poster_path,
          original_name,
          original_title,
          first_air_date,
          release_date,
          overview,
          isLikedBefore,
        },
      }}
    >
      <a className="cursor-pointer flex gap-2 border-2 rounded-lg overflow-hidden shadow-md select-none">
        <li className="flex gap-2 overflow-hidden w-full">
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
            <h1 className="text-xl font-bold text-gray-900 line-clamp-1">
              {original_title || original_name}
            </h1>
            <h2 className="text-sm text-gray-400 mb-2">
              {release_date || first_air_date}
            </h2>
            <span className="text-sm text-gray-800 line-clamp-3">
              {overview}
            </span>
          </div>
        </li>
        <button
          onClick={() =>
            addToArchive({
              id,
              poster_path,
              original_name,
              original_title,
              first_air_date,
              release_date,
              overview,
            })
          }
          className={cls(
            isLiked ? "text-orange-500" : "text-slate-300",
            "h-full rounded-full hover:text-orange-500"
          )}
        >
          <svg
            className="w-6 h-6 m-2"
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
      </a>
    </Link>
  );
}
