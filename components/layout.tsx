import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Idea } from "@prisma/client";
import { useRecoilState } from "recoil";
import { archivePathState, homePathState } from "@libs/client/states";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  children: React.ReactNode;
}
interface IdeaResponse {
  ok: boolean;
  ideas: Idea[];
}

export default function Layout({ title, canGoBack, children }: LayoutProps) {
  const router = useRouter();
  const { pathname, asPath } = router;

  const [homePath, setHomePath] = useRecoilState(homePathState);
  const [archivePath, setArchivePath] = useRecoilState(archivePathState);

  useEffect(() => {
    if (pathname.includes("archive")) {
      setArchivePath(asPath);
    } else {
      setHomePath(asPath);
    }
  }, [asPath, pathname]);

  // useEffect(() => {
  //   console.log("home Path", homePath);
  //   console.log("archivePath", archivePath);
  // }, [homePath, archivePath]);

  // const { data: ideaData, isValidating } = useSWR<IdeaResponse>("/api/ideas");

  const onClickGoBack = () => {
    // console.log("router", router);
    if (pathname === "/archive/[id]") {
      router.push("/archive");
    } else if (pathname.includes("reviews")) {
      const prevPath = sessionStorage.getItem("searchedVideosPath");
      if (prevPath) {
        router.push(prevPath);
      }
    } else {
      router.push("/");
    }
  };

  // const onClickCart = () => {
  //   router.push("/ideas");
  // };

  return (
    <section className="w-full">
      <div
        className="z-10 
          bg-white w-full h-12 text-lg px-10 font-medium fixed text-gray-800 top-0 flex items-center"
      >
        {canGoBack ? (
          <button onClick={onClickGoBack} className="absolute left-4">
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        ) : null}
        {title ? (
          <span
            className={cls(router.pathname === "/archive" ? "mx-auto" : "", "")}
          >
            {title}
          </span>
        ) : null}
        <nav className="text-gray-700 absolute right-4 flex gap-4 text-xs z-50 h-full mt-1">
          <Link href={homePath}>
            <a
              className={cls(
                "flex flex-col items-center justify-center space-y-0.5 md:flex-row md:gap-1",
                !router.pathname.includes("archive")
                  ? "text-orange-500 md:border-b-4 border-orange-300 h-full"
                  : "hover:text-gray-500 transition-colors"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
              <span>Explore</span>
            </a>
          </Link>
          <Link href={archivePath}>
            <a
              className={cls(
                "flex flex-col items-center justify-center space-y-0.5 md:flex-row md:gap-1",
                router.pathname.includes("archive")
                  ? "text-orange-500 md:border-b-4 border-orange-300 h-full"
                  : "hover:text-gray-500 transition-colors"
              )}
            >
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
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span>Archive</span>
            </a>
          </Link>
          {/* <Link href="/profile">
            <a
              className={cls(
                "flex flex-col items-center space-y-0.5 justify-center",
                router.pathname === "/profile"
                  ? "text-orange-500"
                  : "hover:text-gray-500 transition-colors"
              )}
            >
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <span>My Account</span>
            </a>
          </Link> */}
        </nav>
        {/* idea cart button */}
        {/* {pathname !== "/" && (
          <button onClick={onClickCart} className="absolute right-6">
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
            {ideaData?.ideas && ideaData.ideas.length > 0 && (
              <span
                className={`${
                  isValidating && "animate-ping"
                } absolute -right-2 -top-1 hover:bg-orange-500 border-0 aspect-square border-transparent transition-colors cursor-pointer  shadow-xl bg-orange-400 rounded-full flex items-center justify-center text-white w-4 h-4 text-[8px]`}
              >
                {ideaData.ideas.length}
              </span>
            )}
          </button>
        )} */}
      </div>
      <main className="my-12 z-0">{children}</main>
    </section>
  );
}
