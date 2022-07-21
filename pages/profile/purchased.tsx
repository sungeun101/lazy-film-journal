import Item from "@components/item";
import Layout from "@components/layout";
import type { NextPage } from "next";

const Purchased: NextPage = () => {
  return (
    <Layout title="Purchased History" canGoBack>
      <div className="flex flex-col space-y-5 pb-10 divide-y">
        {[...Array(10)].map((_, i) => (
          <Item
            key={i}
            id={i}
            title="iPhone 14"
            price={99}
            comments={1}
            hearts={1}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Purchased;
