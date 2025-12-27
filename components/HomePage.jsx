import React from 'react'
import Image from 'next/image';
import { Button } from './ui/button';
import { VscDebugStart, VscDebugBreakpointFunction } from "react-icons/vsc";
import Link from 'next/link';

// Static content - This should be server-rendered for SEO
const staticContent = {
  en: {
    title: "Smart Book & PDF Summaries in One Place",
    subtitle: "Get concise, easy-to-read summaries for books and PDFs, plus links to buy the original editions.",
    button: "Get Started",
    whyTitle: "Why Choose Book Summarizer?",
    features: [
      {
        strong: "Save valuable time:",
        text: "Get the essence of a book in minutes instead of spending days reading."
      },
      {
        strong: "Clear and simple explanations:",
        text: "Complex ideas are rewritten in easy-to-understand language."
      },
      {
        strong: "Built for real people:",
        text: "Ideal for students, founders, readers, and anyone who values learning."
      },
      {
        strong: "Multiple formats supported:",
        text: "Upload books or PDFs across different topics and categories."
      },
      {
        strong: "Support authors:",
        text: "We include official purchase links so you can buy the full book anytime."
      }
    ],
    statsTitle: "Platform Statistics",
    statsDescription: "These numbers reflect the growing community using Book Summarizer daily to explore knowledge, save time, and discover new books across different fields.",
    stats: [
      {
        value: "1,200+",
        title: "Active Users Worldwide",
        description: "Readers and learners actively using the platform every month.",
        color: "text-blue-400"
      },
      {
        value: "8,500+",
        title: "Books & PDFs Summarized",
        description: "From business and psychology to technology and self-development.",
        color: "text-green-400"
      },
      {
        value: "95%",
        title: "User Satisfaction",
        description: "Based on user feedback and repeated usage across the platform.",
        color: "text-purple-400"
      }
    ],
    additionalStats: [
      { label: "Supported Languages", value: "2"},
      { label: "Time Saved", value: "50K+ hours" },
      { label: "Growth Rate", value: "20% monthly" },
      { label: "Return Rate", value: "85%" }
    ]
  }
};

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Book Summarizer - AI-Powered Book & PDF Summaries",
  "url": "https://booksummarizer.net",
  "description": "Get concise, easy-to-read summaries for books and PDFs. AI-powered book analysis, multi-language support, and official purchase links.",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1200"
  }
};

export default async function HomePage() {
  const content = staticContent.en; // Use English content for server rendering

  return (
    <div className='relative min-h-screen'>
      {/* Hidden SEO content - rich text for search engines */}
      <div className="sr-only" aria-hidden="true">
        <h1>Book Summarizer - AI-Powered Platform for Book and PDF Summaries</h1>
        <p>
          Book Summarizer is an innovative AI-powered platform designed to help readers, students, professionals, 
          and lifelong learners save time while expanding their knowledge. Our advanced natural language processing 
          algorithms analyze complex texts from books and PDF documents, extracting key concepts, main arguments, 
          and essential insights to provide comprehensive summaries.
        </p>
        <p>
          The platform supports multiple languages and formats, making it accessible to a global audience. 
          Whether you're preparing for exams, conducting research, or simply want to understand complex topics 
          quickly, Book Summarizer delivers accurate, easy-to-understand summaries that preserve the original 
          context and meaning of the source material.
        </p>
        <h2>Key Features and Benefits</h2>
        <ul>
          <li>AI-powered text analysis for accurate summaries</li>
          <li>Support for multiple languages including English</li>
          <li>PDF upload capability with smart text extraction</li>
          <li>Official purchase links to support authors</li>
          <li>User-friendly interface for seamless experience</li>
          <li>Time-saving summaries for busy professionals</li>
        </ul>
        <h2>How It Works</h2>
        <p>
          Our platform utilizes cutting-edge machine learning models to process uploaded documents. 
          The system first extracts text content, then identifies key themes, main arguments, and 
          important concepts. Using advanced summarization techniques, it creates concise yet 
          comprehensive overviews that capture the essence of the original material while maintaining 
          accuracy and context.
        </p>
        <h2>Educational Applications</h2>
        <p>
          Book Summarizer is particularly valuable for educational purposes. Students can use it to 
          prepare for exams, understand complex textbooks, and improve their reading comprehension. 
          Educators can leverage our summaries for lesson planning and curriculum development. 
          Researchers benefit from quick literature reviews and academic paper analysis.
        </p>
        <h2>Technology Stack</h2>
        <p>
          Built with modern web technologies including Next.js, React, and advanced NLP libraries, 
          Book Summarizer represents the forefront of educational technology innovation. Our AI 
          models are continuously trained and updated to improve accuracy and provide better 
          summarization results across various genres and formats.
        </p>
      </div>

      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        suppressHydrationWarning
      />

      {/* Background Image */}
      <Image
        src="/colors-noise-grainy-background-copy-space.jpg"
        alt="Book Summarizer AI Platform Background - Advanced AI technology for book and PDF summaries"
        fill
        className="object-cover"
        quality={100}
        priority
        sizes="100vw"
      />
      
      {/* Hero Section */}
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4'>
        <div className='max-w-4xl mx-auto text-center space-y-6'>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffecb3] via-[#ff3bd3] to-[#3b3bd9] leading-tight">
            {content.title}
          </h1>
          
          <p className="text-lg md:text-2xl font-light text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
          
          <Button className="group px-8 py-6 rounded-xl font-extrabold text-lg md:text-xl bg-gradient-to-r from-[#ff3bd3] to-[#3b3bd9] hover:from-[#ff3bd3] hover:to-[#ff3bd3] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl mt-8">
            <Link href="/main" className="flex items-center gap-2">
              <span className='animate-pulse'>{content.button}</span>
              <VscDebugStart className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className='relative z-10 py-16 px-4'>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-8 text-white text-center">
            {content.whyTitle}
          </h2>

          <ul className="space-y-6">
            {content.features.map((feature, index) => (
              <li 
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer border border-white/10 hover:border-[#ff3bd3]/30"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#ff3bd3]/20 to-[#3b3bd9]/20 group-hover:scale-110 transition-transform duration-300">
                  <VscDebugBreakpointFunction className="text-[#ff3bd3] text-2xl" />
                </div>
                <span className="text-gray-300 text-lg leading-relaxed">
                  <strong className="text-white font-semibold">{feature.strong}</strong> {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            {content.statsTitle}
          </h2>
          
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            {content.statsDescription}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {content.stats.map((stat, index) => (
              <div 
                key={index}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-800 hover:border-[#ff3bd3]/30 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff3bd3]/5 to-[#3b3bd9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <span className={`block text-4xl md:text-5xl font-bold ${stat.color} mb-3`}>
                    {stat.value}
                  </span>
                  <span className="text-xl font-semibold text-white mb-3 block">
                    {stat.title}
                  </span>
                  <p className="text-gray-400 text-sm">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.additionalStats.map((item, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
              >
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">
                  {item.value}
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Content for SEO - EXTENDED with more text */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Enhancing Learning with AI Technology
            </h2>
            
            <div className="space-y-6 text-gray-300">
              <p className="leading-relaxed text-lg">
                Book Summarizer technology uses advanced language models to analyze texts and identify core concepts. This approach goes beyond simply shortening content—it aims to provide valuable insights that help readers quickly and efficiently understand key points. Our AI algorithms are specifically trained on academic, professional, and literary texts to ensure accurate and contextually appropriate summaries.
              </p>
              
              <p className="leading-relaxed text-lg">
                Our platform features comprehensive multi-language support, making knowledge accessible to a global community of learners. Users can upload books and PDFs in different languages and receive accurate summaries that preserve the original context, tone, and core message of the source material. This multilingual capability is particularly valuable for researchers, students, and professionals working with international materials.
              </p>

              <div className="mt-6 p-6 bg-gray-900/30 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">
                  How the Platform Works: Technical Details
                </h3>
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="text-gray-300">
                    <strong>Document Upload and Processing:</strong> Users can upload PDF files or search for books in our extensive database. The system extracts text content while preserving formatting and structure.
                  </li>
                  <li className="text-gray-300">
                    <strong>AI-Powered Text Analysis:</strong> Our advanced natural language processing algorithms analyze the text, identifying key themes, main arguments, supporting evidence, and essential concepts.
                  </li>
                  <li className="text-gray-300">
                    <strong>Contextual Understanding:</strong> The system maintains contextual relationships between ideas, ensuring that summaries accurately reflect the original material's intent and meaning.
                  </li>
                  <li className="text-gray-300">
                    <strong>Summary Generation:</strong> Using state-of-the-art summarization techniques, the platform generates comprehensive, easy-to-understand summaries that capture the essence of the original document.
                  </li>
                  <li className="text-gray-300">
                    <strong>Quality Assurance:</strong> All summaries undergo automated quality checks to ensure accuracy, coherence, and readability before being presented to users.
                  </li>
                </ol>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">
                  Educational Benefits and Applications
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">For Students</h4>
                    <p className="text-gray-300 text-sm">
                      Perfect for exam preparation, textbook understanding, research paper analysis, and improving reading comprehension skills. Students can save significant study time while improving their academic performance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">For Professionals</h4>
                    <p className="text-gray-300 text-sm">
                      Business professionals can quickly understand industry reports, research papers, and professional literature. This helps with continuing education, staying updated in your field, and making informed decisions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">For Researchers</h4>
                    <p className="text-gray-300 text-sm">
                      Accelerate literature reviews, analyze academic papers efficiently, and identify key research trends. Our platform helps researchers stay current with developments in their field without spending excessive time reading.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">For Book Lovers</h4>
                    <p className="text-gray-300 text-sm">
                      Discover new books, understand complex literature, and get quick overviews before committing to full reads. Enhance your reading experience with insightful summaries that complement your literary exploration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-900/30 rounded-xl">
                <h3 className="text-xl font-semibold text-green-400 mb-4">
                  Platform Features and Technical Specifications
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300">Advanced AI algorithms trained on millions of documents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300">Support for multiple file formats including PDF, EPUB, and DOCX</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300">Real-time processing with average completion time under 60 seconds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300">Secure document handling with end-to-end encryption</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300">Mobile-responsive design for access on any device</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300">Regular updates and improvements to AI models</span>
                  </li>
                </ul>
              </div>

              <p className="leading-relaxed text-lg mt-6">
                Book Summarizer represents the future of educational technology, combining artificial intelligence with user-friendly design to create a powerful tool for knowledge acquisition and retention. Whether you're a student preparing for exams, a professional staying current in your field, or a lifelong learner exploring new subjects, our platform provides the tools you need to learn more efficiently and effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section with more SEO text */}
      <footer className="relative z-10 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-gray-400">
            <p className="text-lg mb-4">
              Book Summarizer is committed to making knowledge accessible to everyone through advanced AI technology. 
              Our platform continuously evolves to provide better summaries and enhanced user experiences.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <h4 className="font-semibold text-white mb-3">About Our Technology</h4>
                <p className="text-sm text-gray-500">
                  Built with cutting-edge machine learning models and natural language processing algorithms, 
                  our platform represents the forefront of AI-powered educational technology.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Our Mission</h4>
                <p className="text-sm text-gray-500">
                  To democratize access to knowledge by providing accurate, comprehensive summaries that help 
                  people learn more efficiently and make informed decisions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Future Development</h4>
                <p className="text-sm text-gray-500">
                  We're continuously improving our AI models, adding new features, and expanding our 
                  language support to serve our growing global community better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}