import { AppProps } from "next/app"
import "../styles/index.css"
import "../styles/main.css"
import "../styles/survey.css"

import { useApp } from "../lib/gateway"
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  
  return <Component {...pageProps} />
}
