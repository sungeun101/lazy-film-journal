import FloatingButton from "@components/floating-button";
import Spinner from "@components/spinner";
import useMutation from "@libs/client/useMutation";
import { Idea, Watched } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import Layout from "@components/layout";
import Comments from "@components/comments";
import { Alert, Button } from "@mui/material";

interface CommentInfo {
  snippet: any;
  id: string;
}
interface UploadIdeaForm {
  content: string;
}
interface MutationResult {
  ok: boolean;
  idea: Idea;
  error?: string;
}

const commentMaxResults = 10;

const VideoItem: NextPage = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data: video } = useSWR(
    id
      ? `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      : null
  );
  const { data: comments } = useSWR(
    id
      ? `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${commentMaxResults}&order=relevance&videoId=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      : null
  );

  const { register, handleSubmit, reset } = useForm<UploadIdeaForm>();

  const [uploadIdeas, { data: ideaResult }] =
    useMutation<MutationResult>("/api/ideas");

  const { mutate } = useSWRConfig();

  const [showUploadAlert, setShowUploadAlert] = useState(false);
  const [title, setTitle] = useState<Watched | null>(null);

  useEffect(() => {
    if (ideaResult && ideaResult.ok) {
      reset();
      setShowUploadAlert(true);
      mutate("/api/ideas");
      const timer = setTimeout(() => {
        setShowUploadAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [ideaResult, mutate, reset]);

  useEffect(() => {
    const title = sessionStorage.getItem("title");
    if (title) {
      const parsedTitle = JSON.parse(title);
      setTitle(parsedTitle);
    }
  }, []);

  const onValid = (data: UploadIdeaForm) => {
    if (title) {
      uploadIdeas({ ...data, ...title });
    }
  };

  return (
    <Layout canGoBack>
      <div className="space-y-4 max-w-7xl mx-auto">
        {video ? (
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`http://www.youtube.com/embed/${id}`}
              allowFullScreen={true}
            ></iframe>
          </div>
        ) : (
          <div className="w-full shadow-sm bg-slate-300 aspect-video" />
        )}

        <section className="px-4 divide-y-[1px] space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {video?.items[0]?.snippet?.title}
          </h1>
          <div>
            <h2 className="text-lg text-gray-900 pt-4 py-2">Comments</h2>
            <main className="pb-16 px-1 space-y-4">
              {comments?.items ? (
                comments.items.map(
                  ({ snippet, id }: CommentInfo, index: number) => (
                    <div key={id}>
                      <Comments
                        message={snippet.topLevelComment.snippet.textOriginal}
                        reversed={index % 2 == 1}
                        commentId={id}
                      />
                    </div>
                  )
                )
              ) : comments?.error?.code === 403 ? (
                <div className="flex justify-center p-4 text-gray-400">
                  Nothing Found!
                </div>
              ) : (
                <Spinner />
              )}
            </main>
            {/* my comment */}
            <div className="fixed p-2 bottom-0 inset-x-0">
              <form
                className="flex relative max-w-md items-center  w-full mx-auto"
                onSubmit={handleSubmit(onValid)}
              >
                <input
                  {...register("content", { required: true })}
                  placeholder="Any thoughts from the video?"
                  type="text"
                  className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500
                  text-xs"
                />
                <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                  <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                    <span>&rarr;</span>
                  </button>
                </div>
              </form>
              {showUploadAlert && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 rounded-lg overflow-hidden">
                  <Alert
                    severity="success"
                    color="warning"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => router.push(`/archive/${title?.id}`)}
                      >
                        Check it out
                      </Button>
                    }
                  >
                    Saved to your archive!
                  </Alert>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* <FloatingButton href="/create">
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
      </FloatingButton> */}
    </Layout>
  );
};

export default VideoItem;
