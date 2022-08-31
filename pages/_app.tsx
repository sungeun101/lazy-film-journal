import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        onError(error) {
          if (error) {
            router.push("/enter");
          }
        },
      }}
    >
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
