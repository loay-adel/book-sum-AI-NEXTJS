"use client";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";

const AboutUs = () => {
  const { lang } = useLanguage();

  const dict = {
    en: {
      title: "About Us",
      content:
        "We are a digital library dedicated to providing access to thousands of books with AI-powered summaries. Our mission is to make knowledge more accessible and help readers discover new books that match their interests.",
      team: "Our Team",
      teamDesc:
        "We are a diverse team of book lovers, developers, and AI experts working together to create the best reading experience.",
      mission: "Our Mission",
      missionDesc:
        "Making knowledge accessible to everyone through AI-powered insights",
      vision: "Our Vision",
      visionDesc:
        "A world where everyone can discover and enjoy books that resonate with them",
      values: "Our Values",
      valuesList: [
        "Accessibility for all readers",
        "Innovation in book discovery",
        "Quality content curation",
        "User-centric design",
      ],
    },
    ar: {
      title: "من نحن",
      content:
        "نحن مكتبة رقمية مخصصة لتوفير الوصول إلى الآلاف من الكتب مع ملخصات مدعومة بالذكاء الاصطناعي. مهمتنا هي جعل المعرفة أكثر accessibility ومساعدة القراء في اكتشاف كتب جديدة تتطابق مع اهتماماتهم.",
      team: "فريقنا",
      teamDesc:
        "نحن فريق متنوع من عشاق الكتب والمطورين وخبراء الذكاء الاصطناعي الذين يعملون معًا لخلق أفضل تجربة قراءة.",
      mission: "مهمتنا",
      missionDesc:
        "جعل المعرفة في متناول الجميع من خلال الرؤى المدعومة بالذكاء الاصطناعي",
      vision: "رؤيتنا",
      visionDesc:
        "عالم يمكن للجميع فيه اكتشاف الكتب والاستمتاع بها والتي تتردد صداها معهم",
      values: "قيمنا",
      valuesList: [
        "إمكانية الوصول لجميع القراء",
        "الابتكار في اكتشاف الكتب",
        "اختيار المحتوى عالي الجودة",
        "تصميم يركز على المستخدم",
      ],
    },
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-[1.5]"
        >
          {dict[lang].title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          {dict[lang].content}
        </motion.p>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="text-blue-400 mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{dict[lang].mission}</h3>
            <p className="text-gray-300">{dict[lang].missionDesc}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="text-purple-400 mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{dict[lang].vision}</h3>
            <p className="text-gray-300">{dict[lang].visionDesc}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="text-green-400 mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{dict[lang].values}</h3>
            <ul className="text-gray-300 space-y-2">
              {dict[lang].valuesList.map((value, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-400 mr-2">•</span> {value}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
