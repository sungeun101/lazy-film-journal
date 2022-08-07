import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import Layout from "../../components/layout";
import Message from "../../components/message";

interface CommentInfo {
  snippet: any;
  id: string;
}

const VideoItem: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  const { data } = useSWR(
    id
      ? `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&order=relevance&videoId=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      : null
  );

  return (
    <Layout canGoBack>
      <div className="py-10 px-4 space-y-4">
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">Wednesday 220720</h1>
          <span className="text-2xl block mt-3 text-gray-900">
            Workout of the Day
          </span>
          <p>contents</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.items
              ? data.items.map(
                  ({ snippet, id }: CommentInfo, index: number) => (
                    <div key={id}>
                      <Message
                        message={snippet.topLevelComment.snippet.textOriginal}
                        reversed={index % 2 == 1}
                      />
                    </div>
                  )
                )
              : "loading..."}
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <div className="flex relative max-w-md items-center  w-full mx-auto">
              <input
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoItem;
