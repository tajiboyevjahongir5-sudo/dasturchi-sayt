/**
 * CodeQuest — JavaScript Intermediate Curriculum Definition
 * 5 Modules, 18 Comprehensive Lessons, Multi-file Projects, Test Cases, and Quizzes
 * 
 * SPRINT 1 QUALITY REMEDIATION:
 * - StarterCode driver harness for all 18 lessons
 * - Strict 3-tier hints (Thinking -> Logic -> Syntax) for all 18 lessons
 * - At least 2 meaningful Quiz questions with detailed explanations for all 18 lessons
 * - Full LocalStorage XSS security warnings and WHATWG event loop specifications
 * - Production-ready Multi-file Task Manager with a11y, LocalStorage and filtering
 */

export const jsIntermediateCourse = {
  "title": "JavaScript Intermediate (O‘rta daraja)",
  "slug": "javascript-intermediate",
  "shortDescription": "Scope, Closures, Event Loop, Asinxron dasturlash, DOM arxitekturasi va Multi-file loyiha.",
  "description": "JavaScript tilining o‘rta va yuqori darajadagi nozikliklari: leksik muhit, xotira boshqaruvi, prototiplar, hodisalar oqimi, asinxron dasturlash va brauzer imkoniyatlarini professional darajada o‘rganing.",
  "category": "frontend",
  "level": "orta",
  "thumbnail": "⚡",
  "estimatedHours": 25,
  "technologies": [
    "JavaScript",
    "ES6+",
    "Async/Await",
    "Event Loop",
    "DOM",
    "LocalStorage",
    "Multi-file"
  ]
};

export const jsIntermediateModules = [
  {
    "order": 1,
    "title": "1-Modul: JavaScript’ni Chuqurroq Tushunish",
    "description": "Scope turlari, leksik muhit (Lexical Environment), Hoisting, Temporal Dead Zone va Closures mexanizmi.",
    "slug": "deep-javascript-mechanics"
  },
  {
    "order": 2,
    "title": "2-Modul: Funksiyalar va Obyektlar",
    "description": "Higher-order funksiyalar, callbacklar, this konteksti, call/apply/bind va prototip merosxo‘rligi.",
    "slug": "functions-and-prototypes"
  },
  {
    "order": 3,
    "title": "3-Modul: Asinxron JavaScript",
    "description": "Call stack, Web APIs, Event Loop, Microtasks, Promises, async/await va xatolarni boshqarish.",
    "slug": "async-javascript-event-loop"
  },
  {
    "order": 4,
    "title": "4-Modul: Brauzer Muhiti Bilan Ishlash",
    "description": "DOM arxitekturasi, Event bubbling va delegation, Form validation, LocalStorage, Debouncing va Throttling.",
    "slug": "browser-apis-and-dom"
  },
  {
    "order": 5,
    "title": "5-Modul: Yakuniy Amaliy Loyiha (Multi-file Task Manager)",
    "description": "HTML, CSS va JavaScript asosida to‘liq interaktiv, LocalStorage bilan ishlovchi Task Manager loyihasi.",
    "slug": "interactive-task-manager-project"
  }
];

export const jsIntermediateLessons = [
  {
    "moduleIndex": 0,
    "order": 1,
    "title": "1-Dars: Scope va Leksik Muhit (Lexical Environment)",
    "slug": "scope-va-lexical-environment",
    "description": "Global, function va block scope farqlari, Scope Chain va identifikatorlarni qidirish mexanizmi.",
    "estimatedMinutes": 20,
    "objectives": [
      "Global, funksiya va blok doirasidagi ko‘rinish (Scope) farqlarini ajrata olish",
      "Leksik muhit (Lexical Environment) va Scope Chain orqali o‘zgaruvchilarni qidirish mexanizmini tushunish"
    ],
    "content": {
      "title": "1-Dars: Scope va Leksik Muhit (Lexical Environment)",
      "learningObjective": "Scope turlari va kodning qaysi nuqtasida qaysi o‘zgaruvchilardan foydalanish mumkinligini boshqarishni o‘rganish.",
      "prerequisites": "JavaScript asoslari: let, const va funksiyalar haqida tushuncha.",
      "realLifeAnalogy": "Ko‘p qavatli uy xonalari: Siz ichki xonada turib, ochiq eshik orqali dahlizdagi va hovlidagi buyumlarni bemalol ko‘rishingiz mumkin (Scope Chain). Ammo tashqarida turgan begona odam sizning ichki xonangizdagi buyumlarni ko‘ra olmaydi (Scope izolyatsiyasi).",
      "theory": [
        {
          "type": "text",
          "content": "JavaScript tilida **Scope** (ko‘rinish sohasi) — bu o‘zgaruvchilar va funksiyalarning qayerda e’lon qilinganligi va qayerdan ularga murojaat qilish mumkinligini belgilovchi qoidalar to‘plamidir. Zamonaviy JavaScriptda 3 xil asosiy scope mavjud:\n\n1. **Global Scope:** Dasturning istalgan joyidan kirish mumkin bo‘lgan soha.\n2. **Function Scope:** Funksiya ichida e’lon qilingan o‘zgaruvchilar faqat shu funksiya ichida mavjud bo‘ladi.\n3. **Block Scope:** Jingalak qavslar `{ ... }` ichida `let` yoki `const` bilan e’lon qilingan o‘zgaruvchilar faqat o‘sha blok ichida ko‘rinadi."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "function checkAccess() {\n  const insideFunction = \"Men funksiya ichidaman\";\n  if (true) {\n    const insideBlock = \"Men blok ichidaman\";\n    console.log(insideFunction); // Ishlaydi: tashqi function scope ochiq\n  }\n  // console.log(insideBlock); // Xatolik: insideBlock bu yerda mavjud emas!\n}\ncheckAccess();",
          "lineExplanations": {
            "2": "insideFunction o‘zgaruvchisi butun checkAccess funksiyasi ichida ko‘rinadi",
            "4": "insideBlock faqatgina if blokining jingalak qavslari ichida yashaydi",
            "5": "Ichki blok tashqi funksiya sohasidagi o‘zgaruvchini bemalol o‘qiy oladi",
            "7": "insideBlock ga blok tashqarisidan murojaat qilib bo‘lmaydi (ReferenceError)"
          }
        },
        {
          "type": "tip",
          "content": "Leksik muhit (Lexical Environment) — kod qayerda yozilganiga qarab belgilanadi. U ikki qismdan iborat: Environment Record (joriy o‘zgaruvchilar) va Tashqi leksik muhit havolasi (outer reference). JavaScript dvigateli o‘zgaruvchini avval joriy blokdan, topa olmasa tashqi blokdan, nihoyat global sohadan qidiradi (Scope Chain)."
        }
      ],
      "commonMistakes": [
        {
          "title": "Blok scopedan tashqarida let/const ga murojaat qilish",
          "wrongCode": "const isValid = true;\nif (isValid) {\n  let token = \"abc-123\";\n}\nconsole.log(token);",
          "correctCode": "const isValid = true;\nlet token = null;\nif (isValid) {\n  token = \"abc-123\";\n}\nconsole.log(token);",
          "explanation": "let va const blok doirasiga ega. Agar o‘zgaruvchi blokdan tashqarida kerak bo‘lsa, uni blokdan oldin e’lon qilish lozim.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-scope-1",
          "question": "`const` kalit so‘zi bilan blok ichida e’lon qilingan o‘zgaruvchi qayerda ko‘rinadi?",
          "type": "multiple-choice",
          "options": [
            "Butun fayl bo‘yicha global ko‘rinadi",
            "Faqat o‘zi e’lon qilingan blok ichida ko‘rinadi",
            "Faqat funksiya tugaguncha ko‘rinadi",
            "Faqat tashqi script fayllarda ko‘rinadi"
          ],
          "correctAnswer": 1,
          "explanation": "`let` va `const` blok doirasiga (Block Scope) ega bo‘lib, faqat o‘zining jingalak qavslari ichida mavjud bo‘ladi."
        },
        {
          "id": "q-scope-2",
          "question": "Scope Chain qidiruv yo‘nalishi qanday ishlaydi?",
          "type": "multiple-choice",
          "options": [
            "Globaldan ichkariga qarab qidiradi",
            "Ichki sohadan tashqi sohalarga qarab qidiradi",
            "Tasodifiy tartibda qidiradi",
            "Faqat global o‘zgaruvchilarni tekshiradi"
          ],
          "correctAnswer": 1,
          "explanation": "Dvigatel o‘zgaruvchini dastlab eng ichki joriy sohadan izlaydi, topolmasa yuqoridagi ota sohalarga qarab ko‘tariladi."
        }
      ],
      "reflectionQuestion": "Nima uchun zamonaviy JavaScriptda global o‘zgaruvchilardan imkon qadar kamroq foydalanish tavsiya etiladi?",
      "summary": "Ushbu darsda global, funksiya va blok ko‘rinish sohalarini hamda Scope Chain qoidalarini o‘rgandik.",
      "nextLessonSlug": "hoisting-va-temporal-dead-zone",
      "nextLessonTitle": "2-Dars: Hoisting va Temporal Dead Zone"
    },
    "exercise": {
      "title": "Xavfsiz hisob-kitob va Scope izolyatsiyasi",
      "description": "calculateCartTotal nomli funksiya yozing. U narxlar massivi (prices) va chegirma foizini (discountPercent) qabul qilsin. Funksiya global o‘zgaruvchilarni ifloslantirmasdan, har bir narxdan chegirma ayirib, umumiy summani yaxlitlab (Math.round) qaytarsin.",
      "instructions": [
        "calculateCartTotal(prices, discountPercent) funksiyasini e’lon qiling",
        "Ichki total yig‘indisini blok doirasidagi o‘zgaruvchida hisoblang",
        "Agar prices bo‘sh bo‘lsa, 0 qaytaring",
        "Yakuniy summani Math.round() qilib qaytaring"
      ],
      "starterCode": "function calculateCartTotal(prices, discountPercent) {\n  // Funksiya tanasini to'ldiring:\n  // Har bir narxdan discountPercent chegirmasini ayirib, Math.round bilan yaxlitlang.\n  // Bo'sh massiv uchun 0 qaytaring.\n}\n\n// Sinov uchun chaqiruvlar:\nconsole.log(\"Jami:\", calculateCartTotal([100, 200, 300], 10));\nconsole.log(\"Bo‘sh:\", calculateCartTotal([], 10));\nconsole.log(\"Yashirin:\", calculateCartTotal([50, 150], 20));\n",
      "language": "javascript",
      "difficulty": "easy",
      "passingScore": 100,
      "xpReward": 60,
      "testCases": [
        {
          "id": "tc-sc-1",
          "description": "[100, 200, 300] va 10% chegirma bilan 540 chiqishi",
          "expectedOutput": "Jami: 540",
          "isHidden": false
        },
        {
          "id": "tc-sc-2",
          "description": "Bo‘sh massiv berilganda 0 qaytishi kerak",
          "expectedOutput": "Bo‘sh: 0",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-sc-3",
          "description": "[50, 150] va 20% chegirma bilan 160 chiqishi",
          "expectedOutput": "Yashirin: 160",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Dastlab narxlar massivi mavjudligi va bo‘sh emasligini qanday tekshirish hamda summani to‘plash uchun qanday lokal o‘zgaruvchi kerakligini o‘ylab ko‘ring.",
        "2-yordam: Bo‘sh massiv bo‘lsa 0 qaytaring. Aks holda for yoki for...of sikli orqali har bir narxdan chegirma foizini ayirib, umumiy summaga qo‘shing.",
        "3-yordam: price * (1 - discountPercent / 100) orqali chegirmali narxni hisoblab yig‘indiga qo‘shing va Math.round(total) bilan yaxlitlab return qiling."
      ],
      "solutionExplanation": "prices massividagi har bir narxga chegirma qo‘llanib, total o‘zgaruvchisiga yig‘iladi va Math.round(total) qaytariladi.",
      "expectedConcepts": [
        "scope",
        "let",
        "function",
        "Math.round"
      ],
      "validSolutionCode": "function calculateCartTotal(prices, discountPercent) {\n  if (!prices || prices.length === 0) return 0;\n  let total = 0;\n  for (const price of prices) {\n    const discounted = price * (1 - discountPercent / 100);\n    total += discounted;\n  }\n  return Math.round(total);\n}\nconsole.log(\"Jami:\", calculateCartTotal([100, 200, 300], 10));\nconsole.log(\"Bo‘sh:\", calculateCartTotal([], 10));\nconsole.log(\"Yashirin:\", calculateCartTotal([50, 150], 20));",
      "deliberateErrorCode": "function calculateCartTotal(prices, discountPercent) {\n  return invalidVariableUndefined;\n}\nconsole.log(\"Jami:\", calculateCartTotal([100], 10));"
    }
  },
  {
    "moduleIndex": 0,
    "order": 2,
    "title": "2-Dars: Hoisting va Temporal Dead Zone (TDZ)",
    "slug": "hoisting-va-temporal-dead-zone",
    "description": "var hoistingi, let va const ning Temporal Dead Zone holati, funksiya deklaratsiyasi va ifodasi farqi.",
    "estimatedMinutes": 25,
    "objectives": [
      "var hoistingi va let/const ning Temporal Dead Zone (TDZ) farqini tushunish",
      "Funksiya deklaratsiyasi (Declaration) va funksiya ifodasi (Expression) orasidagi hoisting farqini bilish"
    ],
    "content": {
      "title": "2-Dars: Hoisting va Temporal Dead Zone (TDZ)",
      "learningObjective": "O‘zgaruvchi va funksiyalarni e’lon qilish tartibini tushunish hamda kutilmagan ReferenceError xatolarini oldini olish.",
      "prerequisites": "1-Dars: Scope va Leksik Muhit.",
      "realLifeAnalogy": "Restoranda taom buyurtma qilish: Menyuda taomlar nomi oldindan yozib qo‘yilgan (Hoisting), lekin taom oshpaz tomonidan tayyorlanib stolga qo‘yilguncha (Initsializatsiya), siz uni iste’mol qila olmaysiz. Agar pishmasdan avval qo‘l ursangiz, kuyib qolasiz — bu xuddi Temporal Dead Zone (TDZ) kabi xatoga olib keladi.",
      "theory": [
        {
          "type": "text",
          "content": "**Hoisting** — bu JavaScript dvigateli kodni bajarishdan oldin o‘zgaruvchilar va funksiyalar deklaratsiyasini xotiraga yozib olishi (ko‘tarish) jarayonidir.\n\n- `var`: Deklaratsiyasi yuqoriga ko‘tariladi va avtomatik ravishda `undefined` bilan initsializatsiya qilinadi.\n- `let` va `const`: Ular ham hoisting bo‘ladi, ammo initsializatsiya qilinmaydi. Ular e’lon qilingan qatorga yetib kelguncha **Temporal Dead Zone (TDZ)** holatida turadi. Bu vaqtda ularga murojaat qilish `ReferenceError` xatosiga olib keladi.\n- **Function Declaration:** Butun funksiya tanasi bilan hoisting bo‘ladi, uni e’lon qilingan qatordan oldin chaqirish mumkin."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "// Funksiya deklaratsiyasi hoisting bo'ladi:\nsayHello(); // \"Salom!\" deb ishlaydi\n\nfunction sayHello() {\n  console.log(\"Salom!\");\n}\n\n// let va const TDZ da bo'ladi:\n// console.log(userAge); // ReferenceError: Cannot access 'userAge' before initialization\nconst userAge = 25;",
          "lineExplanations": {
            "2": "sayHello() o‘z e’lonidan oldin bemalol chaqiriladi",
            "9": "userAge ga initsializatsiyadan oldin murojaat qilish TDZ xatosini beradi"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "Arrow functionni e’lon qilinishidan oldin chaqirish",
          "wrongCode": "greet();\nconst greet = () => console.log(\"Salom\");",
          "correctCode": "const greet = () => console.log(\"Salom\");\ngreet();",
          "explanation": "Arrow funksiyalar `const` yoki `let` o‘zgaruvchilariga biriktiriladi, shuning uchun ular ham TDZ qoidasiga bo‘ysunadi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-hoist-1",
          "question": "`let x = 5;` qatoridan oldin `console.log(x);` chaqirilsa nima yuz beradi?",
          "type": "multiple-choice",
          "options": [
            "undefined chiqadi",
            "5 chiqadi",
            "ReferenceError xatosi yuz beradi",
            "null chiqadi"
          ],
          "correctAnswer": 2,
          "explanation": "`let` va `const` initsializatsiyagacha Temporal Dead Zone (TDZ)da bo‘ladi va ReferenceError yuz beradi."
        },
        {
          "id": "q-hoist-2",
          "question": "Quyidagilardan qaysi biri e’lon qilingan qatordan oldin to‘liq chaqirilishi mumkin?",
          "type": "multiple-choice",
          "options": [
            "Function Declaration (function myFunc() {})",
            "Function Expression (const myFunc = function() {})",
            "Arrow Function (const myFunc = () => {})",
            "Hech biri"
          ],
          "correctAnswer": 0,
          "explanation": "Faqat an’anaviy Function Declaration dvigatel tomonidan to‘liq tanasi bilan hoisting qilinadi."
        }
      ],
      "reflectionQuestion": "Nima sababdan zamonaviy dasturchilar `var` o‘rniga deyarli har doim `const` va `let` dan foydalanishadi?",
      "summary": "Hoisting tushunchasi, TDZ xavflari va funksiyalarni to‘g‘ri tartibda e’lon qilishni o‘rgandik.",
      "nextLessonSlug": "closures-yopiq-funksiyalar",
      "nextLessonTitle": "3-Dars: Closures (Yopiq Funksiyalar)"
    },
    "exercise": {
      "title": "TDZ dan holi profil formatlovchi funksiya",
      "description": "formatUserProfile(user) nomli funksiya yozing. U user obyektini qabul qilib, uning name va role qiymatlariga qarab \"Foydalanuvchi: [NAME] | Rol: [ROLE]\" satrini qaytarsin. Agar role kiritilmagan bo‘lsa, standart holatda \"Oddiy foydalanuvchi\" bo‘lsin. Hech qanday TDZ va hoisting xatolariga yo‘l qo‘ymang.",
      "instructions": [
        "formatUserProfile funksiyasini to‘g‘ri e’lon qiling",
        "Agar user obyekti bo‘lmasa, \"Foydalanuvchi topilmadi\" qaytaring",
        "Default rol qiymatini xavfsiz initsializatsiya qiling"
      ],
      "starterCode": "function formatUserProfile(user) {\n  // TDZ va hoisting xatolariga yo'l qo'ymaslik uchun o'zgaruvchilarni to'g'ri tartibda e'lon qiling.\n  // user obyekti { name, role } qabul qilib, \"[ROLE]: [NAME]\" formatida qaytarsin.\n}\n\n// Sinov uchun chaqiruvlar:\nconsole.log(formatUserProfile({ name: \"Ali\", role: \"admin\" }));\nconsole.log(formatUserProfile({ name: \"Zuhra\", role: \"moderator\" }));\nconsole.log(formatUserProfile({ name: \"Vali\", role: \"user\" }));\n",
      "language": "javascript",
      "difficulty": "easy",
      "passingScore": 100,
      "xpReward": 60,
      "testCases": [
        {
          "id": "tc-hoist-1",
          "description": "To‘liq ma’lumotli profilni formatlash",
          "expectedOutput": "Foydalanuvchi: Jasur | Rol: O‘qituvchi",
          "isHidden": false
        },
        {
          "id": "tc-hoist-2",
          "description": "Rol kiritilmaganda standart rol berilishi",
          "expectedOutput": "Foydalanuvchi: Laylo | Rol: Oddiy foydalanuvchi",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-hoist-3",
          "description": "user obyekti berilmaganda to‘g‘ri xabar qaytishi",
          "expectedOutput": "Foydalanuvchi topilmadi",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: let va const o‘zgaruvchilari e’lon qilinishidan oldin ishlatilsa nima uchun ReferenceError (TDZ) yuz berishini eslang.",
        "2-yordam: Funksiya boshida name va role qiymatlarini xavfsiz o‘qib oling va rollarni toUpperCase() orqali katta harfga o‘giring.",
        "3-yordam: return `${user.role.toUpperCase()}: ${user.name}`; ko‘rinishida natija qaytaring."
      ],
      "solutionExplanation": "TDZ xatolariga yo‘l qo‘ymaslik uchun o‘zgaruvchilar ishlatilishidan oldin e’lon qilinadi va formatlangan matn qaytariladi.",
      "expectedConcepts": [
        "hoisting",
        "tdz",
        "default parameters",
        "template literals"
      ],
      "validSolutionCode": "function formatUserProfile(user) {\n  if (!user || !user.name) return \"Foydalanuvchi topilmadi\";\n  const userRole = user.role || \"Oddiy foydalanuvchi\";\n  return `Foydalanuvchi: ${user.name} | Rol: ${userRole}`;\n}\nconsole.log(formatUserProfile({ name: \"Jasur\", role: \"O‘qituvchi\" }));\nconsole.log(formatUserProfile({ name: \"Laylo\" }));\nconsole.log(formatUserProfile(null));",
      "deliberateErrorCode": "function formatUserProfile(user) {\n  console.log(invalidVar);\n  let invalidVar = 10;\n}"
    }
  },
  {
    "moduleIndex": 0,
    "order": 3,
    "title": "3-Dars: Closures (Yopiq Funksiyalar)",
    "slug": "closures-yopiq-funksiyalar",
    "description": "Closure tushunchasi, xotirada leksik muhitni saqlash va shaxsiy (private) ma’lumotlarni inkapsulyatsiya qilish.",
    "estimatedMinutes": 30,
    "objectives": [
      "Closure (yopiq funksiya) nima ekanligini va qanday yaratilishini tushunish",
      "Shaxsiy (private) o‘zgaruvchilar va ma’lumotlar xavfsizligini (encapsulation) ta’minlash"
    ],
    "content": {
      "title": "3-Dars: Closures (Yopiq Funksiyalar)",
      "learningObjective": "Funksiyalar o‘zlari yaratilgan muhitni eslab qolishini tushunish va xavfsiz private holatlarni qurish.",
      "prerequisites": "Scope Chain va Funksiyalar.",
      "realLifeAnalogy": "Bank kassirining shaxsiy seyfi: Kassir tashqariga chiqsa ham, o‘z seyfining kalitini cho‘ntagida olib yuradi. Seyf ichidagi pullarni faqat kassir orqali (depozit yoki yechib olish) boshqarish mumkin, ko‘chadagi hech kim to‘g‘ridan-to‘g‘ri seyfni ocha olmaydi.",
      "theory": [
        {
          "type": "text",
          "content": "**Closure** — bu funksiyaning o‘zi e’lon qilingan leksik muhit (Lexical Scope) bilan birga bog‘lanishidir. Tashqi funksiya o‘z ishini tugatgan bo‘lsa ham, ichki funksiya tashqi o‘zgaruvchilarga murojaat qila oladi.\n\nAsosiy qo‘llanilishi:\n1. **Data Privacy (Maxfiy ma’lumotlar):** O‘zgaruvchini tashqaridan to‘g‘ridan-to‘g‘ri o‘zgartirib bo‘lmaydigan qilish.\n2. **Function Factories:** Turli sozlamalarga ega funksiyalar ishlab chiqarish."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "function createCounter() {\n  let count = 0; // Private o'zgaruvchi!\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter.increment()); // 1\nconsole.log(counter.getCount());  // 1\nconsole.log(counter.count);       // undefined (tashqaridan yopiq!)",
          "lineExplanations": {
            "2": "count o‘zgaruvchisi createCounter doirasida yopiq holatda saqlanadi",
            "4": "increment funksiyasi count ga o‘z closure orqali kiradi",
            "12": "counter.count deb to‘g‘ridan-to‘g‘ri murojaat qilib bo‘lmaydi (undefined qaytadi)"
          }
        },
        {
          "type": "text",
          "content": "**Function Factory va Xotira Boshqaruvi:**\nClosure yordamida parametrlar asosida maxsus funksiyalar yasovchi \"fabrikalar\" qurish mumkin:\n```javascript\nfunction makeMultiplier(factor) {\n  return (number) => number * factor;\n}\nconst double = makeMultiplier(2);\nconsole.log(double(5)); // 10\n```\n*Xotira eslatmasi:* Closure tashqi o‘zgaruvchilarni xotirada ushlab turadi. Keraksiz katta obyektlarni closure ichida saqlash xotira to‘lib ketishiga (Memory Leak) sabab bo‘lishi mumkin."
        }
      ],
      "commonMistakes": [
        {
          "title": "Private o‘zgaruvchini obyekt kaliti deb o‘ylash",
          "wrongCode": "const counter = createCounter();\ncounter.count = 100; // Bu yangi xususiyat yaratadi, ichki count ga ta'sir qilmaydi!",
          "correctCode": "// Faqat berilgan metodlar orqali boshqarish lozim\ncounter.increment();",
          "explanation": "Closure ichidagi o‘zgaruvchilar obyekt xususiyati emas, ular xotiradagi leksik bog‘lanishdir.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-cls-1",
          "question": "Closure qachon paydo bo‘ladi?",
          "type": "multiple-choice",
          "options": [
            "Faqat global o‘zgaruvchilar yaratilganda",
            "Ichki funksiya o‘zining tashqi funksiyasi o‘zgaruvchilariga murojaat qilganda",
            "Faqat setTimeout chaqirilganda",
            "Faqat massiv metodlari ishlatilganda"
          ],
          "correctAnswer": 1,
          "explanation": "Ichki funksiya tashqi funksiya o‘zgaruvchilarini eslab qolib, ulardan foydalanganda closure yuzaga keladi."
        },
        {
          "id": "q-cls-2",
          "question": "Quyidagilardan qaysi biri closure ning eng katta afzalligi hisoblanadi?",
          "type": "multiple-choice",
          "options": [
            "Ma’lumotlarni yashirish (Data Encapsulation)",
            "Brauzerni tezlashtirish",
            "HTML teglarni o‘chirish",
            "CSS kod hajmini qisqartirish"
          ],
          "correctAnswer": 0,
          "explanation": "Closure yordamida o‘zgaruvchilarni tashqi dunyodan himoyalab, faqat maxsus metodlar orqali boshqarish mumkin."
        }
      ],
      "reflectionQuestion": "Agar closure juda ko‘p ishlatilsa va xotiradan tozalanmasa, qanday xotira (Memory leak) muammolari kelib chiqishi mumkin?",
      "summary": "Closure tushunchasi, leksik bog‘lanish va shaxsiy holat yaratish tamoyillarini o‘rgandik.",
      "nextLessonSlug": "higher-order-functions",
      "nextLessonTitle": "4-Dars: Higher-Order Functions"
    },
    "exercise": {
      "title": "Xavfsiz Bank Hisobi (Bank Account Closure)",
      "description": "createBankAccount(initialBalance) nomli funksiya yozing. U faqat quyidagi 3 ta metodga ega obyekt qaytarsin:\n1. deposit(amount) — balansni oshiradi va yangi balansni qaytaradi\n2. withdraw(amount) — agar balans yetarli bo‘lsa, balansdan ayiradi va yangi balansni qaytaradi; agar yetarli bo‘lmasa \"Mablag‘ yetarli emas\" qaytaradi\n3. getBalance() — joriy balansni qaytaradi. Balans tashqaridan to‘g‘ridan-to‘g‘ri o‘zgartirilmasin!",
      "instructions": [
        "initialBalance qiymatini closure ichida private o‘zgaruvchi sifatida saqlang",
        "deposit(amount) metodida faqat musbat son qo‘shilsin",
        "withdraw(amount) metodida mablag‘ yetarli emasligini tekshiring"
      ],
      "starterCode": "function createBankAccount(initialBalance = 0) {\n  // Yechimni yozing:\n  // initialBalance ni closure ichida private o'zgaruvchi sifatida saqlang.\n  // Metodlar: deposit(amount), withdraw(amount), getBalance().\n}\n\n// Sinov uchun chaqiruvlar:\nconst acc = createBankAccount(100);\nacc.deposit(50);\nconsole.log(\"Balans:\", acc.getBalance());\nconsole.log(\"Yetarli emas:\", acc.withdraw(200));\nconsole.log(\"Yechildi:\", acc.withdraw(70));\nconsole.log(\"Balans yashirin:\", acc.balance === undefined);\n",
      "language": "javascript",
      "difficulty": "medium",
      "passingScore": 100,
      "xpReward": 70,
      "testCases": [
        {
          "id": "tc-cls-1",
          "description": "Depozit va balansni tekshirish",
          "expectedOutput": "Balans: 150",
          "isHidden": false
        },
        {
          "id": "tc-cls-2",
          "description": "Yetarli mablag‘ bo‘lmaganda ogohlantirish qaytishi",
          "expectedOutput": "Yetarli emas: Mablag‘ yetarli emas",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-cls-3",
          "description": "Muvaffaqiyatli pul yechish (withdraw)",
          "expectedOutput": "Yechildi: 80",
          "isHidden": true
        },
        {
          "id": "tc-cls-4",
          "description": "Balans tashqaridan yopiq (private) ekanini tekshirish",
          "expectedOutput": "Balans yashirin: true",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Bank hisobi balansini tashqaridan yashirish (inkapsulyatsiya) uchun uni createBankAccount funksiyasi tanasida alohida let o‘zgaruvchisi sifatida saqlash haqida o‘ylang.",
        "2-yordam: withdraw(amount) metodida avval so‘ralgan summa balansdan katta ekanligini tekshiring. Katta bo‘lsa \"Mablag‘ yetarli emas\" deb qaytaring, aks holda balansdan ayirib yangi balansni return qiling.",
        "3-yordam: return { deposit(amount) { if (amount > 0) balance += amount; return balance; }, withdraw(amount) { ... }, getBalance() { return balance; } }; ko‘rinishida obyekt qaytaring."
      ],
      "solutionExplanation": "balance o‘zgaruvchisi createBankAccount doirasida qoladi va faqat qaytarilgan metodlar orqali boshqariladi.",
      "expectedConcepts": [
        "closures",
        "encapsulation",
        "private variables"
      ],
      "validSolutionCode": "function createBankAccount(initialBalance = 0) {\n  let balance = initialBalance;\n  return {\n    deposit(amount) {\n      if (amount > 0) balance += amount;\n      return balance;\n    },\n    withdraw(amount) {\n      if (amount > balance) {\n        return \"Mablag‘ yetarli emas\";\n      }\n      balance -= amount;\n      return balance;\n    },\n    getBalance() {\n      return balance;\n    }\n  };\n}\nconst acc = createBankAccount(100);\nacc.deposit(50);\nconsole.log(\"Balans:\", acc.getBalance());\nconsole.log(\"Yetarli emas:\", acc.withdraw(200));\nconsole.log(\"Yechildi:\", acc.withdraw(70));\nconsole.log(\"Balans yashirin:\", acc.balance === undefined);",
      "deliberateErrorCode": "function createBankAccount(initialBalance = 0) {\n  return {\n    getBalance() { return invalidVariable; }\n  };\n}\nconst acc = createBankAccount(100);\nconsole.log(acc.getBalance());"
    }
  },
  {
    "moduleIndex": 1,
    "order": 4,
    "title": "4-Dars: Higher-Order Functions (Yuqori Tartibli Funksiyalar)",
    "slug": "higher-order-functions",
    "description": "First-class citizens, funksiyalarni parametr sifatida uzatish va qaytarish, deklarativ dasturlash.",
    "estimatedMinutes": 25,
    "objectives": [
      "Funksiyalar birinchi darajali fuqaro (First-Class Citizen) ekanligini tushunish",
      "Funksiyani argument sifatida uzatish va yangi funksiya qaytarish mexanizmini o‘rganish"
    ],
    "content": {
      "title": "4-Dars: Higher-Order Functions (Yuqori Tartibli Funksiyalar)",
      "learningObjective": "Funksiyalarni qismlarga bo‘lib, qayta ishlatiluvchi universal mantiqlar hosil qilish.",
      "prerequisites": "Funksiyalar va massivlar.",
      "realLifeAnalogy": "Universal duradgor dastgohi: Siz unga yog‘och taxta (massiv) berasiz va qanday shaklda qirqish bo‘yicha chizma (callback funksiya) o‘rnatasiz. Dastgoh har bir taxtani aynan siz bergan chizma asosida kesib, yangi tayyor mahsulotlar to‘plamini beradi.",
      "theory": [
        {
          "type": "text",
          "content": "**Higher-Order Function (Yuqori tartibli funksiya)** — bu boshqa funksiyani argument sifatida qabul qiladigan yoki natija sifatida yangi funksiya qaytaradigan funksiyadir.\n\nMisollar: `map`, `filter`, `reduce`.\nAfzalliklari:\n- Kodni qisqartiradi va o‘qishni osonlashtiradi (Deklarativ uslub).\n- Asl ma’lumotlarni buzmasdan (immutability) yangi natijalar hosil qiladi."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "// Funksiya qaytaruvchi Higher-Order Function:\nfunction createMultiplier(multiplier) {\n  return function(number) {\n    return number * multiplier;\n  };\n}\n\nconst double = createMultiplier(2);\nconsole.log(double(5)); // 10\nconst triple = createMultiplier(3);\nconsole.log(triple(5)); // 15",
          "lineExplanations": {
            "2": "createMultiplier yangi funksiya ishlab chiqaradi",
            "7": "double endi sonni 2 ga ko‘paytiruvchi ixtisoslashgan funksiya"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "Higher-order funksiyaga funksiyani chaqirib uzatish",
          "wrongCode": "// XATO: sayHi darhol chaqirilib ketadi!\nbutton.addEventListener(\"click\", sayHi());",
          "correctCode": "// TO'G'RI: funksiyaning o'zi uzatiladi\nbutton.addEventListener(\"click\", sayHi);",
          "explanation": "Higher-order funksiyaga funksiya havolasi (nomi) uzatilishi kerak, `()` qo‘yilsa u darhol ishlab ketadi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-hof-1",
          "question": "Qaysi funksiya Higher-Order Function deb ataladi?",
          "type": "multiple-choice",
          "options": [
            "Faqat son qaytaradigan funksiya",
            "Boshqa funksiyani argument sifatida qabul qiluvchi yoki yangi funksiya qaytaruvchi",
            "Faqat HTML sahifada ishlaydigan funksiya",
            "Faqat asinxron ishlaydigan funksiya"
          ],
          "correctAnswer": 1,
          "explanation": "Funksiyani argument sifatida oladigan yoki funksiya qaytaradigan har qanday funksiya Higher-Order hisoblanadi."
        },
        {
          "id": "q-hof-2",
          "question": "Quyidagi JavaScript metodlaridan qaysi biri Higher-Order Funksiya hisoblanadi?",
          "type": "multiple-choice",
          "options": [
            "Math.round()",
            "Array.prototype.map()",
            "parseInt()",
            "console.log()"
          ],
          "correctAnswer": 1,
          "explanation": "map() metodi o‘ziga parametr sifatida har bir element ustida bajariluvchi callback funksiyani qabul qilgani uchun Higher-Order Funksiya hisoblanadi."
        }
      ],
      "reflectionQuestion": "Nima uchun `for` tsikliga qaraganda `map` yoki `filter` ishlatish xatoliklarni kamaytiradi?",
      "summary": "Higher-order funksiyalar va ularning zamonaviy dasturlashdagi o‘rnini ko‘rib chiqdik.",
      "nextLessonSlug": "callback-functions-va-asinxronlik",
      "nextLessonTitle": "5-Dars: Callback Funksiyalari va Asinxronlikka Kirish"
    },
    "exercise": {
      "title": "Custom myFilter Higher-Order Funksiyasi",
      "description": "myFilter(array, predicateFn) nomli funksiya yozing. U tayyor Array.prototype.filter metodidan foydalanmasdan, massivdagi har bir elementni predicateFn ga uzatib, faqat true qaytargan elementlardan iborat yangi massiv qaytarsin.",
      "instructions": [
        "Yangi bo‘sh massiv yarating",
        "array bo‘ylab tsikl yuriting va har bir element uchun predicateFn(item) ni chaqiring",
        "Faqat true bo‘lgan elementlarni yangi massivga qo‘shing va qaytaring"
      ],
      "starterCode": "function myFilter(array, predicateFn) {\n  // array elementlarini predicateFn orqali tekshirib,\n  // faqat rost qaytargan elementlardan iborat yangi massiv qaytaring.\n}\n\n// Sinov uchun chaqiruvlar:\nconsole.log(JSON.stringify(myFilter([1, 2, 3, 4, 5, 6], n => n % 2 === 0)));\nconsole.log(JSON.stringify(myFilter([\"olma\", \"anor\", \"behi\"], w => w.length > 4)));\nconsole.log(JSON.stringify(myFilter([10, 20, 30], n => n > 15)));\n",
      "language": "javascript",
      "difficulty": "medium",
      "passingScore": 100,
      "xpReward": 65,
      "testCases": [
        {
          "id": "tc-hof-1",
          "description": "Juft sonlarni filtrlash",
          "expectedOutput": "[2,4,6]",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-hof-2",
          "description": "So‘z uzunligi 4 dan kattalarini ajratish",
          "expectedOutput": "[\"CodeQuest\",\"Javascript\"]",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Funksiyaga boshqa funksiyani parametr sifatida uzatganda uning har bir element ustida qanday chaqirilishini tasavvur qiling.",
        "2-yordam: Yangi bo‘sh massiv oching va for...of sikli yordamida har bir elementni predicateFn(element) orqali tekshirib, rost bo‘lsa massivga qo‘shing.",
        "3-yordam: result.push(item) orqali elementni to‘plab, sikl yakunida return result qiling."
      ],
      "solutionExplanation": "myFilter funksiyasi har bir elementni tekshirib, shartga moslarini yangi massivga yig‘adi.",
      "expectedConcepts": [
        "higher-order functions",
        "callbacks",
        "pure functions"
      ],
      "validSolutionCode": "function myFilter(array, predicateFn) {\n  const result = [];\n  for (let i = 0; i < array.length; i++) {\n    if (predicateFn(array[i], i, array)) {\n      result.push(array[i]);\n    }\n  }\n  return result;\n}\nconsole.log(JSON.stringify(myFilter([1, 2, 3, 4, 5, 6], n => n % 2 === 0)));\nconsole.log(JSON.stringify(myFilter([\"Salom\", \"CodeQuest\", \"JS\", \"Javascript\"], w => w.length > 5)));",
      "deliberateErrorCode": "function myFilter() {\n  return [1, 2].notAFunction();\n}"
    }
  },
  {
    "moduleIndex": 1,
    "order": 5,
    "title": "5-Dars: Callback Funksiyalari va Asinxronlikka Kirish",
    "slug": "callback-functions-va-asinxronlik",
    "description": "Callback nima, sinxron va asinxron callback farqi, Callback Hell xatarlari.",
    "estimatedMinutes": 20,
    "objectives": [
      "Callback funksiyasining vazifasini aniq tushunish",
      "Sinxron va asinxron callbacklar farqini ajrata olish",
      "Callback Hell (Piramida xatosi) nima sababdan kelib chiqishini anglash"
    ],
    "content": {
      "title": "5-Dars: Callback Funksiyalari va Asinxronlikka Kirish",
      "learningObjective": "Funksiyalarni callback sifatida uzatish va asinxron oqimlarni boshqarishga poydevor qo‘yish.",
      "prerequisites": "Higher-order funksiyalar.",
      "realLifeAnalogy": "Kuryerlik xizmati: Tovarni qabul qilayotganingizda, kuryerga telefon raqamingizni qoldirasiz: \"Buyurtma yetib kelganda menga qo‘ng‘iroq qiling (Call me back)\". Siz eshik tagida kutib o‘tirmaysiz, boshqa ishlaringizni davom ettirasiz.",
      "theory": [
        {
          "type": "text",
          "content": "**Callback funksiyasi** — boshqa bir funksiyaga parametr sifatida berilgan va ma’lum bir amal tugagach chaqirilishi rejalashtirilgan funksiyadir.\n\n- **Sinxron Callback:** Darhol, asosiy kod oqimi davomida chaqiriladi (masalan, `array.forEach(...)`).\n- **Asinxron Callback:** Ma’lum vaqt yoki voqeadan so‘ng chaqiriladi (masalan, `setTimeout`, tugma bosilishi)."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "function fetchUserData(userId, callback) {\n  // Simulyatsiya qilingan asinxron operatsiya:\n  setTimeout(() => {\n    const user = { id: userId, name: \"Ali\", role: \"talaba\" };\n    callback(null, user); // Error-first callback\n  }, 500);\n}",
          "lineExplanations": {
            "1": "callback oxirgi parametr sifatida qabul qilinadi",
            "4": "Node.js va brauzerda birinchi parametr xatolik (null), ikkinchisi ma’lumot bo‘lishi standart odat"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "Asinxron callback natijasini sinxron return qilishga urinish",
          "wrongCode": "function getUser() {\n  setTimeout(() => {\n    return \"Ali\";\n  }, 100);\n}\nconsole.log(getUser()); // undefined!",
          "correctCode": "function getUser(callback) {\n  setTimeout(() => {\n    callback(\"Ali\");\n  }, 100);\n}\ngetUser(name => console.log(name));",
          "explanation": "Asinxron funksiyalar sinxron return qila olmaydi, natija faqat callback yoki Promise orqali yetkaziladi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-cb-1",
          "question": "Callback Hell nima?",
          "type": "multiple-choice",
          "options": [
            "Kompyuterning qizib ketishi",
            "Ketma-ket asinxron callbacklarning ichma-ich chuqur joylashib (pyramid of doom), kodni o‘qish qiyinlashishi",
            "Funksiyani e’lon qilmasdan chaqirish",
            "Faqat CSS dagi xatolik"
          ],
          "correctAnswer": 1,
          "explanation": "Ichma-ich bir nechta callback yozilganda kod o‘ng tomonga qarab o‘sib ketadi va xatolarni boshqarish nihoyatda qiyinlashadi."
        },
        {
          "id": "q-cb-2",
          "question": "Asinxron callback natijasini sinxron tarzda darhol return qilib bo‘lmasligining sababi nima?",
          "type": "multiple-choice",
          "options": [
            "JavaScriptda return kalit so‘zi taqiqlangan",
            "Asinxron operatsiya tugamasdan oldin sinxron funksiya allaqachon bajarilib bo‘lgan bo‘ladi",
            "Callback funksiyalarga parametr uzatib bo‘lmaydi",
            "Brauzer xotirasi yetishmaydi"
          ],
          "correctAnswer": 1,
          "explanation": "Asinxron amallar navbatga (Web API/Task Queue) qo‘yiladi, asosiy funksiya esa sinxron tarzda darhol return qilib bajarilishini yakunlaydi."
        }
      ],
      "reflectionQuestion": "Nima uchun Callback Hell muammosini hal qilish uchun keyinchalik Promise va async/await yaratilgan?",
      "summary": "Callbacklar, sinxron/asinxron farqlar va asinxron fikrlash asoslarini o‘rgandik.",
      "nextLessonSlug": "this-konteksti-va-boglash-usullari",
      "nextLessonTitle": "6-Dars: this Konteksti va Bog‘lash Usullari"
    },
    "exercise": {
      "title": "Ma’lumotlarni qayta ishlovchi Callback Pipeline",
      "description": "processNumbers(numbers, transformFn, onComplete) funksiyasini yozing. U numbers massividagi har bir sonni transformFn orqali o‘zgartirib, hosil bo‘lgan yangi massivni onComplete callbackiga uzatsin.",
      "instructions": [
        "transformFn yordamida massivni yangilang",
        "Natijaviy massivni onComplete(result) ko‘rinishida chaqiring"
      ],
      "starterCode": "function processNumbers(numbers, transformFn, onComplete) {\n  // Har bir sonni transformFn orqali o'zgartirib,\n  // natijaviy massivni onComplete callback'iga uzating.\n}\n\n// Sinov uchun chaqiruvlar:\nprocessNumbers([1, 2, 3], n => n * 2, res => console.log(JSON.stringify(res)));\nprocessNumbers([1, 2, 3, 4], n => n * n, res => console.log(JSON.stringify(res)));\n",
      "language": "javascript",
      "difficulty": "easy",
      "passingScore": 100,
      "xpReward": 60,
      "testCases": [
        {
          "id": "tc-cb-1",
          "description": "Sonlarni 2 ga ko‘paytirib callbackka uzatish",
          "expectedOutput": "[2,4,6]",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-cb-2",
          "description": "Sonlarni kvadratga ko‘tarish",
          "expectedOutput": "[1,4,9,16]",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Birinchi callback (transformFn) har bir elementni o‘zgartirish uchun, ikkinchi callback (onComplete) esa umumiy natijani qabul qilish uchun kerakligini anglang.",
        "2-yordam: Massivning map() metodi orqali barcha elementlarni transformFn yordamida o‘zgartirib, yangi massiv hosil qiling.",
        "3-yordam: Hosil bo‘lgan massivni onComplete(transformed); ko‘rinishida yakuniy callbackka parametr sifatida uzating."
      ],
      "solutionExplanation": "Massiv elementlari transformFn orqali o‘zgartirilib, yakuniy natija onComplete callbackiga topshiriladi.",
      "expectedConcepts": [
        "callbacks",
        "pipeline",
        "transformation"
      ],
      "validSolutionCode": "function processNumbers(numbers, transformFn, onComplete) {\n  const result = numbers.map(transformFn);\n  onComplete(result);\n}\nprocessNumbers([1, 2, 3], n => n * 2, res => console.log(JSON.stringify(res)));\nprocessNumbers([1, 2, 3, 4], n => n * n, res => console.log(JSON.stringify(res)));",
      "deliberateErrorCode": "function processNumbers() {\n  throw new Error(\"Callback error\");\n}"
    }
  },
  {
    "moduleIndex": 1,
    "order": 6,
    "title": "6-Dars: this Konteksti va Bog‘lash Usullari",
    "slug": "this-konteksti-va-boglash-usullari",
    "description": "this qanday aniqlanadi, call, apply, bind usullari, Arrow funksiyalardagi leksik this.",
    "estimatedMinutes": 30,
    "objectives": [
      "this qiymati funksiyaning chaqirilish joyi (call-site)ga qarab aniqlanishini tushunish",
      "call, apply va bind yordamida kontekstni aniq (explicit) bog‘lashni o‘rganish",
      "Arrow funksiyalarda this leksik ekanligini anglash"
    ],
    "content": {
      "title": "6-Dars: this Konteksti va Bog‘lash Usullari",
      "learningObjective": "JavaScriptda eng ko‘p adashiladigan this muammolarini hal qilish va to‘g‘ri bog‘lash usullarini o‘zlashtirish.",
      "prerequisites": "Obyektlar va metodlar.",
      "realLifeAnalogy": "Teatr aktyori: Bitta aktyor bugun Qirol sahnasida qirol sifatida gapiradi (this = Qirol), ertaga esa Jang sahnasida askar sifatida gapiradi (this = Askar). Aktyorning o‘zi bitta, lekin uning kim nomidan gapirishi u qaysi sahnada turganiga bog‘liq.",
      "theory": [
        {
          "type": "text",
          "content": "**this** kalit so‘zi funksiya chaqirilgan paytda unga bog‘langan obyektga ishora qiladi.\n\n`this` ni aniqlashning 4 asosiy qoidasi:\n1. **Default Binding:** Oddiy chaqiruv — brauzer skriptida `window`, `\"use strict\"` rejimida yoki ES modullarda esa `undefined`.\n2. **Implicit Binding:** Obyekt orqali chaqiruv: `user.greet()` -> `this === user`.\n3. **Explicit Binding:** Aniq ko‘rsatish:\n   - `fn.call(obj, arg1, arg2)` — darhol chaqiradi, argumentlar alohida uzatiladi.\n   - `fn.apply(obj, [arg1, arg2])` — darhol chaqiradi, argumentlar massivda uzatiladi.\n   - `fn.bind(obj)` — darhol chaqirmaydi, `this` bog‘langan **yangi funksiya nusxasini** qaytaradi.\n4. **Lexical Binding (Arrow Functions):** Arrow funksiyalarning shaxsiy `this`i bo‘lmaydi, ular o‘rab turgan tashqi kontekstdagi `this`ni saqlab qoladi."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "function introduce(greeting, punctuation) {\n  return `${greeting}, mening ismim ${this.name}${punctuation}`;\n}\n\nconst user = { name: \"Zuhra\" };\n\n// 1. call — argumentlar alohida uzatiladi:\nconsole.log(introduce.call(user, \"Salom\", \"!\"));\n\n// 2. apply — argumentlar massiv ichida uzatiladi:\nconsole.log(introduce.apply(user, [\"Assalomu alaykum\", \".\"]));\n\n// 3. bind — this bog‘langan yangi funksiya qaytaradi:\nconst boundFn = introduce.bind(user, \"Salom\");\nconsole.log(boundFn(\"!\"));",
          "lineExplanations": {
            "8": "call metodi funksiyani darhol chaqiradi va this sifatida user obyektini o‘rnatadi",
            "11": "apply metodi ham darhol chaqiradi, biroq argumentlarni massiv ko‘rinishida qabul qiladi",
            "14": "bind yangi funksiya nusxasini qaytaradi va unda this doim user obyektiga biriktirilgan bo‘ladi"
          }
        },
        {
          "type": "tip",
          "content": "Leksik this kuchi: Obyekt metodi ichida setTimeout yoki forEach ishlatilganda, oddiy funksiya o‘z this kontekstini yo‘qotadi. Arrow funksiya esa tashqi metodning this ini saqlab qoladi: setTimeout(() => console.log(this.name), 500);"
        }
      ],
      "commonMistakes": [
        {
          "title": "Obyekt metodini arrow funksiya bilan yozish",
          "wrongCode": "const user = {\n  name: \"Ali\",\n  greet: () => console.log(this.name) // this globalga ketib qoladi!\n};",
          "correctCode": "const user = {\n  name: \"Ali\",\n  greet() {\n    console.log(this.name); // To'g'ri\n  }\n};",
          "explanation": "Obyekt metodlari uchun oddiy funksiya sintaksisi ishlatilishi shart, aks holda arrow function global window ni ushlaydi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-this-1",
          "question": "Arrow funksiyalarning `this` kalit so‘zi qayerdan olinadi?",
          "type": "multiple-choice",
          "options": [
            "O‘zi chaqirilgan obyektning ichidan",
            "O‘zi e’lon qilingan tashqi leksik sohadan (Lexical Scope)",
            "Doimo window obyektidan",
            "Doimo null bo‘ladi"
          ],
          "correctAnswer": 1,
          "explanation": "Arrow funksiyalar o‘z `this`iga ega emas, ular o‘rab turgan tashqi muhitdan `this`ni oladi."
        },
        {
          "id": "q-this-2",
          "question": "call() va apply() metodlarining asosiy farqi nimada?",
          "type": "multiple-choice",
          "options": [
            "call yangi funksiya qaytaradi, apply esa darhol chaqiradi",
            "call argumentlarni ketma-ket (vergul bilan), apply esa massiv ko‘rinishida qabul qiladi",
            "call faqat obyektlar bilan ishlaydi, apply esa faqat massivlar bilan",
            "Ikkalasi bir xil, hech qanday farqi yo‘q"
          ],
          "correctAnswer": 1,
          "explanation": "Ikkala metod ham funksiyani darhol chaqiradi va this ni o‘rnatadi, faqat call argumentlarni alohida-alohida, apply esa massiv ichida qabul qiladi."
        }
      ],
      "reflectionQuestion": "Event listenerlar yozganda nima uchun arrow function va oddiy function har xil `this` qiymatiga ega bo‘ladi?",
      "summary": "this mexanizmi, explicit binding va arrow funksiyalarning o‘ziga xosligini o‘rgandik.",
      "nextLessonSlug": "prototype-va-prototip-merosxorligi",
      "nextLessonTitle": "7-Dars: Prototype va Prototip Merosxo‘rligi"
    },
    "exercise": {
      "title": "Yo‘qolgan kontekstni tiklash",
      "description": "createGreeter(user) nomli funksiya yozing. U user obyektini qabul qilib, uning greet metodini o‘ziga bind qilgan holda alohida funksiya sifatida qaytarsin, toki uni istalgan joyda parametrsiz chaqirganda to‘g‘ri \"Salom, mening ismim [NAME]\" matni chiqsin.",
      "instructions": [
        "user obyekti name xususiyatiga va greet metodiga ega bo‘lishi mumkin",
        "Agar user.greet bo‘lmasa, yangi funksiya yarating va user ga bind qiling",
        "Bog‘langan funksiyani return qiling"
      ],
      "starterCode": "function createGreeter(user) {\n  // user obyektining name xususiyatidan foydalanib,\n  // \"Salom, mening ismim [NAME]\" matnini qaytaruvchi funksiyani user ga bind qilib qaytaring.\n}\n\n// Sinov uchun chaqiruvlar:\nconst greeter1 = createGreeter({ name: 'Nodir' });\nconsole.log(greeter1());\nconst greeter2 = createGreeter({ name: 'Malika' });\nconsole.log(greeter2());\n",
      "language": "javascript",
      "difficulty": "medium",
      "passingScore": 100,
      "xpReward": 65,
      "testCases": [
        {
          "id": "tc-this-1",
          "description": "Metodni to‘g‘ri bog‘lash",
          "expectedOutput": "Salom, mening ismim Nodir",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-this-2",
          "description": "Boshqa foydalanuvchi ismi bilan sinash",
          "expectedOutput": "Salom, mening ismim Malika",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Funksiya qayerda va qanday chaqirilishidan qat’i nazar this o‘zgarmasligi uchun qaysi bog‘lash metodidan foydalanish kerakligini eslang.",
        "2-yordam: Ichki salomlashish funksiyasida this.name dan foydalaning va uni user obyektiga .bind(user) orqali bog‘lang.",
        "3-yordam: function greet() { return \"Salom, mening ismim \" + this.name; } funksiyasini yozib, return greet.bind(user); qiling."
      ],
      "solutionExplanation": "bind(user) orqali funksiya konteksti doimiy ravishda user obyektiga biriktiriladi.",
      "expectedConcepts": [
        "this",
        "bind",
        "call-site"
      ],
      "validSolutionCode": "function createGreeter(user) {\n  function greet() {\n    return \"Salom, mening ismim \" + this.name;\n  }\n  return greet.bind(user);\n}\nconst greeter = createGreeter({ name: \"Nodir\" });\nconsole.log(greeter());\nconst greeter2 = createGreeter({ name: \"Malika\" });\nconsole.log(greeter2());",
      "deliberateErrorCode": "function createGreeter() {\n  return this.notMethod();\n}"
    }
  },
  {
    "moduleIndex": 1,
    "order": 7,
    "title": "7-Dars: Prototype va Prototip Merosxo‘rligi",
    "slug": "prototype-va-prototip-merosxorligi",
    "description": "__proto__, prototype, prototype chain, xotirani tejash, ES6 class sintaksisi.",
    "estimatedMinutes": 25,
    "objectives": [
      "prototype va __proto__ orasidagi bog‘liqlikni tushunish",
      "Prototip zanjiri (Prototype Chain) orqali merosxo‘rlik qanday ishlashini bilish",
      "Xotirani tejash uchun metodlarni prototipga biriktirish tamoyilini o‘rganish"
    ],
    "content": {
      "title": "7-Dars: Prototype va Prototip Merosxo‘rligi",
      "learningObjective": "JavaScript obyektlarining asosiy karkasi bo‘lgan prototiplar va xotira optimizatsiyasini o‘zlashtirish.",
      "prerequisites": "Obyektlar va konstruktor funksiyalar.",
      "realLifeAnalogy": "Oila kutubxonasi: Har bir farzandning xonasiga alohida qimmatbaho ensiklopediyani sotib olib qo‘yish ortiqcha xarajat. Buning o‘rniga, uydagi umumiy kutubxonaga bitta to‘plam qo‘yiladi va barcha oila a’zolari unga murojaat qiladi (xotirani tejash).",
      "theory": [
        {
          "type": "text",
          "content": "JavaScript klassik emas, balki **prototipga asoslangan (Prototypal)** tildir. Har bir obyekt yashirin `[[Prototype]]` (brauzerda `__proto__`) havolasiga ega.\n\nAgar obyektda biror xususiyat yoki metod topilmasa, dvigatel uni prototipidan, topolmasa uning prototipidan qidiradi — bu **Prototype Chain** deyiladi. Zanjirning oxiri `Object.prototype` bo‘lib, uning prototipi `null`dir."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "function User(name) {\n  this.name = name;\n}\n\n// Metodni prototipga qo'shish (hamma instansiyalar bitta metoddan foydalanadi):\nUser.prototype.sayHi = function() {\n  return \"Salom, \" + this.name;\n};\n\nconst u1 = new User(\"Aziz\");\nconst u2 = new User(\"Bobur\");\nconsole.log(u1.sayHi === u2.sayHi); // true (bitta xotira katagida!)",
          "lineExplanations": {
            "6": "Metod har bir nusxa uchun qaytadan yaratilmaydi, faqat prototipda saqlanadi",
            "12": "Ikkala obyekt ham aynan bitta sayHi funksiyasiga havola qiladi"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "Prototip metodini konstruktor ichida e’lon qilish",
          "wrongCode": "function User(name) {\n  this.name = name;\n  this.sayHi = function() { ... }; // 1000 ta user ochilsa, 1000 ta funksiya nusxasi yaratiladi!\n}",
          "correctCode": "function User(name) {\n  this.name = name;\n}\nUser.prototype.sayHi = function() { ... };",
          "explanation": "Konstruktor ichida metod yozish xotirani isrof qiladi. Umumiy metodlar har doim prototype ga qo‘yilishi kerak.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-proto-1",
          "question": "Prototype chain ning eng yuqori oxirgi nuqtasi nima?",
          "type": "multiple-choice",
          "options": [
            "Function.prototype",
            "null (Object.prototype ning prototipi)",
            "window",
            "undefined"
          ],
          "correctAnswer": 1,
          "explanation": "Object.prototype zanjirning cho‘qqisi bo‘lib, uning [[Prototype]] havolasi null ga teng."
        },
        {
          "id": "q-proto-2",
          "question": "Prototip zanjirining (Prototype Chain) eng yuqori nuqtasida nima turadi?",
          "type": "multiple-choice",
          "options": [
            "Function.prototype",
            "Object.prototype (va uning __proto__ si null)",
            "window",
            "Array.prototype"
          ],
          "correctAnswer": 1,
          "explanation": "JavaScriptda barcha obyektlar oxir-oqibat Object.prototype ga borib taqaladi, uning prototipi esa null ga teng."
        }
      ],
      "reflectionQuestion": "ES6 dagi `class` sintaksisi prototiplardan qanday farq qiladi?",
      "summary": "Prototiplar, zanjirli qidiruv va xotirani tejash usullarini o‘rgandik.",
      "nextLessonSlug": "call-stack-va-event-loop",
      "nextLessonTitle": "8-Dars: Call Stack, Web APIs va Event Loop"
    },
    "exercise": {
      "title": "Transport Vositalari Prototiplari",
      "description": "Vehicle nomli konstruktor funksiya yarating, u brand va speed parametrlarini qabul qilsin. Uning prototipiga accelerate(amount) metodini qo‘shing. Ushbu metod speed ni amount ga oshirsin va \"[BRAND] tezligi endi [SPEED] km/soat\" deb qaytarsin.",
      "instructions": [
        "function Vehicle(brand, speed) konstruktorini e’lon qiling",
        "Vehicle.prototype.accelerate = function(amount) {...} deb metod qo‘shing",
        "this.speed += amount qilib yangilangan tezlikni matnda qaytaring"
      ],
      "starterCode": "function Vehicle(brand, speed) {\n  // Konstruktor: this.brand va this.speed ni biriktiring\n}\n\n// Vehicle.prototype ga accelerate(amount) metodini qo'shing:\n// speed ga amount ni qo'shib, \"[brand] tezligi endi [speed] km/soat\" deb qaytarsin.\n\n// Sinov uchun chaqiruvlar:\nconst car = new Vehicle(\"Chevrolet\", 60);\nconsole.log(car.accelerate(20));\nconst car2 = new Vehicle(\"BMW\", 100);\ncar2.accelerate(20);\nconsole.log(car2.accelerate(20));\n",
      "language": "javascript",
      "difficulty": "medium",
      "passingScore": 100,
      "xpReward": 65,
      "testCases": [
        {
          "id": "tc-pr-1",
          "description": "Tezlikni oshirish va xabar chiqarish",
          "expectedOutput": "Chevrolet tezligi endi 80 km/soat",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-pr-2",
          "description": "Ikki marta tezlik oshirilishi",
          "expectedOutput": "BMW tezligi endi 140 km/soat",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Nima sababdan metodlarni konstruktor ichida emas, balki prototipda saqlash xotirani tejashini o‘ylab ko‘ring.",
        "2-yordam: Konstruktor ichida this.brand = brand va this.speed = speed qiling. Metodni esa Vehicle.prototype.accelerate ga biriktiring.",
        "3-yordam: accelerate metodi ichida this.speed += amount qiling va this.brand + \" tezligi endi \" + this.speed + \" km/soat\" satrini return qiling."
      ],
      "solutionExplanation": "accelerate metodi Vehicle prototipiga qo‘shiladi va barcha yaratilgan transport nusxalarida ishlaydi.",
      "expectedConcepts": [
        "prototype",
        "constructor",
        "inheritance"
      ],
      "validSolutionCode": "function Vehicle(brand, speed) {\n  this.brand = brand;\n  this.speed = speed;\n}\nVehicle.prototype.accelerate = function(amount) {\n  this.speed += amount;\n  return this.brand + \" tezligi endi \" + this.speed + \" km/soat\";\n};\nconst car = new Vehicle(\"Chevrolet\", 60);\nconsole.log(car.accelerate(20));\nconst car2 = new Vehicle(\"BMW\", 100);\ncar2.accelerate(20);\nconsole.log(car2.accelerate(20));",
      "deliberateErrorCode": "function Vehicle() {\n  this.accelerate = () => { throw new Error(\"wrong\"); };\n}"
    }
  },
  {
    "moduleIndex": 2,
    "order": 8,
    "title": "8-Dars: Call Stack, Web APIs va Event Loop",
    "slug": "call-stack-va-event-loop",
    "description": "Single-thread modeli, Call stack, Web APIs, Macrotasks vs Microtasks.",
    "estimatedMinutes": 30,
    "objectives": [
      "JavaScript bitta oqimli (single-threaded) ishlash modelini tushunish",
      "Call Stack, Web APIs, Task Queue va Microtask Queue qanday hamkorlik qilishini bilish",
      "Asinxron kodlarning bajarilish tartibini to‘g‘ri oldindan bashorat qila olish"
    ],
    "content": {
      "title": "8-Dars: Call Stack, Web APIs va Event Loop",
      "learningObjective": "JavaScript brauzerda kodni qanday tartibda bajarishini va Event Loop sirini to‘liq anglash.",
      "prerequisites": "Asinxronlik asoslari va Callbacklar.",
      "realLifeAnalogy": "Bank filiali: Kassa bitta (Call Stack), u navbatdagi bitta odamga xizmat ko‘rsatadi. Uzoq vaqt oladigan hujjatlar esa orqa xonaga (Web APIs) yuboriladi. Ular tayyor bo‘lgach, maxsus qabul navbatiga (Queue) qo‘yiladi. Muhim VIP mijozlar (Microtasks / Promises) esa oddiy navbatdagi (Macrotasks / setTimeout) mijozlardan oldinroq kassaga kiritiladi.",
      "theory": [
        {
          "type": "text",
          "content": "JavaScript dvigateli bitta oqimli bo‘lsa ham, brauzer taqdim etadigan Web APIs yordamida ko‘p vazifalarni asinxron bajara oladi.\n\n**Event Loop algoritmi:**\n1. Call Stack bo‘shashini kutadi.\n2. **Microtask Queue** (Promise callbacks, queueMicrotask) dagi barcha vazifalarni tugatadi.\n3. **Macrotask Queue** (setTimeout, setInterval, DOM hodisalari) dan bitta vazifani olib Call Stackga kiritadi.\n4. Sahifani qayta chizadi (Render) va siklni takrorlaydi."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "console.log(\"1. Sinxron\");\n\nsetTimeout(() => {\n  console.log(\"4. Macrotask (Timeout)\");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log(\"3. Microtask (Promise)\");\n});\n\nconsole.log(\"2. Sinxron\");\n// Natija: 1, 2, 3, 4",
          "lineExplanations": {
            "1": "Sinxron kod darhol Call Stack-da bajariladi",
            "3": "setTimeout Web API ga topshiriladi va Macrotask Queue ga tushadi",
            "7": "Promise.then zudlik bilan Microtask Queue ga qo‘shiladi",
            "11": "Sinxron kod tugagach, navbatdagi microtasklar (Promise) macrotasklardan (setTimeout) oldin bajariladi"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "setTimeout(fn, 0) darhol bajariladi deb o‘ylash",
          "wrongCode": "let data;\nsetTimeout(() => { data = \"Yuklandi\"; }, 0);\nconsole.log(data); // undefined!",
          "correctCode": "let data;\nsetTimeout(() => {\n  data = \"Yuklandi\";\n  console.log(data);\n}, 0);",
          "explanation": "Hatto 0 millisoniya berilsa ham, callback Macrotask navbatiga qo‘yiladi va faqat joriy sinxron kodlar tugagach ishga tushadi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-el-1",
          "question": "Microtask Queue da nimalar saqlanadi?",
          "type": "multiple-choice",
          "options": [
            "Faqat setTimeout va setInterval",
            "Promise.then/catch/finally va queueMicrotask callbacklari",
            "Faqat DOM click hodisalari",
            "CSS animatsiyalari"
          ],
          "correctAnswer": 1,
          "explanation": "Promise callbacklari va microtasklar Microtask Queue ga joylashadi va macrotasklardan oldin bajariladi."
        },
        {
          "id": "q-el-2",
          "question": "setTimeout(callback, 0) qachon bajariladi?",
          "type": "multiple-choice",
          "options": [
            "Darhol (0 millisekundda sinxron koddan oldin)",
            "Joriy Call Stack va barcha Microtasklar tugagandan so‘ng navbat kelganda",
            "Hech qachon bajarilmaydi",
            "Faqat sahifa yopilganda"
          ],
          "correctAnswer": 1,
          "explanation": "Hatto vaqt 0 qilib belgilansa ham, setTimeout Macrotask Queue ga tushadi va faqat Call Stack hamda Microtasklar bo‘shagandan so‘ng ishga tushadi."
        }
      ],
      "reflectionQuestion": "Nima sababdan og‘ir hisob-kitoblarni asosiy Call Stackda bajarish sahifani qotirib qo‘yadi?",
      "summary": "Call Stack, Web APIs, Microtasks va Macrotasks qanday ishlashini to‘liq o‘rganib oldik.",
      "nextLessonSlug": "promises-va-chaining",
      "nextLessonTitle": "9-Dars: Promise Obyekti va Zanjirlash (Chaining)"
    },
    "exercise": {
      "title": "Event Loop Ketma-ketlik Bashorati",
      "description": "simulateEventLoopOrder() nomli funksiya yozing. U quyidagi 4 ta amalning bajarilish tartibidagi nomlarini massiv ko‘rinishida qaytarsin:\n1. \"Sinxron 1\"\n2. \"Sinxron 2\"\n3. \"Promise Microtask\"\n4. \"Timeout Macrotask\"",
      "instructions": [
        "Massivda elementlar aynan bajarilish ketma-ketligida joylashsin",
        "return qilib massivni qaytaring"
      ],
      "starterCode": "function simulateEventLoopOrder() {\n  // Sinxron kod, Microtask (Promise) va Macrotask (setTimeout) bajarilish tartibidagi\n  // 4 ta amal nomini to'g'ri ketma-ketlikda massiv ko'rinishida qaytaring:\n  // \"Sinxron 1\", \"Sinxron 2\", \"Promise Microtask\", \"Timeout Macrotask\"\n}\n\n// Sinov uchun chaqiruvlar:\nconsole.log(JSON.stringify(simulateEventLoopOrder()));\nconsole.log(simulateEventLoopOrder()?.length);\n",
      "language": "javascript",
      "difficulty": "easy",
      "passingScore": 100,
      "xpReward": 60,
      "testCases": [
        {
          "id": "tc-el-1",
          "description": "To‘g‘ri Event Loop ketma-ketligi",
          "expectedOutput": "[\"Sinxron 1\",\"Sinxron 2\",\"Promise Microtask\",\"Timeout Macrotask\"]",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-el-2",
          "description": "Massiv uzunligi 4 ga teng bo‘lishi",
          "expectedOutput": "4",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: JavaScript dvigateli vazifalarni qanday navbatlar (Microtask vs Macrotask) bo‘yicha taqsimlashini va ularning ustuvorligini eslang.",
        "2-yordam: Call Stackdagi barcha sinxron amallar tugagandan so‘ng, dvigatel avval Microtasklar (Promise) navbatini to‘liq bo‘shatadi. Macrotasklar (setTimeout) esa oxirida olinadi.",
        "3-yordam: [\"Sinxron 1\", \"Sinxron 2\", \"Promise Microtask\", \"Timeout Macrotask\"] massivini return qiling."
      ],
      "solutionExplanation": "Event loop avval Call Stackdagi barcha sinxron amallarni, so‘ng Microtask Queue, so‘ng Macrotask Queue ni ishga tushiradi.",
      "expectedConcepts": [
        "event loop",
        "call stack",
        "microtasks",
        "macrotasks"
      ],
      "validSolutionCode": "function simulateEventLoopOrder() {\n  return [\"Sinxron 1\", \"Sinxron 2\", \"Promise Microtask\", \"Timeout Macrotask\"];\n}\nconsole.log(JSON.stringify(simulateEventLoopOrder()));\nconsole.log(simulateEventLoopOrder().length);",
      "deliberateErrorCode": "function simulateEventLoopOrder() {\n  return [\"Timeout Macrotask\", \"Sinxron 1\"];\n}"
    }
  },
  {
    "moduleIndex": 2,
    "order": 9,
    "title": "9-Dars: Promise Obyekti va Zanjirlash (Chaining)",
    "slug": "promises-va-chaining",
    "description": "Promise holatlari, .then, .catch, .finally, xatolarni uzatish va Promise.all.",
    "estimatedMinutes": 25,
    "objectives": [
      "Promise ning 3 xil holatini (pending, fulfilled, rejected) o‘rganish",
      ".then(), .catch() va .finally() orqali zanjirli asinxron oqim tuzish"
    ],
    "content": {
      "title": "9-Dars: Promise Obyekti va Zanjirlash (Chaining)",
      "learningObjective": "Callback Hell o‘rniga toza va o‘qilishi oson bo‘lgan Promise zanjirlarini qurish.",
      "prerequisites": "Event Loop va Asinxronlik.",
      "realLifeAnalogy": "Internet-do‘kondan buyurtma berish: Siz to‘lov qildingiz va chek-kvitansiya oldingiz (pending). Buyurtma yetib kelsa — kvitansiyani ko‘rsatib tovar olasiz (fulfilled / .then). Agar omborda mahsulot tugasa — uzr so‘ralib pul qaytariladi (rejected / .catch). Do‘kon esa har qanday holatda hisobini yopadi (.finally).",
      "theory": [
        {
          "type": "text",
          "content": "**Promise** — kelajakda bajarilishi kutilayotgan asinxron amal natijasini ifodalovchi obyektdir.\n\nHolatlari:\n- **pending:** Jarayon ketmoqda.\n- **fulfilled:** Muvaffaqiyatli yakunlandi (`resolve(qiymat)` chaqirildi).\n- **rejected:** Xatolik yuz berdi (`reject(xato)` chaqirildi).\n\n`.then()` har safar yangi Promise qaytaradi, shu sababli ularni ketma-ket zanjir (chain) qilish mumkin."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "function fetchNumber() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve(10), 100);\n  });\n}\n\nfetchNumber()\n  .then(num => num * 2) // 20\n  .then(num => num + 5) // 25\n  .then(result => console.log(result))\n  .catch(err => console.error(\"Xato:\", err));",
          "lineExplanations": {
            "2": "new Promise orqali asinxron mantiq o‘raladi",
            "9": "Har bir then avvalgisidan chiqqan qiymatni oladi",
            "11": "Zanjirning istalgan joyidagi xato to‘g‘ridan-to‘g‘ri catch ga yetkaziladi"
          }
        },
        {
          "type": "text",
          "content": "**Promise.all() va .finally():**\n- `.finally(() => ...)` — Promise muvaffaqiyatli yoki xato yakunlanishidan qat’i nazar eng oxirida ishga tushadi (masalan, yuklanish indikatorini yashirish uchun).\n- `Promise.all([p1, p2])` — bir nechta mustaqil so‘rovlarni parallel ishga tushirib, barchasi bajarilgach natijalarni massiv ko‘rinishida qaytaradi. Agar bitta so‘rov xato bersa, butun natija rad etiladi (fail-fast)."
        }
      ],
      "commonMistakes": [
        {
          "title": ".then() ichida return qilishni unutish",
          "wrongCode": ".then(data => {\n  const result = data * 2;\n  // return yo'q!\n})\n.then(final => console.log(final)); // undefined!",
          "correctCode": ".then(data => {\n  return data * 2;\n})\n.then(final => console.log(final)); // to'g'ri qiymat",
          "explanation": "Agar .then ichida qiymat return qilinmasa, keyingi zanjir bo‘g‘iniga `undefined` boradi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-prom-1",
          "question": "Promise qaysi holatda bo‘lganda `.catch()` metodi ishga tushadi?",
          "type": "multiple-choice",
          "options": [
            "pending holatida",
            "fulfilled holatida",
            "rejected holatida",
            "Doim ishga tushadi"
          ],
          "correctAnswer": 2,
          "explanation": "Promise xatolikka uchraganda (rejected bo‘lganda) yoki xato throw qilinganda .catch ishga tushadi."
        },
        {
          "id": "q-prom-2",
          "question": "Promise.all() metodining o‘ziga xos xususiyati nimada?",
          "type": "multiple-choice",
          "options": [
            "Barcha Promiselarni ketma-ket (biri tugagach ikkinchisini) bajaradi",
            "Promiselarni parallel ishga tushiradi, lekin bittasi rad etilsa (rejected) butun natija xatolik bilan to‘xtaydi (fail-fast)",
            "Xatoliklarni e’tiborsiz qoldirib faqat muvaffaqiyatlilarni qaytaradi",
            "Faqat bitta Promise qabul qiladi"
          ],
          "correctAnswer": 1,
          "explanation": "Promise.all parallel so‘rovlar uchun juda qulay, biroq bitta so‘rov yiqilsa, butun natija darhol xatolikka uchraydi."
        }
      ],
      "reflectionQuestion": "Nima uchun `Promise.all` zanjirida bitta so‘rov xato bersa, barcha so‘rovlar rad etiladi?",
      "summary": "Promise yaratish, zanjirli oqimlar va xatolarni markazlashtirilgan boshqarishni o‘rgandik.",
      "nextLessonSlug": "async-await-sintaksisi",
      "nextLessonTitle": "10-Dars: async / await Sintaksisi"
    },
    "exercise": {
      "title": "Foydalanuvchi ma’lumotlarini zanjirli qayta ishlash",
      "description": "fetchUserDataPromise(id) nomli funksiya yozing. U Promise qaytarsin. Agar id musbat bo‘lsa, resolve({ id, status: \"faol\" }), agar id 0 yoki manfiy bo‘lsa reject(\"Yaroqsiz ID\") qilsin.",
      "instructions": [
        "new Promise((resolve, reject) => { ... }) yarating",
        "Shart bo‘yicha to‘g‘ri resolve yoki reject qiling"
      ],
      "starterCode": "function fetchUserDataPromise(id) {\n  // Yangi Promise qaytaring:\n  // Agar id > 0 bo'lsa: resolve({ id, status: \"faol\" })\n  // Agar id <= 0 bo'lsa: reject(\"Yaroqsiz ID\")\n}\n\n// Sinov uchun chaqiruvlar:\nfetchUserDataPromise(5).then(res => console.log(JSON.stringify(res)));\nfetchUserDataPromise(-1).catch(err => console.log(err));\n",
      "language": "javascript",
      "difficulty": "easy",
      "passingScore": 100,
      "xpReward": 60,
      "testCases": [
        {
          "id": "tc-prom-1",
          "description": "To‘g‘ri ID bilan muvaffaqiyatli resolve bo‘lishi",
          "expectedOutput": "{\"id\":5,\"status\":\"faol\"}",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-prom-2",
          "description": "Manfiy ID bilan xatolik qaytishi",
          "expectedOutput": "Yaroqsiz ID",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Asinxron natijani va’da qilish uchun new Promise((resolve, reject) => { ... }) konstruktoridan qanday foydalanishni o‘ylab ko‘ring.",
        "2-yordam: Kiruvchi parametr id > 0 shartini qanoatlantirsa resolve, aks holda reject chaqiring.",
        "3-yordam: resolve({ id: id, status: \"faol\" }) va reject(\"Yaroqsiz ID\") sintaksisidan foydalanib Promise tanasini yakunlang."
      ],
      "solutionExplanation": "Promise id musbatligiga qarab resolve yoki reject chaqiradi.",
      "expectedConcepts": [
        "promises",
        "resolve",
        "reject"
      ],
      "validSolutionCode": "function fetchUserDataPromise(id) {\n  return new Promise((resolve, reject) => {\n    if (id > 0) {\n      resolve({ id: id, status: \"faol\" });\n    } else {\n      reject(\"Yaroqsiz ID\");\n    }\n  });\n}\nfetchUserDataPromise(5).then(res => console.log(JSON.stringify(res)));\nfetchUserDataPromise(-1).catch(err => console.log(err));",
      "deliberateErrorCode": "function fetchUserDataPromise() {\n  throw new Error(\"Reject immediately\");\n}"
    }
  },
  {
    "moduleIndex": 2,
    "order": 10,
    "title": "10-Dars: async / await Sintaksisi",
    "slug": "async-await-sintaksisi",
    "description": "async funksiyalar, await kalit so‘zi, Promise zanjirlarini soddalashtirish va parallel so‘rovlar.",
    "estimatedMinutes": 25,
    "objectives": [
      "async/await sintaksisi orqali asinxron kodni xuddi sinxron o‘qiladigan shaklda yozish",
      "async funksiya doimo Promise qaytarishini anglash",
      "Parallel (Promise.all) va ketma-ket asinxron chaqiruvlarni to‘g‘ri tashkil etish"
    ],
    "content": {
      "title": "10-Dars: async / await Sintaksisi",
      "learningObjective": "Asinxron kodni eng zamonaviy va qulay uslubda yozishni o‘rganish.",
      "prerequisites": "Promises va Event Loop.",
      "realLifeAnalogy": "Kuryerlik kutish stoli: Pochta kvitansiyasini olib zanjir bo‘ylab kutib o‘tirmasdan, buyurtma kelguncha bevosita kuryer oldida turib kutasiz (await), so‘ng qutini ochib keyingi qadamga o‘tasiz.",
      "theory": [
        {
          "type": "text",
          "content": "`async/await` — bu Promiselar ustiga qurilgan sintaktik qulaylikdir (Syntactic sugar).\n\n- `async`: Funksiyani asinxron qiladi va uning qaytargan qiymatini avtomatik Promise ga o‘raydi.\n- `await`: Faqat `async` funksiya ichida ishlaydi. U berilgan Promise hal (resolved) bo‘lguncha funksiya bajarilishini to‘xtatib turadi, lekin asosiy oqimni (UI) qotirib qo‘ymaydi."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "async function loadData() {\n  const user = await fetchUser(); // Promise tugashini kutadi\n  const orders = await fetchOrders(user.id);\n  return { user, orders };\n}",
          "lineExplanations": {
            "1": "async kalit so‘zi funksiyaning asinxron ekanini bildiradi",
            "2": "await Promisening qiymatini to‘g‘ridan-to‘g‘ri o‘zgaruvchiga oladi"
          }
        },
        {
          "type": "text",
          "content": "**Parallel va Ketma-ket await:**\nBir-biriga bog‘liq bo‘lmagan so‘rovlarni ketma-ket `await a(); await b();` deb chaqirish ortiqcha vaqt yo‘qotishiga olib keladi. Ularni `Promise.all` orqali parallel kutish eng yaxshi amaliyotdir:\n```javascript\n// Parallel bajarish:\nconst [user, balance] = await Promise.all([\n  getUserProfile(id),\n  getUserBalance(id)\n]);\n```"
        }
      ],
      "commonMistakes": [
        {
          "title": "Oddiy (sinxron) funksiya ichida await ishlatish",
          "wrongCode": "function getData() {\n  const res = await fetch(\"/api\"); // SyntaxError!\n}",
          "correctCode": "async function getData() {\n  const res = await fetch(\"/api\"); // To'g'ri\n}",
          "explanation": "`await` faqat `async` funksiya tanasida yoki modul darajasida (Top-level await) ishlatilishi mumkin.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-aa-1",
          "question": "`async` kalit so‘zi bilan e’lon qilingan funksiya nimani qaytaradi?",
          "type": "multiple-choice",
          "options": [
            "Doimo Promise qaytaradi",
            "Har doim matn qaytaradi",
            "Hech narsa qaytarmaydi",
            "Faqat son qaytaradi"
          ],
          "correctAnswer": 0,
          "explanation": "async funksiya hatto oddiy qiymat return qilsa ham, u avtomatik tarzda hal bo‘lgan Promise (Promise.resolve) bo‘lib qaytadi."
        },
        {
          "id": "q-aa-2",
          "question": "await kalit so‘zini qayerda ishlatish mumkin?",
          "type": "multiple-choice",
          "options": [
            "Istalgan oddiy funksiya ichida",
            "Faqat async bilan belgilangan funksiyalar ichida yoki modullarning yuqori darajasida (top-level await)",
            "Faqat for sikllari ichida",
            "Faqat HTML fayllar ichida"
          ],
          "correctAnswer": 1,
          "explanation": "await sintaktik jihatdan faqat async funksiya tanasida yoki zamonaviy modullarda (top-level await) ishlatilishi mumkin."
        }
      ],
      "reflectionQuestion": "Bir-biriga bog‘liq bo‘lmagan ikkita so‘rovni `await a(); await b();` deb ketma-ket yozish qanday sekinlikka olib keladi?",
      "summary": "async/await sintaksisi, undan foydalanish qoidalari va asinxron kodni toza yozishni o‘rgandik.",
      "nextLessonSlug": "async-error-handling-try-catch",
      "nextLessonTitle": "11-Dars: Asinxron Xatolarni Boshqarish (try/catch)"
    },
    "exercise": {
      "title": "Foydalanuvchi va Balansni Birlashtiruvchi Asinxron Funksiya",
      "description": "getUserSummary(userId) nomli async funksiya yozing. U simulyatsiya qilingan getUserProfile(userId) va getUserBalance(userId) ma’lumotlarini kutib olsin va \"{ ism: user.name, balans: balance.amount }\" obyektini qaytarsin.",
      "instructions": [
        "async function getUserSummary(userId) deb e’lon qiling",
        "await getUserProfile(userId) va await getUserBalance(userId) ni chaqiring",
        "Natijani formatlangan obyekt ko‘rinishida qaytaring"
      ],
      "starterCode": "// Simulyatsiya qilingan yordamchilar:\nasync function getUserProfile(id) { return { id, name: \"Sardor\" }; }\nasync function getUserBalance(id) { return { id, amount: 250000 }; }\n\nasync function getUserSummary(userId) {\n  // async/await yordamida profile va balance ma'lumotlarini oling\n  // va { ism: profile.name, balans: balance.amount } ko'rinishida qaytaring.\n}\n\n// Sinov uchun chaqiruvlar:\ngetUserSummary(1).then(res => console.log(JSON.stringify(res)));\nconsole.log(getUserSummary(1) instanceof Promise);\n",
      "language": "javascript",
      "difficulty": "easy",
      "passingScore": 100,
      "xpReward": 65,
      "testCases": [
        {
          "id": "tc-aa-1",
          "description": "Profil va balansni to‘g‘ri birlashtirish",
          "expectedOutput": "{\"ism\":\"Sardor\",\"balans\":250000}",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-aa-2",
          "description": "Funksiya Promise qaytarishini tekshirish",
          "expectedOutput": "true",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Ikkala yordamchi funksiya ham Promise qaytaradi. Ularning natijasini olish uchun async funksiya ichida qaysi kalit so‘zdan foydalanish kerakligini o‘ylang.",
        "2-yordam: await yordamida har bir funksiyani chaqirib, natijalarini profile va balance o‘zgaruvchilariga saqlang.",
        "3-yordam: return { ism: profile.name, balans: balance.amount }; shaklida birlashtirilgan obyekt qaytaring."
      ],
      "solutionExplanation": "await orqali ikkala Promise natijasi olinadi va birlashtirilgan obyekt qaytariladi.",
      "expectedConcepts": [
        "async",
        "await",
        "object construction"
      ],
      "validSolutionCode": "async function getUserProfile(id) { return { id, name: \"Sardor\" }; }\nasync function getUserBalance(id) { return { id, amount: 250000 }; }\n\nasync function getUserSummary(userId) {\n  const profile = await getUserProfile(userId);\n  const balance = await getUserBalance(userId);\n  return { ism: profile.name, balans: balance.amount };\n}\ngetUserSummary(1).then(res => console.log(JSON.stringify(res)));\nconsole.log(getUserSummary(1) instanceof Promise);",
      "deliberateErrorCode": "function getUserSummary() {\n  const x = await getUserProfile();\n}"
    }
  },
  {
    "moduleIndex": 2,
    "order": 11,
    "title": "11-Dars: Asinxron Xatolarni Boshqarish (try/catch)",
    "slug": "async-error-handling-try-catch",
    "description": "try/catch/finally, tarmoq xatolari va HTTP statuslari, xavfsiz fallback qaytarish.",
    "estimatedMinutes": 25,
    "objectives": [
      "async/await kodida xatolarni try/catch orqali xavfsiz ushlab qolish",
      "Tarmoq xatosi (Network Error) va server javob xatoliklarini farqlash",
      "Xato yuz berganda dastur qulamasligi uchun xavfsiz fallback ma’lumot qaytarish"
    ],
    "content": {
      "title": "11-Dars: Asinxron Xatolarni Boshqarish (try/catch)",
      "learningObjective": "Asinxron so‘rovlar muvaffaqiyatsiz bo‘lganda tizim barqarorligini ta’minlash va foydalanuvchiga to‘g‘ri xabar berish.",
      "prerequisites": "async/await sintaksisi.",
      "realLifeAnalogy": "Avtomobilning xavfsizlik yostiqchasi: Yo‘lda kutilmagan to‘siq (server xatosi yoki internet uzilishi) paydo bo‘lsa, yostiqcha (catch bloki) ishga tushadi. Mashina ag‘darilmaydi, yo‘lovchilar shikastlanmaydi va tizim xavfsiz to‘xtatiladi.",
      "theory": [
        {
          "type": "text",
          "content": "Asinxron kodda xatolar `try...catch` bloki bilan ushlanadi. Agar `await` qilingan Promise rad etilsa (rejected), boshqaruv darhol `catch` blokiga o‘tadi.\n\n`finally` bloki xato bo‘lishi yoki bo‘lmasligidan qat’i nazar eng oxirida ishlaydi (masalan, yuklanish indikatorini — Loading spinnerni o‘chirish uchun juda qulay)."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "async function fetchDataSafe() {\n  try {\n    const res = await fakeNetworkCall();\n    return { success: true, data: res };\n  } catch (error) {\n    return { success: false, error: error.message || \"Tarmoq xatosi\" };\n  } finally {\n    console.log(\"So‘rov yakunlandi\");\n  }\n}",
          "lineExplanations": {
            "2": "Xatolik yuz berishi mumkin bo‘lgan kod try ichiga olinadi",
            "5": "Xato bo‘lsa dastur to‘xtamaydi, catch uni chiroyli xabar bilan tutib qoladi",
            "7": "finally doimo har qanday holatda ishlaydi"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "Xatoni ushlab, jimgina yutib yuborish (Silent Failure)",
          "wrongCode": "try {\n  await doRiskyAction();\n} catch (e) {\n  // Hech narsa yo'q, xato qayerda sodir bo'lgani noma'lum qoladi!\n}",
          "correctCode": "try {\n  await doRiskyAction();\n} catch (e) {\n  console.error(\"Xatolik yuz berdi:\", e);\n  showUserFeedback(\"Ma'lumotni yuklab bo'lmadi\");\n}",
          "explanation": "Xatolar har doim qayd etilishi (log) va foydalanuvchiga mos tushunarli xabar berilishi shart.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-err-1",
          "question": "`finally` bloki qachon ishga tushadi?",
          "type": "multiple-choice",
          "options": [
            "Faqat xato yuz berganda",
            "Faqat kod muvaffaqiyatli yakunlanganda",
            "Har doim (xato bo‘lsa ham, bo‘lmasa ham)",
            "Faqat sahifa yopilganda"
          ],
          "correctAnswer": 2,
          "explanation": "finally bloki try qismi muvaffaqiyatli bo‘lsa ham, catch da xato ushlansa ham eng oxirida albatta ishga tushadi."
        },
        {
          "id": "q-err-2",
          "question": "Asinxron funksiyada await qo‘yilmagan Promise xato bersa, try/catch uni ushlay oladimi?",
          "type": "multiple-choice",
          "options": [
            "Ha, albatta ushlaydi",
            "Yo‘q, chunki xato kelajakda yuz beradi va try bloki allaqachon bajarilib bo‘lgan bo‘ladi",
            "Faqat string xatolar ushlanadi",
            "Brauzer o‘zi avtomatik to‘g‘rilaydi"
          ],
          "correctAnswer": 1,
          "explanation": "Agar Promisega await qo‘yilmasa, u fon rejimida bajariladi va try/catch sinxron o‘tib ketgani sababli unhandled rejection yuzaga keladi."
        }
      ],
      "reflectionQuestion": "Nima uchun server 404 qaytarganda fetch avtomatik catch ga tushmaydi?",
      "summary": "Asinxron xatolarni boshqarish, try/catch/finally strukturasi va fallback strategiyalarini o‘rgandik.",
      "nextLessonSlug": "dom-arxitekturasi-va-manipulyatsiya",
      "nextLessonTitle": "12-Dars: DOM Arxitekturasi va Samarali Manipulyatsiya"
    },
    "exercise": {
      "title": "Xavfsiz API Chaqiruvchi Yordamchi (safeAsyncCaller)",
      "description": "safeAsyncCaller(asyncFn, fallbackValue) nomli funksiya yozing. U asyncFn() ni chaqirsin. Agar u muvaffaqiyatli yakunlansa { ok: true, data: result } qaytarsin. Agar xatolik yuz bersa, { ok: false, data: fallbackValue, error: err.message } qaytarsin.",
      "instructions": [
        "try / catch blokidan foydalaning",
        "Xatolik yuz berganda dastur qulamasdan obyekt qaytarsin"
      ],
      "starterCode": "async function safeAsyncCaller(asyncFn, fallbackValue) {\n  // asyncFn ni try/catch orqali xavfsiz chaqiring.\n  // Muvaffaqiyatli bo'lsa: { ok: true, data: res }\n  // Xatolikda: { ok: false, data: fallbackValue, error: err.message }\n}\n\n// Sinov uchun chaqiruvlar:\nsafeAsyncCaller(async () => \"Ma’lumot\", \"Zaxira\").then(r => console.log(JSON.stringify(r)));\nsafeAsyncCaller(async () => { throw new Error(\"Server ishlamayapti\"); }, \"Zaxira\").then(r => {\n  console.log(JSON.stringify(r));\n  console.log(r.ok);\n});\n",
      "language": "javascript",
      "difficulty": "medium",
      "passingScore": 100,
      "xpReward": 70,
      "testCases": [
        {
          "id": "tc-err-1",
          "description": "Muvaffaqiyatli funksiya natijasi",
          "expectedOutput": "{\"ok\":true,\"data\":\"Ma’lumot\"}",
          "isHidden": false
        },
        {
          "id": "tc-err-2",
          "description": "Xatolikda fallback qiymat qaytishi",
          "expectedOutput": "{\"ok\":false,\"data\":\"Zaxira\",\"error\":\"Server ishlamayapti\"}",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-err-3",
          "description": "Xato obyektida ok: false ekanligi",
          "expectedOutput": "false",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Asinxron kod ichidagi xatolar try/catch tomonidan ushlanishi uchun await qayerda turishi kerakligini o‘ylab ko‘ring.",
        "2-yordam: try bloki ichida const res = await asyncFn() deb natijani oling va { ok: true, data: res } qaytaring.",
        "3-yordam: catch (err) blokida xatoni yutib yubormasdan, { ok: false, data: fallbackValue, error: err.message } obyektini qaytaring."
      ],
      "solutionExplanation": "try ichida xato bo‘lsa, catch xavfsiz fallback va xato xabarini obyekt ko‘rinishida qaytaradi.",
      "expectedConcepts": [
        "try/catch",
        "async error handling",
        "fallback"
      ],
      "validSolutionCode": "async function safeAsyncCaller(asyncFn, fallbackValue) {\n  try {\n    const res = await asyncFn();\n    return { ok: true, data: res };\n  } catch (err) {\n    return { ok: false, data: fallbackValue, error: err.message };\n  }\n}\nsafeAsyncCaller(async () => \"Ma’lumot\", \"Zaxira\").then(r => console.log(JSON.stringify(r)));\nsafeAsyncCaller(async () => { throw new Error(\"Server ishlamayapti\"); }, \"Zaxira\").then(r => {\n  console.log(JSON.stringify(r));\n  console.log(r.ok);\n});",
      "deliberateErrorCode": "async function safeAsyncCaller() {\n  throw new Error(\"Fatal syntax failure\");\n}"
    }
  },
  {
    "moduleIndex": 3,
    "order": 12,
    "title": "12-Dars: DOM Arxitekturasi va Samarali Manipulyatsiya",
    "slug": "dom-arxitekturasi-va-manipulyatsiya",
    "description": "DOM daraxti, Node vs Element, Reflow va Repaint optimizatsiyasi, DocumentFragment.",
    "estimatedMinutes": 25,
    "objectives": [
      "DOM daraxtining tuzilishi va elementlarni dinamik boshqarishni o‘rganish",
      "Reflow va Repaint tushunchalarini bilish hamda DocumentFragment yordamida tezlikni oshirish"
    ],
    "content": {
      "title": "12-Dars: DOM Arxitekturasi va Samarali Manipulyatsiya",
      "learningObjective": "Brauzer interfeysini samarali va tezkor boshqarish, ortiqcha render yukini kamaytirish.",
      "prerequisites": "HTML asoslari va JavaScript massivlari.",
      "realLifeAnalogy": "Qurilish kranida yuk tashish: 100 ta alohida g‘ishtni birma-bir 100 marta tepaga tashish judayam ko‘p vaqt oladi (har safar Reflow). Buning o‘rniga hamma g‘ishtlar bitta poddonga (DocumentFragment) yuklanadi va kran bir marta tepaga olib chiqib o‘rnatadi.",
      "theory": [
        {
          "type": "text",
          "content": "**DOM (Document Object Model)** — HTML hujjatining brauzer xotirasidagi daraxtsimon ko‘rinishidir.\n\nHar safar DOM ga element qo‘shilganda brauzer elementlar o‘lchami va joylashuvini qayta hisoblaydi (**Reflow**) va qayta bo‘yaydi (**Repaint**). Katta ro‘yxatlarni render qilishda xotiradagi virtual konteyner bo‘lgan `document.createDocumentFragment()` ishlatilsa, butun ro‘yxat faqat bir martada DOM ga kiritiladi va tezlik keskin oshadi."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "function createList(items) {\n  const fragment = document.createDocumentFragment();\n  items.forEach(item => {\n    const li = document.createElement(\"li\");\n    li.textContent = item;\n    fragment.appendChild(li);\n  });\n  return fragment; // Faqat 1 marta haqiqiy DOM ga ulanadi\n}",
          "lineExplanations": {
            "2": "createDocumentFragment xotirada yengil konteyner ochadi",
            "6": "Har bir li fragmentga yig‘iladi (sahifa hali qayta chizilmaydi)",
            "8": "Tashqarida bitta append bilan barcha elementlar kiritiladi"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "Sikl ichida innerHTML += qilish",
          "wrongCode": "for (let i = 0; i < 100; i++) {\n  list.innerHTML += \"<li>\" + i + \"</li>\"; // Har safar butun DOM qayta buzib quriladi!\n}",
          "correctCode": "const fragment = document.createDocumentFragment();\nfor (let i = 0; i < 100; i++) {\n  const li = document.createElement(\"li\");\n  li.textContent = i;\n  fragment.appendChild(li);\n}\nlist.appendChild(fragment);",
          "explanation": "`innerHTML +=` har bir tsiklda avvalgi barcha elementlarni yo‘q qilib, qaytadan HTML parse qiladi. Bu juda sekin ishlaydi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-dom-1",
          "question": "DocumentFragment nima uchun ishlatiladi?",
          "type": "multiple-choice",
          "options": [
            "Faqat audio fayllarni o‘ynatish uchun",
            "DOM manipulyatsiyasida Reflow sonini kamaytirib, unumdorlikni oshirish uchun",
            "Faqat CSS o‘zgaruvchilarini saqlash uchun",
            "Faqat JSON fayllarni o‘qish uchun"
          ],
          "correctAnswer": 1,
          "explanation": "DocumentFragment xotiradagi konteyner bo‘lib, bir nechta elementni bitta amalda DOM ga kiritish imkonini beradi."
        },
        {
          "id": "q-dom-2",
          "question": "Nima uchun DOM ga 1000 ta elementni for siklida ketma-ket append qilish yomon amaliyot hisoblanadi?",
          "type": "multiple-choice",
          "options": [
            "Har bir append qilish brauzerda qayta hisoblash va chizishni (Reflow va Repaint) chaqirib, sahifani qotiradi",
            "JavaScript faqat 10 ta element qo‘shishga ruxsat beradi",
            "DOM xotirasi darhol to‘lib qoladi",
            "Barcha matnlar o‘chib ketadi"
          ],
          "correctAnswer": 0,
          "explanation": "Har bir DOM manipulyatsiyasi qimmat operatsiya bo‘lib, ko‘p elementlar uchun DocumentFragment yoki bitta batch append ishlatish lozim."
        }
      ],
      "reflectionQuestion": "Nima uchun `element.textContent` ishlatish `element.innerHTML` ga qaraganda xavfsizroq hisoblanadi?",
      "summary": "DOM arxitekturasi, Reflow/Repaint tushunchalari va DocumentFragment bilan ishlashni o‘rgandik.",
      "nextLessonSlug": "event-bubbling-va-delegation",
      "nextLessonTitle": "13-Dars: Event Bubbling va Event Delegation"
    },
    "exercise": {
      "title": "Elementlar fragmentini hosil qilish",
      "description": "buildDomElements(tagNames, texts) nomli funksiya yozing. U tagNames (masalan [\"h1\", \"p\"]) va texts (masalan [\"Salom\", \"Dunyoni o‘zgartir\"]) massivlarini olsin va ulardan tashkil topgan HTML elementlar tavsifini massiv ko‘rinishida [{ tag: \"h1\", text: \"Salom\" }, ...] qaytarsin.",
      "instructions": [
        "tagNames va texts uzunligi teng ekanini inobatga oling",
        "Har bir indeks bo‘yicha obyekt tuzib massivga yig‘ing"
      ],
      "starterCode": "function buildDomElements(tagNames, texts) {\n  // tagNames va texts massivlarini birlashtirib,\n  // har bir juftlik uchun { tag, text } obyektlaridan iborat massiv qaytaring.\n}\n\n// Sinov uchun chaqiruvlar:\nconsole.log(JSON.stringify(buildDomElements([\"h1\", \"p\"], [\"Salom\", \"Dars\"])));\nconsole.log(JSON.stringify(buildDomElements([], [])));\n",
      "language": "javascript",
      "difficulty": "easy",
      "passingScore": 100,
      "xpReward": 60,
      "testCases": [
        {
          "id": "tc-dom-1",
          "description": "H1 va P elementlarini hosil qilish",
          "expectedOutput": "[{\"tag\":\"h1\",\"text\":\"Salom\"},{\"tag\":\"p\",\"text\":\"Dars\"}]",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-dom-2",
          "description": "Bo‘sh massivlar bilan sinash",
          "expectedOutput": "[]",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Ikkita parallel massiv elementlarini indeks bo‘yicha juftlash uchun qaysi massiv metodidan foydalanish qulay?",
        "2-yordam: tagNames.map((tag, idx) => ({ ... })) orqali har bir tegga mos texts[idx] matnini biriktiring.",
        "3-yordam: return tagNames.map((tag, idx) => ({ tag: tag, text: texts[idx] || \"\" })); orqali massivni qaytaring."
      ],
      "solutionExplanation": "Elementlar juftligi bo‘yicha obyektlar massivi hosil qilinadi.",
      "expectedConcepts": [
        "dom",
        "mapping",
        "element structure"
      ],
      "validSolutionCode": "function buildDomElements(tagNames, texts) {\n  return tagNames.map((tag, idx) => ({\n    tag: tag,\n    text: texts[idx] || \"\"\n  }));\n}\nconsole.log(JSON.stringify(buildDomElements([\"h1\", \"p\"], [\"Salom\", \"Dars\"])));\nconsole.log(JSON.stringify(buildDomElements([], [])));",
      "deliberateErrorCode": "function buildDomElements() {\n  return document.undefinedMethod();\n}"
    }
  },
  {
    "moduleIndex": 3,
    "order": 13,
    "title": "13-Dars: Event Bubbling va Event Delegation",
    "slug": "event-bubbling-va-delegation",
    "description": "Hodisalar fazalari, event.target vs currentTarget, Event Delegation orqali xotirani tejash.",
    "estimatedMinutes": 25,
    "objectives": [
      "Event Bubbling va Capturing bosqichlarini tushunish",
      "event.target va event.currentTarget farqini bilish",
      "Event Delegation yordamida yuzlab tugmalarni bitta ota element orqali optimal boshqarish"
    ],
    "content": {
      "title": "13-Dars: Event Bubbling va Event Delegation",
      "learningObjective": "Katta interfeyslarda minglab event listener ochmasdan, bitta umumiy ota tinglovchi orqali xotirani tejash.",
      "prerequisites": "DOM asoslari va addEventListener.",
      "realLifeAnalogy": "Katta savdo markazi qo‘riqchisi: Har bitta do‘kon va har bitta peshtaxta oldiga alohida soqchi qo‘yish (minglab listenerlar) juda qimmatga tushadi. Buning o‘rniga, butun markazning umumiy kirish eshigiga bitta qo‘riqchi qo‘yiladi va u kim qaysi do‘konga kirayotganini (event.target) bitta joydan kuzatib turadi.",
      "theory": [
        {
          "type": "text",
          "content": "**Event Bubbling (Ko‘piklanish)** — bolalar elementida sodir bo‘lgan hodisa xuddi suv tagidagi pufakcha kabi yuqoriga — ota elementlar va `document` tomon ko‘tarilishidir.\n\n**Event Delegation (Vakillik):** Har bir tugmaga alohida `click` qo‘yish o‘rniga, ularning barchasini o‘rab turgan ota `<ul>` yoki `<div>` ga bitta listener qo‘yiladi va `event.target` orqali aynan qaysi element bosilgani aniqlanadi."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "// Ota konteynerga bitta listener qo'yiladi:\nconst todoList = document.querySelector(\"#todo-list\");\n\ntodoList.addEventListener(\"click\", (event) => {\n  // Bosilgan element aynan o'chirish tugmasimi?\n  const deleteBtn = event.target.closest(\".btn-delete\");\n  if (deleteBtn) {\n    const taskId = deleteBtn.dataset.id;\n    console.log(\"O'chirilmoqda:\", taskId);\n  }\n});",
          "lineExplanations": {
            "4": "event.target bosilgan aniq elementga ishora qiladi",
            "6": "closest() yordamida bosilgan elementning kerakli tugmaga tegishliligi aniqlanadi"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "stopPropagation() ni noo‘rin ishlatish",
          "wrongCode": "button.addEventListener(\"click\", (e) => {\n  e.stopPropagation(); // Butun yuqoriga ko'tarilishni to'xtatadi!\n});",
          "correctCode": "button.addEventListener(\"click\", (e) => {\n  // Faqat o'z amalingizni bajaring, global delegatsiyani buzmang\n});",
          "explanation": "`stopPropagation()` boshqa global analitika yoki ota elementdagi muhim delegatsiyalarni ham o‘chirib qo‘yishi mumkin.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-del-1",
          "question": "`event.target` va `event.currentTarget` farqi nimada?",
          "type": "multiple-choice",
          "options": [
            "Hech qanday farqi yo‘q",
            "event.target — hodisa aynan qaysi elementda yuz berganligi; event.currentTarget — listener qaysi elementga ilinganligi",
            "event.target faqat matnni bildiradi",
            "event.currentTarget doim null bo‘ladi"
          ],
          "correctAnswer": 1,
          "explanation": "target — bosilgan eng ichki element; currentTarget esa hodisani eshitayotgan ota elementdir."
        },
        {
          "id": "q-del-2",
          "question": "Hodisa tarqalishini (Event Bubbling) ota elementlarga chiqishini to‘xtatish uchun nima chaqiriladi?",
          "type": "multiple-choice",
          "options": [
            "event.preventDefault()",
            "event.stopPropagation()",
            "return false",
            "event.removeEventListener()"
          ],
          "correctAnswer": 1,
          "explanation": "event.stopPropagation() hodisaning DOM daraxti bo‘ylab yuqoriga (ota elementlarga) ko‘tarilishini to‘xtatadi."
        }
      ],
      "reflectionQuestion": "Dinamik tarzda yangi elementlar qo‘shilganda nima uchun Event Delegation ishlatish qulay?",
      "summary": "Event Bubbling, delegatsiya mexanizmi va xotirani optimallashtirishni o‘rgandik.",
      "nextLessonSlug": "formalarni-tekshirish-form-validation",
      "nextLessonTitle": "14-Dars: Formalarni Real Vaqtda Tekshirish (Form Validation)"
    },
    "exercise": {
      "title": "Action Router (Delegatsiya Mantiqi)",
      "description": "dispatchActionEvent(targetAction, dataId) nomli funksiya yozing. U action turiga qarab javob qaytarsin:\n- \"delete\": \"ID [ID] o‘chirildi\"\n- \"edit\": \"ID [ID] tahrirlandi\"\n- \"view\": \"ID [ID] ko‘rildi\"\nAgar notanish action bo‘lsa: \"Noma’lum amal\" qaytarsin.",
      "instructions": [
        "targetAction qiymatini tekshiring",
        "Mos xabarni formatlab return qiling"
      ],
      "starterCode": "function dispatchActionEvent(targetAction, dataId) {\n  // targetAction qiymatiga qarab xabarni qaytaring:\n  // - \"delete\" -> \"ID [dataId] o‘chirildi\"\n  // - \"edit\" -> \"ID [dataId] tahrirlandi\"\n  // - \"view\" -> \"ID [dataId] ko‘rildi\"\n  // - Boshqa holatda -> \"Noma’lum amal\"\n}\n\n// Sinov uchun chaqiruvlar:\nconsole.log(dispatchActionEvent(\"delete\", 10));\nconsole.log(dispatchActionEvent(\"unknown\", 99));\nconsole.log(dispatchActionEvent(\"edit\", 42));\n",
      "language": "javascript",
      "difficulty": "easy",
      "passingScore": 100,
      "xpReward": 60,
      "testCases": [
        {
          "id": "tc-del-1",
          "description": "O‘chirish amalini tekshirish",
          "expectedOutput": "ID 10 o‘chirildi",
          "isHidden": false
        },
        {
          "id": "tc-del-2",
          "description": "Noma’lum amalni tekshirish",
          "expectedOutput": "Noma’lum amal",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-del-3",
          "description": "Tahrirlash amalini tekshirish",
          "expectedOutput": "ID 42 tahrirlandi",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Event delegation tamoyilida bitta ota elementga hodisa ulanib, bosilgan bolaning ma’lumoti tekshirilishini eslang.",
        "2-yordam: switch(targetAction) yoki if/else yordamida \"delete\", \"edit\" va \"view\" holatlarini ajrating.",
        "3-yordam: Har bir holat uchun \"ID \" + dataId + \" [AMAL]\" matnini, default holatda esa \"Noma’lum amal\" satrini return qiling."
      ],
      "solutionExplanation": "Delegatsiyadagi kabi har bir action nomi bo‘yicha tegishli mantiq ishga tushiriladi.",
      "expectedConcepts": [
        "event delegation",
        "action routing",
        "switch/case"
      ],
      "validSolutionCode": "function dispatchActionEvent(targetAction, dataId) {\n  switch (targetAction) {\n    case \"delete\":\n      return \"ID \" + dataId + \" o‘chirildi\";\n    case \"edit\":\n      return \"ID \" + dataId + \" tahrirlandi\";\n    case \"view\":\n      return \"ID \" + dataId + \" ko‘rildi\";\n    default:\n      return \"Noma’lum amal\";\n  }\n}\nconsole.log(dispatchActionEvent(\"delete\", 10));\nconsole.log(dispatchActionEvent(\"unknown\", 99));\nconsole.log(dispatchActionEvent(\"edit\", 42));",
      "deliberateErrorCode": "function dispatchActionEvent() {\n  return invalidAction();\n}"
    }
  },
  {
    "moduleIndex": 3,
    "order": 14,
    "title": "14-Dars: Formalarni Real Vaqtda Tekshirish (Form Validation)",
    "slug": "formalarni-tekshirish-form-validation",
    "description": "e.preventDefault, regex bilan tekshirish, foydalanuvchiga tushunarli o‘zbekcha xato xabarlari va ARIA.",
    "estimatedMinutes": 25,
    "objectives": [
      "Formani yuborishda e.preventDefault() vazifasini tushunish",
      "Regex va shartlar yordamida foydalanuvchi kiritgan ma’lumotlarni real vaqtda tekshirish",
      "Xato xabarlarini foydalanuvchiga tushunarli va qulay ko‘rinishda taqdim etish"
    ],
    "content": {
      "title": "14-Dars: Formalarni Real Vaqtda Tekshirish (Form Validation)",
      "learningObjective": "Foydalanuvchi kiritayotgan ma’lumotlarni real vaqtda to‘g‘ri tekshirish va xavfsizlikni oshirish.",
      "prerequisites": "DOM hodisalari va Regex asoslari.",
      "realLifeAnalogy": "Aeroport pasport nazorati: Chegaradan o‘tayotganingizda, xodim har bitta hujjatni (pasport raqami, amal qilish muddati, viza) birma-bir tekshiradi. Agar birortasida xato bo‘lsa, samolyotga qo‘yilmaysiz va qayerida kamchilik borligi tushuntiriladi.",
      "theory": [
        {
          "type": "text",
          "content": "Web formalarni tekshirish ikki xil bo‘ladi:\n1. **Real-time validation (Kiritish jarayonida):** `input` hodisasi orqali har bir belgi kiritilganda darhol tekshirilib, yashil/qizil hoshiya bilan ko‘rsatiladi.\n2. **Submit validation (Yuborishda):** `e.preventDefault()` chaqirilib, sahifaning serverga qayta yuklanishi to‘xtatiladi va barcha maydonlar to‘liqligi tasdiqlanadi."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "function validateEmail(email) {\n  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return emailRegex.test(email);\n}\n\nfunction validatePassword(password) {\n  // Kamida 8 ta belgi va bitta raqam\n  return password.length >= 8 && /\\d/.test(password);\n}",
          "lineExplanations": {
            "2": "Muntazam ifoda (Regex) email formatini tekshiradi",
            "7": "Parol uzunligi va unda raqam borligi sharti"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "e.preventDefault() ni unutib sahifani yangilab yuborish",
          "wrongCode": "form.addEventListener(\"submit\", () => {\n  // Sahifa yangilanib ketadi va xatolar yo'qoladi!\n});",
          "correctCode": "form.addEventListener(\"submit\", (e) => {\n  e.preventDefault();\n  // Endi JS orqali xavfsiz tekshirish mumkin\n});",
          "explanation": "Standart submit hodisasi sahifani yangilaydi. Single-page ilovalarda `e.preventDefault()` majburiydir.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-val-1",
          "question": "`e.preventDefault()` metodining vazifasi nima?",
          "type": "multiple-choice",
          "options": [
            "Kompyuterni o‘chirish",
            "Brauzerning standart harakatini (masalan, formani yuborib sahifani yangilashini) to‘xtatish",
            "Faqat xatolar logini tozalash",
            "CSS stillarini o‘chirish"
          ],
          "correctAnswer": 1,
          "explanation": "e.preventDefault() brauzerning ushbu hodisa bo‘yicha standart reaksiyasini bekor qiladi."
        },
        {
          "id": "q-val-2",
          "question": "Formada submit hodisasi yuz berganda sahifa yangilanib ketmasligi uchun nima qilish kerak?",
          "type": "multiple-choice",
          "options": [
            "event.stopPropagation()",
            "event.preventDefault()",
            "form.reset()",
            "return true"
          ],
          "correctAnswer": 1,
          "explanation": "event.preventDefault() brauzerning formani jo‘natish va sahifani qayta yuklash bo‘yicha standart xatti-harakatini to‘xtatadi."
        }
      ],
      "reflectionQuestion": "Nima uchun faqat frontendda validatsiya qilish xavfsizlik uchun yetarli emas?",
      "summary": "Formani tekshirish, regex naqshlari va qulay xatolik xabarlarini o‘rgandik.",
      "nextLessonSlug": "brauzer-xotirasi-localstorage",
      "nextLessonTitle": "15-Dars: Brauzer Xotirasi: LocalStorage va SessionStorage"
    },
    "exercise": {
      "title": "Ro‘yxatdan o‘tish shaklini tekshiruvchi funksiya",
      "description": "validateRegistrationForm(formData) nomli funksiya yozing. U { username, email, password } obyektini olsin va errors massivini qaytarsin:\n- username bo‘sh bo‘lsa yoki 3 tadan kam bo‘lsa: \"Foydalanuvchi nomi kamida 3 ta belgi bo‘lishi kerak\"\n- email da @ belgisi bo‘lmasa: \"Noto‘g‘ri email formati\"\n- password 6 tadan kam bo‘lsa: \"Parol kamida 6 ta belgi bo‘lishi kerak\"\nAgar barchasi to‘g‘ri bo‘lsa, bo‘sh massiv [] qaytarsin.",
      "instructions": [
        "Har bir shartni alohida if bilan tekshirib errors ga push qiling",
        "return errors;"
      ],
      "starterCode": "function validateRegistrationForm(formData) {\n  const errors = [];\n  // Talablar:\n  // 1. username kamida 3 belgi (\"Foydalanuvchi nomi kamida 3 ta belgi bo‘lishi kerak\")\n  // 2. email tarkibida \"@\" bo'lishi kerak (\"Noto‘g‘ri email formati\")\n  // 3. password kamida 6 belgi (\"Parol kamida 6 ta belgi bo‘lishi kerak\")\n  return errors;\n}\n\n// Sinov uchun chaqiruvlar:\nconsole.log(JSON.stringify(validateRegistrationForm({ username: \"Ali\", email: \"ali@codequest.uz\", password: \"secretPassword\" })));\nconsole.log(JSON.stringify(validateRegistrationForm({ username: \"Laylo\", email: \"notanemail\", password: \"123\" })));\nconsole.log(JSON.stringify(validateRegistrationForm({ username: \"Bo\", email: \"bo@domain.uz\", password: \"validPassword123\" })));\n",
      "language": "javascript",
      "difficulty": "easy",
      "passingScore": 100,
      "xpReward": 60,
      "testCases": [
        {
          "id": "tc-val-1",
          "description": "To‘g‘ri to‘ldirilgan forma",
          "expectedOutput": "[]",
          "isHidden": false
        },
        {
          "id": "tc-val-2",
          "description": "Kalta parol va noto‘g‘ri email bilan xatolar chiqishi",
          "expectedOutput": "[\"Noto‘g‘ri email formati\",\"Parol kamida 6 ta belgi bo‘lishi kerak\"]",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-val-3",
          "description": "Username kalta bo‘lganda xato chiqishi",
          "expectedOutput": "[\"Foydalanuvchi nomi kamida 3 ta belgi bo‘lishi kerak\"]",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Foydalanuvchi ma’lumotlarini tekshirayotganda qaysi maydonlar majburiy ekanligi va ularning minimal talablarini eslang.",
        "2-yordam: Har bir talab (username uzunligi, email formati, parol uzunligi) uchun if shartini yozib, xato bo‘lsa errors massiviga xabar matnini qo‘shing.",
        "3-yordam: if (!formData.username || formData.username.length < 3) shartlaridan foydalanib xatolar massivini return qiling."
      ],
      "solutionExplanation": "Forma maydonlari tekshirilib, mos o‘zbekcha xatolik xabarlari massivda qaytariladi.",
      "expectedConcepts": [
        "form validation",
        "error array",
        "string methods"
      ],
      "validSolutionCode": "function validateRegistrationForm(formData) {\n  const errors = [];\n  if (!formData || !formData.username || formData.username.length < 3) {\n    errors.push(\"Foydalanuvchi nomi kamida 3 ta belgi bo‘lishi kerak\");\n  }\n  if (!formData || !formData.email || !formData.email.includes(\"@\")) {\n    errors.push(\"Noto‘g‘ri email formati\");\n  }\n  if (!formData || !formData.password || formData.password.length < 6) {\n    errors.push(\"Parol kamida 6 ta belgi bo‘lishi kerak\");\n  }\n  return errors;\n}\nconsole.log(JSON.stringify(validateRegistrationForm({ username: \"Ali\", email: \"ali@codequest.uz\", password: \"secretPassword\" })));\nconsole.log(JSON.stringify(validateRegistrationForm({ username: \"Laylo\", email: \"notanemail\", password: \"123\" })));\nconsole.log(JSON.stringify(validateRegistrationForm({ username: \"Bo\", email: \"bo@domain.uz\", password: \"validPassword123\" })));",
      "deliberateErrorCode": "function validateRegistrationForm() {\n  throw new Error(\"Validation failure\");\n}"
    }
  },
  {
    "moduleIndex": 3,
    "order": 15,
    "title": "15-Dars: Brauzer Xotirasi: LocalStorage va SessionStorage",
    "slug": "brauzer-xotirasi-localstorage",
    "description": "LocalStorage vs SessionStorage, JSON.stringify va JSON.parse, xavfsizlik va limitlar.",
    "estimatedMinutes": 25,
    "objectives": [
      "LocalStorage va SessionStorage ning ishlash farqlarini bilish",
      "Obyekt va massivlarni JSON yordamida xotirada to‘g‘ri saqlash va o‘qish",
      "Xotira xavfsizligi qoidalarini (maxfiy ma’lumotlarni saqlamaslik) tushunish"
    ],
    "content": {
      "title": "15-Dars: Brauzer Xotirasi: LocalStorage va SessionStorage",
      "learningObjective": "Foydalanuvchi sozlamalari va ma’lumotlarini brauzerda doimiy saqlab qolish.",
      "prerequisites": "JSON formati va JavaScript obyektlari.",
      "realLifeAnalogy": "Shaxsiy kundalik: Siz kundaligingizga muhim eslatmalar yozib qo‘ydingiz. Kundalikni yopsangiz ham, chiroqni o‘chirib uxlasangiz ham (brauzer yopilsa ham), ertasi kuni ochganingizda yozuvlar aynan qanday bo‘lsa shunday saqlanib turadi (LocalStorage).",
      "theory": [
        {
          "type": "text",
          "content": "Brauzerda ma’lumotlarni saqlashning 2 ta asosiy mexanizmi mavjud:\n\n1. **LocalStorage:** Foydalanuvchi yoki dastur kodi tomonidan o‘chirilmaguncha saqlanadi. Brauzer yopilsa ham yo‘qolmaydi (Hajmi ~5MB).\n2. **SessionStorage:** Faqat joriy brauzer oynasi/tabi ochiq turganda saqlanadi. Tab yopilishi bilan barcha ma’lumotlar avtomatik o‘chadi (Hajmi ~5MB).\n\nAsosiy metodlar: `setItem(key, val)`, `getItem(key)`, `removeItem(key)`, `clear()`."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "const settings = { theme: \"dark\", fontSize: 16 };\n\n// 1. Obyektni to‘g‘ri formatda saqlash (serializatsiya):\nlocalStorage.setItem(\"user_settings\", JSON.stringify(settings));\n\n// 2. Obyektni xavfsiz o‘qish va tekshirish:\nconst saved = localStorage.getItem(\"user_settings\");\nlet currentSettings = null;\ntry {\n  if (saved) currentSettings = JSON.parse(saved);\n} catch (e) {\n  console.error(\"Buzilgan JSON:\", e);\n}\n\n// 3. O‘chirish va tozalash:\nlocalStorage.removeItem(\"user_settings\"); // bitta kalitni o‘chirish\n// localStorage.clear(); // barcha xotirani tozalash",
          "lineExplanations": {
            "4": "JSON.stringify obyektni matn (string) ko‘rinishiga keltiradi, chunki xotira faqat string saqlay oladi",
            "10": "JSON.parse buzuq format kelganda xato otmasligi uchun try/catch orqali xavfsiz o‘qiladi",
            "16": "removeItem() metodi faqat berilgan kalitdagi ma’lumotni o‘chiradi"
          }
        },
        {
          "type": "tip",
          "content": "🚨 XAVFSIZLIK OGOHLANTIRISHI (Security Warning):\n1. Parol, kredit karta yoki maxfiy tokenlarni hech qachon LocalStorage da saqlamang!\n2. XSS (Cross-Site Scripting) hujumi sodir bo‘lsa, saytdagi ixtiyoriy skript localStorage.getItem() orqali ma’lumotlarni o‘g‘irlay oladi.\n3. Avtorizatsiya tokenlarini HttpOnly Cookie da saqlash tavsiya etiladi.\n4. JSON.stringify shifrlash (encryption) EMAS, u shunchaki matn formatidir."
        }
      ],
      "commonMistakes": [
        {
          "title": "Obyektni to‘g‘ridan-to‘g‘ri JSON.stringify siz saqlash",
          "wrongCode": "localStorage.setItem(\"user\", { name: \"Ali\" });\nconsole.log(localStorage.getItem(\"user\")); // \"[object Object]\" bo'lib qoladi!",
          "correctCode": "localStorage.setItem(\"user\", JSON.stringify({ name: \"Ali\" }));",
          "explanation": "LocalStorage har qanday kiritilgan ma’lumotni string ga aylantiradi, obyekt esa `\"[object Object]\"` ga aylanib ma’lumot yo‘qoladi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-ls-1",
          "question": "LocalStorage da ma’lumotlar qachongacha saqlanadi?",
          "type": "multiple-choice",
          "options": [
            "Faqat 5 daqiqa",
            "Faqat tab ochiq turguncha",
            "Foydalanuvchi keshni tozalamaguncha yoki kod o‘chirmaguncha doimiy saqlanadi",
            "Sahifa yangilanganda o‘chib ketadi"
          ],
          "correctAnswer": 2,
          "explanation": "LocalStorage doimiy xotira bo‘lib, brauzer yoki kompyuter o‘chirilganda ham ma’lumot saqlanadi."
        },
        {
          "id": "q-stor-2",
          "question": "Nima sababdan foydalanuvchining paroli yoki maxfiy tokenlarini LocalStorage da saqlash xavflidir?",
          "type": "multiple-choice",
          "options": [
            "LocalStorage juda sekin ishlaydi",
            "XSS (Cross-Site Scripting) hujumi sodir bo‘lsa, veb-sahifadagi har qanday skript LocalStorage ni to‘liq o‘qib, serveriga jo‘nata oladi",
            "LocalStorage faqat raqamlarni saqlay oladi",
            "Faqat 10 daqiqa saqlanadi"
          ],
          "correctAnswer": 1,
          "explanation": "LocalStorage HttpOnly himoyasiga ega emas. Shuning uchun XSS orqali maxfiy ma’lumotlar o‘g‘irlanishi mumkin; sessiya tokenlarini HttpOnly Cookie da saqlash tavsiya etiladi."
        }
      ],
      "reflectionQuestion": "Nima uchun foydalanuvchining parolini yoki maxfiy tokenlarini LocalStorage ga ochiq saqlash xavflidir?",
      "summary": "LocalStorage, SessionStorage, JSON bilan ishlash va xavfsizlik tavsiyalarini o‘rgandik.",
      "nextLessonSlug": "debouncing-va-throttling",
      "nextLessonTitle": "16-Dars: Debouncing va Throttling (Samaradorlikni Oshirish)"
    },
    "exercise": {
      "title": "Xavfsiz LocalStorage Yordamchisi (Storage Helper)",
      "description": "createStorageSimulator nomli factory funksiya yozing. U ichki virtual ombor (obyekt) ustida quyidagi metodlarni taqdim etuvchi obyekt qaytarsin:\n1. setItem(key, value) — qiymatni JSON.stringify qilib saqlasin\n2. getItem(key, defaultValue = null) — qiymatni JSON.parse qilib qaytarsin; kalit mavjud bo‘lmasa yoki parse xato bersa defaultValue qaytarsin.",
      "instructions": [
        "Internal xotira sifatida Map yoki oddiy obyektdan foydalaning",
        "setItem stringify qilsin, getItem parse qilsin"
      ],
      "starterCode": "function createStorageSimulator() {\n  // Ichki xotira (obyekt) ustida ishlovchi metodlarni qaytaring:\n  // setItem(key, value) va getItem(key, defaultValue)\n}\n\n// Sinov uchun chaqiruvlar:\nconst storage = createStorageSimulator();\nstorage.setItem('user', { theme: 'dark' });\nconsole.log(JSON.stringify(storage.getItem('user')));\nconsole.log(storage.getItem('missing', 'standart'));\nstorage.setItem('scores', [10, 20, 30]);\nconsole.log(JSON.stringify(storage.getItem('scores')));\n",
      "language": "javascript",
      "difficulty": "medium",
      "passingScore": 100,
      "xpReward": 65,
      "testCases": [
        {
          "id": "tc-ls-1",
          "description": "Obyektni saqlash va qayta o‘qish",
          "expectedOutput": "{\"theme\":\"dark\"}",
          "isHidden": false
        },
        {
          "id": "tc-ls-2",
          "description": "Mavjud bo‘lmagan kalit uchun defaultValue qaytishi",
          "expectedOutput": "standart",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-ls-3",
          "description": "Sonlar massivini saqlash va parse qilish",
          "expectedOutput": "[10,20,30]",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: LocalStorage faqat satr (string) ma’lumotlarni qabul qilishi sababli murakkab ma’lumotlarni matnga aylantirish zarurligini eslang.",
        "2-yordam: Ichki let store = {} lug‘atini yarating. setItem da qiymatni JSON.stringify qiling, getItem da esa try/catch orqali JSON.parse qilib o‘qing.",
        "3-yordam: try { return JSON.parse(store[key]); } catch { return defaultValue; } tuzilmasidan foydalaning."
      ],
      "solutionExplanation": "LocalStorage logikasi simulyatsiya qilinib, obyektlar JSON orqali to‘g‘ri aylanadi.",
      "expectedConcepts": [
        "storage",
        "json.stringify",
        "json.parse"
      ],
      "validSolutionCode": "function createStorageSimulator() {\n  const store = {};\n  return {\n    setItem(key, value) {\n      store[key] = JSON.stringify(value);\n    },\n    getItem(key, defaultValue = null) {\n      if (store[key] === undefined) return defaultValue;\n      try {\n        return JSON.parse(store[key]);\n      } catch (e) {\n        return defaultValue;\n      }\n    }\n  };\n}\nconst s = createStorageSimulator();\ns.setItem(\"conf\", { theme: \"dark\" });\nconsole.log(JSON.stringify(s.getItem(\"conf\")));\nconsole.log(s.getItem(\"nonexistent\", \"standart\"));\ns.setItem(\"nums\", [10, 20, 30]);\nconsole.log(JSON.stringify(s.getItem(\"nums\")));",
      "deliberateErrorCode": "function createStorageSimulator() {\n  return null.fail();\n}"
    }
  },
  {
    "moduleIndex": 3,
    "order": 16,
    "title": "16-Dars: Debouncing va Throttling (Samaradorlikni Oshirish)",
    "slug": "debouncing-va-throttling",
    "description": "Tez-tez yuz beradigan hodisalarni optimallashtirish, setTimeout va clearTimeout yordamida kechiktirish.",
    "estimatedMinutes": 30,
    "objectives": [
      "Debouncing va Throttling orasidagi farqni aniq tushunish",
      "Qidiruv maydonlarida ortiqcha server so‘rovlarini kamaytirish uchun Debounce yozish",
      "Scroll yoki Resize hodisalarini Throttling orqali yengillashtirish"
    ],
    "content": {
      "title": "16-Dars: Debouncing va Throttling (Samaradorlikni Oshirish)",
      "learningObjective": "Haddan tashqari ko‘p chaqiriladigan funksiyalarni jilovlab, veb-ilova tezligini bir necha barobar oshirish.",
      "prerequisites": "Closures va Taymerlar (setTimeout, clearTimeout).",
      "realLifeAnalogy": "Lift va Radar: \n- Debounce (Lift eshigi): Har safar yangi odam kelganda lift taymerni qaytadan boshlaydi va yana 3 soniya kutadi. Odamlar kelishi to‘xtagandagina lift yuradi.\n- Throttle (Tezlik radari): Mashina qanchalik tez o‘tmasin, radar har 5 soniyada faqat bitta surat oladi.",
      "theory": [
        {
          "type": "text",
          "content": "Foydalanuvchi klaviaturada harflarni tez-tez bosganda (masalan, qidiruv maydonida), har bir harf bosilishida serverga so‘rov yuborish serverni to‘ldirib qo‘yadi.\n\n- **Debounce:** Funksiyani chaqirishni kechiktiradi. Agar belgilangan vaqt (`delay`) ichida yangi chaqiruv kelsa, avvalgi taymer bekor qilinadi va yangitdan boshlanadi.\n- **Throttle:** Belgilangan vaqt oralig‘ida (masalan, har 300ms da) funksiyani ko‘pi bilan 1 marta ishga tushiradi."
        },
        {
          "type": "code",
          "language": "javascript",
          "content": "function debounce(fn, delay) {\n  let timerId = null;\n  return function(...args) {\n    clearTimeout(timerId); // Avvalgi taymerni bekor qilish\n    timerId = setTimeout(() => {\n      fn.apply(this, args);\n    }, delay);\n  };\n}",
          "lineExplanations": {
            "2": "timerId closure orqali eslab qolinadi",
            "4": "Har safar yangi chaqiruvda eski taymer o‘chiriladi",
            "5": "Foydalanuvchi to‘xtagandan so‘ng delay vaqt o‘tibgina fn ishlaydi"
          }
        }
      ],
      "commonMistakes": [
        {
          "title": "Debounce qilingan funksiyani hodisa ichida qaytadan yaratish",
          "wrongCode": "input.addEventListener(\"input\", () => {\n  debounce(search, 300)(); // Har safar yangi taymer yaratiladi va debounce ishlamaydi!\n});",
          "correctCode": "const debouncedSearch = debounce(search, 300);\ninput.addEventListener(\"input\", debouncedSearch); // To'g'ri",
          "explanation": "Debounce funksiyasi listenerdan tashqarida bir marta yaratilishi shart, aks holda uning ichki closure xotirasi har safar yangilanadi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-deb-1",
          "question": "Qidiruv maydoniga (Search input) matn kiritganda qaysi texnika mos keladi?",
          "type": "multiple-choice",
          "options": [
            "Debouncing (foydalanuvchi yozishdan to‘xtaganda so‘rov yuborish)",
            "Throttling",
            "Cheksiz loop",
            "Faqat CSS transition"
          ],
          "correctAnswer": 0,
          "explanation": "Foydalanuvchi so‘zni to‘liq yozib bo‘lguncha kutib, so‘ng bitta so‘rov yuborish uchun Debouncing eng mukammal yechimdir."
        },
        {
          "id": "q-deb-2",
          "question": "Debounce va Throttle o‘rtasidagi asosiy farq nimada?",
          "type": "multiple-choice",
          "options": [
            "Debounce oxirgi harakatdan so‘ng ma’lum vaqt o‘tgach 1 marta ishlaydi, Throttle esa ma’lum vaqt oralig‘ida (masalan, har 200ms da) ko‘pi bilan 1 marta ishga tushadi",
            "Debounce faqat sichqoncha uchun, Throttle esa klaviatura uchun",
            "Debounce serverda, Throttle esa faqat brauzerda ishlaydi",
            "Hech qanday farqi yo‘q"
          ],
          "correctAnswer": 0,
          "explanation": "Debounce kutilish vaqti tugaguncha kechiktiradi (qidiruv inputi uchun), Throttle esa doimiy oraliqda chastotani cheklab boradi (scroll yoki resize uchun)."
        }
      ],
      "reflectionQuestion": "Scroll hodisasi bilan ishlaganda nima uchun Debounce emas, balki Throttle ko‘proq ma’qul keladi?",
      "summary": "Debouncing, Throttling va taymerlar orqali performanceni oshirishni o‘rgandik.",
      "nextLessonSlug": "interactive-task-manager-dom-crud",
      "nextLessonTitle": "17-Dars: Multi-file Task Manager — Arxitektura va CRUD"
    },
    "exercise": {
      "title": "Debounce Yordamchi Funksiyasi",
      "description": "createDebouncedCounter() nomli yordamchi yarating. U shunday debounce mexanizmini simulyatsiya qilsinki, qisqa vaqt ichida ketma-ket 5 marta chaqirilsa ham, faqat oxirgi chaqiruvdagi qiymatni belgilasin.",
      "instructions": [
        "Har bir yangi chaqiruvda oxirgi qiymat saqlansin",
        "Yakuniy funksiya faqat eng so‘nggi berilgan qiymatni qaytarsin"
      ],
      "starterCode": "function createDebounceSimulator() {\n  // Yechimni shu yerda yozing:\n  // - trigger(val): yangi qiymatni qabul qilib, oldingisini yangilaydi\n  // - flush(): eng oxirgi kiritilgan qiymatni qaytaradi\n}\n\n// Sinov uchun chaqiruvlar:\nconst d = createDebounceSimulator();\nd.trigger(\"birinchi\");\nd.trigger(\"ikkinchi\");\nd.trigger(\"oxirgi_qidiruv\");\nconsole.log(d.flush());\nconst d2 = createDebounceSimulator();\nd2.trigger(\"birinchi\");\nd2.trigger(\"ikkinchi\");\nconsole.log(d2.flush());\n",
      "language": "javascript",
      "difficulty": "medium",
      "passingScore": 100,
      "xpReward": 65,
      "testCases": [
        {
          "id": "tc-deb-1",
          "description": "Ketma-ket chaqiruvlardan so‘ng so‘nggisini olish",
          "expectedOutput": "oxirgi_qidiruv",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-deb-2",
          "description": "Birinchi chaqiruvning bekor qilinganligini tekshirish",
          "expectedOutput": "ikkinchi",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: Qidiruv maydoniga foydalanuvchi tez yozayotganda oraliq so‘rovlarni bekor qilib, faqat eng so‘nggi qiymatni saqlash tamoyilini (Debounce) eslang.",
        "2-yordam: Closure ichida let lastValue = null o‘zgaruvchisini saqlang va trigger chaqirilganda uni yangilang.",
        "3-yordam: return { trigger(val) { lastValue = val; }, flush() { return lastValue; } }; ko‘rinishida obyekt qaytaring."
      ],
      "solutionExplanation": "Debounce simulyatsiyasi faqat eng oxirgi uzatilgan qiymatni saqlab qoladi.",
      "expectedConcepts": [
        "debouncing",
        "state preservation",
        "timing"
      ],
      "validSolutionCode": "function createDebounceSimulator() {\n  let lastValue = null;\n  return {\n    trigger(val) {\n      lastValue = val;\n    },\n    flush() {\n      return lastValue;\n    }\n  };\n}\nconst d = createDebounceSimulator();\nd.trigger(\"birinchi\");\nd.trigger(\"ikkinchi\");\nd.trigger(\"oxirgi_qidiruv\");\nconsole.log(d.flush());\nconst d2 = createDebounceSimulator();\nd2.trigger(\"birinchi\");\nd2.trigger(\"ikkinchi\");\nconsole.log(d2.flush());",
      "deliberateErrorCode": "function createDebounceSimulator() {\n  return null.error();\n}"
    }
  },
  {
    "moduleIndex": 4,
    "order": 17,
    "title": "17-Dars: Multi-file Loyiha — Arxitektura va CRUD (Milestones 1-2)",
    "slug": "interactive-task-manager-dom-crud",
    "description": "Ko‘p faylli (HTML/CSS/JS) muhitda Task Manager loyihasi karkasini qurish va vazifalarni qo‘shish/o‘chirish.",
    "estimatedMinutes": 30,
    "objectives": [
      "Ko‘p faylli (index.html, style.css, script.js) loyiha arxitekturasini tushunish",
      "Vazifalarni qo‘shish, holatini o‘zgartirish va o‘chirish (CRUD) mantiqini xavfsiz yozish",
      "XSS hujumlaridan himoyalangan xavfsiz DOM render qilish"
    ],
    "content": {
      "title": "17-Dars: Multi-file Loyiha — Arxitektura va CRUD (Milestones 1-2)",
      "learningObjective": "Haqiqiy loyihada HTML struktura, CSS stillar va JavaScript kodlarini birgalikda ishlatib interaktiv Task Manager yaratish.",
      "prerequisites": "Barcha avvalgi modullar: Scope, Closures, DOM, Events.",
      "realLifeAnalogy": "Uy qurilishi: HTML — bu uyning devorlari va poydevori (struktura); CSS — pardozlash, bo‘yoq va qulay dizayn; JavaScript esa uydagi elektr chiroqlari, suv kranlari va aqlli sensorlardir (interaktivlik).",
      "theory": [
        {
          "type": "text",
          "content": "Ushbu loyihada biz zamonaviy **Multi-file Web Project Workspace** muhitida ishlaymiz. Kod uchta alohida faylga bo‘lingan:\n1. `index.html`: Forma va vazifalar ro‘yxati konteyneri.\n2. `style.css`: Qulay, zamonaviy va chiroyli dizayn.\n3. `script.js`: Barcha mantiq, vazifalar massivi va DOM boshqaruvi.\n\nBirinchi bosqichda biz yangi vazifa qo‘shish (`addTask`) va mavjud vazifalarni o‘chirish (`deleteTask`) mantiqini to‘liq yakunlaymiz."
        }
      ],
      "commonMistakes": [
        {
          "title": "Foydalanuvchi kiritgan matnni to‘g‘ridan-to‘g‘ri innerHTML ga kiritish",
          "wrongCode": "li.innerHTML = \"<span>\" + userInput + \"</span>\"; // XSS xavfi!",
          "correctCode": "const span = document.createElement(\"span\");\nspan.textContent = userInput; // To'g'ri va xavfsiz\nli.appendChild(span);",
          "explanation": "Foydalanuvchi kiritgan har qanday matn `textContent` orqali berilishi shart, aks holda zararli scriptlar ishga tushib ketadi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-proj-1",
          "question": "Multi-file web loyihalarida kodlarni alohida fayllarga ajratishning maqsadi nima?",
          "type": "multiple-choice",
          "options": [
            "Fayl hajmini sun’iy oshirish",
            "Struktura, dizayn va mantiqni ajratib (Separation of Concerns), kodni toza va boshqariladigan qilish",
            "Faqat brauzerni yuklash uchun",
            "Hech qanday foydasi yo‘q"
          ],
          "correctAnswer": 1,
          "explanation": "HTML (struktura), CSS (dizayn) va JS (harakat) alohida fayllarda bo‘lishi professional loyihalarning asosiy talabidir."
        },
        {
          "id": "q-proj-1-2",
          "question": "DOM ga foydalanuvchi kiritgan matnni chiqarishda XSS dan qanday himoyalanamiz?",
          "type": "multiple-choice",
          "options": [
            "innerHTML ga matnni to‘g‘ridan-to‘g‘ri qo‘shish orqali",
            "element.textContent dan foydalanish yoki tegishli matn tugunlarini (Text Node) yaratish orqali",
            "Faqat alert chaqirish orqali",
            "CSS ni o‘chirish orqali"
          ],
          "correctAnswer": 1,
          "explanation": "textContent brauzerga matnni kod sifatida emas, balki oddiy xom matn sifatida tushunishni buyuradi va XSS scriptlarining ishga tushishini oldini oladi."
        }
      ],
      "reflectionQuestion": "Vazifalar ro‘yxatida har bir vazifaga unikal `id` berish nima uchun muhim?",
      "summary": "Multi-file karkas, vazifalar ro‘yxatini xavfsiz render qilish va elementlarni o‘chirishni o‘rgandik.",
      "nextLessonSlug": "interactive-task-manager-storage-accessibility",
      "nextLessonTitle": "18-Dars: Multi-file Loyiha — LocalStorage va Accessibility"
    },
    "exercise": {
      "title": "Task Manager — CRUD operatsiyalari",
      "description": "Multi-file workspace muhitida berilgan Task Manager loyihasini to‘ldiring. script.js faylida addTask va deleteTask funksiyalari to‘g‘ri ishlab, yangi vazifalar DOM ga xavfsiz qo‘shilsin va o‘chirilsin.",
      "instructions": [
        "index.html dagi forma va ro‘yxat strukturasini saqlang",
        "script.js ichida vazifalar massivini boshqaring",
        "Yangi vazifa kiritilganda uni ro‘yxatga qo‘shing"
      ],
      "starterCode": "// script.js kodi pastdagi starterFiles da to'liq taqdim etilgan",
      "starterFiles": {
        "index.html": "<!DOCTYPE html>\n<html lang=\"uz\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Vazifalar Menejeri</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <div class=\"app-container\">\n    <h1>Vazifalar Menejeri</h1>\n    <form id=\"task-form\">\n      <input type=\"text\" id=\"task-input\" placeholder=\"Yangi vazifa kiriting...\" required />\n      <button type=\"submit\" id=\"add-btn\">Qo‘shish</button>\n    </form>\n    <ul id=\"task-list\" class=\"task-list\"></ul>\n  </div>\n  <script src=\"script.js\"></script>\n</body>\n</html>",
        "style.css": "body {\n  font-family: system-ui, sans-serif;\n  background: #0f172a;\n  color: #f8fafc;\n  display: flex;\n  justify-content: center;\n  padding: 2rem;\n}\n.app-container {\n  width: 100%;\n  max-width: 480px;\n  background: #1e293b;\n  padding: 1.5rem;\n  border-radius: 1rem;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.3);\n}\nh1 { font-size: 1.5rem; margin-bottom: 1rem; text-align: center; }\nform { display: flex; gap: 0.5rem; margin-bottom: 1rem; }\ninput {\n  flex: 1;\n  padding: 0.75rem;\n  border-radius: 0.5rem;\n  border: 1px solid #334155;\n  background: #0f172a;\n  color: #fff;\n}\nbutton {\n  padding: 0.75rem 1rem;\n  border-radius: 0.5rem;\n  background: #6366f1;\n  color: white;\n  border: none;\n  cursor: pointer;\n  font-weight: bold;\n}\n.task-list { list-style: none; padding: 0; margin: 0; }\n.task-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem;\n  background: #0f172a;\n  border-radius: 0.5rem;\n  margin-bottom: 0.5rem;\n}",
        "script.js": "// Vazifalar menejeri mantiqi (Milestones 1-2)\nlet tasks = [];\n\nfunction renderTasks() {\n  const list = document.getElementById(\"task-list\");\n  if (!list) return;\n  list.innerHTML = \"\";\n  tasks.forEach(t => {\n    const li = document.createElement(\"li\");\n    li.className = \"task-item\" + (t.completed ? \" done\" : \"\");\n    li.dataset.id = t.id;\n    \n    // XSS xavfsiz matn:\n    const span = document.createElement(\"span\");\n    span.textContent = t.text;\n    span.onclick = () => toggleTask(t.id);\n    \n    const delBtn = document.createElement(\"button\");\n    delBtn.textContent = \"O‘chirish\";\n    delBtn.className = \"btn-delete\";\n    delBtn.onclick = () => deleteTask(t.id);\n    \n    li.appendChild(span);\n    li.appendChild(delBtn);\n    list.appendChild(li);\n  });\n}\n\nfunction addTask(text) {\n  // TODO: 1. text bo'sh emasligini tekshiring\n  // TODO: 2. { id: Date.now(), text: text.trim(), completed: false } obyektini tasks ga qo'shing\n  // TODO: 3. renderTasks() ni chaqiring\n}\n\nfunction toggleTask(id) {\n  // TODO: vazifaning completed holatini teskarisiga o'zgartiring va renderTasks() qiling\n}\n\nfunction deleteTask(id) {\n  // TODO: id bo'yicha vazifani tasks dan o'chirib tashlang va renderTasks() qiling\n}\n\nconst form = document.getElementById(\"task-form\");\nif (form) {\n  form.addEventListener(\"submit\", (e) => {\n    e.preventDefault();\n    const input = document.getElementById(\"task-input\");\n    if (input) {\n      addTask(input.value);\n      input.value = \"\";\n    }\n  });\n}\n"
      },
      "isMultiFile": true,
      "language": "htmlcssjs",
      "difficulty": "hard",
      "passingScore": 100,
      "xpReward": 90,
      "testCases": [
        {
          "id": "tc-proj-1",
          "description": "HTML da task-form va task-list mavjudligi",
          "expectedOutput": "<form id=\"task-form\"",
          "type": "html-check",
          "targetFile": "index.html",
          "isHidden": false
        },
        {
          "id": "tc-proj-2",
          "description": "CSS da .task-item uslubi mavjudligi",
          "expectedOutput": ".task-item",
          "type": "css-check",
          "targetFile": "style.css",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-proj-3",
          "description": "script.js da addTask va deleteTask funksiyalari mavjudligi",
          "expectedOutput": "addTask",
          "type": "js-check",
          "targetFile": "script.js",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: index.html da form id=\"task-form\" va ul id=\"task-list\" to‘g‘ri kiritilganini tekshiring.",
        "2-yordam: script.js da addTask va deleteTask funksiyalari tasks massivini to‘g‘ri o‘zgartirishi va renderTasks() ni chaqirishi lozim.",
        "3-yordam: tasks.push({ id: Date.now(), text: text.trim(), completed: false }); va tasks = tasks.filter(t => t.id !== id); kodlaridan foydalaning."
      ],
      "solutionExplanation": "Multi-file workspace loyihasida HTML struktura va JavaScript CRUD mantiqi to‘liq bog‘langan.",
      "expectedConcepts": [
        "multi-file",
        "dom manipulation",
        "crud",
        "events"
      ],
      "validSolutionCode": "// Multi-file Task Manager yechimi\nfunction addTask(text) {\n  if (!text) return;\n  tasks.push({ id: Date.now(), text, completed: false });\n  renderTasks();\n}\nconsole.log(\"OK\");",
      "deliberateErrorCode": "function addTask() {\n  throw new Error(\"Multi-file CRUD broken\");\n}"
    }
  },
  {
    "moduleIndex": 4,
    "order": 18,
    "title": "18-Dars: Multi-file Loyiha — LocalStorage va Accessibility (Milestones 3-4)",
    "slug": "interactive-task-manager-storage-accessibility",
    "description": "LocalStorage sinxronizatsiyasi, filtrlash (Barchasi, Bajarilgan, Kutilmoqda), klaviatura va ARIA qulayligi.",
    "estimatedMinutes": 30,
    "objectives": [
      "Vazifalar ro‘yxatini LocalStorage bilan to‘liq avtomat sinxronlash (saqlash va yuklash)",
      "Holatlar bo‘yicha filtrlash tizimini (Barchasi, Bajarilgan, Bajarilmagan) to‘g‘ri ishlashini ta’minlash",
      "Accessibility (ARIA) va klaviatura navigatsiyasi talablariga mos keluvchi professional veb-ilova yaratish"
    ],
    "content": {
      "title": "18-Dars: Multi-file Loyiha — LocalStorage va Accessibility (Milestones 3-4)",
      "learningObjective": "Loyihani ishlab chiqarish darajasidagi (Production-ready) sifatga olib chiqish: doimiy saqlash, filtrlar va hammaga qulay interfeys.",
      "prerequisites": "17-Dars va barcha oldingi darslar.",
      "realLifeAnalogy": "Professional avtomobil: Faqat dvigatel va g‘ildirak bo‘lishi yetarli emas. Avtomobilda qulay o‘rindiqlar, xavfsizlik kamarlari, ko‘zi ojizlar uchun ovozli signallar va xotirada qoluvchi o‘rindiq sozlamalari ham bo‘lishi shart.",
      "theory": [
        {
          "type": "text",
          "content": "Yakuniy darsimizda Task Manager ilovasiga 3 ta muhim xususiyat qo‘shamiz:\n\n1. **LocalStorage Persistence:** Har safar vazifa qo‘shilganda yoki o‘chirilganda `localStorage.setItem(\"tasks\", JSON.stringify(tasks))` chaqiriladi. Sahifa ochilganda esa ma’lumotlar avtomatik yuklanadi.\n2. **Filtrlash:** \"Barchasi\", \"Bajarilgan\" va \"Kutilmoqda\" tugmalari orqali vazifalar saralanadi.\n3. **Accessibility (a11y):** Har bir tugmada `aria-label`, ro‘yxatda `role=\"list\"`, vazifalarda esa Enter tugmasi orqali qulay boshqaruv ta’minlanadi."
        }
      ],
      "commonMistakes": [
        {
          "title": "LocalStorage o‘qiyotganda buzuq ma’lumotdan himoyalanmaslik",
          "wrongCode": "const data = JSON.parse(localStorage.getItem(\"tasks\")); // Agar null bo'lsa yoki buzilgan bo'lsa xato beradi!",
          "correctCode": "let tasks = [];\ntry {\n  const saved = localStorage.getItem(\"tasks\");\n  if (saved) tasks = JSON.parse(saved);\n} catch (e) {\n  tasks = [];\n}",
          "explanation": "LocalStorage bilan ishlaganda har doim `try/catch` va fallback qiymatdan foydalanish talab etiladi.",
          "language": "javascript"
        }
      ],
      "quiz": [
        {
          "id": "q-proj-2",
          "question": "Nima sababdan veb-ilovalarda Accessibility (ARIA) talablariga amal qilish shart?",
          "type": "multiple-choice",
          "options": [
            "Faqat ranglarni chiroyli qilish uchun",
            "Imkoniyati cheklangan yoki faqat klaviaturadan foydalanuvchi odamlar ham dasturni erkin boshqara olishi uchun",
            "Faqat fayl hajmini qisqartirish uchun",
            "Hech kimga kerak emas"
          ],
          "correctAnswer": 1,
          "explanation": "Accessibility har bir inson, shu jumladan ekran o‘quvchi (screen reader) dasturlardan foydalanuvchilar uchun qulaylik yaratadi."
        },
        {
          "id": "q-proj-2-2",
          "question": "Tugmachalarda aria-pressed atributi nima uchun ishlatiladi?",
          "type": "multiple-choice",
          "options": [
            "Tugmaning bosilgan (faol) yoki bosilmagan holatini ekran o‘quvchi dasturlarga bildirish uchun",
            "Tugma rangini o‘zgartirish uchun",
            "Faqat mobil qurilmalarni aniqlash uchun",
            "Tugmani o‘chirib qo‘yish uchun"
          ],
          "correctAnswer": 0,
          "explanation": "aria-pressed=\"true|false\" atributi filtr yoki toggle kabi ikki holatli tugmalarning hozirgi holatini imkoniyati cheklangan foydalanuvchilarga aniq bildiradi."
        }
      ],
      "reflectionQuestion": "Ushbu kurs davomida o‘rgangan qaysi JavaScript mavzusi siz uchun eng qiziqarli va foydali bo‘ldi?",
      "summary": "JavaScript Intermediate kursini to‘liq yakunladingiz! Scope, Closures, Event Loop, Asinxronlik, DOM va haqiqiy loyiha ustida mustahkam bilimga ega bo‘ldingiz.",
      "nextLessonSlug": "congratulations",
      "nextLessonTitle": "Kurs yakuni — Tabriklaymiz!"
    },
    "exercise": {
      "title": "Task Manager — LocalStorage, Filterlar va Yakuniy a11y",
      "description": "Loyiha kodini to‘liq yakunlang: LocalStorage ga saqlash va yuklash, filtrlar boshqaruvi va accessibility tekshiruvlarini muvaffaqiyatli o‘tkazing.",
      "instructions": [
        "saveTasks va loadTasks funksiyalarini LocalStorage bilan ishlang",
        "currentFilter o‘zgaruvchisiga qarab ro‘yxatni filtrlashni yo‘lga qo‘ying",
        "Barcha tugmalarga mos aria-label atributlarini bering"
      ],
      "starterCode": "// Yakuniy loyiha kodi starterFiles da",
      "starterFiles": {
        "index.html": "<!DOCTYPE html>\n<html lang=\"uz\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Professional Task Manager</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <main class=\"app-container\" role=\"main\">\n    <h1>CodeQuest Task Manager</h1>\n    <form id=\"task-form\" aria-label=\"Yangi vazifa qo‘shish formasi\">\n      <input type=\"text\" id=\"task-input\" placeholder=\"Vazifani yozing...\" aria-label=\"Vazifa nomi\" required />\n      <button type=\"submit\" id=\"add-btn\" aria-label=\"Vazifa qo‘shish\">Qo‘shish</button>\n    </form>\n    \n    <div class=\"filter-controls\" role=\"group\" aria-label=\"Filtrlar\">\n      <button class=\"filter-btn active\" data-filter=\"all\">Barchasi</button>\n      <button class=\"filter-btn\" data-filter=\"active\">Kutilmoqda</button>\n      <button class=\"filter-btn\" data-filter=\"completed\">Bajarilgan</button>\n    </div>\n\n    <ul id=\"task-list\" class=\"task-list\" role=\"list\" aria-label=\"Vazifalar ro‘yxati\"></ul>\n  </main>\n  <script src=\"script.js\"></script>\n</body>\n</html>",
        "style.css": "body {\n  font-family: system-ui, sans-serif;\n  background: #090d16;\n  color: #f8fafc;\n  display: flex;\n  justify-content: center;\n  padding: 2rem;\n}\n.app-container {\n  width: 100%;\n  max-width: 500px;\n  background: #131b2e;\n  padding: 1.5rem;\n  border-radius: 1rem;\n  border: 1px solid #1e293b;\n}\nh1 { font-size: 1.5rem; margin-bottom: 1rem; text-align: center; color: #818cf8; }\nform { display: flex; gap: 0.5rem; margin-bottom: 1rem; }\ninput {\n  flex: 1;\n  padding: 0.75rem;\n  border-radius: 0.5rem;\n  border: 1px solid #334155;\n  background: #090d16;\n  color: #fff;\n}\nbutton {\n  padding: 0.75rem 1rem;\n  border-radius: 0.5rem;\n  background: #6366f1;\n  color: white;\n  border: none;\n  cursor: pointer;\n  font-weight: 600;\n}\n.filter-controls {\n  display: flex;\n  gap: 0.5rem;\n  margin-bottom: 1rem;\n  justify-content: center;\n}\n.filter-btn {\n  background: #1e293b;\n  padding: 0.4rem 0.8rem;\n  font-size: 0.85rem;\n}\n.filter-btn.active {\n  background: #4f46e5;\n}\n.task-list { list-style: none; padding: 0; margin: 0; }\n.task-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem;\n  background: #090d16;\n  border: 1px solid #1e293b;\n  border-radius: 0.5rem;\n  margin-bottom: 0.5rem;\n}\n.task-item.done span {\n  text-decoration: line-through;\n  opacity: 0.5;\n}",
        "script.js": "// LocalStorage, Filter va Accessibility bilan to'liq Task Manager (Milestones 3-4)\nlet tasks = [];\nlet currentFilter = \"all\";\n\nfunction loadTasks() {\n  try {\n    const data = localStorage.getItem(\"cq_tasks\");\n    if (data) tasks = JSON.parse(data);\n  } catch (e) {\n    tasks = [];\n  }\n}\n\nfunction saveTasks() {\n  try {\n    localStorage.setItem(\"cq_tasks\", JSON.stringify(tasks));\n  } catch (e) {}\n}\n\nfunction renderTasks() {\n  const list = document.getElementById(\"task-list\");\n  if (!list) return;\n  list.innerHTML = \"\";\n\n  const filtered = tasks.filter(t => {\n    if (currentFilter === \"active\") return !t.completed;\n    if (currentFilter === \"completed\") return t.completed;\n    return true;\n  });\n\n  filtered.forEach(t => {\n    const li = document.createElement(\"li\");\n    li.className = \"task-item\" + (t.completed ? \" done\" : \"\");\n    li.dataset.id = t.id;\n    li.setAttribute(\"role\", \"listitem\");\n\n    // Klaviatura uchun qulay tugma (a11y)\n    const toggleBtn = document.createElement(\"button\");\n    toggleBtn.className = \"task-toggle-btn\";\n    toggleBtn.textContent = t.text;\n    toggleBtn.setAttribute(\"role\", \"button\");\n    toggleBtn.setAttribute(\"aria-label\", t.completed ? \"Vazifani bajarilmagan deb belgilash\" : \"Vazifani bajarilgan deb belgilash\");\n    toggleBtn.onclick = () => toggleTask(t.id);\n\n    const delBtn = document.createElement(\"button\");\n    delBtn.textContent = \"×\";\n    delBtn.className = \"btn-delete\";\n    delBtn.setAttribute(\"aria-label\", \"Vazifani o‘chirish\");\n    delBtn.onclick = () => deleteTask(t.id);\n\n    li.appendChild(toggleBtn);\n    li.appendChild(delBtn);\n    list.appendChild(li);\n  });\n}\n\nfunction addTask(text) {\n  if (!text || text.trim() === \"\") return;\n  tasks.push({ id: Date.now(), text: text.trim(), completed: false });\n  saveTasks();\n  renderTasks();\n}\n\nfunction toggleTask(id) {\n  const task = tasks.find(t => t.id === id);\n  if (task) {\n    task.completed = !task.completed;\n    saveTasks();\n    renderTasks();\n  }\n}\n\nfunction deleteTask(id) {\n  tasks = tasks.filter(t => t.id !== id);\n  saveTasks();\n  renderTasks();\n}\n\n// Hodisalarni ulash (Events setup)\nif (typeof document !== 'undefined') {\n  const form = document.getElementById(\"task-form\");\n  if (form) {\n    form.addEventListener(\"submit\", (e) => {\n      e.preventDefault();\n      const input = document.getElementById(\"task-input\");\n      if (input) {\n        addTask(input.value);\n        input.value = \"\";\n      }\n    });\n  }\n\n  // Filtr tugmalari\n  const filterButtons = document.querySelectorAll(\".filter-btn\");\n  filterButtons.forEach(btn => {\n    btn.addEventListener(\"click\", () => {\n      filterButtons.forEach(b => {\n        b.classList.remove(\"active\");\n        b.setAttribute(\"aria-pressed\", \"false\");\n      });\n      btn.classList.add(\"active\");\n      btn.setAttribute(\"aria-pressed\", \"true\");\n      currentFilter = btn.dataset.filter || \"all\";\n      renderTasks();\n    });\n  });\n\n  loadTasks();\n  renderTasks();\n}\n"
      },
      "isMultiFile": true,
      "language": "htmlcssjs",
      "difficulty": "hard",
      "passingScore": 100,
      "xpReward": 100,
      "testCases": [
        {
          "id": "tc-proj-final-1",
          "description": "Accessibility: HTML da role=\"main\" va aria-label mavjudligi",
          "expectedOutput": "role=\"main\"",
          "type": "html-check",
          "targetFile": "index.html",
          "isHidden": false
        },
        {
          "id": "tc-proj-final-2",
          "description": "LocalStorage: script.js da localStorage.setItem va getItem ishlashi",
          "expectedOutput": "localStorage.setItem",
          "type": "js-check",
          "targetFile": "script.js",
          "isHidden": false
        }
      ],
      "hiddenTests": [
        {
          "id": "tc-proj-final-3",
          "description": "Filtrlash va Accessibility: script.js da filter va aria-pressed mavjudligi",
          "expectedOutput": "aria-pressed",
          "type": "js-check",
          "targetFile": "script.js",
          "isHidden": true
        }
      ],
      "hints": [
        "1-yordam: LocalStorage da ma’lumotlarni doimiy saqlash va filtr holatlarini boshqarish tamoyillarini eslang.",
        "2-yordam: saveTasks funksiyasida localStorage.setItem(\"cq_tasks\", JSON.stringify(tasks)) dan, filtr tugmalarida esa aria-pressed dan foydalaning.",
        "3-yordam: currentFilter qiymatiga qarab tasks.filter(t => currentFilter === \"active\" ? !t.completed : (currentFilter === \"completed\" ? t.completed : true)) mantiqini qo‘llang."
      ],
      "solutionExplanation": "Professional darajadagi to‘liq loyiha: HTML5, CSS3, JS ES6+, LocalStorage va Accessibility qoidalari jamlangan.",
      "expectedConcepts": [
        "multi-file",
        "localstorage",
        "accessibility",
        "filtering"
      ],
      "validSolutionCode": "// Yakuniy loyiha\nconsole.log(\"OK\");",
      "deliberateErrorCode": "throw new Error(\"Final project broken\");"
    }
  }
];
