import type { NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";

interface AnswersWithUser extends Answer {
  user: User;
}
interface PostDetailWithUserAndCount extends Post {
  user: User;
  _count: { recommended: number; answers: number };
  answers: AnswersWithUser[];
}

interface PostDetailResponse {
  ok: boolean;
  post: PostDetailWithUserAndCount;
  isRecommended: boolean;
}

const CommunityPostDetail: NextPage = () => {
  const { register } = useForm();

  const router = useRouter();

  const { data, mutate } = useSWR<PostDetailResponse>(
    `/api/posts/${router.query.id}`
  );

  const [toggleRecommend] = useMutation(
    `/api/posts/${router.query.id}/recommend`
  );

  useEffect(() => {
    if (data && !data.ok) {
      router.push("/community");
    }
  }, [data, router]);

  const onRecommendClick = () => {
    if (!data) return;
    mutate(
      (prev) =>
        prev && {
          ...prev,
          post: {
            ...prev.post,
            _count: {
              ...prev.post._count,
              recommended: prev.isRecommended
                ? prev.post._count.recommended - 1
                : prev.post._count.recommended + 1,
            },
          },
          isRecommended: !prev.isRecommended,
        },
      false
    );
    toggleRecommend({});
  };

  return (
    <Layout canGoBack>
      <div>
        <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Near you
        </span>
        <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {data?.post?.user?.name}
            </p>
            <Link href={`/users/profiles/${data?.post?.user?.id}`}>
              <a className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </a>
            </Link>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-orange-500 font-medium">Q. </span>
            {data?.post?.question}
          </div>
          <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
            <button
              onClick={onRecommendClick}
              className="flex space-x-2 items-center text-sm"
            >
              <svg
                className="w-4 h-4"
                fill={data?.isRecommended ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span>Recommended {data?.post?._count?.recommended}</span>
            </button>
            <button className="flex space-x-2 items-center text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>
                {data?.post?._count?.answers && data?.post?._count?.answers > 1
                  ? "Answers"
                  : "Answer"}{" "}
                {data?.post?._count?.answers}
              </span>
            </button>
          </div>
        </div>

        <div className="px-4 my-5 space-y-5">
          {data?.post?.answers?.map((answer) => (
            <div key={answer.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full" />
              <div>
                <span className="text-sm block font-medium text-gray-700">
                  {answer.user.name}
                </span>
                <span className="text-xs text-gray-500 block ">2시간 전</span>
                <p className="text-gray-700 mt-2">{answer.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4">
          <TextArea
            name="description"
            placeholder="Answer this question!"
            required
            register={register("description", { required: true })}
          />
          <button className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
            Reply
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
