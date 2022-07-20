import type { NextPage } from "next";

const CreateStream: NextPage = () => {
  return (
    <div className="px-4 py-16 space-y-5">
      <div>
        <label
          className="mb-1 block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Name
        </label>
        <div className="rounded-md relative flex  items-center shadow-sm">
          <input
            id="name"
            type="email"
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="price"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <div className="rounded-md shadow-sm relative flex items-center">
          <span className="absolute left-0 pl-3 text-gray-500 text-sm pointer-events-none">
            $
          </span>
          <input
            id="price"
            type="text"
            placeholder="0.00"
            className="appearance-none w-full border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 pl-7"
          />
          <span className="absolute right-0 pr-3 text-gray-500 text-sm pointer-events-none">
            USD
          </span>
        </div>
      </div>

      <div className="my-5">
        <label
          htmlFor="description"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          className="mt-1 w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          rows={4}
        />
      </div>

      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none py-2 text-sm">
        Go Live
      </button>
    </div>
  );
};

export default CreateStream;
