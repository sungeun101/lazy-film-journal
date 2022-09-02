import React from "react";
import Image from "next/image";
import { TitleInfo } from "pages/explore";

export default function SearchedTitle({
  poster_path,
  original_name,
  original_title,
  first_air_date,
  release_date,
  overview,
}: TitleInfo) {
  return (
    <li className="flex gap-2 overflow-hidden shadow-md cursor-pointer">
      {poster_path ? (
        <Image
          src={`https://www.themoviedb.org/t/p/w94_and_h141_bestv2/${poster_path}`}
          width={94}
          height={141}
          alt="thumbnail"
        />
      ) : (
        <div className="flex justify-center items-center w-[94px] h-[141px]">
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
        <span className="text-sm text-gray-800 line-clamp-3">{overview}</span>
      </div>
    </li>
  );
}
