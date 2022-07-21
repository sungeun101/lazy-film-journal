import Layout from "@components/layout";
import Message from "@components/message";
import type { NextPage } from "next";

const ChatDetail: NextPage = () => {
  return (
    <Layout canGoBack title="Steve">
      <div className="py-10 px-4 space-y-4">
        <Message message="Hi how much are you selling them for?" />
        <Message message="I want ￦20,000" reversed />
        <Message message="미쳤어" />

        <form className="fixed inset-x-0 bottom-2 w-full max-w-md mx-auto">
          <div className="flex items-center">
            <input
              type="text"
              className="w-full pr-12 border-gray-300 rounded-full shadow-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <div className="absolute right-0 py-1.5 pr-1.5 inset-y-0 flex">
              <button className="flex items-center bg-orange-500 hover:bg-orange-600 rounded-full px-3 text-sm text-white focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
