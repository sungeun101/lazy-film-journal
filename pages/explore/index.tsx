import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import FloatingButton from "../../components/floating-button";
import Layout from "../../components/layout";

export interface VideoInfo {
  snippet: any;
  id: { videoId: string };
}
interface SearchedTitles {
  id: string;
  poster_path: string;
  original_name?: string;
  original_title?: string;
  first_air_date?: string;
  release_date?: string;
  overview: string;
}

const maxResults = 2;

// tmdb sample
// {"page":1,"results":[{"backdrop_path":"/iW74tZ8y2qobdpt4J9UQ71sw8q7.jpg","first_air_date":"2020-10-02","genre_ids":[18,35],"id":82596,"name":"Emily in Paris","origin_country":["US"],"original_language":"en","original_name":"Emily in Paris","overview":"When ambitious Chicago marketing exec Emily unexpectedly lands her dream job in Paris, she embraces a new life as she juggles work, friends and romance.","popularity":57.128,"poster_path":"/Ak59Y9bzykmV0wAiwKsqrbORDBo.jpg","vote_average":8,"vote_count":854}],"total_pages":1,"total_results":1}

const Explore: NextPage = () => {
  const [isReviewVideo, setIsReviewVideo] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [movieOrSeries, setMovieOrSeries] = useState("movie");
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data: videos } = useSWR(
    isReviewVideo && searchWord !== ""
      ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${searchWord}review&regionCode=us&relevanceLanguage=en&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      : null
  );
  const { data: written } = useSWR(
    // !isReviewVideo
    //   ?
    //   `https://imdb-api.com/en/API/Reviews/${process.env.NEXT_PUBLIC_IMDB_API_KEY}/tt5113044`
    //   :
    null
  );
  const { data: tmdb } = useSWR(
    showSearchResult && searchWord !== ""
      ? `https://api.themoviedb.org/3/search/${movieOrSeries}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchWord}&page=1&include_adult=false&language=en`
      : null
  );
  console.log(tmdb);

  useEffect(() => {
    if (searchWord === "") {
      setShowSearchResult(false);
    }
  }, [searchWord]);

  const handleChange = (event: any) => {
    const {
      target: { value },
      key,
    } = event;
    setSearchWord("");
    setUserInput(value);
  };

  const handleSearch = (event: any) => {
    if (event.key === "Enter") {
      setShowSearchResult(true);
      setSearchWord(userInput);
    }
  };

  const changeReviewType = () => {
    setIsReviewVideo((prev) => !prev);
  };

  const handleSearchOption = (event: any) => {
    const { value } = event.target;
    setShowSearchResult(false);
    setMovieOrSeries(value);
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
          value={userInput}
          className="w-full pl-28 border-gray-300 rounded-full shadow-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
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
        <div className="absolute inset-y-0 flex py-1.5 pr-1.5 left-9">
          <select
            className="flex ring-2 focus:ring-offset-2 ring-orange-500 items-center text-orange-500 rounded-full px-2 text-xs w-16"
            onChange={handleSearchOption}
            value={movieOrSeries}
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
      </section>

      {showSearchResult ? (
        <main className="px-4 space-y-4 mt-4">
          {tmdb?.results
            ?.slice(0, 8)
            .map(
              ({
                id,
                poster_path,
                original_name,
                original_title,
                first_air_date,
                release_date,
                overview,
              }: SearchedTitles) => (
                <Link key={id} href={`/explore/${id}`}>
                  <a className="flex gap-2 border rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={`https://www.themoviedb.org/t/p/w94_and_h141_bestv2/${poster_path}`}
                      width={94}
                      height={141}
                      alt="thumbnail"
                    />
                    <div className="max-w-[80%] py-2 px-1">
                      <h1 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {movieOrSeries === "movie"
                          ? original_title
                          : original_name}
                      </h1>
                      <h2 className="text-sm text-gray-400 mb-2">
                        {movieOrSeries === "movie"
                          ? release_date
                          : first_air_date}
                      </h2>
                      <span className="text-sm text-gray-800 line-clamp-3">
                        {overview}
                      </span>
                    </div>
                  </a>
                </Link>
              )
            )}
        </main>
      ) : (
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
              {written.items?.map(
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
      )}
    </Layout>
  );
};

export default Explore;
