import Head from "next/head";
import "./globals.css";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { AnalyticsBrowser } from "@segment/analytics-next";

const TITLE = "Match Phrase";
const DESCRIPTION = "Guess the phrase from AI-made emojis";
const PREVIEW = "https://match-phrase.vercel.app/mp-preview.png";

export const analytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY!,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          },
        }}
      />
      <Head>
        <title>Match Phrase</title>
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={PREVIEW} />
        <meta property="og:url" content="https://match-phrase.vercel.app" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={PREVIEW} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
