import Input from "@components/input";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import FloatingButton from "../../components/floating-button";
import Layout from "../../components/layout";

export interface VideoInfo {
  snippet: any;
  id: { videoId: string };
}

const Explore: NextPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchWord, setSearchWord] = useState("minions2");

  const { data } = useSWR(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${searchWord}review&regionCode=us&relevanceLanguage=en&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
  );

  const handleChange = (event: any) => {
    const {
      target: { value },
      key,
    } = event;
    setSearchInput(value);
  };

  const handleSearch = (event: any) => {
    if (event.key === "Enter") {
      setSearchWord(searchInput);
    }
  };

  return (
    <Layout hasTabBar>
      {/* searchbar */}
      <div className="fixed inset-x-0 top-2 w-full max-w-md mx-auto">
        <input
          type="text"
          placeholder="What have you watched?"
          onChange={handleChange}
          onKeyUp={handleSearch}
          value={searchInput}
          className="w-full pl-10 border-gray-300 rounded-full shadow-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-5 absolute inset-y-0 inset-x-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="px-4 divide-y-[1px] space-y-4">
        {data && data.items ? (
          data.items.map(({ snippet, id: { videoId } }: VideoInfo) => (
            <Link key={videoId} href={`/explore/${videoId}`}>
              {snippet.thumbnails?.high?.url && (
                <a className="pt-4 block">
                  <Image
                    src={snippet.thumbnails.high.url}
                    width={snippet.thumbnails.high.width}
                    height={snippet.thumbnails.high.height}
                    alt="thumbnail"
                  />
                  <h1 className="text-2xl mt-2 font-bold text-gray-900">
                    {snippet.title.replace(
                      /&#(\d+);/g,
                      function (match: string, dec: number) {
                        return String.fromCharCode(dec);
                      }
                    )}
                  </h1>
                </a>
              )}
            </Link>
          ))
        ) : (
          <>
            <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video"></div>
            <h1 className="text-2xl mt-2 font-bold text-gray-900">
              loading...
            </h1>
          </>
        )}

        <FloatingButton href="/explore/create">
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
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Explore;
