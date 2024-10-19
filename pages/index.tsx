import Container from "../components/container"
import Layout from "../components/layout"
import Head from "next/head"
import { CMS_NAME } from "../lib/constants"
import GettingStarted from "../components/getting-started";

const Index = () => {
  const title = `Next.js Example with ${CMS_NAME}`

  return (
    <>
      <Layout>
        <Head>
          <title>{title}</title>
        </Head>
        <Container>
          <h1>Index Form</h1>
        </Container>
        <GettingStarted/>
      </Layout>
    </>
  )
}

export default Index

