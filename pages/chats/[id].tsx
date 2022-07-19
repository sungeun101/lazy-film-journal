import type { NextPage } from "next";

const ChatDetail: NextPage = () => {
  return (
    <div className="py-10 px-4 space-y-4">
      {[...Array(4)].map((_, i) => (
        <>
          <div key={i} className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-400"></div>
            <div className="w-1/2 text-sm text-gray-700 p-2 border round">
              <p>Hi how much are you selling them for?</p>
            </div>
          </div>

          <div className="flex flex-row-reverse items-center space-x-2 space-x-reverse">
            <div className="w-8 h-8 rounded-full bg-slate-400"></div>
            <div className="w-1/2 text-sm text-gray-700 p-2 border round">
              <p>I want $20</p>
            </div>
            <div />
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-400"></div>
            <div className="w-1/2 text-sm text-gray-700 p-2 border round">
              <p>You are kidding me.</p>
            </div>
          </div>
        </>
      ))}

      <div className="fixed inset-x-0 bottom-2 w-full max-w-md mx-auto">
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
      </div>
    </div>
  );
};

export default ChatDetail;
