import Header from "./Header";
import Footer from "./Footer";
import { MainContentClient } from './MainContentClient';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <MainContentClient /> 
      </main>
      <Footer />
    </>
  );
}