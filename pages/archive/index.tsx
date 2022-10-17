import Layout from "@components/layout";
import SearchedTitle from "@components/searchedTitle";
import Spinner from "@components/spinner";
import { Watched } from "@prisma/client";
import type { NextPage } from "next";
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
  const { data: watchedData, isValidating } =
    useSWR<WatchedData>("/api/archive");

  return (
    <Layout title="Archive">
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
              original_title,
              release_date,
              overview,
              _count,
            }: WatchedWithIdeasCount) => (
              <SearchedTitle
                key={id}
                id={id}
                poster_path={poster_path}
                original_title={original_title || ""}
                release_date={release_date || ""}
                overview={overview}
                isLikedBefore={watchedData.watched.some(
                  (item) => item.id === id
                )}
                isMovie={Boolean(release_date)}
                ideaCount={_count.ideas}
              />
            )
          )}
        </main>
      )}
    </Layout>
  );
};

export default Archive;
