import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import Spinner from "@components/spinner";
import { Product } from "@prisma/client";
import type { NextPage } from "next";
import useSWR from "swr";

interface ProductWithFavCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductResponse {
  ok: boolean;
  products: ProductWithFavCount[];
}

const Archive: NextPage = () => {
  const { data } = useSWR<ProductResponse>("/api/idea/bookmark");

  return (
    <Layout title="Archive" hasTabBar>
      <div className="flex flex-col space-y-5 divide-y">
        {data && data.products ? (
          data?.products?.map((product) => (
            <Item
              id={product.id}
              key={product.id}
              title={product.name}
              price={product.price}
              comments={1}
              hearts={product._count.favs}
            />
          ))
        ) : (
          <Spinner />
        )}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Archive;
