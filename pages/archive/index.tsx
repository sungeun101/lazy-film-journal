import Layout from "@components/layout";
import SearchedTitle from "@components/searchedTitle";
import Spinner from "@components/spinner";
import { Watched } from "@prisma/client";
import type { NextPage } from "next";
import { TitleInfo } from "pages/explore";
import useSWR from "swr";

interface WatchedWithIdeasCount extends Watched {
  _count: {
    ideas: number;
  };
}
export interface WatchedData {
  ok: boolean;
  watched: WatchedWithIdeasCount[];
}

const Archive: NextPage = () => {
  const { data: watchedData, isValidating } = useSWR("/api/archive");

  return (
    <Layout title="Archive" hasTabBar>
      {isValidating ? (
        <Spinner />
      ) : watchedData?.watched && watchedData.watched.length === 0 ? (
        <div className="flex justify-center p-4 text-gray-400">
          Nothing saved yet!
        </div>
      ) : (
        <main className="px-4 space-y-5">
          {watchedData?.watched.map(
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
                original_name={original_name || ""}
                original_title={original_title || ""}
                first_air_date={first_air_date || ""}
                release_date={release_date || ""}
                overview={overview}
                isLikedBefore={watchedData.watched.some(
                  (item: TitleInfo) => item.id === id
                )}
              />
            )
          )}
        </main>
      )}
    </Layout>
  );
};

export default Archive;
