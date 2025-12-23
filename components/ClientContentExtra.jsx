"use client"
import React from 'react'
import Image from 'next/image';
import { Button } from './ui/button';
import { VscDebugStart, VscDebugBreakpointFunction } from "react-icons/vsc";
import Link from 'next/link';
import { useLanguage } from "@/lib/context/LanguageContext";

const ClientContentExtra = () => {
  const { lang } = useLanguage();

  // Bilingual content
  const content = {
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
      ]
    },
    ar: {
      title: "ملخصات كتب وPDF ذكية في مكان واحد",
      subtitle: "احصل على ملخصات موجزة وسهلة القراءة للكتب وملفات PDF، بالإضافة إلى روابط لشراء النسخ الأصلية.",
      button: "ابدأ الآن",
      whyTitle: "لماذا تختار ملخص الكتب؟",
      features: [
        {
          strong: "وفر وقتك الثمين:",
          text: "احصل على جوهر الكتاب في دقائق بدلاً من قضاء أيام في القراءة."
        },
        {
          strong: "شروحات واضحة وبسيطة:",
          text: "تتم إعادة صياغة الأفكار المعقدة بلغة سهلة الفهم."
        },
        {
          strong: "مصمم للأشخاص الحقيقيين:",
          text: "مثالي للطلاب، رواد الأعمال، القراء، وأي شخص يقدر التعلم."
        },
        {
          strong: "تعددية في الصيغ المدعومة:",
          text: "قم بتحميل الكتب أو ملفات PDF عبر مواضيع وفئات مختلفة."
        },
        {
          strong: "ادعم المؤلفين:",
          text: "نضمن روابط شراء رسمية حتى تتمكن من شراء الكتاب الكامل في أي وقت."
        }
      ],
      statsTitle: "إحصائيات المنصة",
      statsDescription: "تعكس هذه الأرقام المجتمع المتنامي الذي يستخدم ملخص الكتب يومياً لاستكشاف المعرفة، توفير الوقت، واكتشاف كتب جديدة عبر مختلف المجالات.",
      stats: [
        {
          value: "+١,٢٠٠",
          title: "مستخدم نشط حول العالم",
          description: "قراء ومتعلمين يستخدمون المنصة بنشاط كل شهر.",
          color: "text-blue-400"
        },
        {
          value: "+٨,٥٠٠",
          title: "كتاب وملف PDF ملخص",
          description: "من الأعمال التجارية وعلم النفس إلى التكنولوجيا وتطوير الذات.",
          color: "text-green-400"
        },
        {
          value: "٩٥٪",
          title: "رضا المستخدمين",
          description: "بناءً على ملاحظات المستخدمين والاستخدام المتكرر عبر المنصة.",
          color: "text-purple-400"
        }
      ]
    }
  };

  const t = content[lang];
  const isArabic = lang === 'ar';

  return (
    <div className='relative min-h-screen' dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Background Image */}
      <Image
        src="/colors-noise-grainy-background-copy-space.jpg"
        alt="Background"
        fill
        className="object-cover"
        quality={100}
        priority
      />
      
      {/* Hero Section */}
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4'>
        <div className='max-w-4xl mx-auto text-center space-y-6'>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffecb3] via-[#ff3bd3] to-[#3b3bd9] leading-tight">
            {t.title}
          </h1>
          
          <p className="text-lg md:text-2xl font-light text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          
          <Button className="group px-8 py-6 rounded-xl font-extrabold text-lg md:text-xl bg-gradient-to-r from-[#ff3bd3] to-[#3b3bd9] hover:from-[#ff3bd3] hover:to-[#ff3bd3] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl mt-8">
            <Link href="/main" className="flex items-center gap-2">
              <span className='animate-pulse'>{t.button}</span>
              <VscDebugStart className={`group-hover:translate-x-1 transition-transform ${isArabic ? 'rotate-180' : ''}`} />
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
            {t.whyTitle}
          </h2>

          <ul className="space-y-6">
            {t.features.map((feature, index) => (
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
            {t.statsTitle}
          </h2>
          
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            {t.statsDescription}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {t.stats.map((stat, index) => (
              <div 
                key={index}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-800 hover:border-[#ff3bd3]/30 transition-all duration-300 group overflow-hidden"
              >
                {/* Animated background effect */}
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
            {[
              { label: isArabic ? "لغات مدعومة" : "Supported Languages", value: isArabic ? "+١٠" : "10+" },
              { label: isArabic ? "وقت محفوظ" : "Time Saved", value: isArabic ? "+٥٠,٠٠٠ ساعة" : "50K+ hours" },
              { label: isArabic ? "معدل النمو" : "Growth Rate", value: isArabic ? "+٢٠٪ شهرياً" : "20% monthly" },
              { label: isArabic ? "نسبة العودة" : "Return Rate", value: isArabic ? "٨٥٪" : "85%" }
            ].map((item, index) => (
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

    </div>
  )
}

export default ClientContentExtra;