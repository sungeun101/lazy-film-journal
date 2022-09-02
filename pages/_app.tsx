import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default MyApp;
