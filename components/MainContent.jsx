import Header from "./Header";

import { MainContentClient } from "./MainContentClient";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main >

        <MainContentClient/>
      </main>

    </>
  );
}