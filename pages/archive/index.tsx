import Layout from "@components/layout";
import SearchedTitle from "@components/searchedTitle";
import Spinner from "@components/spinner";
import { handleFetch } from "@libs/client/utils";
import { Watched } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";

interface WatchedWithIdeasCount extends Watched {
  _count: {
    ideas: number;
  };
}
interface WatchedData {
  ok: boolean;
  watched: WatchedWithIdeasCount[];
}

const Archive: NextPage = () => {
  const { isFetching, data: watchedData } = useQuery(["archive"], () =>
    handleFetch("/api/archive")
  );

  return (
    <Layout title="Archive" hasTabBar>
      {isFetching ? (
        <Spinner />
      ) : watchedData?.watched && watchedData.watched.length === 0 ? (
        <div>검색 결과가 없습니다.</div>
      ) : (
        <main className="px-4 space-y-5 mt-4">
          {watchedData?.watched.map((title: any) => (
            <div
              key={title.id}
              className="flex gap-2 border rounded-lg overflow-hidden shadow-md cursor-pointer"
            >
              <SearchedTitle
                id={title.id}
                poster_path={title.poster_path}
                original_name={title.original_name || ""}
                original_title={title.original_title || ""}
                first_air_date={title.first_air_date || ""}
                release_date={title.release_date || ""}
                overview={title.overview}
              />
            </div>
          ))}
        </main>
      )}
    </Layout>
  );
};

export default Archive;
