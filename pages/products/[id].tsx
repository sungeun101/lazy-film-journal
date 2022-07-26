import Button from "@components/button";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { Product, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

interface ProductWithUser extends Product {
  user: User;
}
interface ProductDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ProductDetail: NextPage = () => {
  const router = useRouter();

  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ProductDetailResponse>(
    router.query ? `/api/products/${router.query.id}` : null
  );

  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);

  const onFavClick = () => {
    if (!data) return;
    // optimistic UI update for users
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    // Unbound Mutation
    mutate(
      "/api/profile/wish",
      (prev: ProductDetailResponse) =>
        prev && { ...prev, isLiked: !prev.isLiked },
      false
    );
    mutate(
      "/api/products",
      (prev: any) => prev && { ...prev, isLiked: !prev.isLiked },
      false
    );
    // real update
    toggleFav({});
  };
  return (
    <Layout canGoBack>
      <div className="px-4 py-10">
        {data?.product && (
          <div className="mb-8">
            <div className="h-96 bg-slate-300" />
            <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-slate-300" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {data.product.user.name}
                </p>
                <Link href={`/users/profiles/${data.product.user.id}`}>
                  <a className="text-xs font-medium text-gray-500">
                    View profile &rarr;
                  </a>
                </Link>
              </div>
            </div>
            <div className="mt-5">
              <h1 className="text-3xl font-bold text-gray-900">
                {data?.product?.name}
              </h1>
              <span className="text-2xl block mt-3 text-gray-900">
                {`$${data.product.price}`}
              </span>
              <p className=" my-6 text-gray-700">{data.product.description}</p>
              <div className="flex items-center justify-between space-x-2">
                <Button large text="Talk to seller" />
                <button
                  className={cls(
                    "p-3 rounded-md flex items-center justify-center hover:bg-gray-100 ",
                    data?.isLiked
                      ? "text-red-400 hover:text-red-500"
                      : "text-gray-400 hover:text-gray-500"
                  )}
                  onClick={onFavClick}
                >
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill={data?.isLiked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {data?.relatedProducts && data.relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {data.relatedProducts.map((product) => (
                <div key={product.id}>
                  <div className="h-56 w-full mb-4 bg-slate-300" />
                  <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">{`$${product.price}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
