import useMutation from "@libs/client/useMutation";
import { Idea } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import Layout from "../../components/layout";
import Message from "../../components/message";

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

const commentMaxResults = 2;

const VideoItem: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  const { data: video } = useSWR(
    // id
    //   ? `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    //   :
    null
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

  useEffect(() => {
    if (ideaResult && ideaResult.ok) {
      mutate("/api/ideas");
    }
    reset();
  }, [ideaResult, mutate, reset]);

  const onValid = (data: UploadIdeaForm) => {
    uploadIdeas(data);
  };

  return (
    <Layout canGoBack>
      <div className="space-y-4">
        {video ? (
          <iframe
            // width={video.snippet?.thumbnails?.default?.high?.width}
            // height={video.snippet?.thumbnails?.default?.high?.height}
            width="100%"
            height="300px"
            src={`http://www.youtube.com/embed/${id}`}
            allowFullScreen={true}
          ></iframe>
        ) : (
          <div className="w-full shadow-sm bg-slate-300 aspect-video" />
        )}

        <section className="px-4 divide-y-[1px] space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {video?.items[0]?.snippet?.title}
          </h1>
          <div>
            <h2 className="text-lg text-gray-900 pt-4 py-2">Comments</h2>
            <main className="pb-16 h-[50vh] overflow-y-scroll px-1 space-y-4">
              {comments?.items
                ? comments.items.map(
                    ({ snippet, id }: CommentInfo, index: number) => (
                      <div key={id} onClick={handleSubmit(onValid)}>
                        <Message
                          message={snippet.topLevelComment.snippet.textOriginal}
                          reversed={index % 2 == 1}
                          commentId={id}
                        />
                      </div>
                    )
                  )
                : "loading..."}
            </main>

            {/* my comment */}
            <div className="fixed p-2 bg-white  bottom-0 inset-x-0">
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
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default VideoItem;
