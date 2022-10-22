import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { useRouter } from "next/router";
import { RecoilRoot } from "recoil";

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
        revalidateOnFocus: false,
      }}
    >
      <RecoilRoot>
        <div className="w-full mx-auto">
          <Component {...pageProps} />
        </div>
      </RecoilRoot>
    </SWRConfig>
  );
}

export default MyApp;
