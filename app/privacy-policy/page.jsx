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
      welcome: `Welcome to <strong>booksummarizer.net</strong>. We respect your privacy and are committed to protecting user data. 
      This policy explains in detail the type of information we collect, the legal basis for processing your data, how we use it, 
      how long we keep it, and the rights you have as a user. By using this website, you agree to the practices stated in this policy.`,

      infoWeCollect: "1. Information We Collect",
      voluntaryData: "<strong>Voluntary Data:</strong> Such as name, username, or email address when creating an account, contacting us, or using any interactive feature.",
      usageData: "<strong>Usage Data:</strong> Includes device type, browser information, pages visited, time spent, referring links, and anonymized IP.",
      cookies: "<strong>Cookies:</strong> Cookies help us remember preferences, enhance performance, improve loading speed, analyze behavior, and personalize ads.",

      googleServices: "2. Use of Google Services",
      googleServicesDesc: "We integrate several trusted external tools to ensure smooth operation, analytics, and advertising:",
      analytics: "<strong>Google Analytics:</strong> Used to track website usage, visitor flow, bounce rates, and engagement trends.",
      adsense: "<strong>Google AdSense or other ad networks:</strong> May display personalized ads based on interest categories.",
      tagManager: "<strong>Google Tag Manager:</strong> Helps manage tracking scripts securely without modifying the code manually.",
      recaptcha: "<strong>Google reCAPTCHA:</strong> Protects the website from bots, spam, and automated abuse.",

      dataUsage: "3. How We Use Your Data",
      usagePoints: [
        "To improve content quality, platform performance, and user experience.",
        "To ensure website security and monitor suspicious activities.",
        "To adapt summaries, recommendations, and search features to user needs.",
        "To run advertisements and analytics tools legally and ethically.",
        "To respond to inquiries and provide technical support."
      ],

      dataSharing: "4. Data Sharing",
      sharingDesc: `We do not sell personal data. Limited data may be shared with trusted third-party service providers 
      such as Google, hosting companies, or analytics services. These parties follow strict contractual privacy obligations.`,

      legalBasis: "5. Legal Basis for Processing (GDPR–Compliant)",
      legalBasisDesc: `
        We process user data based on one or more of the following:
        • Consent (when you voluntarily provide data or accept cookies)
        • Legitimate interest to improve website security and functionality
        • Compliance with legal obligations
      `,

      controlOptions: "6. Your Rights and Control Options",
      controlPoints: [
        "You may disable cookies at any time through browser settings.",
        "You may request access, correction, or deletion of your personal data.",
        "You may withdraw consent for data processing when applicable.",
        "You may opt out of personalized ads through Google Ads Settings.",
        "You may prevent Google Analytics tracking using official browser add-ons."
      ],

      dataRetention: "7. Data Retention",
      retentionDesc: `We retain data only for the period required to fulfill legitimate purposes such as security, 
      analytics, and technical operation. When data is no longer needed, we delete or anonymize it safely.`,

      security: "8. Data Security",
      securityDesc: `We apply administrative, technical, and organizational safety measures to protect data from 
      unauthorized access, alteration, or misuse. Although no system is fully immune, we prioritize user safety.`,

      externalLinks: "9. External Links",
      linksDesc: "Our website may include links to external websites. We are not responsible for their content or privacy practices.",

      policyChanges: "10. Policy Updates",
      changesDesc: "This privacy policy may be updated occasionally. Major changes will be announced on this page.",

      contact: "11. Contact Us",
      contactDesc: "If you have privacy questions or want your data removed or updated, contact us at:",
      lastUpdated: "Last updated:"
    },

    /* ------------------------------------------------------------------- */

    ar: {
      title: "سياسة الخصوصية",
      welcome: `مرحبًا بك في <strong>booksummarizer.net</strong>. نحن نحترم خصوصيتك ونحرص على حماية بياناتك. 
      توضح هذه السياسة بشكل تفصيلي أنواع البيانات التي نجمعها، والأساس القانوني لمعالجتها، وكيف نستخدمها، 
      ومدة الاحتفاظ بها، وما هي حقوقك كمستخدم. استخدامك للموقع يعني موافقتك على هذه السياسة.`,

      infoWeCollect: "1. المعلومات التي نجمعها",
      voluntaryData: "<strong>البيانات المقدمة طوعًا:</strong> مثل الاسم أو الإيميل عند التسجيل أو التواصل معنا.",
      usageData: "<strong>بيانات الاستخدام:</strong> نوع الجهاز، نوع المتصفح، الصفحات التي تمت زيارتها، مدة البقاء، الروابط المحوّلة، وعنوان IP بعد إخفاء جزء منه.",
      cookies: "<strong>ملفات الارتباط (Cookies):</strong> تستخدم لتحسين الأداء، تسريع التحميل، التحليل الإحصائي، وتخصيص الإعلانات.",

      googleServices: "2. استخدام خدمات Google",
      googleServicesDesc: "قد نستخدم الخدمات التالية لضمان تشغيل الموقع بكفاءة:",
      analytics: "<strong>Google Analytics:</strong> لتحليل التفاعل وسلوك الزوار.",
      adsense: "<strong>AdSense أو شبكات بديلة:</strong> لعرض إعلانات قد تكون مخصّصة حسب الاهتمامات.",
      tagManager: "<strong>Google Tag Manager:</strong> لإدارة الأكواد الخاصة بالتحليلات والإعلانات بأمان.",
      recaptcha: "<strong>reCAPTCHA:</strong> للحماية من الروبوتات والبريد العشوائي.",

      dataUsage: "3. كيفية استخدام البيانات",
      usagePoints: [
        "تحسين جودة المحتوى وتجربة المستخدم.",
        "حماية الموقع ومراقبة الأنشطة المشبوهة.",
        "تشغيل الإعلانات والتحليلات بشكل قانوني ومنضبط.",
        "الرد على الاستفسارات وتقديم الدعم الفني.",
        "تطوير ميزات جديدة بناءً على سلوك المستخدم."
      ],

      dataSharing: "4. مشاركة البيانات",
      sharingDesc: `لا نقوم ببيع بيانات المستخدم. قد نشارك بيانات محدودة مع جهات موثوقة مثل Google أو مزودي الاستضافة، 
      وذلك تحت التزامات قانونية صارمة لحماية الخصوصية.`,

      legalBasis: "5. الأساس القانوني لمعالجة البيانات",
      legalBasisDesc: `
        تتم معالجة البيانات بناءً على واحد أو أكثر مما يلي:
        • الموافقة الصريحة منك
        • مصلحة مشروعة لتحسين الموقع وحمايته
        • الامتثال لمتطلبات قانونية
      `,

      controlOptions: "6. حقوقك وكيف تتحكم في بياناتك",
      controlPoints: [
        "يمكنك تعطيل الكوكيز من إعدادات المتصفح.",
        "لك الحق في طلب نسخة من بياناتك أو تعديلها أو حذفها.",
        "يمكنك سحب موافقتك على معالجة البيانات في أي وقت.",
        "يمكنك إيقاف الإعلانات المخصصة من إعدادات Google.",
        "يمكنك استخدام إضافات منع التتبع لمنع Google Analytics."
      ],

      dataRetention: "7. مدة الاحتفاظ بالبيانات",
      retentionDesc: `نحتفظ بالبيانات فقط لمدة الحاجة لأغراض الأمان والتحليل وتشغيل الخدمات. 
      وبعد انتهاء الغرض، نقوم بحذفها أو إخفائها بشكل دائم.`,

      security: "8. أمن البيانات",
      securityDesc: `نطبق إجراءات أمنية تنظيمية وتقنية لمنع الوصول غير المصرح به أو سوء الاستخدام. 
      ورغم ذلك لا يمكن ضمان الأمان بنسبة 100٪ مثل أي نظام إلكتروني.`,

      externalLinks: "9. روابط خارجية",
      linksDesc: "قد يحتوي الموقع على روابط لمواقع أخرى لا نملك السيطرة عليها. ننصح بمراجعة سياسات الخصوصية الخاصة بها.",

      policyChanges: "10. التعديلات على السياسة",
      changesDesc: "قد نقوم بتحديث هذه السياسة. سيتم توضيح التغييرات في هذه الصفحة.",

      contact: "11. تواصل معنا",
      contactDesc: "لأي استفسار أو لطلب حذف أو تعديل بياناتك يمكنك التواصل عبر:",
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
            <div className={`prose prose-invert max-w-none ${lang === 'ar' ? 'prose-rtl' : 'prose-ltr'}`}>
              
              <p dangerouslySetInnerHTML={{ __html: currentContent.welcome }} />

              <h2 className="section-title">{currentContent.infoWeCollect}</h2>
              <ul>
                <li dangerouslySetInnerHTML={{ __html: currentContent.voluntaryData }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.usageData }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.cookies }} />
              </ul>

              <h2 className="section-title">{currentContent.googleServices}</h2>
              <p>{currentContent.googleServicesDesc}</p>
              <ul>
                <li dangerouslySetInnerHTML={{ __html: currentContent.analytics }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.adsense }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.tagManager }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.recaptcha }} />
              </ul>

              <h2 className="section-title">{currentContent.dataUsage}</h2>
              <ul>
                {currentContent.usagePoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>

              <h2 className="section-title">{currentContent.dataSharing}</h2>
              <p>{currentContent.sharingDesc}</p>

              <h2 className="section-title">{currentContent.legalBasis}</h2>
              <p>{currentContent.legalBasisDesc}</p>

              <h2 className="section-title">{currentContent.controlOptions}</h2>
              <ul>
                {currentContent.controlPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>

              <h2 className="section-title">{currentContent.dataRetention}</h2>
              <p>{currentContent.retentionDesc}</p>

              <h2 className="section-title">{currentContent.security}</h2>
              <p>{currentContent.securityDesc}</p>

              <h2 className="section-title">{currentContent.externalLinks}</h2>
              <p>{currentContent.linksDesc}</p>

              <h2 className="section-title">{currentContent.policyChanges}</h2>
              <p>{currentContent.changesDesc}</p>

              <h2 className="section-title">{currentContent.contact}</h2>
              <p>
                {currentContent.contactDesc}{" "}
                <a href="mailto:info@booksummarizer.net" className="text-blue-400">
                  info@booksummarizer.net
                </a>
              </p>

              <hr className="my-8 border-gray-600" />
              <p className="text-sm text-gray-400">
                {currentContent.lastUpdated}{" "}
                {new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
