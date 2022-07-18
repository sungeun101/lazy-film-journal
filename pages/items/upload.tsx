import type { NextPage } from "next";

const Upload: NextPage = () => {
  return (
    <div className="px-4 py-16">
      <div>
        <label className="w-full flex items-center justify-center h-48 border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-md text-gray-600 hover:text-orange-500 cursor-pointer">
          <svg
            className="h-12 w-12"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input type="file" className="hidden" />
        </label>
      </div>
      <div className="my-5">
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
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="mt-1 w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          rows={4}
        />
      </div>
      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none py-2 text-sm">
        Upload Product
      </button>
    </div>
  );
};

export default Upload;
