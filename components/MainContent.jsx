import Header from "./Header";
import ClientContentExtra from "./ClientContentExtra";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main >

        <ClientContentExtra/>
      </main>

    </>
  );
}