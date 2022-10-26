import Layout from "@components/layout";
import SearchedTitle from "@components/searchedTitle";
import { Skeleton } from "@mui/material";
import { Watched } from "@prisma/client";
import type { NextPage } from "next";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface WatchedWithIdeasCount extends Watched {
  _count: {
    ideas: number;
  };
}
export interface WatchedData {
  ok: boolean;
  watched?: WatchedWithIdeasCount[];
  error?: string;
}

const Archive: NextPage = () => {
  const { data: watchedData, isValidating } =
    useSWR<WatchedData>("/api/archive");

  const router = useRouter();

  useEffect(() => {
    if (watchedData?.error) {
      router.replace("/enter");
    }
  }, [watchedData, router]);

  return (
    <Layout title="Archive">
      {isValidating ? (
        <main className="px-4 lg:px-[10%] pt-3 grid md:grid-cols-2 gap-3">
          {[...Array(8)].map((_, i) => (
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
          ))}
        </main>
      ) : watchedData?.watched && watchedData.watched.length === 0 ? (
        <div className="flex justify-center pt-3 text-gray-400">
          Nothing saved yet!
        </div>
      ) : (
        <main className="px-4 lg:px-[10%] pt-3 grid md:grid-cols-2 gap-3">
          {watchedData?.watched?.map(
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
                isLikedBefore={watchedData?.watched?.some(
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
