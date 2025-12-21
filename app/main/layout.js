import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Book Summarizer | Main Dashboard",
  description: "Upload and summarize your books and PDFs with AI",
};

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen">
        <Header/>
      {/* Add any navigation, sidebar, or header specific to main functionality */}
      <main className="py-9">
        {children}
      </main>
      <Footer/>
    </div>
  );
}