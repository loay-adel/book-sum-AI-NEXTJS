import React from "react";
import Header from "@/components/Header";

const PrivacyPolicyClient = ({ lang = "en", dictionary }) => {
  // Static content as fallback
  const staticContent = {
    en: {
      title: "Privacy Policy & Terms of Use",
      welcome: `Welcome to <strong>booksummarizer.net</strong>. We respect your privacy and are committed to protecting user data. 
      This policy explains the type of information we collect, the legal basis for processing your data, how we use it, 
      how long we keep it, and the rights you have as a user. By using this website, you agree to all terms stated here.`,

      // Sections
      termsOfUse: "1. Terms of Use",
      acceptance: "<strong>Acceptance of Terms:</strong> By accessing or using our website, you agree to be bound by these Terms of Use. If you disagree with any part, you may not use our services.",
      eligibility: "<strong>Eligibility:</strong> You must be at least 16 years old to use our services. By using our website, you represent that you meet this age requirement.",
      accountResponsibility: "<strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
      acceptableUse: "Acceptable Use: You agree not to:",
      acceptableUsePoints: [
        "Use our service for any illegal purpose",
        "Attempt to gain unauthorized access to our systems",
        "Interfere with or disrupt the service",
        "Upload malicious code or viruses",
        "Use automated systems to access our service without permission"
      ],
      contentOwnership: "Content Ownership & Intellectual Property:",
      contentOwnershipDesc: "All content on this website, including text, graphics, logos, and software, is our property or licensed to us. You may not reproduce, distribute, or create derivative works without permission.",

      aiGeneratedContent: "2. AI-Generated Content Policy",
      aiNature: "<strong>Nature of AI Content:</strong> Our book summaries are generated using artificial intelligence (OpenAI technology). These are interpretations and should not be considered exact reproductions of the original works.",
      accuracyDisclaimer: "<strong>Accuracy Disclaimer:</strong> While we strive for accuracy, AI-generated content may contain errors or omissions. Summaries are for educational and informational purposes only.",
      notReplacement: "<strong>Not a Replacement:</strong> Our summaries are not substitutes for reading the original books. They are intended to provide insights and overviews.",
      openAIAttribution: "<strong>OpenAI Attribution:</strong> Summaries are generated using OpenAI's language models. We acknowledge OpenAI's technology but claim no affiliation with OpenAI beyond using their API services.",
      liabilityLimitation: "<strong>Limitation of Liability:</strong> We are not liable for any decisions made based on AI-generated content. Users should verify important information from original sources.",

      bookCopyrights: "3. Book Copyrights & Fair Use",
      fairUsePolicy: "<strong>Fair Use Policy:</strong> We operate under the doctrine of fair use for educational and transformative purposes. Our summaries:",
      fairUsePoints: [
        "Are transformative works that provide analysis and commentary",
        "Use only limited portions of original works",
        "Do not substitute for purchasing or reading original books",
        "Add significant educational value through AI analysis",
        "Do not negatively impact the market value of original works"
      ],
      copyrightRespect: "<strong>Copyright Respect:</strong> We respect intellectual property rights. If you are a copyright owner and believe your work has been used in a way that constitutes infringement, contact us immediately.",
      dmcaProcedure: "<strong>DMCA Compliance:</strong> We comply with the Digital Millennium Copyright Act. Copyright infringement claims can be sent to our designated agent at <strong>copyright@booksummarizer.net</strong>.",
      attribution: "<strong>Attribution:</strong> We properly attribute book titles, authors, and publishers when information is available. Summaries include clear disclaimers about their AI-generated nature.",

      infoWeCollect: "4. Information We Collect",
      voluntaryData: "<strong>Voluntary Data:</strong> Such as name, username, or email address when creating an account, contacting us, or using interactive features.",
      usageData: "<strong>Usage Data:</strong> Includes device type, browser information, pages visited, time spent, referring links, and anonymized IP addresses.",
      cookies: "<strong>Cookies:</strong> Cookies help us remember preferences, enhance performance, improve loading speed, analyze behavior, and personalize ads.",

      googleServices: "5. Use of Third-Party Services",
      googleServicesDesc: "We integrate several trusted external tools to ensure smooth operation, analytics, and advertising:",
      analytics: "<strong>Google Analytics:</strong> Used to track website usage, visitor flow, bounce rates, and engagement trends.",
      adsense: "<strong>Google AdSense:</strong> May display personalized ads based on interest categories. We use non-intrusive ad placements.",
      tagManager: "<strong>Google Tag Manager:</strong> Helps manage tracking scripts securely without modifying code manually.",
      recaptcha: "<strong>Google reCAPTCHA:</strong> Protects the website from bots, spam, and automated abuse.",
      cloudflare: "<strong>Cloudflare:</strong> Provides security and content delivery services.",
      hosting: "<strong>Hosting Providers:</strong> Our website is hosted on secure servers with appropriate data protection measures.",

      dataUsage: "6. How We Use Your Data",
      usagePoints: [
        "To improve content quality, platform performance, and user experience",
        "To ensure website security and monitor suspicious activities",
        "To adapt summaries, recommendations, and search features to user needs",
        "To run advertisements and analytics tools legally and ethically",
        "To respond to inquiries and provide technical support",
        "To develop new features based on user behavior patterns"
      ],

      dataSharing: "7. Data Sharing & Third Parties",
      sharingDesc: `We do not sell personal data. Limited data may be shared with trusted third-party service providers 
      under strict contractual privacy obligations. These include:`,
      thirdParties: [
        "Analytics providers (Google Analytics)",
        "Advertising networks (Google AdSense)",
        "Cloud service providers (AWS, Vercel)",
        "Security services (Cloudflare)",
        "Email service providers"
      ],
      legalDisclosure: "<strong>Legal Disclosure:</strong> We may disclose information if required by law or to protect our rights, users, or the public.",

      legalBasis: "8. Legal Basis for Processing (GDPR–Compliant)",
      legalBasisDesc: `We process user data based on one or more of the following legal grounds:`,
      legalGrounds: [
        "<strong>Consent:</strong> When you voluntarily provide data or accept cookies",
        "<strong>Contractual Necessity:</strong> To provide services you requested",
        "<strong>Legitimate Interests:</strong> To improve website security, functionality, and user experience",
        "<strong>Legal Obligations:</strong> To comply with applicable laws and regulations"
      ],

      userRights: "9. Your Rights (GDPR & CCPA)",
      rightsDesc: "Depending on your location, you may have the following rights:",
      rightsList: [
        "<strong>Right to Access:</strong> Request a copy of your personal data",
        "<strong>Right to Rectification:</strong> Correct inaccurate or incomplete data",
        "<strong>Right to Erasure:</strong> Request deletion of your data (Right to be Forgotten)",
        "<strong>Right to Restriction:</strong> Limit how we use your data",
        "<strong>Right to Data Portability:</strong> Receive your data in a structured format",
        "<strong>Right to Object:</strong> Object to certain processing activities",
        "<strong>Right to Opt-Out:</strong> Opt out of data sales (CCPA)"
      ],
      exerciseRights: "To exercise these rights, contact us at <strong>privacy@booksummarizer.net</strong>. We will respond within 30 days.",

      controlOptions: "10. Control Options",
      controlPoints: [
        "Disable cookies through browser settings",
        "Use browser extensions to block tracking",
        "Adjust ad personalization through Google Ads Settings",
        "Use incognito/private browsing modes",
        "Clear browser cache and cookies regularly"
      ],

      dataRetention: "11. Data Retention",
      retentionDesc: `We retain data only for the period required to fulfill legitimate purposes:`,
      retentionPeriods: [
        "Account data: Retained while account is active, deleted upon request",
        "Usage data: Anonymized after 14 months",
        "Contact information: Retained for 2 years after last contact",
        "Server logs: Rotated every 30 days",
        "Backup data: Encrypted and rotated every 90 days"
      ],

      security: "12. Data Security",
      securityDesc: `We implement comprehensive security measures:`,
      securityMeasures: [
        "SSL/TLS encryption for data transmission",
        "Regular security audits and vulnerability testing",
        "Access controls and authentication protocols",
        "Secure data storage with encryption at rest",
        "Employee training on data protection"
      ],
      breachProtocol: "<strong>Data Breach Protocol:</strong> In the event of a data breach, we will notify affected users and authorities within 72 hours as required by GDPR.",

      childrenPrivacy: "13. Children's Privacy",
      childrenDesc: "Our service is not directed to children under 16. We do not knowingly collect data from children. If we learn we have collected such data, we will delete it promptly.",

      externalLinks: "14. External Links",
      linksDesc: "Our website may include links to external websites. We are not responsible for their content, privacy practices, or terms of use. We recommend reviewing their policies.",

      internationalTransfer: "15. International Data Transfers",
      transferDesc: "We operate globally and may transfer data to countries with different data protection laws. We use Standard Contractual Clauses (SCCs) and other safeguards for international transfers.",

      policyChanges: "16. Policy Updates",
      changesDesc: "We may update this policy periodically. Significant changes will be announced on this page with a clear update date. Continued use after changes constitutes acceptance.",
      notificationMethod: "We encourage users to review this policy regularly for updates.",

      contact: "17. Contact Information",
      contactDesc: "For privacy concerns, copyright issues, or data requests, contact us:",
      dataProtectionOfficer: "<strong>Data Protection Officer:</strong>",
      email: "Email: privacy@booksummarizer.net",
      postal: "Postal: [Your Business Address Here]",
      responseTime: "We aim to respond within 7 business days.",

      governingLaw: "18. Governing Law & Dispute Resolution",
      governingDesc: "These terms are governed by the laws of [Your Jurisdiction]. Disputes will be resolved through binding arbitration rather than court proceedings.",
      arbitration: "<strong>Arbitration Agreement:</strong> By using our service, you agree to resolve disputes through arbitration, waiving rights to class actions.",

      disclaimer: "19. General Disclaimer",
      disclaimerDesc: "Our service is provided 'as is' without warranties. We are not liable for:",
      disclaimerPoints: [
        "Accuracy of AI-generated content",
        "Availability or uptime of the service",
        "Third-party content or links",
        "Decisions made based on our summaries",
        "Indirect or consequential damages"
      ],

      lastUpdated: "Last updated:",
      effectiveDate: "Effective Date:"
    },

    ar: {
      title: "سياسة الخصوصية وشروط الاستخدام",
      welcome: `مرحبًا بك في <strong>booksummarizer.net</strong>. نحن نحترم خصوصيتك ونحرص على حماية بياناتك. 
      توضح هذه السياسة أنواع البيانات التي نجمعها، والأساس القانوني لمعالجتها، وكيف نستخدمها، 
      ومدة الاحتفاظ بها، وما هي حقوقك كمستخدم. استخدامك للموقع يعني موافقتك على جميع الشروط الواردة هنا.`,

      // Sections
      termsOfUse: "1. شروط الاستخدام",
      acceptance: "<strong>قبول الشروط:</strong> باستخدامك للموقع، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي جزء، لا تستخدم خدماتنا.",
      eligibility: "<strong>الأهلية:</strong> يجب أن يكون عمرك 16 عامًا على الأقل لاستخدام خدماتنا. باستخدام الموقع، تؤكد أنك تستوفي هذا الشرط.",
      accountResponsibility: "<strong>مسؤولية الحساب:</strong> أنت مسؤول عن الحفاظ على سرية بيانات حسابك وجميع الأنشطة تحت حسابك.",
      acceptableUse: "<strong>الاستخدام المقبول:</strong> توافق على عدم:",
      acceptableUsePoints: [
        "استخدام الخدمة لأي غرض غير قانوني",
        "محاولة الوصول غير المصرح به لأنظمتنا",
        "التدخل في الخدمة أو تعطيلها",
        "تحميل أكواد ضارة أو فيروسات",
        "استخدام أنظمة آلية للوصول إلى الخدمة دون إذن"
      ],
      contentOwnership: "<strong>ملكية المحتوى والملكية الفكرية:</strong>",
      contentOwnershipDesc: "جميع المحتويات على الموقع ملك لنا أو مرخصة لنا. لا يمكنك نسخها أو توزيعها أو إنشاء أعمال مشتقة دون إذن.",

      aiGeneratedContent: "2. سياسة المحتوى المولد بالذكاء الاصطناعي",
      aiNature: "<strong>طبيعة المحتوى الذكي:</strong> ملخصات الكتب لدينا يتم إنشاؤها باستخدام الذكاء الاصطناعي (تقنية OpenAI). هذه هي تفسيرات ولا تعتبر نسخًا طبق الأصل من الأعمال الأصلية.",
      accuracyDisclaimer: "<strong>إخلاء مسؤولية الدقة:</strong> بينما نسعى للدقة، قد يحتوي المحتوى المولد بالذكاء الاصطناعي على أخطاء أو أوجه قصور. الملخصات للأغراض التعليمية والإعلامية فقط.",
      notReplacement: "<strong>ليست بديلاً:</strong> ملخصاتنا ليست بديلاً عن قراءة الكتب الأصلية. تهدف إلى تقديم رؤى ونظرات عامة.",
      openAIAttribution: "<strong>الإسناد لـ OpenAI:</strong> يتم إنشاء الملخصات باستخدام نماذج لغة OpenAI. نقر بتقنية OpenAI ولكننا لا ندعي أي انتماء لـ OpenAI باستثناء استخدام خدمات API الخاصة بهم.",
      liabilityLimitation: "<strong>تقييد المسؤولية:</strong> نحن لسنا مسؤولين عن أي قرارات تتخذ بناءً على محتوى الذكاء الاصطناعي. يجب على المستخدمين التحقق من المعلومات المهمة من المصادر الأصلية.",

      bookCopyrights: "3. حقوق النشر للكتب والاستخدام العادل",
      fairUsePolicy: "<strong>سياسة الاستخدام العادل:</strong> نعمل تحت مبدأ الاستخدام العادل للأغراض التعليمية والتحويلية. ملخصاتنا:",
      fairUsePoints: [
        "هي أعمال تحويلية توفر التحليل والتعليق",
        "تستخدم أجزاء محدودة فقط من الأعمال الأصلية",
        "لا تحل محل شراء أو قراءة الكتب الأصلية",
        "تضيف قيمة تعليمية كبيرة من خلال تحليل الذكاء الاصطناعي",
        "لا تؤثر سلبًا على القيمة السوقية للأعمال الأصلية"
      ],
      copyrightRespect: "<strong>احترام حقوق النشر:</strong> نحترم حقوق الملكية الفكرية. إذا كنت مالك حقوق النشر وتعتقد أن عملك قد تم استخدامه بطريقة تشكل انتهاكًا، اتصل بنا فورًا.",
      dmcaProcedure: "<strong>الامتثال لـ DMCA:</strong> نلتزم بقانون الألفية للملكية الرقمية. يمكن إرسال مطالبات انتهاك حقوق النشر إلى وكيلنا المعين على <strong>copyright@booksummarizer.net</strong>.",
      attribution: "<strong>الإسناد:</strong> ننسب عناوين الكتب والمؤلفين والناشرين بشكل صحيح عند توفر المعلومات. تحتوي الملخصات على إخلاء مسؤولية واضح حول طبيعتها المولدة بالذكاء الاصطناعي.",

      infoWeCollect: "4. المعلومات التي نجمعها",
      voluntaryData: "<strong>البيانات المقدمة طوعًا:</strong> مثل الاسم أو الإيميل عند التسجيل أو التواصل معنا.",
      usageData: "<strong>بيانات الاستخدام:</strong> نوع الجهاز، نوع المتصفح، الصفحات التي تمت زيارتها، مدة البقاء، الروابط المحوّلة، وعنوان IP بعد إخفاء جزء منه.",
      cookies: "<strong>ملفات الارتباط (Cookies):</strong> تستخدم لتحسين الأداء، تسريع التحميل، التحليل الإحصائي، وتخصيص الإعلانات.",

      googleServices: "5. استخدام خدمات الطرف الثالث",
      googleServicesDesc: "قد نستخدم الخدمات التالية لضمان تشغيل الموقع بكفاءة:",
      analytics: "<strong>Google Analytics:</strong> لتحليل التفاعل وسلوك الزوار.",
      adsense: "<strong>Google AdSense:</strong> لعرض إعلانات قد تكون مخصّصة حسب الاهتمامات. نستخدم إعلانات غير متطفلة.",
      tagManager: "<strong>Google Tag Manager:</strong> لإدارة الأكواد الخاصة بالتحليلات والإعلانات بأمان.",
      recaptcha: "<strong>reCAPTCHA:</strong> للحماية من الروبوتات والبريد العشوائي.",
      cloudflare: "<strong>Cloudflare:</strong> يوفر خدمات الأمان وتوصيل المحتوى.",
      hosting: "<strong>مزودي الاستضافة:</strong> يتم استضافة موقعنا على خوادم آمنة مع تدابير حماية بيانات مناسبة.",

      dataUsage: "6. كيفية استخدام البيانات",
      usagePoints: [
        "تحسين جودة المحتوى وتجربة المستخدم",
        "حماية الموقع ومراقبة الأنشطة المشبوهة",
        "تشغيل الإعلانات والتحليلات بشكل قانوني ومنضبط",
        "الرد على الاستفسارات وتقديم الدعم الفني",
        "تطوير ميزات جديدة بناءً على سلوك المستخدم",
        "تخصيص التوصيات وميزات البحث لاحتياجات المستخدم"
      ],

      dataSharing: "7. مشاركة البيانات والجهات الخارجية",
      sharingDesc: `لا نقوم ببيع بيانات المستخدم. قد نشارك بيانات محدودة مع جهات موثوقة تحت التزامات خصوصية تعاقدية صارمة. تشمل هذه:`,
      thirdParties: [
        "مزودي التحليلات (Google Analytics)",
        "شبكات الإعلانات (Google AdSense)",
        "مزودي خدمات السحابة (AWS, Vercel)",
        "خدمات الأمان (Cloudflare)",
        "مزودي خدمات البريد الإلكتروني"
      ],
      legalDisclosure: "<strong>الكشف القانوني:</strong> قد نكشف عن المعلومات إذا طلب القانون أو لحماية حقوقنا أو مستخدمينا أو الجمهور.",

      legalBasis: "8. الأساس القانوني للمعالجة (متوافق مع GDPR)",
      legalBasisDesc: `نعالج بيانات المستخدم بناءً على واحد أو أكثر من الأسس القانونية التالية:`,
      legalGrounds: [
        "<strong>الموافقة:</strong> عند تقديمك للبيانات طواعية أو قبول ملفات الارتباط",
        "<strong>الضرورة التعاقدية:</strong> لتقديم الخدمات التي طلبتها",
        "<strong>المصالح المشروعة:</strong> لتحسين أمان الموقع ووظائفه وتجربة المستخدم",
        "<strong>الالتزامات القانونية:</strong> للامتثال للقوانين واللوائح المعمول بها"
      ],

      userRights: "9. حقوقك (GDPR و CCPA)",
      rightsDesc: "حسب موقعك، قد تكون لديك الحقوق التالية:",
      rightsList: [
        "<strong>حق الوصول:</strong> طلب نسخة من بياناتك الشخصية",
        "<strong>حق التصحيح:</strong> تصحيح البيانات غير الدقيقة أو غير الكاملة",
        "<strong>حق المسح:</strong> طلب حذف بياناتك (الحق في النسيان)",
        "<strong>حق التقييد:</strong> تقييد كيفية استخدامنا لبياناتك",
        "<strong>حق نقل البيانات:</strong> استلام بياناتك بتنسيق منظم",
        "<strong>حق الاعتراض:</strong> الاعتراض على أنشطة معالجة معينة",
        "<strong>حق الانسحاب:</strong> الانسحاب من بيع البيانات (CCPA)"
      ],
      exerciseRights: "لممارسة هذه الحقوق، اتصل بنا على <strong>privacy@booksummarizer.net</strong>. سنجيب خلال 30 يومًا.",

      controlOptions: "10. خيارات التحكم",
      controlPoints: [
        "تعطيل ملفات الارتباط من إعدادات المتصفح",
        "استخدام إضافات المتصفح لحجب التتبع",
        "ضبط تخصيص الإعلانات من خلال إعدادات Google للإعلانات",
        "استخدام وضع التصفح المتخفي/الخاص",
        "مسح ذاكرة التخزين المؤقت وملفات الارتباط بانتظام"
      ],

      dataRetention: "11. مدة الاحتفاظ بالبيانات",
      retentionDesc: `نحتفظ بالبيانات فقط للمدة المطلوبة لتحقيق الأغراض المشروعة:`,
      retentionPeriods: [
        "بيانات الحساب: محتفظ بها أثناء نشاط الحساب، تحذف عند الطلب",
        "بيانات الاستخدام: يتم إخفاء هويتها بعد 14 شهرًا",
        "معلومات الاتصال: محتفظ بها لمدة سنتين بعد آخر اتصال",
        "سجلات الخادم: يتم تدويرها كل 30 يومًا",
        "بيانات النسخ الاحتياطي: مشفرة وتدوير كل 90 يومًا"
      ],

      security: "12. أمن البيانات",
      securityDesc: `نطبق إجراءات أمنية شاملة:`,
      securityMeasures: [
        "تشفير SSL/TLS لنقل البيانات",
        "مراجعات أمنية منتظمة واختبار الثغرات",
        "ضوابط الوصول وبروتوكولات المصادقة",
        "تخزين بيانات آمن مع تشفير في حالة السكون",
        "تدريب الموظفين على حماية البيانات"
      ],
      breachProtocol: "<strong>بروتوكول خرق البيانات:</strong> في حالة حدوث خرق للبيانات، سنخطر المستخدمين المتأثرين والسلطات خلال 72 ساعة كما يتطلب GDPR.",

      childrenPrivacy: "13. خصوصية الأطفال",
      childrenDesc: "خدمتنا غير موجهة للأطفال دون 16 عامًا. لا نجمع بيانات من الأطفال عن علم. إذا علمنا أننا جمعنا مثل هذه البيانات، فسنحذفها على الفور.",

      externalLinks: "14. روابط خارجية",
      linksDesc: "قد يحتوي الموقع على روابط لمواقع أخرى. نحن لسنا مسؤولين عن محتواها أو ممارسات الخصوصية أو شروط الاستخدام الخاصة بها. نوصي بمراجعة سياساتهم.",

      internationalTransfer: "15. نقل البيانات الدولية",
      transferDesc: "نعمل عالميًا وقد ننقل البيانات إلى دول ذات قوانين حماية بيانات مختلفة. نستخدم البنود التعاقدية القياسية (SCCs) وضمانات أخرى للتحويلات الدولية.",

      policyChanges: "16. تحديثات السياسة",
      changesDesc: "قد نقوم بتحديث هذه السياسة بشكل دوري. سيتم الإعلان عن التغييرات المهمة في هذه الصفحة مع تاريخ تحديث واضح. الاستمرار في الاستخدام بعد التغييرات يعني القبول.",
      notificationMethod: "نشجع المستخدمين على مراجعة هذه السياسة بانتظام للحصول على التحديثات.",

      contact: "17. معلومات الاتصال",
      contactDesc: "لمخاوف الخصوصية، أو قضايا حقوق النشر، أو طلبات البيانات، اتصل بنا:",
      dataProtectionOfficer: "<strong>مسؤول حماية البيانات:</strong>",
      email: "البريد الإلكتروني: privacy@booksummarizer.net",
      postal: "العنوان البريدي: [عنوان عملك هنا]",
      responseTime: "نسعى للرد خلال 7 أيام عمل.",

      governingLaw: "18. القانون الحاكم وتسوية المنازعات",
      governingDesc: "تخضع هذه الشروط لقوانين [ولايتك القضائية هنا]. سيتم حل النزاعات من خلال التحكيم الملزم بدلاً من إجراءات المحكمة.",
      arbitration: "<strong>اتفاقية التحكيم:</strong> باستخدامك لخدمتنا، فإنك توافق على حل النزاعات من خلال التحكيم، وتتنازل عن الحقوق في الدعاوى الجماعية.",

      disclaimer: "19. إخلاء مسؤولية عام",
      disclaimerDesc: "تقدم خدمتنا 'كما هي' دون ضمانات. نحن لسنا مسؤولين عن:",
      disclaimerPoints: [
        "دقة المحتوى المولد بالذكاء الاصطناعي",
        "توفر الخدمة أو وقت التشغيل",
        "محتوى أو روابط الطرف الثالث",
        "القرارات المتخذة بناءً على ملخصاتنا",
        "الأضرار غير المباشرة أو التبعية"
      ],

      lastUpdated: "آخر تحديث:",
      effectiveDate: "تاريخ النفاذ:"
    }
  };

  // Use passed dictionary or fallback to static content
  const currentContent = dictionary?.privacy || staticContent[lang] || staticContent.en;

  const renderSection = (title, content, isList = false, isDangerousHTML = false) => (
    <>
      <h2 className="text-xl font-bold mt-8 mb-4 text-blue-300 border-b border-gray-700 pb-2">
        {title}
      </h2>
      {isDangerousHTML ? (
        <p dangerouslySetInnerHTML={{ __html: content }} className="mb-4" />
      ) : isList ? (
        <ul className="list-disc pl-5 mb-4 space-y-2">
          {content.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      ) : (
        <p className="mb-4">{content}</p>
      )}
    </>
  );

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Header lang={lang} />

      <div className="pt-32 pb-20 px-4">
        <div className={`max-w-5xl mx-auto ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {currentContent.title}
          </h1>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-xl">
            <div className={`prose prose-invert max-w-none ${lang === 'ar' ? 'prose-rtl' : 'prose-ltr'}`}>
              
              {/* Introduction */}
              <p 
                className="text-lg leading-relaxed mb-8 p-4 bg-gray-900/30 rounded-lg border-l-4 border-blue-500"
                dangerouslySetInnerHTML={{ __html: currentContent.welcome }}
              />

              {/* Terms of Use */}
              {renderSection(currentContent.termsOfUse, currentContent.acceptance, false, true)}
              {renderSection("", currentContent.eligibility, false, true)}
              {renderSection("", currentContent.accountResponsibility, false, true)}
              <p className="font-semibold mb-2">{currentContent.acceptableUse}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                {currentContent.acceptableUsePoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className="font-semibold mb-2">{currentContent.contentOwnership}</p>
              <p>{currentContent.contentOwnershipDesc}</p>

              {/* AI-Generated Content Policy */}
              {renderSection(currentContent.aiGeneratedContent, currentContent.aiNature, false, true)}
              {renderSection("", currentContent.accuracyDisclaimer, false, true)}
              {renderSection("", currentContent.notReplacement, false, true)}
              {renderSection("", currentContent.openAIAttribution, false, true)}
              {renderSection("", currentContent.liabilityLimitation, false, true)}

              {/* Book Copyrights & Fair Use */}
              {renderSection(currentContent.bookCopyrights, currentContent.fairUsePolicy, false, true)}
              <ul className="list-disc pl-5 mb-4 space-y-2">
                {currentContent.fairUsePoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              {renderSection("", currentContent.copyrightRespect, false, true)}
              {renderSection("", currentContent.dmcaProcedure, false, true)}
              {renderSection("", currentContent.attribution, false, true)}

              {/* Information Collection */}
              {renderSection(currentContent.infoWeCollect, currentContent.voluntaryData, false, true)}
              {renderSection("", currentContent.usageData, false, true)}
              {renderSection("", currentContent.cookies, false, true)}

              {/* Third-Party Services */}
              {renderSection(currentContent.googleServices, currentContent.googleServicesDesc)}
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li dangerouslySetInnerHTML={{ __html: currentContent.analytics }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.adsense }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.tagManager }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.recaptcha }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.cloudflare }} />
                <li dangerouslySetInnerHTML={{ __html: currentContent.hosting }} />
              </ul>

              {/* Data Usage */}
              {renderSection(currentContent.dataUsage, currentContent.usagePoints, true)}

              {/* Data Sharing */}
              {renderSection(currentContent.dataSharing, currentContent.sharingDesc)}
              <p className="mb-2">{currentContent.thirdParties?.join(", ")}</p>
              {renderSection("", currentContent.legalDisclosure, false, true)}

              {/* Legal Basis */}
              {renderSection(currentContent.legalBasis, currentContent.legalBasisDesc)}
              <ul className="list-disc pl-5 mb-4 space-y-2">
                {currentContent.legalGrounds?.map((ground, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: ground }} />
                ))}
              </ul>

              {/* User Rights */}
              {renderSection(currentContent.userRights, currentContent.rightsDesc)}
              <ul className="list-disc pl-5 mb-4 space-y-2">
                {currentContent.rightsList?.map((right, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: right }} />
                ))}
              </ul>
              <p dangerouslySetInnerHTML={{ __html: currentContent.exerciseRights }} />

              {/* Control Options */}
              {renderSection(currentContent.controlOptions, currentContent.controlPoints, true)}

              {/* Data Retention */}
              {renderSection(currentContent.dataRetention, currentContent.retentionDesc)}
              <ul className="list-disc pl-5 mb-4 space-y-2">
                {currentContent.retentionPeriods?.map((period, index) => (
                  <li key={index}>{period}</li>
                ))}
              </ul>

              {/* Security */}
              {renderSection(currentContent.security, currentContent.securityDesc)}
              <ul className="list-disc pl-5 mb-4 space-y-2">
                {currentContent.securityMeasures?.map((measure, index) => (
                  <li key={index}>{measure}</li>
                ))}
              </ul>
              {renderSection("", currentContent.breachProtocol, false, true)}

              {/* Children's Privacy */}
              {renderSection(currentContent.childrenPrivacy, currentContent.childrenDesc)}

              {/* External Links */}
              {renderSection(currentContent.externalLinks, currentContent.linksDesc)}

              {/* International Transfers */}
              {renderSection(currentContent.internationalTransfer, currentContent.transferDesc)}

              {/* Policy Updates */}
              {renderSection(currentContent.policyChanges, currentContent.changesDesc)}
              <p>{currentContent.notificationMethod}</p>

              {/* Contact Information */}
              {renderSection(currentContent.contact, currentContent.contactDesc)}
              <p dangerouslySetInnerHTML={{ __html: currentContent.dataProtectionOfficer }} />
              <p>{currentContent.email}</p>
              <p>{currentContent.postal}</p>
              <p>{currentContent.responseTime}</p>

              {/* Governing Law */}
              {renderSection(currentContent.governingLaw, currentContent.governingDesc)}
              {renderSection("", currentContent.arbitration, false, true)}

              {/* Disclaimer */}
              {renderSection(currentContent.disclaimer, currentContent.disclaimerDesc)}
              <ul className="list-disc pl-5 mb-8 space-y-2">
                {currentContent.disclaimerPoints?.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>

              <hr className="my-8 border-gray-600" />
              
              <div className="flex flex-wrap justify-between text-sm text-gray-400">
                <div>
                  <p>
                    {currentContent.lastUpdated}{" "}
                    {new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p>
                    {currentContent.effectiveDate}{" "}
                    {new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                <p className="text-center text-gray-300">
                  <strong>{lang === 'ar' ? 'ملاحظة:' : 'Note:'}</strong>{" "}
                  {lang === 'ar' 
                    ? 'هذا المستند مرخص تحت رخصة المشاع الإبداعي ويخضع للتحديثات الدورية. للتأكد من حصولك على أحدث نسخة، يرجى زيارة هذه الصفحة بانتظام.'
                    : 'This document is licensed under Creative Commons and subject to periodic updates. To ensure you have the latest version, please visit this page regularly.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyClient;