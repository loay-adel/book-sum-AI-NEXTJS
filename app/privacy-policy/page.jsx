"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/context/LanguageContext";

const PrivacyPolicy = () => {
  const { lang } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      welcome: "Welcome to <strong>booksummarizer.net</strong>. We respect your privacy and are committed to protecting user data. This page explains the types of data we collect, how we use it, and how you can control it.",
      
      infoWeCollect: "Information We Collect",
      voluntaryData: "<strong>Data you provide voluntarily:</strong> Such as username or email if you register or contact us.",
      usageData: "<strong>Usage data:</strong> Pages visited, number of visits, time spent, and IP address (anonymized or truncated as needed).",
      cookies: "<strong>Cookies:</strong> We use cookies to improve user experience, remember preferences, and for analytics and advertising purposes.",
      
      googleServices: "Our Use of Services and Integration with Google",
      googleServicesDesc: "We may use external Google services to operate the site, analyze performance, and display ads. Main services we may integrate:",
      analytics: "<strong>Google Analytics:</strong> To analyze user visits, traffic sources, and visitor behavior on the site. This data is used to improve content and user experience.",
      adsense: "<strong>Google AdSense or alternative ads:</strong> To display ads on the site. Certain data may be collected (such as general interests and sites you visit) to show ads relevant to visitor interests.",
      tagManager: "<strong>Google Tag Manager:</strong> To manage tags on the site flexibly and securely without direct code modification.",
      recaptcha: "<strong>Google reCAPTCHA:</strong> For protection against automated messages and spam when there are contact forms or registration.",
      
      dataUsage: "How We Use Data",
      usagePoints: [
        "Improve content quality and user experience.",
        "Operate technical services like ads and performance analytics.",
        "Respond to user inquiries and provide support."
      ],
      
      dataSharing: "Data Sharing with Third Parties",
      sharingDesc: "We may share limited data with third-party service providers (like Google) for advertising, analytics, and hosting purposes. These parties are bound by their own privacy policies.",
      
      controlOptions: "Control and Options",
      controlPoints: [
        "You can disable cookies from browser settings, but this may affect some site functions.",
        "To limit personalized ad tracking, you can visit Google's ad settings page and manage your preferences.",
        "To limit Google Analytics tracking, you can use anti-tracking add-ons or install the Google Analytics opt-out tool provided by Google."
      ],
      
      dataRetention: "Data Retention",
      retentionDesc: "We retain data for the period necessary to achieve the purposes outlined in this policy or to comply with legal obligations. When no longer needed, we work to delete or anonymize data securely.",
      
      externalLinks: "Links to Other Sites",
      linksDesc: "The site may contain links to other sites not controlled by booksummarizer.net. We advise reviewing the privacy policies of those sites when visiting.",
      
      policyChanges: "Changes to Privacy Policy",
      changesDesc: "We may update this policy from time to time. We will announce important updates through the site or associated communication channels.",
      
      contact: "Contact Us",
      contactDesc: "If you have any questions or wish to request deletion or modification of your data, contact us through the 'Contact Us' page or send a message to:",
      
      lastUpdated: "Last updated:"
    },
    ar: {
      title: "سياسة الخصوصية",
      welcome: "مرحبًا بك في <strong>booksummarizer.net</strong>. نحترم خصوصيتك ونلتزم بحماية بيانات المستخدمين. توضح هذه الصفحة أنواع البيانات التي نجمعها، كيف نستخدمها، وكيف يمكنك التحكم بها.",
      
      infoWeCollect: "1. المعلومات التي نجمعها",
      voluntaryData: "<strong>البيانات التي تقدمها طواعية:</strong> مثل اسم المستخدم أو البريد الإلكتروني إذا سجّلت أو تواصلت معنا.",
      usageData: "<strong>بيانات الاستخدام:</strong> صفحات الزيارة، عدد الزيارات، زمن البقاء، وعنوان الـ IP (مُجهّد أو مجزّأ حسب الحاجة).",
      cookies: "<strong>ملفات تعريف الارتباط (Cookies):</strong> نستخدم الكوكيز لتحسين تجربة المستخدم، وتذكر التفضيلات، ولأغراض التحليل والإعلانات.",
      
      googleServices: "2. استخدامنا للخدمات والربط مع Google",
      googleServicesDesc: "قد نستخدم خدمات خارجية من جوجل لتشغيل الموقع وتحليل الأداء وعرض الإعلانات. الخدمات الرئيسية التي قد نربطها:",
      analytics: "<strong>Google Analytics:</strong> لتحليل زيارات المستخدمين، مصادر الترافيك، وسلوك الزوار داخل الموقع. تُستخدَم هذه البيانات لتحسين المحتوى وتجربة الاستخدام.",
      adsense: "<strong>Google AdSense أو بدائل إعلانية:</strong> لعرض إعلانات داخل الموقع. قد تُجمَع بيانات معينة (مثل الاهتمامات العامة والمواقع التي تزورها) لعرض إعلانات متوافقه مع اهتمامات الزوار.",
      tagManager: "<strong>Google Tag Manager:</strong> لإدارة الوسوم (tags) على الموقع بشكل مرن وآمن دون تعديل مباشر في الكود.",
      recaptcha: "<strong>reCAPTCHA من Google:</strong> للحماية من الرسائل الآلية والـ spam عند وجود نماذج تواصل أو تسجيل.",
      
      dataUsage: "3. كيف نستخدم البيانات",
      usagePoints: [
        "تحسين جودة المحتوى وتجربة المستخدم.",
        "تشغيل الخدمات التقنية مثل الإعلانات وتحليل الأداء.",
        "الرد على استفسارات المستخدمين وتقديم الدعم."
      ],
      
      dataSharing: "4. مشاركة البيانات مع طرف ثالث",
      sharingDesc: "قد نشارك بيانات محدودة مع مزودي خدمات طرف ثالث (مثل Google) لأغراض الإعلان، التحليل، والاستضافة. هذه الجهات ملزمة بالالتزام بسياسات الخصوصية الخاصة بها.",
      
      controlOptions: "5. التحكم والخيارات",
      controlPoints: [
        "يمكنك تعطيل الكوكيز من إعدادات المتصفح، لكن قد يؤثر ذلك على بعض وظائف الموقع.",
        "للحد من تتبع الإعلانات المخصصة، يمكنك زيارة صفحة إعدادات الإعلانات في Google وإدارة تفضيلاتك.",
        "للحد من تتبع Google Analytics، يمكنك استخدام إضافات مانعة للتتبع أو تثبيت أداة تعطيل Google Analytics الموفرة من جوجل."
      ],
      
      dataRetention: "6. حفظ البيانات",
      retentionDesc: "نحتفظ بالبيانات بالمدة اللازمة لتحقيق الأغراض المبيّنة في هذه السياسة أو للامتثال للالتزامات القانونية. عند انتهاء الحاجة، نعمل على حذف أو إخفاء البيانات بشكل آمن.",
      
      externalLinks: "7. روابط لمواقع أخرى",
      linksDesc: "قد يحتوي الموقع على روابط لمواقع أخرى لا تتحكم فيها booksummarizer.net. ننصح بمراجعة سياسات الخصوصية لتلك المواقع عند الزيارة.",
      
      policyChanges: "8. التغييرات على سياسة الخصوصية",
      changesDesc: "قد نحدّث هذه السياسة من وقت لآخر. سنعلن عن التحديثات المهمة عبر الموقع أو قنوات التواصل المرتبطة.",
      
      contact: "9. تواصل معنا",
      contactDesc: "لو عندك أي استفسار أو رغبت في طلب حذف بياناتك أو تعديلها، تواصل معنا عبر صفحة 'تواصل معنا' أو أرسل رسالة إلى:",
      
      lastUpdated: "آخر تحديث:"
    }
  };

  const currentContent = content[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      <div className="pt-32 pb-20 px-4">
        <div className={`max-w-4xl mx-auto ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {currentContent.title}
          </h1>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div 
              className={`prose prose-invert max-w-none ${
                lang === 'ar' ? 'prose-rtl' : 'prose-ltr'
              }`}
            >
              <p dangerouslySetInnerHTML={{ __html: currentContent.welcome }} />

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-300">
                {currentContent.infoWeCollect}
              </h2>
              <ul className="space-y-2">
                <li dangerouslySetInnerHTML={{ __html: currentContent.voluntaryData }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.usageData }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.cookies }} />
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-300">
                {currentContent.googleServices}
              </h2>
              <p>{currentContent.googleServicesDesc}</p>
              <ul className="space-y-3 mt-4">
                <li dangerouslySetInnerHTML={{ __html: currentContent.analytics }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.adsense }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.tagManager }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.recaptcha }} />
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-300">
                {currentContent.dataUsage}
              </h2>
              <ul className="space-y-2">
                {currentContent.usagePoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-300">
                {currentContent.dataSharing}
              </h2>
              <p>{currentContent.sharingDesc}</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-300">
                {currentContent.controlOptions}
              </h2>
              <ul className="space-y-2">
                {currentContent.controlPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-300">
                {currentContent.dataRetention}
              </h2>
              <p>{currentContent.retentionDesc}</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-300">
                {currentContent.externalLinks}
              </h2>
              <p>{currentContent.linksDesc}</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-300">
                {currentContent.policyChanges}
              </h2>
              <p>{currentContent.changesDesc}</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-300">
                {currentContent.contact}
              </h2>
              <p>
                {currentContent.contactDesc}{' '}
                <a 
                  href="mailto:info@booksummarizer.net" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  info@booksummarizer.net
                </a>
              </p>

              <hr className="my-8 border-gray-600" />
              
              <p className="text-sm text-gray-400">
                {currentContent.lastUpdated} {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
              </p>
            </div>
          </div>
        </div>
      </div>

 
    </div>
  );
};

export default PrivacyPolicy;