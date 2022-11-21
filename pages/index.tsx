import SearchedTitle from "@components/searchedTitle";
import useMutation from "@libs/client/useMutation";
import { handleFetch } from "@libs/client/utils";
import { Watched } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { SWRConfig } from "swr";
// import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import { useRecoilState } from "recoil";
import { Skeleton } from "@mui/material";
import axios from "axios";

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

const maxResults = 2;

const mockTitles = [
  {
    adult: false,
    backdrop_path: "/7ABsaBkO1jA2psC8Hy4IDhkID4h.jpg",
    genre_ids: [28, 12, 14, 878],
    id: 19995,
    original_language: "en",
    original_title: "Avatar",
    overview:
      "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    popularity: 648.095,
    poster_path: "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    release_date: "2009-12-15",
    title: "Avatar",
    video: false,
    vote_average: 7.5,
    vote_count: 26316,
  },
  {
    adult: false,
    backdrop_path: "/198vrF8k7mfQ4FjDJsBmdQcaiyq.jpg",
    genre_ids: [878, 28, 12],
    id: 76600,
    original_language: "en",
    original_title: "Avatar: The Way of Water",
    overview:
      "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    popularity: 526.294,
    poster_path: "/1yppMeTNQwDrzaUH4dRCx4mr8We.jpg",
    release_date: "2022-12-14",
    title: "Avatar: The Way of Water",
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [99],
    id: 287003,
    original_language: "en",
    original_title: "Avatar: Scene Deconstruction",
    overview: "The deconstruction of the Avatar scenes and sets",
    popularity: 126.336,
    poster_path: "/uCreCQFReeF0RiIXkQypRYHwikx.jpg",
    release_date: "2009-12-18",
    title: "Avatar: Scene Deconstruction",
    video: false,
    vote_average: 9,
    vote_count: 3,
  },
  {
    adult: false,
    backdrop_path: "/uEwGFGtao9YG2JolmdvtHLLVbA9.jpg",
    genre_ids: [99],
    id: 111332,
    original_language: "en",
    original_title: "Avatar: Creating the World of Pandora",
    overview:
      "The Making-of James Cameron's Avatar. It shows interesting parts of the work on the set.",
    popularity: 129.32,
    poster_path: "/sjf3xjuofCtDhZghJRzXlTiEjJe.jpg",
    release_date: "2010-02-07",
    title: "Avatar: Creating the World of Pandora",
    video: false,
    vote_average: 7,
    vote_count: 20,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [28, 878, 12, 14],
    id: 216527,
    original_language: "en",
    original_title: "Avatar 4",
    overview: "",
    popularity: 47.705,
    poster_path: "/qHvsKYrWm7MCGqvRb0mUX26Sqgb.jpg",
    release_date: "2026-12-16",
    title: "Avatar 4",
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [28, 18, 878, 12, 14],
    id: 83533,
    original_language: "en",
    original_title: "Avatar 3",
    overview: "",
    popularity: 41.244,
    poster_path: "/hDG5IyML9SNbiQ6T1lYWliPYy3Q.jpg",
    release_date: "2024-12-18",
    title: "Avatar 3",
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [28, 12, 14, 878],
    id: 393209,
    original_language: "en",
    original_title: "Avatar 5",
    overview: "",
    popularity: 29.575,
    poster_path: "/cOW3wFkecesFqh8XWKERKKfiNFl.jpg",
    release_date: "2028-12-20",
    title: "Avatar 5",
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
];

const Explore: NextPage = () => {
  const [isReviewVideo, setIsReviewVideo] = useState(false);

  const {
    register: searchRegister,
    handleSubmit: handleSearchSubmit,
    getValues,
    watch,
    formState: { isDirty },
  } = useForm();
  const { movieOrSeries } = getValues();

  const { data: videos } = useSWR(
    // isReviewVideo
    //   ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${searchWord}%review&regionCode=us&relevanceLanguage=en&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    //   :
    null
  );
  const { data: written } = useSWR(
    // !isReviewVideo
    //   ? `https://imdb-api.com/en/API/Reviews/${process.env.NEXT_PUBLIC_IMDB_API_KEY}/tt5113044`
    //   :
    null
  );
  // console.log("written", written);
  const { data: watched } = useSWR("/api/archive");

  const { data: tmdb } = useSWR(
    watch("searchWord") && watch("searchWord").length > 2
      ? `https://api.themoviedb.org/3/search/${watch(
          "movieOrSeries"
        )}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${watch(
          "searchWord"
        )}&page=1&include_adult=false&language=en`
      : null
  );

  const onSearchValid = (userInput: any) => {};

  // const changeReviewType = () => {
  //   setIsReviewVideo((prev) => !prev);
  // };

  return (
    <Layout>
      {/* searchbar */}
      <form
        onSubmit={handleSearchSubmit(onSearchValid)}
        className="mt-1 fixed top-1 left-4 lg:left-1/2 lg:-translate-x-1/2 w-full max-w-xs sm:max-w-md flex z-10"
      >
        <input
          {...searchRegister("searchWord")}
          type="text"
          placeholder="How about 'Avatar'?"
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
        {/* <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
          <button
            onClick={changeReviewType}
            className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white"
          >
            {isReviewVideo ? "Written" : "Video"}
          </button>
        </div> */}
      </form>

      {tmdb?.results ? (
        <main className="px-4 lg:px-[10%] pt-3 grid md:grid-cols-2 gap-3">
          {tmdb?.results?.length === 0 ? (
            <div className="flex justify-center">
              Nothing Found. Are you sure you are searching for
              <span className="font-bold pl-1 italic">
                {movieOrSeries === "movie" ? "movie" : "series"}
              </span>
              ?
            </div>
          ) : (
            tmdb?.results
              .slice(0, 8)
              .map(
                ({
                  id,
                  poster_path,
                  original_name,
                  original_title,
                  first_air_date,
                  release_date,
                  overview,
                }: TitleInfo) => (
                  <SearchedTitle
                    key={id}
                    id={id}
                    poster_path={poster_path}
                    original_title={original_title || original_name || ""}
                    release_date={release_date || first_air_date || ""}
                    overview={overview}
                    isLikedBefore={
                      watched?.watched && watched.watched.length > 0
                        ? watched.watched.some(
                            (item: TitleInfo) => item.id === id
                          )
                        : false
                    }
                    isMovie={Boolean(release_date)}
                  />
                )
              )
          )}
        </main>
      ) : (
        <main className="px-4 lg:px-[10%] pt-3 grid md:grid-cols-2 gap-3">
          {videos && videos.items
            ? videos.items.map(({ snippet, id: { videoId } }: VideoInfo) => (
                <Link key={videoId} href={`/${videoId}`}>
                  {snippet.thumbnails?.high?.url && (
                    <a className="pt-4 block">
                      <Image
                        src={snippet.thumbnails.high.url}
                        width={snippet.thumbnails.high.width}
                        height={snippet.thumbnails.high.height}
                        alt="thumbnail"
                      />
                      <h1 className="text-2xl mt-2 font-bold text-gray-900">
                        {snippet.replace(
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
            : // : written ? (
            //   <>
            //     <h2>
            //       Have you checked <strong>{written.fullTitle}</strong>?
            //     </h2>
            //     <Image
            //       src="https://m.media-amazon.com/images/M/MV5BZDQyODUwM2MtNzA0YS00ZjdmLTgzMjItZWRjN2YyYWE5ZTNjXkEyXkFqcGdeQXVyMTI2MzY1MjM1._V1_Ratio0.7273_AL_.jpg"
            //       alt="imdbMovieImage"
            //       width={67}
            //       height={98}
            //     ></Image>
            //     {written.items?.map(
            //       ({
            //         username,
            //         rate,
            //         title,
            //         content,
            //       }: {
            //         username: string;
            //         rate: string;
            //         title: string;
            //         content: string;
            //       }) => (
            //         <div key={username} className="pt-4">
            //           <p className="flex items-center">
            //             <svg
            //               className="h-5 w-5 text-yellow-400"
            //               xmlns="http://www.w3.org/2000/svg"
            //               viewBox="0 0 20 20"
            //               fill="currentColor"
            //               aria-hidden="true"
            //             >
            //               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            //             </svg>
            //             <span className="pl-1 text-xs">{rate}/10</span>
            //           </p>
            //           <h3 className="font-bold my-1.5">{title}</h3>
            //           <p>{content}</p>
            //         </div>
            //       )
            //     )}
            //   </>
            // )
            watch("searchWord")?.length > 0
            ? [...Array(8)].map((_, i) => (
                <li
                  className="flex w-full border-2 rounded-lg overflow-hidden shadow-sm select-none h-full"
                  key={i}
                >
                  <Skeleton variant="rectangular" width={105} height="100%" />
                  <div className="w-full m-2">
                    <Skeleton width="40%" height={35} />
                    <Skeleton width="30%" height={20} />
                    <Skeleton width="90%" height={20} />
                    <Skeleton width="95%" height={20} />
                    <Skeleton width="70%" height={20} />
                  </div>
                </li>
              ))
            : // : mockTitles.map(
              //     ({
              //       id,
              //       poster_path,
              //       original_name,
              //       original_title,
              //       first_air_date,
              //       release_date,
              //       overview,
              //     }: TitleInfo) => (
              //       <SearchedTitle
              //         key={id}
              //         id={id}
              //         poster_path={poster_path}
              //         original_title={original_title || original_name || ""}
              //         release_date={release_date || first_air_date || ""}
              //         overview={overview}
              //         isLikedBefore={
              //           watched?.watched && watched.watched.length > 0
              //             ? watched.watched.some(
              //                 (item: TitleInfo) => item.id === id
              //               )
              //             : false
              //         }
              //         isMovie={Boolean(release_date)}
              //       />
              //     )
              //   )
              null}
        </main>
      )}
    </Layout>
  );
};

// const Page: NextPage = ()=>{
//   return(
//     <SWRConfig
//     value={{
//       fallback:{
//         `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=avatar&page=1&include_adult=false&language=en`:{
//           tmdb.results
//         }
//       }
//     }}
//     >
//       <Explore/>
//     </SWRConfig>
//   )
// }

export async function getStaticProps() {
  const res = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=avatar&page=1&include_adult=false&language=en`
  );
  console.log(res.data);
  const data = res.data;
  // return {
  //   props: {
  //     data,
  //   },
  // };
  return {
    props: {
      fallback: {
        "/": data,
      },
    },
  };
}

export default Explore;
