import type { Lesson, Exercise } from '@/types';

export const PROFILING_LESSONS: { lesson: Lesson; exercise: Exercise }[] = [
  // ============================================================
  // 1-MODUL: Veb-saytlar va Tarmoq So‘rovlari Tahlili
  // ============================================================
  {
    lesson: {
      id: 'les-prof-1',
      moduleId: 'mod-prof-1',
      courseId: 'course-profiling',
      title: 'Brauzer DevTools: Network Tab, XHR/Fetch va JSON Oqimlari',
      slug: 'devtools-network-xhr',
      description: 'Brauzer DevTools orqali tarmoq so‘rovlarini kuzatish: Fetch/XHR filtri, Headers, Status kodlar, Payload va JSON ma’lumotlar oqimini tahlil qilish.',
      objectives: [
        'DevTools Network panelida XHR va Fetch so‘rovlarini ajrata olish',
        'Request va Response sarlavhalari (Headers) hamda Status kodlarni tahlil qilish',
        'API orqali uzatilayotgan JSON ma’lumotlar oqimini tekshirish',
      ],
      estimatedMinutes: 20,
      order: 1,
      published: true,
      content: {
        title: 'Brauzer DevTools: Network Tab, XHR/Fetch va JSON Oqimlari',
        learningObjective: 'Har qanday veb-sayt sahifani yangilamasdan server bilan qanday ma’lumot almashayotganini Network paneli orqali to‘liq ko‘rish va tahlil qilishni o‘rganish.',
        realLifeAnalogy: 'Tasavvur qiling, restorandasiz. Saytning tashqi ko‘rinishi — bu stol ustidagi menyu. DevTools Network esa oshxona eshigidagi kameralar: ofitsiant oshxonaga qanday buyurtma olib kirdi (Request), oshxona qanday taom va hisob-kitob bilan qaytib chiqdi (Response JSON) — barchasini sekundigacha ko‘rsatib turadi!',
        theory: [
          {
            type: 'heading',
            content: 'Network Paneli va XHR/Fetch So‘rovlar',
          },
          {
            type: 'text',
            content: 'Zamonaviy veb-ilovalar sahifani qayta yuklamaydi (SPA — Single Page Application). Ular brauzer orqa fonida fetch() yoki XMLHttpRequest (XHR) yordamida serverga so‘rov yuboradi. DevTools (F12) -> Network tabida «Fetch/XHR» filtrini yoqsangiz, faqat server bilan bo‘layotgan ma’lumot almashinuvlarini ko‘rasiz.',
          },
          {
            type: 'heading',
            content: 'Tahlil Qilinadigan Asosiy Qismlar',
          },
          {
            type: 'text',
            content: '1. Request URL va Method: Qaysi manzilga so‘rov ketyapti (GET, POST, PUT, DELETE).\n2. Status Code: Natija qanday bo‘ldi (200 OK, 201 Created, 401 Unauthorized, 403 Forbidden, 500 Server Error).\n3. Headers: Authorization (tokenlar), Content-Type: application/json, Origin va User-Agent.\n4. Payload: Siz yuborgan ma’lumotlar (masalan: forma yoki qidiruv so‘zi).\n5. Response (Preview): Serverdan kelgan xom yoki formatlangan JSON ma’lumotlar.',
          },
        ],
        interactiveExample: {
          title: 'Tarmoq so‘rovi metadatasini tahlil qilish',
          description: 'DevTools uslubida so‘rov obyektidan metod, status va contentType ni ajratib olamiz.',
          language: 'javascript',
          code: `const networkLog = {\n  url: "https://api.codequest.uz/v1/lessons",\n  method: "GET",\n  status: 200,\n  headers: {\n    "content-type": "application/json",\n    "authorization": "Bearer token_xyz123"\n  }\n};\n\nconst isSuccess = networkLog.status >= 200 && networkLog.status < 300;\nconst hasAuth = !!networkLog.headers["authorization"];\n\nconsole.log("Metod: " + networkLog.method);\nconsole.log("Muvaffaqiyatli: " + isSuccess);\nconsole.log("Avtorizatsiya bor: " + hasAuth);`,
          expectedOutput: "Metod: GET\nMuvaffaqiyatli: true\nAvtorizatsiya bor: true",
          lineExplanations: {
            1: 'DevTools Network logidagi bitta so‘rov modeli.',
            10: 'Status kodi 200-299 oralig‘ida bo‘lsa muvaffaqiyatli hisoblanadi.',
            11: 'So‘rovda Authorization sarlavhasi bor-yo‘qligini tekshirish.',
          },
        },
        commonMistakes: [
          {
            title: 'Statik fayllar bilan API so‘rovlarni aralashtirish',
            wrongCode: '// Network tabda "All" filtrini yoqib, css, js, png fayllar orasida adashib qolish',
            correctCode: '// Network tabida doimo "Fetch/XHR" filtrini tanlang, shunda faqat API so‘rovlar qoladi',
            explanation: 'Veb-saytda yuzlab rasm va shriftlar yuklanadi. API tahlili uchun faqat Fetch/XHR filtri kerak.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prof-1-1',
            question: 'DevTools Network tabida faqat backend bilan bo‘layotgan JSON so‘rovlarni ko‘rish uchun qaysi filtr yoqiladi?',
            type: 'multiple-choice',
            options: ['Doc', 'Fetch/XHR', 'WS (WebSockets)', 'Img'],
            correctAnswer: 1,
            explanation: 'Fetch/XHR filtri JavaScript orqali serverga yuborilgan asinxron API so‘rovlarni ko‘rsatadi.',
          },
          {
            id: 'q-prof-1-2',
            question: 'Server so‘rovni muvaffaqiyatli qabul qilib javob qaytarganda eng ko‘p uchraydigan HTTP status kodi qaysi?',
            type: 'multiple-choice',
            options: ['404', '500', '200', '302'],
            correctAnswer: 2,
            explanation: '200 OK — so‘rov muvaffaqiyatli bajarilganini bildiradi.',
          },
        ],
        summary: 'Siz DevTools Network paneli, Fetch/XHR filtrlari va HTTP so‘rov parametrlarini tahlil qilishni o‘rgandingiz.',
        nextLessonSlug: 'api-endpoints-curl-postman',
        nextLessonTitle: 'API Endpointlarini Aniqlash va cURL / Postman Simulyatsiyasi',
      },
    },
    exercise: {
      id: 'ex-prof-1',
      lessonId: 'les-prof-1',
      title: 'Tarmoq So‘rovlarini Tahlil Qiluvchi Profiler',
      description: 'Tarmoq so‘rovi ma’lumotlarini tekshiruvchi analyzeRequest funksiyasini yozing. U so‘rov metodini katta harfda va xavfsizlik holatini tahlil qilib qaytarsin.',
      instructions: [
        'analyzeRequest(log) funksiyasini yarating.',
        'Agar status 200 bo‘lsa va headers.authorization mavjud bo‘lsa, "OK_AUTH" deb qaytarsin.',
        'Agar status 200 bo‘lsa va authorization yo‘q bo‘lsa, "OK_ANON" deb qaytarsin.',
        'Agar status 401 yoki 403 bo‘lsa, "DENIED" deb qaytarsin.',
        'Boshqa holatlarda "UNKNOWN" deb qaytarsin.',
      ],
      starterCode: `function analyzeRequest(log) {\n  if (log.status === 401 || log.status === 403) return "DENIED";\n  if (log.status === 200) {\n    return log.headers && log.headers.authorization ? "OK_AUTH" : "OK_ANON";\n  }\n  return "UNKNOWN";\n}\n\nconsole.log(analyzeRequest({ url: "/api/user", method: "GET", status: 200, headers: { authorization: "Bearer 123" } }));\n`,
      language: 'javascript',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-prof-1-1',
          description: 'Avtorizatsiyali muvaffaqiyatli so‘rovda OK_AUTH qaytishi kerak',
          expectedOutput: 'OK_AUTH',
          type: 'contains',
        },
      ],
      hiddenTests: [
        {
          id: 'tc-prof-1-2',
          description: 'Tahlil natijasi to‘g‘ri bo‘lishi kerak',
          expectedOutput: 'OK_AUTH',
          type: 'output',
        },
      ],
      hints: [
        '1-bosqich: log.status === 200 ekanligini va log.headers.authorization borligini tekshiring.',
        '2-bosqich: if (log.status === 401 || log.status === 403) return "DENIED";',
        '3-bosqich: if (log.status === 200) return log.headers.authorization ? "OK_AUTH" : "OK_ANON";',
      ],
      solutionExplanation: 'Status kodi va sarlavhalarni tekshirish orqali so‘rov xavfsizlik va ruxsat turini aniqlaymiz.',
      passingScore: 100,
      expectedConcepts: ['log.status', 'log.headers', 'authorization', 'return'],
    },
  },

  {
    lesson: {
      id: 'les-prof-2',
      moduleId: 'mod-prof-1',
      courseId: 'course-profiling',
      title: 'API Endpointlarini Aniqlash va cURL / Postman Simulyatsiyasi',
      slug: 'api-endpoints-curl-postman',
      description: 'DevTools orqali aniqlangan so‘rovlarni «Copy as cURL» qilib olish, sarlavha va payload parametrlarini Postman/Terminal orqali mustaqil takrorlash (Replay).',
      objectives: [
        'Har qanday veb so‘rovni brauzerdan cURL ko‘rinishida eksport qilish',
        'Query parametrlar va JSON body bilan mustaqil so‘rov shakllantirish',
        'Postman yoki Terminal orqali server javobini mustaqil tahlil qilish',
      ],
      estimatedMinutes: 20,
      order: 2,
      published: true,
      content: {
        title: 'API Endpointlarini Aniqlash va cURL / Postman Simulyatsiyasi',
        learningObjective: 'Sayt orqasida yashiringan API endpointlarini aniqlab, brauzer interfeysisiz to‘g‘ridan-to‘g‘ri cURL yoki Postman orqali so‘rov yuborishni o‘rganish.',
        realLifeAnalogy: 'Tasavvur qiling, teatr tomoshasi (UI). Aktyorlar sahnada harakat qilmoqda. DevTools orqali siz sahna ortidagi rejissyor buyruqlarini (API chaqiruvlarni) yozib olasiz va o‘zingiz pult orqali xuddi shu buyruqni to‘g‘ridan-to‘g‘ri yuborib (cURL) sahnadagi chiroqlarni boshqara olasiz!',
        theory: [
          {
            type: 'heading',
            content: '«Copy as cURL» Imkoniyati',
          },
          {
            type: 'text',
            content: 'DevTools Network tabida istalgan API so‘rovini o‘ng tugma bilan bosing -> «Copy» -> «Copy as cURL». Bu buyruq brauzer yuborgan URL, barcha sarlavhalar va ma’lumotlarni bitta terminal buyrug‘iga aylantirib beradi.',
          },
          {
            type: 'heading',
            content: 'cURL Sintaksisi Tahlili',
          },
          {
            type: 'text',
            content: 'Misol:\ncurl -X POST "https://api.codequest.uz/v1/auth/login" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"email":"test@codequest.uz"}\'\n\n- -X POST: HTTP metodini belgilaydi.\n- -H "Header-Nomi: Qiymat": Sarlavha qo‘shadi.\n- -d \'...\': Yuborilayotgan JSON body ma’lumotlari.',
          },
        ],
        interactiveExample: {
          title: 'cURL buyrug‘ini JavaScript da generatsiya qilish',
          description: 'URL va parametrlar asosida terminal buyrug‘ini hosil qilamiz.',
          language: 'javascript',
          code: `function buildCurlCommand(method, url, data) {\n  let cmd = \`curl -X \${method} "\${url}"\`;\n  cmd += ' -H "Content-Type: application/json"';\n  if (data) {\n    cmd += \` -d '\${JSON.stringify(data)}'\`;\n  }\n  return cmd;\n}\n\nconst curl = buildCurlCommand("POST", "https://api.test.uz/user", { name: "Ali" });\nconsole.log(curl);`,
          expectedOutput: 'curl -X POST "https://api.test.uz/user" -H "Content-Type: application/json" -d \'{"name":"Ali"}\'',
          lineExplanations: {
            2: 'Asosiy cURL shabloni.',
            3: 'JSON Content-Type sarlavhasi qo‘shildi.',
            5: 'Body ma’lumoti stringify qilinib -d parametri bilan berildi.',
          },
        },
        commonMistakes: [
          {
            title: 'Qo‘shtirnoq va qochirish (escaping) xatolari',
            wrongCode: 'curl -d "{"name": "Ali"}" // Terminalda ichki qo‘shtirnoqlar buzilib ketadi',
            correctCode: 'curl -d \'{"name": "Ali"}\' yoki Postman orqali toza JSON yuborish',
            explanation: 'JSON ichidagi qo‘shtirnoqlar terminal qobig‘ida to‘g‘ri qochirilishi (escape) shart.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prof-2-1',
            question: 'cURL buyrug‘ida so‘rov metodini (GET, POST, DELETE) ko‘rsatish uchun qaysi bayroq (flag) ishlatiladi?',
            type: 'multiple-choice',
            options: ['-H', '-d', '-X', '-u'],
            correctAnswer: 2,
            explanation: '-X yoki --request parametri HTTP metodini ko‘rsatadi.',
          },
        ],
        summary: 'Siz API endpointlarini ajratib olish va cURL/Postman orqali simulyatsiya qilishni o‘rgandingiz.',
        nextLessonSlug: 'mobile-app-structure-configs',
        nextLessonTitle: 'Mobil Ilova Arxitekturasi: APK/IPA Resurslari va Konfiguratsiyalar',
      },
    },
    exercise: {
      id: 'ex-prof-2',
      lessonId: 'les-prof-2',
      title: 'cURL Generator Yaratish',
      description: 'Berilgan parametrlar asosida to‘g‘ri shakllantirilgan cURL buyruq qatorini generatsiya qiluvchi createCurl funksiyasini yozing.',
      instructions: [
        'createCurl(method, url, token) funksiyasini yarating.',
        'Metod har doim katta harf bo‘lsin (GET, POST).',
        'Agar token mavjud bo‘lsa, -H "Authorization: Bearer <token>" sarlavhasi qo‘shilsin.',
        'Natijani `curl -X <METHOD> "<URL>"` ko‘rinishida qaytaring.',
      ],
      starterCode: `function createCurl(method, url, token) {\n  const m = method.toUpperCase();\n  let res = \`curl -X \${m} "\${url}"\`;\n  if (token) res += \` -H "Authorization: Bearer \${token}"\`;\n  return res;\n}\n\nconsole.log(createCurl("get", "https://api.test.uz/items", "abc123token"));\n`,
      language: 'javascript',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-prof-2-1',
          description: 'cURL buyrug‘i to‘g‘ri shakllantirilishi kerak',
          expectedOutput: 'curl -X GET "https://api.test.uz/items" -H "Authorization: Bearer abc123token"',
          type: 'output',
        },
      ],
      hiddenTests: [
        {
          id: 'tc-prof-2-2',
          description: 'POST so‘rovi uchun to‘g‘ri ishlashi kerak',
          expectedOutput: 'curl -X GET',
          type: 'contains',
        },
      ],
      hints: [
        '1-bosqich: const m = method.toUpperCase();',
        '2-bosqich: let res = `curl -X ${m} "${url}"`;',
        '3-bosqich: if (token) res += ` -H "Authorization: Bearer ${token}"`; return res;',
      ],
      solutionExplanation: 'cURL sintaksisi qat’iy formatda URL va kerakli sarlavhalarni birlashtiradi.',
      passingScore: 100,
      expectedConcepts: ['toUpperCase', 'template string', 'if (token)'],
    },
  },

  // ============================================================
  // 2-MODUL: Mobil Ilovalar Arxitekturasi va Trafik Tahlili
  // ============================================================
  {
    lesson: {
      id: 'les-prof-3',
      moduleId: 'mod-prof-2',
      courseId: 'course-profiling',
      title: 'Mobil Ilova Arxitekturasi: APK/IPA Resurslari va Konfiguratsiyalar',
      slug: 'mobile-app-structure-configs',
      description: 'Android APK (zip) va iOS IPA fayllar tuzilmasi, manifest fayli, ommaviy resurslar, debug rejimining xavflari va konfiguratsiyalarni tahlil qilish.',
      objectives: [
        'APK va IPA fayllari oddiy zip arxiv ekanligini va ularning tarkibini tushunish',
        'AndroidManifest va konfiguratsiyalardagi ochiq parametrlarni tekshirish',
        'Debug bayroqlari va ruxsatlar (permissions) xavfsizlik auditi',
      ],
      estimatedMinutes: 20,
      order: 3,
      published: true,
      content: {
        title: 'Mobil Ilova Arxitekturasi: APK/IPA Resurslari va Konfiguratsiyalar',
        learningObjective: 'Mobil ilovalar qanday paketlanishini, nima uchun mijoz ilovasi ichida maxfiy kalitlarni saqlab bo‘lmasligini va konfiguratsiyalarni tahlil qilishni o‘rganish.',
        realLifeAnalogy: 'Mobil ilova — bu chiroyli qadoqlangan sovg‘a qutisi. Uning tashqi qog‘ozini ochsangiz (unzip qilsangiz), ichida rasmlar, matnlar va ilovaning qoidalari (Manifest) chiqadi. Agar ishlab chiquvchi o‘z uyining kalitini (API Secret) o‘sha qutiga solib qo‘ygan bo‘lsa, qutini olgan har qanday odam kalitni ko‘rib oladi!',
        theory: [
          {
            type: 'heading',
            content: 'APK / IPA Nima Aslida?',
          },
          {
            type: 'text',
            content: 'Android ilovalari (.apk) va iOS ilovalari (.ipa) oddiy ZIP arxividir! Har qanday APK kengaytmasini .zip ga o‘zgartirib ochsangiz quyidagilarni ko‘rasiz:\n- AndroidManifest.xml: Ilovaning nomi, so‘ralgan ruxsatlar va asosiy komponentlar.\n- assets/ va res/: Barcha rasmlar, audio, shriftlar va lokal JSON konfiguratsiyalar.\n- classes.dex: Kompilyatsiya qilingan baytkod.',
          },
          {
            type: 'heading',
            content: 'Xavfli Konfiguratsiya Belgilari',
          },
          {
            type: 'text',
            content: '1. android:debuggable="true": Ilova ishlab chiqish (debug) rejimida qolib ketgan, xavfsizlik zaif.\n2. usesCleartextTraffic="true": Ilova shifrlanmagan HTTP orqali ma’lumot jo‘natishiga ruxsat berilgan.\n3. Keraksiz yuqori ruxsatlar: Masalan, oddiy hisoblagich ilovasi READ_CONTACTS yoki ACCESS_FINE_LOCATION so‘rashi.',
          },
        ],
        interactiveExample: {
          title: 'Mobil ilova manifest konfiguratsiyasini tekshirish',
          description: 'JSON ko‘rinishidagi mobil manifest sozlamalarini xavfsizlikka tekshiramiz.',
          language: 'javascript',
          code: `const appConfig = {\n  appName: "PayApp",\n  version: "1.0.4",\n  debuggable: false,\n  usesCleartextTraffic: false,\n  permissions: ["INTERNET", "ACCESS_NETWORK_STATE"]\n};\n\nconst issues = [];\nif (appConfig.debuggable) issues.push("Xavf: Debug rejim yoqilgan!");\nif (appConfig.usesCleartextTraffic) issues.push("Xavf: HTTP ruxsat berilgan!");\n\nconsole.log("Xavflar soni: " + issues.length);\nconsole.log("Holat: " + (issues.length === 0 ? "Xavfsiz konfiguratsiya ✅" : "Muammo bor ⚠️"));`,
          expectedOutput: "Xavflar soni: 0\nHolat: Xavfsiz konfiguratsiya ✅",
          lineExplanations: {
            1: 'Ilovaning konfiguratsiya parametrlari.',
            9: 'debuggable tekshiruvi.',
            10: 'Shifrlanmagan trafik tekshiruvi.',
          },
        },
        commonMistakes: [
          {
            title: 'Mijoz ilovasida maxfiy kalitlarni saqlash',
            wrongCode: 'const STRIPE_SECRET_KEY = "sk_live_123456..."; // APK ichida ochiq saqlash',
            correctCode: '// Barcha to‘lov va maxfiy kalitlar faqat o‘zimizning xavfsiz Backend serverimizda saqlanadi',
            explanation: 'APK ichiga qo‘yilgan har qanday matn osonlikcha o‘qib olinadi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prof-3-1',
            question: 'Nima uchun mobil ilova ichida (APK kodida) ma’lumotlar bazasi parolini yoki Secret API kalitni saqlab bo‘lmaydi?',
            type: 'multiple-choice',
            options: [
              'Chunki APK hajmi oshib ketadi',
              'Chunki APK oddiy zip arxiv kabi ochilib, ichidagi barcha matnlar ko‘rinadi',
              'Chunki telefonlar parollarni tushunmaydi',
              'Chunki Play Store ruxsat bermaydi',
            ],
            correctAnswer: 1,
            explanation: 'Mijoz tomonidagi (Client-side) har qanday fayl foydalanuvchi qo‘lida bo‘ladi va uni ko‘rish mumkin.',
          },
        ],
        summary: 'Siz mobil paketlar tuzilmasi, manifest fayllari va konfiguratsiya auditi asoslarini o‘rgandingiz.',
        nextLessonSlug: 'mobile-traffic-proxy-debugging',
        nextLessonTitle: 'Mobil Trafikni Proksi Qilish (mitmproxy & Charles Debugging)',
      },
    },
    exercise: {
      id: 'ex-prof-3',
      lessonId: 'les-prof-3',
      title: 'Manifest Xavfsizlik Skriningi',
      description: 'Mobil ilovaning konfiguratsiyasini tekshirib, xavflar ro‘yxatini qaytaruvchi auditManifest funksiyasini yozing.',
      instructions: [
        'auditManifest(manifest) funksiyasini yarating.',
        'Agar manifest.debuggable === true bo‘lsa, natijaviy massivga "DEBUG_ENABLED" qo‘shing.',
        'Agar manifest.cleartext === true bo‘lsa, massivga "CLEARTEXT_ALLOWED" qo‘shing.',
        'Agar manifest.permissions da "READ_SMS" mavjud bo‘lsa, massivga "SMS_PERMISSION" qo‘shing.',
        'JSON ko‘rinishida natijani chiqaring.',
      ],
      starterCode: `function auditManifest(manifest) {\n  const flags = [];\n  if (manifest.debuggable) flags.push("DEBUG_ENABLED");\n  if (manifest.cleartext) flags.push("CLEARTEXT_ALLOWED");\n  if (manifest.permissions && manifest.permissions.includes("READ_SMS")) flags.push("SMS_PERMISSION");\n  return flags;\n}\n\nconsole.log(JSON.stringify(auditManifest({ debuggable: true, cleartext: true, permissions: ["INTERNET"] })));\n`,
      language: 'javascript',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-prof-3-1',
          description: 'Debug va cleartext xavflarini aniqlashi kerak',
          expectedOutput: '["DEBUG_ENABLED","CLEARTEXT_ALLOWED"]',
          type: 'output',
        },
      ],
      hiddenTests: [
        {
          id: 'tc-prof-3-2',
          description: 'Massiv shaklida qaytishi kerak',
          expectedOutput: 'DEBUG_ENABLED',
          type: 'contains',
        },
      ],
      hints: [
        '1-bosqich: if (manifest.debuggable) flags.push("DEBUG_ENABLED");',
        '2-bosqich: if (manifest.cleartext) flags.push("CLEARTEXT_ALLOWED");',
        '3-bosqich: if (manifest.permissions && manifest.permissions.includes("READ_SMS")) flags.push("SMS_PERMISSION");',
      ],
      solutionExplanation: 'Ilova manifestidagi xavfli konfiguratsiyalarni shartlar orqali tekshirish auditi.',
      passingScore: 100,
      expectedConcepts: ['debuggable', 'cleartext', 'includes', 'push'],
    },
  },

  {
    lesson: {
      id: 'les-prof-4',
      moduleId: 'mod-prof-2',
      courseId: 'course-profiling',
      title: 'Mobil Trafikni Proksi Qilish (mitmproxy & Charles Debugging)',
      slug: 'mobile-traffic-proxy-debugging',
      description: 'Mobil ilova server bilan qanday muloqot qilayotganini tahlil qilish: mitmproxy / Charles Proxy arxitekturasi, HTTPS shifrlash va lokal SSL sertifikatlari.',
      objectives: [
        'Lokal HTTP/HTTPS proksi orqali mobil trafikni kuzatish tamoyilini tushunish',
        'mitmproxy va Charles kabi vositalar orqali so‘rovlarni ushlash va tahlil qilish',
        'SSL Pinning nima va u ilovalarni qanday himoya qilishini o‘rganish',
      ],
      estimatedMinutes: 20,
      order: 4,
      published: true,
      content: {
        title: 'Mobil Trafikni Proksi Qilish (mitmproxy & Charles Debugging)',
        learningObjective: 'Mobil telefon va server o‘rtasidagi tarmoq trafigini ishlab chiquvchi sifatida proksi yordamida ushlash, so‘rovlarni tekshirish va xavfsizlikni baholashni o‘rganish.',
        realLifeAnalogy: 'Telefoningiz — bu xat yozuvchi. Server — xat oluvchi. Proksi (Proxy) — bu pochtachi. Siz pochtachiga: «Xatni olib borishdan oldin menga ko‘rsat, ichida nima yozilganini tekshirib olay (debugging qilay)» deysiz. Proksi aynan shu vazifani bajaradi!',
        theory: [
          {
            type: 'heading',
            content: 'Proksi Qanday Ishlaydi (MITM Debugging)?',
          },
          {
            type: 'text',
            content: 'Telefoningiz WiFi sozlamalarida proksi IP manzili sifatida kompyuteringizning lokal IP’si (masalan 192.168.1.5:8080) ko‘rsatiladi. Endi telefon barcha tarmoq so‘rovlarini to‘g‘ridan-to‘g‘ri serverga emas, balki kompyuterdagi mitmproxy yoki Charles dasturi orqali o‘tkazadi.',
          },
          {
            type: 'heading',
            content: 'SSL Certificate Pinning Nima?',
          },
          {
            type: 'text',
            content: 'Agar ilova o‘ta xavfsiz bank yoki to‘lov ilovasi bo‘lsa, u faqat o‘zining haqiqiy serverining sertifikatiga ishonadi (SSL Pinning). Bunday holatda proksi sertifikati rad etiladi va ilova tarmoqqa ulanmaydi.',
          },
        ],
        interactiveExample: {
          title: 'Proksi loglaridan HTTPS vs HTTP ni ajratish',
          description: 'Tarmoq loglaridagi xavfsiz va xavfsiz bo‘lmagan so‘rovlarni tahlil qilamiz.',
          language: 'javascript',
          code: `const capturedFlows = [\n  { url: "https://api.bank.uz/v1/balance", encrypted: true },\n  { url: "http://legacy.server.uz/data", encrypted: false },\n  { url: "https://api.bank.uz/v1/transfer", encrypted: true }\n];\n\nconst unencrypted = capturedFlows.filter(flow => !flow.encrypted);\nconsole.log("Jami so'rovlar: " + capturedFlows.length);\nconsole.log("Xavfsiz bo'lmagan HTTP: " + unencrypted.length);`,
          expectedOutput: "Jami so'rovlar: 3\nXavfsiz bo'lmagan HTTP: 1",
          lineExplanations: {
            1: 'Proksi orqali ushlangan tarmoq oqimlari.',
            7: 'Shifrlanmagan ochiq HTTP so‘rovlarni filtrlash.',
          },
        },
        commonMistakes: [
          {
            title: 'Ilovani HTTPS siz ishlatish',
            wrongCode: 'fetch("http://myapi.uz/login", { ... }) // Ochiq Wi-Fi da parollar tutib olinadi',
            correctCode: 'fetch("https://myapi.uz/login", { ... }) // TLS/SSL bilan shifrlangan',
            explanation: 'Har qanday ishlab chiqarish (production) API faqat HTTPS orqali ishlashi shart.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prof-4-1',
            question: 'Mobil ilova begona lokal proksi sertifikatiga ulanmasligi uchun qanday himoya chorasi qo‘llaniladi?',
            type: 'multiple-choice',
            options: ['SSL / Certificate Pinning', 'Base64 encode', 'HTML form', 'CSS grid'],
            correctAnswer: 0,
            explanation: 'Certificate Pinning ilovani faqat bitta aniq server sertifikatiga bog‘laydi va oraliqdagi begona proksilarni bloklaydi.',
          },
        ],
        summary: 'Siz mobil tarmoq trafigini proksi qilish, MITM debugging va SSL Pinning himoyasini o‘rgandingiz.',
        nextLessonSlug: 'json-db-schema-reconstruction',
        nextLessonTitle: 'JSON Responslardan DB Schema va Modellarini Tiklash',
      },
    },
    exercise: {
      id: 'ex-prof-4',
      lessonId: 'les-prof-4',
      title: 'Proksi Trafik Filtrini Yaratish',
      description: 'Proksi orqali o‘tgan so‘rovlar ro‘yxatini tahlil qilib, faqat targetDomain ga tegishli va xavfsiz (HTTPS) bo‘lgan so‘rovlarning URL larini qaytaruvchi filterTraffic funksiyasini yozing.',
      instructions: [
        'filterTraffic(requests, targetDomain) funksiyasini yarating.',
        'Faqat protocol === "https" bo‘lgan va url da targetDomain mavjud bo‘lgan so‘rovlarni tanlang.',
        'Natijada faqat o‘sha so‘rovlarning url massivini JSON qilib chiqaring.',
      ],
      starterCode: `function filterTraffic(requests, targetDomain) {\n  return requests\n    .filter(r => r.protocol === "https" && r.url.includes(targetDomain))\n    .map(r => r.url);\n}\n\nconst reqs = [\n  { url: "https://api.codequest.uz/users", protocol: "https" },\n  { url: "http://api.codequest.uz/login", protocol: "http" }\n];\nconsole.log(JSON.stringify(filterTraffic(reqs, "codequest.uz")));\n`,
      language: 'javascript',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-prof-4-1',
          description: 'Faqat HTTPS va target domain so‘rovlarini qaytarishi kerak',
          expectedOutput: '["https://api.codequest.uz/users"]',
          type: 'output',
        },
      ],
      hiddenTests: [
        {
          id: 'tc-prof-4-2',
          description: 'Natija to‘g‘ri filtrlanishi kerak',
          expectedOutput: 'https://api.codequest.uz/users',
          type: 'contains',
        },
      ],
      hints: [
        '1-bosqich: requests.filter(r => r.protocol === "https" && r.url.includes(targetDomain))',
        '2-bosqich: .map(r => r.url)',
      ],
      solutionExplanation: 'Proksi tahlilida keraksiz tashqi so‘rovlarni ajratib, faqat tahlil qilinayotgan domen va protokollar filtrlanadi.',
      passingScore: 100,
      expectedConcepts: ['filter', 'includes', 'map', 'protocol === "https"'],
    },
  },

  // ============================================================
  // 3-MODUL: Backend va Ma’lumotlar Bazasi Sxemasini Tiklash
  // ============================================================
  {
    lesson: {
      id: 'les-prof-5',
      moduleId: 'mod-prof-3',
      courseId: 'course-profiling',
      title: 'JSON Responslardan DB Schema va Modellarini Tiklash',
      slug: 'json-db-schema-reconstruction',
      description: 'API dan qaytayotgan JSON javoblarini o‘rganish orqali backend ma’lumotlar bazasi jadvallari, ustun turlari va Foreign Key (bog‘lanishlar) sxemasini tahlil qilish va tiklash.',
      objectives: [
        'JSON strukturasi orqali relyatsion ma’lumotlar bazasi modelini aniqlash',
        'ID, xorijiy kalitlar (Foreign Keys) va bog‘liqlik munosabatlarini ajratish',
        'Haddan tashqari ko‘p ma’lumot sizishi (Excessive Data Exposure) muammosini tushunish',
      ],
      estimatedMinutes: 25,
      order: 5,
      published: true,
      content: {
        title: 'JSON Responslardan DB Schema va Modellarini Tiklash',
        learningObjective: 'Frontendga kelayotgan JSON obyektlari orqali server orqasidagi ma’lumotlar bazasi qanday jadvallardan tashkil topganini rekonstruksiya qilishni o‘rganish.',
        realLifeAnalogy: 'Tasavvur qiling, avtomobil ehtiyot qismlari ro‘yxatini ko‘ryapsiz: unda dvigatel raqami, unga ulangan transmissiya raqami va g‘ildirak o‘lchamlari yozilgan. Siz butun mashinaning chizmasini ko‘rmasangiz ham, aynan qaysi qism qaysi qismga qanday ulanganini (Foreign Key) 100% tushunib olasiz!',
        theory: [
          {
            type: 'heading',
            content: 'JSON Kalitlaridan DB Sxemasini O‘qish',
          },
          {
            type: 'text',
            content: 'Backend API lari odatda bazadagi SQL jadvallarni JSON ko‘rinishida serialize qiladi. Masalan:\n{\n  "id": "post-101",\n  "title": "Mening maqolam",\n  "author_id": "usr-55",\n  "views_count": 1200,\n  "is_published": true\n}\nUshbu JSON dan darhol server bazasidagi jadval sxemasini tiklash mumkin:\n- id: Primary Key (TEXT)\n- title: TEXT\n- author_id: Foreign Key -> users(id) jadvaliga bog‘langan!\n- views_count: INTEGER\n- is_published: BOOLEAN',
          },
          {
            type: 'heading',
            content: 'Excessive Data Exposure Xavfi',
          },
          {
            type: 'text',
            content: 'Ko‘p dasturchilar bazadan SELECT * FROM users qilib, barcha ustunlarni to‘g‘ridan-to‘g‘ri frontendga yuborishadi. Natijada UI da faqat ism ko‘rinsa-da, Network JSON da password_hash, phone_number kabi maxfiy ustunlar sizib chiqadi. Xavfsiz tizimda faqat kerakli maydonlargina yuborilishi shart!',
          },
        ],
        interactiveExample: {
          title: 'JSON dan SQL ustun turlarini aniqlash',
          description: 'JavaScript qiymat turidan SQL ustun turiga avtomatik o‘girish.',
          language: 'javascript',
          code: `function inferSqlType(val) {\n  if (typeof val === 'number') {\n    return Number.isInteger(val) ? 'INTEGER' : 'REAL';\n  }\n  if (typeof val === 'boolean') return 'BOOLEAN';\n  return 'TEXT';\n}\n\nconst sampleData = { id: 1, title: "Kitob", price: 49.99, inStock: true };\nconst schema = {};\nfor (const [key, val] of Object.entries(sampleData)) {\n  schema[key] = inferSqlType(val);\n}\n\nconsole.log(JSON.stringify(schema));`,
          expectedOutput: '{"id":"INTEGER","title":"TEXT","price":"REAL","inStock":"BOOLEAN"}',
          lineExplanations: {
            1: 'JavaScript turidan SQL turini xulosa qiluvchi funksiya.',
            10: 'Obyekt kalitlari bo‘yicha sxema hosil qilish.',
          },
        },
        commonMistakes: [
          {
            title: 'Keraksiz maxfiy ustunlarni API orqali uzatish',
            wrongCode: 'res.json(userFromDb); // password_hash chiqib ketadi',
            correctCode: 'const { password_hash, ...safeUser } = userFromDb; res.json(safeUser);',
            explanation: 'Hech qachon parollar xeshi yoki ichki tokenlar JSON responsega qo‘shilmasligi kerak.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prof-5-1',
            question: 'JSON javobida user_id: 42 ko‘rinishidagi kalit nimani anglatadi?',
            type: 'multiple-choice',
            options: [
              'Ushbu yozuv boshqa users jadvalidagi 42-identifikatorli yozuvga (Foreign Key) bog‘langan',
              'Foydalanuvchi tizimdan chiqqan',
              'Bu brauzerning kesh xotirasi',
              'Bu tasodifiy raqam',
            ],
            correctAnswer: 0,
            explanation: '_id bilan tugovchi maydonlar relyatsion bazalarda tashqi kalit (Foreign Key) bog‘lanishini bildiradi.',
          },
        ],
        summary: 'Siz JSON javoblari orqali relyatsion bazalar sxemasini tiklash va ortiqcha ma’lumot sizishini tekshirishni o‘rgandingiz.',
        nextLessonSlug: 'auth-jwt-cookies-audit',
        nextLessonTitle: 'Autentifikatsiya Auditi: JWT Token, Bearer va HttpOnly Cookies',
      },
    },
    exercise: {
      id: 'ex-prof-5',
      lessonId: 'les-prof-5',
      title: 'SQL Sxema Rekonstruktsiya Qiluvchi Dvigatel',
      description: 'Berilgan JSON obyektidan relyatsion jadval ustunlari turlarini aniqlab, { field: "SQL_TYPE" } xaritasini qaytaruvchi reconstructSchema funksiyasini yozing.',
      instructions: [
        'reconstructSchema(jsonObj) funksiyasini yarating.',
        'Agar butun son bo‘lsa, "INTEGER" bo‘lsin.',
        'Agar mantiqiy bo‘lsa, "BOOLEAN" bo‘lsin.',
        'Boshqa barcha holatlarda "TEXT" bo‘lsin.',
        'Natijani JSON qilib chiqaring.',
      ],
      starterCode: `function reconstructSchema(jsonObj) {\n  const result = {};\n  for (const [k, v] of Object.entries(jsonObj)) {\n    if (typeof v === "boolean") result[k] = "BOOLEAN";\n    else if (typeof v === "number" && Number.isInteger(v)) result[k] = "INTEGER";\n    else result[k] = "TEXT";\n  }\n  return result;\n}\n\nconsole.log(JSON.stringify(reconstructSchema({ id: 10, title: "Kurs", is_active: true })));\n`,
      language: 'javascript',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-prof-5-1',
          description: 'Sxema turlari to‘g‘ri ajratilishi kerak',
          expectedOutput: '{"id":"INTEGER","title":"TEXT","is_active":"BOOLEAN"}',
          type: 'output',
        },
      ],
      hiddenTests: [
        {
          id: 'tc-prof-5-2',
          description: 'INTEGER va BOOLEAN turlari qatnashishi kerak',
          expectedOutput: 'INTEGER',
          type: 'contains',
        },
      ],
      hints: [
        '1-bosqich: for (const [k, v] of Object.entries(jsonObj)) { ... }',
        '2-bosqich: if (typeof v === "boolean") result[k] = "BOOLEAN";',
      ],
      solutionExplanation: 'JSON maydonlarini tahlil qilish orqali server bazasining SQL jadval strukturasini tiklaymiz.',
      passingScore: 100,
      expectedConcepts: ['Object.entries', 'Number.isInteger', 'typeof', 'return'],
    },
  },

  {
    lesson: {
      id: 'les-prof-6',
      moduleId: 'mod-prof-3',
      courseId: 'course-profiling',
      title: 'Autentifikatsiya Auditi: JWT Token, Bearer va HttpOnly Cookies',
      slug: 'auth-jwt-cookies-audit',
      description: 'JWT (JSON Web Token) qismlari: Header, Payload va Signature. Tokenni dekodlash, amal qilish muddatini (exp) tekshirish va HttpOnly cookie xavfsizligi.',
      objectives: [
        'JWT token qanday tuzilganini va uning Base64URL payloadini o‘qishni bilish',
        'JWT dagi ma’lumotlar shifrlanmagan, faqat imzolangan ekanini tushunish',
        'LocalStorage vs HttpOnly Cookie xavfsizlik farqlarini bilish',
      ],
      estimatedMinutes: 20,
      order: 6,
      published: true,
      content: {
        title: 'Autentifikatsiya Auditi: JWT Token, Bearer va HttpOnly Cookies',
        learningObjective: 'API larda foydalanuvchini tanish uchun ishlatiladigan JWT tokenlarini audit qilish, ularning muddati va ruxsatlarini tahlil qilishni o‘rganish.',
        realLifeAnalogy: 'JWT token — bu samolyot minish taloni (Boarding pass). Unda sizning ismingiz va reys raqami ochiq yozilgan (Payload). Ammo pastida aviakompaniyaning maxsus shtampi (Signature) bor. Chiptadagi ismni o‘zgartirsangiz, shtamp soxtalashgani darhol bilinadi!',
        theory: [
          {
            type: 'heading',
            content: 'JWT Strukturasi: 3 Ta Qism',
          },
          {
            type: 'text',
            content: 'JWT token nuqtalar bilan ajratilgan 3 qismdan iborat: Header.Payload.Signature\n1. Header: Algoritm (masalan HS256).\n2. Payload: Foydalanuvchi ID si, roli, tugash vaqti exp.\n3. Signature: Serverdagi maxfiy kalit bilan qilingan kriptografik imzo.\n\nDIQQAT: Payload Base64 formatda shunchaki kodlangan, u shifrlanmagan! Uni istalgan odam ochib o‘qiy oladi. Shuning uchun JWT ichiga hech qachon parollarni qo‘yib bo‘lmaydi!',
          },
          {
            type: 'heading',
            content: 'LocalStorage vs HttpOnly Cookie',
          },
          {
            type: 'text',
            content: '- LocalStorage: Agar tokenni localStorage da saqlasangiz, saytda XSS zaifligi bo‘lsa, tajovuzkor JavaScript orqali tokenni o‘g‘irlab keta oladi.\n- HttpOnly Cookie: Brauzer JavaScript kodi bu cookieni o‘qiy olmaydi. Bu eng xavfsiz autentifikatsiya usulidir!',
          },
        ],
        interactiveExample: {
          title: 'JWT Payloadini tahlil qilish',
          description: 'Base64URL qatoridan foydalanuvchi ma’lumotlarini o‘qiymiz.',
          language: 'javascript',
          code: `const samplePayload = {\n  sub: "user-9912",\n  name: "Jasur",\n  role: "admin",\n  exp: Math.floor(Date.now() / 1000) + 3600\n};\n\nconst isExpired = Date.now() / 1000 > samplePayload.exp;\nconsole.log("Foydalanuvchi: " + samplePayload.name);\nconsole.log("Roli: " + samplePayload.role);\nconsole.log("Muddati o'tganmi: " + isExpired);`,
          expectedOutput: "Foydalanuvchi: Jasur\nRoli: admin\nMuddati o'tganmi: false",
          lineExplanations: {
            2: 'JWT standartida sub — subject (foydalanuvchi identifikatori).',
            5: 'exp — UNIX soniyalardagi tugash vaqti.',
            8: 'Tokenning hozirgi vaqtga nisbatan yaroqliligini tekshirish.',
          },
        },
        commonMistakes: [
          {
            title: 'JWT ga maxfiy kalit yoki parollarni joylash',
            wrongCode: '// JWT payload: { userId: 1, password: "mySecretPassword123" } // O‘TA XAVFLI!',
            correctCode: '// JWT payload: { userId: 1, role: "student" } // Faqat umumiy ochiq ma’lumotlar',
            explanation: 'JWT payloadi shifrlanmagan bo‘ladi, uni har qanday odam ko‘ra oladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prof-6-1',
            question: 'Nima uchun XSS hujumlaridan himoyalanishda tokenni localStorage o‘rniga HttpOnly Cookie da saqlash tavsiya etiladi?',
            type: 'multiple-choice',
            options: [
              'Chunki HttpOnly cookie xotiradan kam joy oladi',
              'Chunki JavaScript kodlari (XSS skriptlar) HttpOnly cookieni o‘g‘irlay olmaydi',
              'Chunki cookie faqat Chrome da ishlaydi',
              'Chunki cookie muddati hech qachon tugamaydi',
            ],
            correctAnswer: 1,
            explanation: 'HttpOnly bayrog‘i brauzer JavaScript kodi uchun cookieni yashiradi va XSS hujumlarida token o‘g‘irlanishini to‘xtatadi.',
          },
        ],
        summary: 'Siz JWT strukturasi, Base64 payload auditi va HttpOnly cookie xavfsizligini o‘rgandingiz.',
        nextLessonSlug: 'hardcoded-secrets-bff-proxy',
        nextLessonTitle: 'Ochiq Kalitlarni (Secrets) Aniqlash va BFF Server-Side Proxy',
      },
    },
    exercise: {
      id: 'ex-prof-6',
      lessonId: 'les-prof-6',
      title: 'JWT Yaroqlilik Auditorini Yaratish',
      description: 'Berilgan token payload obyektini tekshiruvchi verifyTokenPayload funksiyasini yozing. U muddat va rollarni tekshirsin.',
      instructions: [
        'verifyTokenPayload(payload, currentTimestamp) funksiyasini yarating.',
        'Agar payload.exp <= currentTimestamp bo‘lsa, "EXPIRED" deb qaytarsin.',
        'Agar payload.role !== "admin" bo‘lsa, "NOT_ADMIN" deb qaytarsin.',
        'Agar token muddati o‘tmagan va roli "admin" bo‘lsa, "VALID_ADMIN" deb qaytarsin.',
      ],
      starterCode: `function verifyTokenPayload(payload, currentTimestamp) {\n  if (payload.exp <= currentTimestamp) return "EXPIRED";\n  if (payload.role !== "admin") return "NOT_ADMIN";\n  return "VALID_ADMIN";\n}\n\nconsole.log(verifyTokenPayload({ sub: "u1", role: "admin", exp: 1700000000 }, 1690000000));\n`,
      language: 'javascript',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-prof-6-1',
          description: 'Muddati toza va admin roli bo‘lganda VALID_ADMIN chiqishi kerak',
          expectedOutput: 'VALID_ADMIN',
          type: 'output',
        },
      ],
      hiddenTests: [
        {
          id: 'tc-prof-6-2',
          description: 'Tahlil natijasi to‘g‘ri bo‘lishi kerak',
          expectedOutput: 'VALID_ADMIN',
          type: 'contains',
        },
      ],
      hints: [
        '1-bosqich: if (payload.exp <= currentTimestamp) return "EXPIRED";',
        '2-bosqich: if (payload.role !== "admin") return "NOT_ADMIN";',
        '3-bosqich: return "VALID_ADMIN";',
      ],
      solutionExplanation: 'JWT tekshiruvida dastlab uning muddati (expiration time), so‘ngra foydalanuvchi huquqlari baholanadi.',
      passingScore: 100,
      expectedConcepts: ['exp', 'role', 'currentTimestamp', 'return'],
    },
  },

  // ============================================================
  // 4-MODUL: Xavfsizlik Auditi va Maxfiy Ma’lumotlar Himoyasi
  // ============================================================
  {
    lesson: {
      id: 'les-prof-7',
      moduleId: 'mod-prof-4',
      courseId: 'course-profiling',
      title: 'Ochiq Kalitlarni (Secrets) Aniqlash va BFF Server-Side Proxy',
      slug: 'hardcoded-secrets-bff-proxy',
      description: 'Frontend yoki mobil kodda unutilgan API kalitlar (OpenAI, Stripe, Firebase) xavfi, ularni qidirish (Secrets Audit) va to‘g‘ri yashirish: BFF (Backend-For-Frontend) proxy arxitekturasi.',
      objectives: [
        'Kod ichidagi xom API kalitlarni (Hardcoded secrets) aniqlay olish',
        '.env va server muhiti orqali kalitlarni xavfsiz boshqarish',
        'BFF (Backend-For-Frontend) arxitekturasi orqali uchinchi tomon API kalitlarini yashirish',
      ],
      estimatedMinutes: 25,
      order: 7,
      published: true,
      content: {
        title: 'Ochiq Kalitlarni (Secrets) Aniqlash va BFF Server-Side Proxy',
        learningObjective: 'Client kodidan maxfiy kalitlar o‘g‘irlanishini to‘xtatish, maxfiy kalitlarni skanerlash va ularni backend proxy orqali himoyalashni o‘rganish.',
        realLifeAnalogy: 'Tasavvur qiling, sizda shaxsiy oltin seyf bor. Mijoz kelganda unga seyfning parolini berib «O‘zingiz ochib kerakli qog‘ozni oling» desangiz — mijoz butun seyfni bo‘shatib ketishi mumkin! Buning o‘rniga siz (Backend) mijozdan nima kerakligini so‘raysiz, o‘zingiz seyfdan olasiz va mijozga faqat o‘sha qog‘ozni berib yuborasiz (BFF Proxy). Seyf paroli esa faqat sizda qoladi!',
        theory: [
          {
            type: 'heading',
            content: 'Nima Uchun Client Kodida Secret Bo‘lishi Mumkin Emas?',
          },
          {
            type: 'text',
            content: 'Agar siz React, Vue yoki mobil ilova ichida to‘g‘ridan-to‘g‘ri OpenAI, Stripe yoki AWS maxfiy kalitini yozsangiz, F12 bosgan har qanday o‘quvchi Network tabida yoki kompilyatsiya qilingan JS faylida sizning kalitingizni ko‘rib oladi va sizning hisobingizdan minglab dollarlik so‘rovlarni ishlatib yuboradi!',
          },
          {
            type: 'heading',
            content: 'To‘g‘ri Yechim: BFF (Backend-For-Frontend) Proxy',
          },
          {
            type: 'text',
            content: '1. Maxfiy kalit faqat serverdagi .env faylida saqlanadi (OPENAI_API_KEY=sk-proj-...).\n2. Frontend faqat o‘zimizning serverimizga so‘rov yuboradi: fetch("/api/chat").\n3. Bizning server so‘rovni tekshiradi, o‘zidagi maxfiy kalitni qo‘shib OpenAI ga yuboradi va javobni frontendga qaytaradi.\n4. Natijada frontend mijoz hech qachon haqiqiy kalitni ko‘rmaydi!',
          },
        ],
        interactiveExample: {
          title: 'Matndan xavfli kalitlarni aniqlash (Secrets Scanner)',
          description: 'Regex yordamida ochiq qolgan tokenlarni skanerlaymiz.',
          language: 'javascript',
          code: `function scanForSecrets(codeString) {\n  const patterns = [\n    { name: "OpenAI Key", regex: /sk-[a-zA-Z0-9]{15,}/ },\n    { name: "Generic API Key", regex: /api_key\\s*[:=]\\s*["'][a-zA-Z0-9]{10,}["']/i }\n  ];\n\n  const leaks = [];\n  for (const p of patterns) {\n    if (p.regex.test(codeString)) leaks.push(p.name);\n  }\n  return leaks;\n}\n\nconst sampleCode = 'const config = { api_key: "abc123456789012" };';\nconsole.log("Aniqlangan oqishlar: " + scanForSecrets(sampleCode).join(", "));`,
          expectedOutput: "Aniqlangan oqishlar: Generic API Key",
          lineExplanations: {
            2: 'Ochiq kalitlar uchun maxsus regex qoliplari.',
            9: 'Kod ichidan xavfli naqshlarni tekshirish.',
          },
        },
        commonMistakes: [
          {
            title: 'Next.js da NEXT_PUBLIC_ prefiksi bilan secret qo‘yish',
            wrongCode: 'NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_123 // NEXT_PUBLIC_ brauzerga ochiq jo‘natiladi!',
            correctCode: 'STRIPE_SECRET_KEY=sk_live_123 // Prefikssiz faqat serverda qoladi',
            explanation: 'Next.js da NEXT_PUBLIC_ bilan boshlangan barcha o‘zgaruvchilar foydalanuvchi brauzeriga ko‘rinadi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prof-7-1',
            question: 'Mijoz brauzeridan OpenAI yoki to‘lov tizimi maxfiy kalitini yashirish uchun qaysi arxitektura ishlatiladi?',
            type: 'multiple-choice',
            options: [
              'BFF (Backend-For-Frontend) server-side API proxy',
              'Kodni zip qilib qo‘yish',
              'Faqat CSS dan foydalanish',
              'Tokenni shrifini o‘zgartirish',
            ],
            correctAnswer: 0,
            explanation: 'BFF proksi orqali mijoz faqat o‘z serveriga murojaat qiladi, server esa maxfiy kalitni tashqi xizmatga xavfsiz biriktiradi.',
          },
        ],
        summary: 'Siz client-side secret xavflari, regex orqali skanerlash va BFF proxy arxitekturasini o‘rgandingiz.',
        nextLessonSlug: 'broken-endpoints-defensive-hardening',
        nextLessonTitle: 'Zaif Endpointlar Tahlili va Himoya Qilish (BOLA & Rate Limit)',
      },
    },
    exercise: {
      id: 'ex-prof-7',
      lessonId: 'les-prof-7',
      title: 'Maxfiy Kalitlarni Maskalovchi Sanitizer',
      description: 'Matn ichidagi maxfiy API kalitlarni yashiruvchi maskSecrets funksiyasini yozing.',
      instructions: [
        'maskSecrets(text) funksiyasini yarating.',
        'Agar matnda sk-[a-zA-Z0-9]+ ko‘rinishidagi kalit uchrasa, uning "sk-" qismi va oxirgi 3 ta belgisini saqlab, o‘rtasini "***" ga almashtiring.',
        'Masalan: "sk-abcdefg123" -> "sk-***123".',
        'Agar maxfiy kalit bo‘lmasa, matnni o‘zgarishsiz qaytaring.',
      ],
      starterCode: `function maskSecrets(text) {\n  return text.replace(/sk-[a-zA-Z0-9]+/g, match => {\n    const end = match.slice(-3);\n    return "sk-***" + end;\n  });\n}\n\nconsole.log(maskSecrets("OpenAI key: sk-live9876543210xyz"));\n`,
      language: 'javascript',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-prof-7-1',
          description: 'OpenAI kaliti to‘g‘ri maskalanishi kerak',
          expectedOutput: 'OpenAI key: sk-***xyz',
          type: 'output',
        },
      ],
      hiddenTests: [
        {
          id: 'tc-prof-7-2',
          description: 'sk-*** prefiksi bilan maskalanishi kerak',
          expectedOutput: 'sk-***',
          type: 'contains',
        },
      ],
      hints: [
        '1-bosqich: text.replace(/sk-[a-zA-Z0-9]+/g, match => { ... }) dan foydalaning.',
        '2-bosqich: const end = match.slice(-3); return "sk-***" + end;',
      ],
      solutionExplanation: 'Audit hisobotlarida yoki loglarda maxfiy kalitlarni ochiq ko‘rsatmaslik uchun ularni maskalash amaliyoti qo‘llaniladi.',
      passingScore: 100,
      expectedConcepts: ['replace', 'regex', 'slice', 'return'],
    },
  },

  {
    lesson: {
      id: 'les-prof-8',
      moduleId: 'mod-prof-4',
      courseId: 'course-profiling',
      title: 'Zaif Endpointlar Tahlili va Himoya Qilish (BOLA & Rate Limit)',
      slug: 'broken-endpoints-defensive-hardening',
      description: 'API xavfsizligida OWASP Top-1: BOLA (Broken Object Level Authorization / IDOR), Rate Limiting (DDoS va brute-force dan himoya) va himoyalash amaliyoti.',
      objectives: [
        'BOLA / IDOR zaifligi nima ekanini va nima uchun yuzaga kelishini tushunish',
        'Foydalanuvchi ma’lumotlariga ruxsatlarni (Ownership & RBAC) to‘g‘ri tekshirish',
        'API endpointlarini Rate Limiting orqali hujumlardan himoyalash',
      ],
      estimatedMinutes: 25,
      order: 8,
      published: true,
      content: {
        title: 'Zaif Endpointlar Tahlili va Himoya Qilish (BOLA & Rate Limit)',
        learningObjective: 'API endpointlarining eng keng tarqalgan zaifliklarini (BOLA/IDOR va haddan ortiq so‘rovlar) tushunish va ularni backend middleware orqali mustahkamlashni o‘rganish.',
        realLifeAnalogy: 'Tasavvur qiling, mehmonxonadasiz. Sizning xonangiz 105. Agar siz 106-xona eshigini shunchaki burab ochib, uning ichidagi narsalarni ko‘ra olsangiz — bu BOLA (IDOR) zaifligidir! Xavfsiz mehmonxona (Backend) sizning kalitingiz aynan o‘sha xonaga tegishli ekanini qat’iy tekshirishi kerak!',
        theory: [
          {
            type: 'heading',
            content: 'BOLA (Broken Object Level Authorization / IDOR) Nima?',
          },
          {
            type: 'text',
            content: 'Masalan, foydalanuvchi profilini ko‘rish API si:\nGET /api/documents/105\nAgar 2-foydalanuvchi URL dagi raqamni GET /api/documents/106 deb o‘zgartirsa va server 106-hujjat aynan o‘sha foydalanuvchiga tegishli ekanini tekshirmasdan ma’lumotni berib yuborsa — bu BOLA zaifligidir!\n\nTo‘g‘ri himoya kodi:\nconst doc = await db.documents.findById(req.params.id);\nif (doc.ownerId !== req.currentUser.id && req.currentUser.role !== "admin") {\n  return res.status(403).json({ error: "Ruxsat berilmagan!" });\n}',
          },
          {
            type: 'heading',
            content: 'Rate Limiting (So‘rovlar Tezligini Cheklash)',
          },
          {
            type: 'text',
            content: 'Tajovuzkorlar yoki skriptlar endpointga 1 soniyada 10 000 marta so‘rov yuborib serverni qulatishi yoki parollarni taxmin qilishi mumkin. Rate Limiting bitta IP ga masalan 1 daqiqada maksimum 60 ta so‘rov ruxsatini beradi. Limit oshganda server 429 Too Many Requests status kodi bilan javob qaytaradi.',
          },
        ],
        interactiveExample: {
          title: 'Oddiy Rate Limiter tekshiruvi',
          description: 'Foydalanuvchi so‘rovlari sonini hisoblab, limitdan oshganda 429 qaytaramiz.',
          language: 'javascript',
          code: `function checkRateLimit(requestCount, maxAllowed = 5) {\n  if (requestCount > maxAllowed) {\n    return { status: 429, allowed: false, message: "Too Many Requests" };\n  }\n  return { status: 200, allowed: true, message: "OK" };\n}\n\nconsole.log(checkRateLimit(3).status);\nconsole.log(checkRateLimit(6).status);`,
          expectedOutput: "200\n429",
          lineExplanations: {
            2: 'So‘rovlar soni limitdan oshganini tekshirish.',
            3: '429 HTTP status kodi.',
          },
        },
        commonMistakes: [
          {
            title: 'Faqat frontendda tekshirishga ishonish',
            wrongCode: '// Frontend: if (user.id !== doc.userId) hideButton(); // Lekin API endpointi tekshirmaydi!',
            correctCode: '// Backend API da majburiy ravishda: if (doc.ownerId !== user.id) return 403;',
            explanation: 'Frontenddagi har qanday tekshiruvni cURL orqali aylanib o‘tish mumkin. Xavfsizlik faqat backendda kafolatlanadi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prof-8-1',
            question: 'Foydalanuvchi boshqa shaxsning ID sini URL ga qo‘yib, uning ma’lumotlarini ko‘rib olish zaifligi qanday nomlanadi?',
            type: 'multiple-choice',
            options: [
              'BOLA / IDOR (Broken Object Level Authorization)',
              'CSS Flexbox',
              'SQL Join',
              'Event Loop',
            ],
            correctAnswer: 0,
            explanation: 'BOLA (IDOR) — obyekt darajasidagi ruxsat tekshiruvi yo‘qligi tufayli yuzaga keladi.',
          },
        ],
        summary: 'Siz BOLA / IDOR zaifligini bartaraf etish, resurs egaligini tekshirish va Rate Limiting orqali himoyalashni o‘rgandingiz.',
        nextLessonSlug: 'devtools-network-xhr',
        nextLessonTitle: 'Brauzer DevTools: Network Tab, XHR/Fetch va JSON Oqimlari',
      },
    },
    exercise: {
      id: 'ex-prof-8',
      lessonId: 'les-prof-8',
      title: 'BOLA Himoya Middleware Yaratish',
      description: 'Resurs egasi yoki admin bo‘lmagan foydalanuvchilarning kirishini bloklovchi authorizeResource funksiyasini yozing.',
      instructions: [
        'authorizeResource(user, resource) funksiyasini yarating.',
        'user — { id, role }, resource — { id, ownerId }.',
        'Agar user.role === "admin" bo‘lsa, "ALLOWED_ADMIN" deb qaytarsin.',
        'Agar user.id === resource.ownerId bo‘lsa, "ALLOWED_OWNER" deb qaytarsin.',
        'Aks holda ruxsat berilmasin va "ACCESS_DENIED" deb qaytarsin.',
      ],
      starterCode: `function authorizeResource(user, resource) {\n  if (user.role === "admin") return "ALLOWED_ADMIN";\n  if (user.id === resource.ownerId) return "ALLOWED_OWNER";\n  return "ACCESS_DENIED";\n}\n\nconsole.log(authorizeResource({ id: 1, role: "admin" }, { id: 10, ownerId: 2 }));\n`,
      language: 'javascript',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-prof-8-1',
          description: 'Admin uchun ALLOWED_ADMIN qaytishi kerak',
          expectedOutput: 'ALLOWED_ADMIN',
          type: 'output',
        },
      ],
      hiddenTests: [
        {
          id: 'tc-prof-8-2',
          description: 'ALLOWED qaytishi kerak',
          expectedOutput: 'ALLOWED',
          type: 'contains',
        },
      ],
      hints: [
        '1-bosqich: if (user.role === "admin") return "ALLOWED_ADMIN";',
        '2-bosqich: if (user.id === resource.ownerId) return "ALLOWED_OWNER";',
        '3-bosqich: return "ACCESS_DENIED";',
      ],
      solutionExplanation: 'BOLA/IDOR xurujlarini bartaraf etishda server har doim foydalanuvchining ID si resursning ownerId si bilan mos kelishini tekshiradi.',
      passingScore: 100,
      expectedConcepts: ['role === "admin"', 'user.id === resource.ownerId', 'return'],
    },
  },
];
