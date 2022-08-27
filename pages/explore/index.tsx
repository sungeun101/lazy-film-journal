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

const maxResults = 2;

const Explore: NextPage = () => {
  const [isReviewVideo, setIsReviewVideo] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchWord, setSearchWord] = useState("minions2");

  const { data: videos } = useSWR(
    isReviewVideo
      ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${searchWord}review&regionCode=us&relevanceLanguage=en&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      : null
  );
  const { data: written } = useSWR(
    !isReviewVideo
      ? `https://imdb-api.com/en/API/Reviews/${process.env.NEXT_PUBLIC_IMDB_API_KEY}/tt5113044`
      : null
  );
  // console.log(written);

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

  const changeReviewType = () => {
    setIsReviewVideo((prev) => !prev);
  };

  return (
    <Layout hasTabBar>
      {/* searchbar */}
      <section className="fixed inset-x-0 top-2 w-full max-w-md mx-auto flex">
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
        <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
          <button
            onClick={changeReviewType}
            className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white"
          >
            {isReviewVideo ? "Written" : "Video"}
          </button>
        </div>
      </section>

      <main className="px-4 divide-y-[1px] space-y-4 mt-4">
        {videos && videos.items ? (
          videos.items.map(({ snippet, id: { videoId } }: VideoInfo) => (
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
        ) : written ? (
          <>
            <h2>
              Have you checked <strong>{written.fullTitle}</strong>?
            </h2>
            <Image
              src="https://m.media-amazon.com/images/M/MV5BZDQyODUwM2MtNzA0YS00ZjdmLTgzMjItZWRjN2YyYWE5ZTNjXkEyXkFqcGdeQXVyMTI2MzY1MjM1._V1_Ratio0.7273_AL_.jpg"
              alt="imdbMovieImage"
              width={67}
              height={98}
            ></Image>
            {written.items.map(
              ({
                username,
                rate,
                title,
                content,
              }: {
                username: string;
                rate: string;
                title: string;
                content: string;
              }) => (
                <div key={username} className="pt-4">
                  <p className="flex items-center">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="pl-1 text-xs">{rate}/10</span>
                  </p>
                  <h3 className="font-bold my-1.5">{title}</h3>
                  <p>{content}</p>
                </div>
              )
            )}
          </>
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
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </FloatingButton>
      </main>
    </Layout>
  );
};

export default Explore;
