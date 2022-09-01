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
    <>
      <Image
        src={`https://www.themoviedb.org/t/p/w94_and_h141_bestv2/${poster_path}`}
        width={94}
        height={141}
        alt="thumbnail"
      />
      <div className="max-w-[80%] p-2 pl-1">
        <h1 className="text-xl font-bold text-gray-900 line-clamp-1">
          {original_title || original_name}
        </h1>
        <h2 className="text-sm text-gray-400 mb-2">
          {release_date || first_air_date}
        </h2>
        <span className="text-sm text-gray-800 line-clamp-3">{overview}</span>
      </div>
    </>
  );
}
