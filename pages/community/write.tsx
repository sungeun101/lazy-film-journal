import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useCoords from "@libs/client/useCoords";
import useMutation from "@libs/client/useMutation";
import { Post } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  question: string;
}

interface PostResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();

  const { register, handleSubmit } = useForm<FormData>();

  const [post, { loading, data }] = useMutation<PostResponse>("/api/posts");

  const router = useRouter();

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  const onValid = (data: FormData) => {
    console.log("hi");
    if (loading) return;
    post({ ...data, latitude, longitude });
  };

  return (
    <Layout canGoBack title="Write Post">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea
          required
          placeholder="Ask a question!"
          register={register("question", { required: true })}
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
