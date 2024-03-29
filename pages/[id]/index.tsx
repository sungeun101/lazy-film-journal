import { Watched } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import Layout from "@components/layout";
import { Skeleton } from "@mui/material";

export interface VideoInfo {
  snippet: any;
  id: { videoId: string };
}
export interface TitleInfo {
  id: number;
  poster_path: string;
  original_name?: string;
  original_title?: string;
  first_air_date?: string;
  release_date?: string;
  overview: string;
}
interface MutationResult {
  ok: boolean;
  watched: Watched[];
}

const maxResults = 10;

const VideosFromSearchedTitle: NextPage = () => {
  // const [isReviewVideo, setIsReviewVideo] = useState(false);
  const router = useRouter();
  const { query, asPath } = router;
  const { original_title } = query;

  useEffect(() => {
    if (query && asPath) {
      sessionStorage.setItem("title", JSON.stringify(query));
      sessionStorage.setItem("searchedVideosPath", asPath);
    }
  }, [query, asPath]);

  const { data: videos } = useSWR(
    query
      ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${original_title}%review&regionCode=us&relevanceLanguage=en&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      : null
  );

  const { data: tmdb } = useSWR(
    // searchWord && searchWord.length > 2 && watched
    //   ? `https://api.themoviedb.org/3/search/${movieOrSeries}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchWord}&page=1&include_adult=false&language=en`
    //   :
    null
  );

  const onSearchValid = (userInput: any) => {
    // setShowSearchResult(true);
  };

  // const changeReviewType = () => {
  //   setIsReviewVideo((prev) => !prev);
  // };

  return (
    <Layout canGoBack title={original_title?.toString()}>
      {/* <form
        onSubmit={handleSearchSubmit(onSearchValid)}
        className="fixed inset-x-0 top-2 w-full max-w-md mx-auto flex z-10"
      >
        <input
          {...searchRegister("searchWord")}
          type="text"
          placeholder="What have you watched?"
          className="w-full pl-28 border-gray-300 rounded-full shadow-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
        />
        <div className="absolute inset-y-0 left-2 flex p-1 text-orange-500">
          <select
            className="cursor-pointer text-orange-500 outline-none ring-orange-500 ring-0 focus:ring-0 border-none text-sm"
            {...searchRegister("movieOrSeries")}
          >
            <option value="movie">Movie</option>
            <option value="tv">Series</option>
          </select>
        </div>
        <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
        <button
          onClick={changeReviewType}
          className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white"
        >
          {isReviewVideo ? "Written" : "Video"}
        </button>
      </div> 
      </form> */}

      <main className="md:px-10 lg:px-30 xl:px-20 grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center">
        {videos && videos.items
          ? videos.items.map(({ snippet, id: { videoId } }: VideoInfo) => (
              <Link key={videoId} href={`/${videoId}/reviews`}>
                {snippet.thumbnails?.high?.url && (
                  <a className="flex flex-col w-[400px] md:w-[320px] h-full mt-4">
                    <Image
                      src={snippet.thumbnails.high.url}
                      width={snippet.thumbnails.high.width}
                      height={snippet.thumbnails.high.height}
                      alt="thumbnail"
                    />
                    <h1 className="text-lg mt-2 font-bold text-gray-900">
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
          : [...Array(10)].map((_, i) => (
              <li
                className="shadow-sm flex flex-col w-[400px] md:w-[320px] h-[19rem] mb-4 mt-2"
                key={i}
              >
                <Skeleton variant="rectangular" width="100%" height="100%" />
                <div className="w-full m-1">
                  <Skeleton width="90%" height={26} />
                  <Skeleton width="35%" height={26} />
                </div>
              </li>
            ))}
      </main>
    </Layout>
  );
};

export default VideosFromSearchedTitle;
