import type { Lesson, Exercise } from '@/types';

export const PROMPT_LESSONS: { lesson: Lesson; exercise: Exercise }[] = [
  // 1-Dars: Prompt Nima va LLM Qanday Fikrlaydi?
  {
    lesson: {
      id: 'les-prompt-1',
      moduleId: 'mod-prompt-1',
      courseId: 'course-prompt',
      title: 'Prompt Nima va LLM Qanday Fikrlaydi?',
      slug: 'prompt-nima-va-llm-qanday-fikrlaydi',
      description: 'Sun’iy intellekt (LLM) falsafasi, tokenlar, keyingi so‘zni bashorat qilish va Garbage In — Garbage Out tamoyili.',
      objectives: [
        'Prompt (so‘rov) tushunchasini to‘liq anglash',
        'Katta til modellari (ChatGPT, Claude, Gemini) qanday "fikrlashini" bilish',
        'Noaniq so‘rov bilan professional so‘rov o‘rtasidagi farqni amalda ko‘rish',
      ],
      estimatedMinutes: 15,
      order: 1,
      published: true,
      content: {
        title: 'Prompt Nima va LLM Qanday Fikrlaydi?',
        learningObjective: 'Sun’iy intellekt qanday ishlashini to‘g‘ri tasavvur qilish va unga dastlabki samarali so‘rovlarni yozishni o‘rganish.',
        realLifeAnalogy: 'Tasavvur qiling, siz nufuzli restoranga kirib, ofitsiantga shunchaki "Menga ovqat bering!" dedingiz. U sizning nima yoqtirishingizni bilmaydi va balki siz yemaydigan baliq sho‘rvasini olib kelishi mumkin. Ammo: "Menga o‘rtacha qovurilgan mol go‘shti steyki, yoniga tuzsiz kartoshka pyuresi va yangi pomidorli salat olib keling" desangiz — natija ayni siz xohlagandek chiqadi! Sun’iy intellekt ham aynan shunday: sizning so‘rovingiz qanchalik aniq bo‘lsa, u bergan natija ham shunchalik mukammal bo‘ladi.',
        theory: [
          {
            type: 'heading',
            content: 'Prompt — bu Sun’iy Intellekt bilan dasturlash tili',
          },
          {
            type: 'text',
            content: 'Prompt (so‘rov) — bu katta til modeliga (ChatGPT, Claude, Gemini yoki boshqa AI tizimiga) aniq vazifani bajarishi uchun beriladigan matnli ko‘rsatma yoki savoldir. Prompt yozish san’ati esa Prompt Engineering (Prompt Muhandisligi) deb ataladi.',
          },
          {
            type: 'note',
            content: 'LLM (Large Language Model) inson kabi ong yoki tushunchaga ega emas. U milliardlab matnlar asosida o‘qitilgan ulkan matematik neyron tarmoq bo‘lib, siz kiritgan so‘zlarga qarab keyingi eng mantiqiy so‘zni (tokenni) ehtimollik bo‘yicha bashorat qiladi.',
          },
          {
            type: 'heading',
            content: 'Garbage In — Garbage Out (Chiqindi kirsangiz, chiqindi olasiz)',
          },
          {
            type: 'text',
            content: 'Agar siz sun’iy intellektga umumiy va chala savol bersangiz (masalan: "Menga kod yozib ber"), u ham umumiy, yuzaki va ko‘pincha yaroqsiz javob beradi. Ammo vazifani, dasturlash tilini, cheklovlarni va maqsadni aniq ko‘rsatsangiz, u jahon darajasidagi senior dasturchidek javob qaytaradi.',
          },
        ],
        interactiveExample: {
          title: 'Noaniq prompt va Aniq prompt taqqoslanishi',
          description: 'Quyidagi kodda noaniq va professional tarzda shakllantirilgan promptlar solishtirilgan.',
          language: 'javascript',
          code: `// ❌ Sifatsiz, noaniq prompt:\nconst badPrompt = "Sayt uchun kod yoz";\n\n// ✅ Professional, aniq prompt:\nconst goodPrompt = \`Siz tajribali Frontend dasturchisiz. \nHTML va Tailwind CSS yordamida zamonaviy Dark Mode ko'rinishidagi Login kartasini yarating. \nKarta ichida Email, Parol maydoni va 'Kirish' tugmasi bo'lsin. \nFaqat toza HTML kodini taqdim eting, ortiqcha tushuntirish yozmang.\`;\n\nconsole.log("Tanlangan professional prompt:\\n" + goodPrompt);`,
          expectedOutput: "Tanlangan professional prompt:\nSiz tajribali Frontend dasturchisiz. \nHTML va Tailwind CSS yordamida zamonaviy Dark Mode ko'rinishidagi Login kartasini yarating. \nKarta ichida Email, Parol maydoni va 'Kirish' tugmasi bo'lsin. \nFaqat toza HTML kodini taqdim eting, ortiqcha tushuntirish yozmang.",
          lineExplanations: {
            2: 'badPrompt juda umumiy bo‘lgani uchun AI qaysi til, qanday dizayn kerakligini bilmaydi.',
            5: 'goodPrompt AI ga rolni (Frontend dasturchi), vazifani, texnologiyani va chiqish formatini aniq berdi.',
            10: 'console.log() orqali tuzilgan prompt konsolga chiqariladi.',
          },
        },
        commonMistakes: [
          {
            title: 'Haddan tashqari qisqa yoki noaniq so‘rov',
            wrongCode: '// "Funksiya yozib ber"',
            correctCode: '// "JavaScript da massiv ichidagi juft sonlarni saralab beruvchi getEvenNumbers nomli toza funksiya yozing."',
            explanation: 'AI sizning miyangizdagi rejalarni o‘qiy olmaydi. Unga kutilayotgan natija haqida to‘liq ma’lumot bering.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prompt-1-1',
            question: 'Prompt nima?',
            type: 'multiple-choice',
            options: [
              'Kompyuterning protsessori',
              'Sun’iy intellektga vazifani bajarishi uchun beriladigan matnli ko‘rsatma yoki topshiriq',
              'Faqat ma’lumotlar bazasining nomi',
              'Brauzerda sahifani yangilash tugmasi',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Prompt — bu sun’iy intellektga beriladigan har qanday matnli yo‘riqnoma yoki topshiriqdir.',
          },
          {
            id: 'q-prompt-1-2',
            question: 'Katta til modellari (LLM — GPT, Claude, Gemini) javobni qanday hosil qiladi?',
            type: 'multiple-choice',
            options: [
              'Inson kabi mustaqil ong bilan o‘ylab',
              'Oldingi so‘zlarga asoslanib keyingi eng mantiqiy so‘zlarni (tokenlarni) ehtimollik bilan bashorat qilib',
              'Faqat Vikipediyadagi sahifalarni to‘g‘ridan-to‘g‘ri ko‘chirib',
              'Internetdagi videolarni tomosha qilib',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! LLMlar statistik va ehtimollik qonuniyatlariga tayanib keyingi eng to‘g‘ri tokenni bashorat qiladi.',
          },
        ],
        summary: 'Siz prompt nima ekanini, LLM modellari qanday ishlashini va nima sababdan aniq so‘rov yozish sifatli natija garovi ekanini o‘rgandingiz.',
        nextLessonSlug: 'rtco-modeli-mukammal-prompt-tuzilishi',
        nextLessonTitle: 'RTCO Modeli — Mukammal Prompt Tuzilishi',
      },
    },
    exercise: {
      id: 'ex-prompt-1',
      lessonId: 'les-prompt-1',
      title: 'Birinchi Aniq Promptni Tuzing',
      description: 'JavaScript o‘zgaruvchisida sun’iy intellekt uchun aniq va mukammal prompt shablonini tuzing va uni konsolga chiqaring.',
      instructions: [
        'promptText nomli o‘zgaruvchi e’lon qiling.',
        'Prompt matnida quyidagi 3 ta element albatta bo‘lsin: "Rol: Dasturchi", "Vazifa: Kalkulyator", "Til: JavaScript".',
        'console.log(promptText) orqali matnni konsolga chiqaring.',
      ],
      starterCode: `// Sun'iy intellekt uchun aniq prompt tuzing\nconst promptText = \`Rol: Dasturchi\nVazifa: Kalkulyator\nTil: JavaScript\`;\n\n// Uni konsolga chiqaring\nconsole.log(promptText);\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-prompt-1-1',
          description: 'Konsolda "Rol: Dasturchi" matni mavjud bo‘lishi kerak',
          expectedOutput: 'Rol: Dasturchi',
          type: 'contains',
        },
        {
          id: 'tc-prompt-1-2',
          description: 'Konsolda "Vazifa: Kalkulyator" matni mavjud bo‘lishi kerak',
          expectedOutput: 'Vazifa: Kalkulyator',
          type: 'contains',
        },
        {
          id: 'tc-prompt-1-3',
          description: 'Konsolda "Til: JavaScript" matni mavjud bo‘lishi kerak',
          expectedOutput: 'Til: JavaScript',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: promptText o‘zgaruvchisiga berilgan satrlarni joylang.',
        '2-bosqich: console.log(promptText) buyrug‘ini oxirida qoldiring.',
        '3-bosqich: Testdan o‘tish uchun matnda "Rol: Dasturchi", "Vazifa: Kalkulyator" va "Til: JavaScript" so‘zlari to‘liq bo‘lishi shart.',
      ],
      solutionExplanation: 'Aniq yo‘naltirilgan prompt AI ga o‘z vazifasini xatosiz va tez bajarishga imkon beradi.',
      passingScore: 100,
      expectedConcepts: ['prompt', 'console.log', 'template string'],
    },
  },

  // 2-Dars: RTCO Modeli — Mukammal Promptning 4 Ustuni
  {
    lesson: {
      id: 'les-prompt-2',
      moduleId: 'mod-prompt-1',
      courseId: 'course-prompt',
      title: 'RTCO Modeli — Mukammal Prompt Tuzilishi',
      slug: 'rtco-modeli-mukammal-prompt-tuzilishi',
      description: 'Dunyo darajasidagi muhandislar formulasi: Role (Rol), Task (Vazifa), Context (Kontekst) va Output (Natija formati).',
      objectives: [
        'RTCO ramkasi (framework) qanday ishlashini tushunish',
        'AI ga aniq shaxsiyat va mutaxassislik rolini yuklashni o‘rganish',
        'Natijani kerakli formatda (JSON, jadval, toza kod) olish qoidalarini egallash',
      ],
      estimatedMinutes: 20,
      order: 2,
      published: true,
      content: {
        title: 'RTCO Modeli — Mukammal Prompt Tuzilishi',
        learningObjective: 'RTCO (Role, Task, Context, Output) formulasidan foydalanib har qanday murakkab topshiriq uchun 100% natija beruvchi prompt yozish.',
        realLifeAnalogy: 'Kvartirangizni ta’mirlash uchun usta yollayotgansiz. Siz unga: 1) Sen kimsan? (Professional kafel ustasi), 2) Qayerda ishlaysan? (Hammom xonasida, devorlar g‘ishtdan), 3) Qanday ish qilishing kerak? (Oq kafel terish kerak), 4) Qanday topshirasan? (Choklari 2 millimetr, tekis sath bilan). Mana shu 4 ma’lumot bo‘lsa, usta hech qanday xatosiz ishni bitiradi. RTCO aynan shu texnik topshiriqdir!',
        theory: [
          {
            type: 'heading',
            content: 'RTCO — Prompt Muhandisligining Oltin Standarti',
          },
          {
            type: 'text',
            content: 'Har qanday professional darajadagi prompt 4 ta asosiy blokdan iborat bo‘lishi lozim: Role (Rol), Task (Vazifa), Context (Kontekst) va Output (Chiqish formati).',
          },
          {
            type: 'heading',
            content: '1. R — Role (Rol)',
          },
          {
            type: 'text',
            content: 'AI qaysi soha mutaxassisi sifatida javob berishi kerak? Masalan: "Siz 10 yillik tajribaga ega Senior Python Architect va xavfsizlik bo‘yicha auditsiz."',
          },
          {
            type: 'heading',
            content: '2. T — Task (Vazifa)',
          },
          {
            type: 'text',
            content: 'AI aynan nima ishni amalga oshirishi kerak? Bitta aniq fe’l bilan boshlang: "Tahlil qiling", "Yozib bering", "Tarjima qiling", "Qayta ishlang (refactor)".',
          },
          {
            type: 'heading',
            content: '3. C — Context (Kontekst)',
          },
          {
            type: 'text',
            content: 'Vaziyat qanday? Foydalanuvchilar kim? Qanday cheklovlar bor? Masalan: "Loyiha yangi boshlovchi bolalar uchun mo‘ljallangan, texnik murakkab atamalar ishlatilmasin."',
          },
          {
            type: 'heading',
            content: '4. O — Output Format (Chiqish formati)',
          },
          {
            type: 'text',
            content: 'Javob qanday ko‘rinishda bo‘lsin? Masalan: "Faqat JSON formatida", "3 ta punktli ro‘yxat ko‘rinishida", yoki "Hech qanday tushuntirishsiz faqat toza kod".',
          },
        ],
        interactiveExample: {
          title: 'RTCO modelida to‘liq prompt yaratish',
          description: 'Quyidagi namunada 4 ta komponent birlashtirilib, mukammal so‘rov hosil qilinadi.',
          language: 'javascript',
          code: `const role = "ROLE: Siz tajribali UI/UX dizayner va Frontend mutaxassisisiz.";\nconst task = "TASK: E-commerce sayti uchun savat (Cart) sahifasi strukturasini tuzing.";\nconst context = "CONTEXT: Foydalanuvchilar asosan smartfondan kiradi, yuklanish tezligi o'ta muhim.";\nconst output = "OUTPUT: Javobni Markdown formatidagi tartibli qadamlar bilan taqdim eting.";\n\nconst fullPrompt = \`\${role}\\n\${task}\\n\${context}\\n\${output}\`;\nconsole.log(fullPrompt);`,
          expectedOutput: "ROLE: Siz tajribali UI/UX dizayner va Frontend mutaxassisisiz.\nTASK: E-commerce sayti uchun savat (Cart) sahifasi strukturasini tuzing.\nCONTEXT: Foydalanuvchilar asosan smartfondan kiradi, yuklanish tezligi o'ta muhim.\nOUTPUT: Javobni Markdown formatidagi tartibli qadamlar bilan taqdim eting.",
          lineExplanations: {
            1: 'Rol berilganda AI o‘z javobini dizaynerlik tamoyillari asosida shakllantiradi.',
            2: 'Vazifa aniq va ravshan belgilangan.',
            3: 'Kontekst AI ga mobil qurilmalarni hisobga olishni bildiradi.',
            4: 'Chiqish formati tartibli Markdown bo‘lishi talab qilindi.',
          },
        },
        commonMistakes: [
          {
            title: 'Chiqish formatini ko‘rsatmaslik',
            wrongCode: '// "HTML jadval tuz" (AI ortiqcha 3 sahifalik matn va tushuntirish qo‘shib tashlaydi)',
            correctCode: '// "HTML jadval tuz. Faqat <table> kodini ber, hech qanday matnli tushuntirish yozma."',
            explanation: 'Chiqish formati belgilanmasa, sun’iy intellekt ko‘p gapirib, vaqtingizni oladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prompt-2-1',
            question: 'RTCO qisqartmasi nimani anglatadi?',
            type: 'multiple-choice',
            options: [
              'Run, Test, Compile, Output',
              'Role, Task, Context, Output',
              'Read, Type, Check, Open',
              'Request, Terminal, Code, Object',
            ],
            correctAnswer: 1,
            explanation: 'Barakalla! RTCO — Role (Rol), Task (Vazifa), Context (Kontekst) va Output (Chiqish formati).',
          },
          {
            id: 'q-prompt-2-2',
            question: 'AI ga nima sababdan Rol (Role) beriladi?',
            type: 'multiple-choice',
            options: [
              'Sun’iy intellekt o‘zining haqiqiy ismini unutishi uchun',
              'AI o‘zining ulkan ma’lumotlar bazasidan aynan o‘sha sohaga tegishli chuqur bilimlarni faollashtirishi uchun',
              'Internet tezligini oshirish uchun',
              'Xotiradan joy tejash uchun',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Rol berilganda AI umumiy javoblar o‘rniga aynan o‘sha soha mutaxassisi uslubida eng to‘g‘ri atamalar bilan javob beradi.',
          },
        ],
        summary: 'Siz RTCO modelining barcha 4 ta bo‘g‘inini va har birining javob sifatiga ta’sirini chuqur o‘zlashtirdingiz.',
        nextLessonSlug: 'zero-shot-va-few-shot-prompting',
        nextLessonTitle: 'Zero-Shot va Few-Shot Prompting',
      },
    },
    exercise: {
      id: 'ex-prompt-2',
      lessonId: 'les-prompt-2',
      title: 'RTCO Formatida Prompt Tuzish',
      description: 'RTCO tamoyiliga to‘liq amal qilgan holda ob-havo ilovasi uchun prompt generatorini yozing.',
      instructions: [
        'rtcoPrompt nomli o‘zgaruvchi e’lon qiling.',
        'Unda quyidagi to‘rtta bo‘lim qatnashsin: "ROLE:", "TASK:", "CONTEXT:", "OUTPUT:".',
        'Uni console.log(rtcoPrompt) orqali chiqaring.',
      ],
      starterCode: `// RTCO modeliga muvofiq prompt tuzing\nconst rtcoPrompt = \`ROLE: Ob-havo tahlilchisi\nTASK: Haftalik prognozni hisoblang\nCONTEXT: Toshkent shahri uchun\nOUTPUT: Faqat JSON formatida\`;\n\nconsole.log(rtcoPrompt);\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-prompt-2-1',
          description: 'Promptda "ROLE:" bo‘limi mavjud bo‘lishi kerak',
          expectedOutput: 'ROLE:',
          type: 'contains',
        },
        {
          id: 'tc-prompt-2-2',
          description: 'Promptda "TASK:" bo‘limi mavjud bo‘lishi kerak',
          expectedOutput: 'TASK:',
          type: 'contains',
        },
        {
          id: 'tc-prompt-2-3',
          description: 'Promptda "CONTEXT:" bo‘limi mavjud bo‘lishi kerak',
          expectedOutput: 'CONTEXT:',
          type: 'contains',
        },
        {
          id: 'tc-prompt-2-4',
          description: 'Promptda "OUTPUT:" bo‘limi mavjud bo‘lishi kerak',
          expectedOutput: 'OUTPUT:',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: rtcoPrompt matnida ROLE, TASK, CONTEXT va OUTPUT so‘zlari bo‘lishini ta’minlang.',
        '2-bosqich: console.log(rtcoPrompt) orqali konsolga chiqaring.',
      ],
      solutionExplanation: 'RTCO arxitekturasi yordamida AI hech qanday adashishlarsiz aniq maqsadga xizmat qiladi.',
      passingScore: 100,
      expectedConcepts: ['RTCO', 'string', 'prompt engineering'],
    },
  },

  // 3-Dars: Zero-Shot va Few-Shot Prompting
  {
    lesson: {
      id: 'les-prompt-3',
      moduleId: 'mod-prompt-2',
      courseId: 'course-prompt',
      title: 'Zero-Shot va Few-Shot Prompting',
      slug: 'zero-shot-va-few-shot-prompting',
      description: 'Misollar bilan o‘rgatish san’ati: nima uchun 2-3 ta namuna sun’iy intellekt aniqligini 300% ga oshiradi?',
      objectives: [
        'Zero-Shot va Few-Shot prompting o‘rtasidagi farqni tushunish',
        'AI ga topshiriqni namunalar (Input -> Output) orqali tushuntirish',
        'Kutilgan murakkab formatlarni bir urinishda olishni o‘rganish',
      ],
      estimatedMinutes: 20,
      order: 3,
      published: true,
      content: {
        title: 'Zero-Shot va Few-Shot Prompting',
        learningObjective: 'Few-Shot (misollar orqali yo‘naltirish) texnikasini qo‘llab, eng nozik va murakkab talablarni AI ga xatosiz bajartirish.',
        realLifeAnalogy: 'Kichik yoshdagi ukangizga "Stolni yig‘ishtir" desangiz (Zero-shot) — u kitoblarni polga tashlashi yoki idishlarni chalkashtirishi mumkin. Ammo unga: "Mana qara: qalamlar qutiga, daftarlar tokchaga, stakan esa oshxonaga ketadi" deb 2-3 ta namuna ko‘rsatsangiz (Few-shot), u qolgan barcha narsalarni ayni o‘sha tartibda joylaydi! Misol ko‘rsatish mingta tushuntirishdan kuchliroqdir.',
        theory: [
          {
            type: 'heading',
            content: 'Zero-Shot Prompting — Misolsiz to‘g‘ridan-to‘g‘ri buyruq',
          },
          {
            type: 'text',
            content: 'Zero-shot promptingda modelga hech qanday bajarilgan namuna berilmaydi. Faqat vazifa aytiladi. Masalan: "Ushbu izohni ijobiy yoki salbiyga ajrating: Xizmat ko‘rsatish ajoyib edi!" Model o‘zining umumiy bilimiga tayanib "Ijobiy" deb javob beradi. Oddiy vazifalar uchun bu yetarli.',
          },
          {
            type: 'heading',
            content: 'Few-Shot Prompting — Namunalar berish (In-Context Learning)',
          },
          {
            type: 'text',
            content: 'Few-shot promptingda modelga topshiriqdan oldin 2 ta yoki 3 ta to‘liq ishlangan misol (Kiritish -> Chiqish) ko‘rsatiladi. Bu modelga kutilayotgan uslub, ohang va formatni 100% tushunib olishga yordam beradi.',
          },
          {
            type: 'note',
            content: 'Few-Shot strukturasi: \nMisol 1: Kirish: [...] -> Chiqish: [...]\nMisol 2: Kirish: [...] -> Chiqish: [...]\nHaqiqiy topshiriq: Kirish: [...] -> Chiqish: ?',
          },
        ],
        interactiveExample: {
          title: 'Few-Shot namunasi: Mahsulot sharhlarini his-tuyg‘uga ajratish',
          description: 'Quyida 2 ta misol orqali modelga qanday formatda javob berish kerakligi ko‘rsatilgan.',
          language: 'javascript',
          code: `const fewShotPrompt = \`Quyidagi sharhlarni ijobiy yoki salbiy deb toifalab, bahosini 1 dan 5 gacha ko'rsating:\n\nMisol 1:\nSharh: "Buyurtma tez yetib keldi, kiyim sifati zo'r!"\nNatija: { tuyg'u: "ijobiy", baho: 5 }\n\nMisol 2:\nSharh: "Mahsulot buzilgan holda keldi, pulimni qaytaring."\nNatija: { tuyg'u: "salbiy", baho: 1 }\n\nYangi topshiriq:\nSharh: "Telefon yaxshi ishlayapti, ammo zaryadi biroz kamroq yetadi."\nNatija:\`;\n\nconsole.log(fewShotPrompt);`,
          expectedOutput: "Quyidagi sharhlarni ijobiy yoki salbiy deb toifalab, bahosini 1 dan 5 gacha ko'rsating:\n\nMisol 1:\nSharh: \"Buyurtma tez yetib keldi, kiyim sifati zo'r!\"\nNatija: { tuyg'u: \"ijobiy\", baho: 5 }\n\nMisol 2:\nSharh: \"Mahsulot buzilgan holda keldi, pulimni qaytaring.\"\nNatija: { tuyg'u: \"salbiy\", baho: 1 }\n\nYangi topshiriq:\nSharh: \"Telefon yaxshi ishlayapti, ammo zaryadi biroz kamroq yetadi.\"\nNatija:",
          lineExplanations: {
            3: 'Birinchi misol AI ga ijobiy sharh qanday formatda chiqishini ko‘rsatadi.',
            7: 'Ikkinchi misol salbiy sharh formatini belgilaydi.',
            11: 'Yangi topshiriq berilganda AI aynan shu JSON tuzilishida { tuyg‘u: "aralash", baho: 3 } deb javob beradi.',
          },
        },
        commonMistakes: [
          {
            title: 'Qarama-qarshi yoki xato misollar berish',
            wrongCode: '// Misol 1: A -> B, Misol 2: A -> C (biri-biriga zid formatlar)',
            correctCode: '// Barcha misollarda chiqish formati (kalit so‘zlar, qavslar, uslub) bir xil bo‘lishi lozim.',
            explanation: 'Misollardagi format har xil bo‘lsa, AI ikkilanadi va kutilmagan javob qaytaradi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prompt-3-1',
            question: 'Few-Shot promptingning Zero-Shot dan asosiy farqi nimada?',
            type: 'multiple-choice',
            options: [
              'Few-Shot da modelga 2-3 ta bajarilgan namuna misollar ko‘rsatiladi',
              'Few-Shot faqat rasm chizish uchun ishlatiladi',
              'Zero-Shot da kompyuter tezroq ishlaydi',
              'Few-Shot da dasturlash tillari ishlatilmaydi',
            ],
            correctAnswer: 0,
            explanation: 'To‘g‘ri! Few-Shot — bu vazifani misollar (namunalar) orqali ko‘rsatib berish usulidir.',
          },
          {
            id: 'q-prompt-3-2',
            question: 'Few-shot prompting qachon eng ko‘p foyda keltiradi?',
            type: 'multiple-choice',
            options: [
              'Faqat oddiy salomlashishda',
              'Murakkab toifalash, aniq JSON/XML format talab qilinganda va maxsus uslub kerak bo‘lganda',
              'Fayllarni o‘chirib yuborishda',
              'Brauzerni yopishda',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Aniq struktura va noodatiy format talab qilinganda bir nechta misol berish xatolarni keskin kamaytiradi.',
          },
        ],
        summary: 'Siz Zero-Shot va Few-Shot uslublarini, namunalar vositasida modelni boshqarishni o‘rgandingiz.',
        nextLessonSlug: 'chain-of-thought-fikrlash-zanjiri',
        nextLessonTitle: 'Chain-of-Thought — Fikrlash Zanjiri (CoT)',
      },
    },
    exercise: {
      id: 'ex-prompt-3',
      lessonId: 'les-prompt-3',
      title: 'Few-Shot Promptini Yarating',
      description: 'Dasturlash atamalarini sodda o‘zbek tiliga o‘giruvchi Few-Shot promptini tuzing.',
      instructions: [
        'fewShotCode nomli o‘zgaruvchi e’lon qiling.',
        'Unda kamida 2 ta namuna bo‘lsin: "Misol 1" va "Misol 2".',
        'Shuningdek, "Yangi atama:" so‘zi mavjud bo‘lsin.',
        'Uni console.log(fewShotCode) orqali chiqaring.',
      ],
      starterCode: `// Few-Shot prompt tuzing\nconst fewShotCode = \`Dasturlash atamalarini sodda tushuntiring:\n\nMisol 1:\nAtama: Bug\nTushuntirish: Dasturdagi xatolik\n\nMisol 2:\nAtama: Variable\nTushuntirish: Ma'lumot saqlovchi quti\n\nYangi atama: Function\nTushuntirish:\`;\n\nconsole.log(fewShotCode);\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-prompt-3-1',
          description: 'Promptda "Misol 1" matni mavjud bo‘lishi kerak',
          expectedOutput: 'Misol 1',
          type: 'contains',
        },
        {
          id: 'tc-prompt-3-2',
          description: 'Promptda "Misol 2" matni mavjud bo‘lishi kerak',
          expectedOutput: 'Misol 2',
          type: 'contains',
        },
        {
          id: 'tc-prompt-3-3',
          description: 'Promptda "Yangi atama:" matni mavjud bo‘lishi kerak',
          expectedOutput: 'Yangi atama:',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: fewShotCode o‘zgaruvchisiga berilgan shablonni to‘liq joylang.',
        '2-bosqich: console.log(fewShotCode) orqali konsolga chop eting.',
      ],
      solutionExplanation: 'Few-shot misollari orqali AI qisqa va aniq o‘xshatishlar bilan tushuntirish uslubini o‘zlashtirib oladi.',
      passingScore: 100,
      expectedConcepts: ['few-shot', 'prompting', 'in-context learning'],
    },
  },

  // 4-Dars: Chain-of-Thought (CoT) — Bosqichma-bosqich Fikrlash Zanjiri
  {
    lesson: {
      id: 'les-prompt-4',
      moduleId: 'mod-prompt-2',
      courseId: 'course-prompt',
      title: 'Chain-of-Thought — Fikrlash Zanjiri',
      slug: 'chain-of-thought-fikrlash-zanjiri',
      description: '"Let\'s think step by step" sehrli iborasi: murakkab mantiqiy va dasturlash vazifalarida AI xatolarini 80% ga kamaytirish.',
      objectives: [
        'Chain-of-Thought (CoT) nima ekanini tushunish',
        'Nima sababdan AI to‘g‘ridan-to‘g‘ri javob berishda adashishi mumkinligini anglash',
        'Qadam-baqadam tahlilni majburlovchi buyruqlarni yozish',
      ],
      estimatedMinutes: 20,
      order: 4,
      published: true,
      content: {
        title: 'Chain-of-Thought — Fikrlash Zanjiri',
        learningObjective: 'Murakkab hisob-kitoblar, mantiqiy jumboqlar va kod tahlilida Chain-of-Thought strategiyasini qo‘llab mukammal aniqlikka erishish.',
        realLifeAnalogy: 'Matematika imtihonida murakkab masalani yechayotganingizda, o‘qituvchi sizdan shunchaki oxirgi javobni yozishni emas, balki "Yechilish qadamlarini ko‘rsat" deb talab qiladi. Nega? Chunki inson miyasi ham qadam-baqadam yozganda har bir bosqichni tekshirib, xato qilmaydi. Agar birdaniga hisoblasa — adashadi. Sun’iy intellekt ham aynan shunday!',
        theory: [
          {
            type: 'heading',
            content: 'To‘g‘ridan-to‘g‘ri javob berish tuzog‘i',
          },
          {
            type: 'text',
            content: 'Agar siz AI ga murakkab algoritmik masala berib, "Javob nima?" deb so‘rasangiz, u birinchi uchragan ehtimoliy natijani chiqarib beradi va ko‘pincha hisoblashda adashadi.',
          },
          {
            type: 'heading',
            content: '"Let’s think step by step" — Qadam-baqadam fikrlaymiz',
          },
          {
            type: 'text',
            content: 'Tadqiqotlar shuni ko‘rsatdiki, prompt oxiriga: "Keling, buni bosqichma-bosqich tahlil qilamiz va har bir qadamni asoslaymiz" deb yozilsa, sun’iy intellektning mantiqiy xatolari 80% ga kamayadi! Bu usul Chain-of-Thought (Fikrlash Zanjiri) deb ataladi.',
          },
          {
            type: 'note',
            content: 'CoT usulida model javob chiqarishdan oldin o‘zi uchun oraliq xulosalarni (qadamlarni) yozadi. Har bir yangi qadam oldingi qadamga asoslangani sababli, yakuniy natija 100% to‘g‘ri chiqadi.',
          },
        ],
        interactiveExample: {
          title: 'Algoritmik masalada CoT qo‘llash',
          description: 'Qadam-baqadam yechishni talab qiluvchi prompt namunasi.',
          language: 'javascript',
          code: `const cotPrompt = \`Topshiriq: Berilgan JavaScript funksiyasida xotira oqishi (memory leak) bormi?\n\nKo'rsatma:\n1-qadam: Funksiya qaysi resurslarni (event listener, interval) yaratayotganini aniqlang.\n2-qadam: Ushbu resurslar tozalanyaptimi (cleanup) yoki yo'qligini tekshiring.\n3-qadam: Agar xato bo'lsa, uni to'g'rilangan kod bilan ko'rsating.\n4-qadam: Yakuniy xulosani 1 ta jumlada ayting.\n\nKeling, har bir qadamni bosqichma-bosqich yozamiz:\`;\n\nconsole.log(cotPrompt);`,
          expectedOutput: "Topshiriq: Berilgan JavaScript funksiyasida xotira oqishi (memory leak) bormi?\n\nKo'rsatma:\n1-qadam: Funksiya qaysi resurslarni (event listener, interval) yaratayotganini aniqlang.\n2-qadam: Ushbu resurslar tozalanyaptimi (cleanup) yoki yo'qligini tekshiring.\n3-qadam: Agar xato bo'lsa, uni to'g'rilangan kod bilan ko'rsating.\n4-qadam: Yakuniy xulosani 1 ta jumlada ayting.\n\nKeling, har bir qadamni bosqichma-bosqich yozamiz:",
          lineExplanations: {
            4: 'AI ga to‘g‘ridan-to‘g‘ri javob berish emas, 1-qadamdan boshlash buyurildi.',
            5: '2-qadam mantiqiy davom ettiriladi.',
            8: 'Bosqichma-bosqich ko‘rsatma orqali AI eng mayda detallargacha e’tibor qaratadi.',
          },
        },
        commonMistakes: [
          {
            title: 'Murakkab hisob-kitobda birdaniga yakuniy javob so‘rash',
            wrongCode: '// "Bu dastur qancha xotira yeydi? Bir so‘z bilan javob ber."',
            correctCode: '// "Har bir o‘zgaruvchining hajmini alohida hisoblab, qadam-baqadam jami xotirani toping."',
            explanation: 'Oraliq qadamsiz AI murakkab hisob-kitobda ko‘pincha xomxayol (gallyutsinatsiya) qiladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prompt-4-1',
            question: 'Chain-of-Thought (CoT) texnikasining asosiy mohiyati nima?',
            type: 'multiple-choice',
            options: [
              'Faqat ingliz tilida so‘rov yozish',
              'Modelga muammoni birdaniga emas, har bir oraliq qadamni asoslab bosqichma-bosqich yechishni buyurish',
              'AI ning internetga ulanishini cheklash',
              'Kodni bir qatorda yozish',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! CoT — bu fikrlash zanjirini bosqichma-bosqich ochib berish orqali xatolarni bartaraf etish usulidir.',
          },
          {
            id: 'q-prompt-4-2',
            question: 'Qaysi sehrli jumla CoT effektini ishga tushirishda eng mashhur hisoblanadi?',
            type: 'multiple-choice',
            options: [
              '"Tezroq javob ber"',
              '"Keling, buni bosqichma-bosqich fikrlaymiz" (Let’s think step by step)',
              '"Hech qachon xato qilma"',
              '"Dasturni qayta yukla"',
            ],
            correctAnswer: 1,
            explanation: 'Barakalla! "Let\'s think step by step" jumlasi modelning fikrlash yo‘nalishini sifatli qadamlarga ajratadi.',
          },
        ],
        summary: 'Siz CoT yondashuvini va murakkab algoritmlarni AI yordamida qadam-baqadam tekshirishni o‘rgandingiz.',
        nextLessonSlug: 'dasturlashda-ai-va-hallucination',
        nextLessonTitle: 'Dasturlashda AI va Gallyutsinatsiya Nazorati',
      },
    },
    exercise: {
      id: 'ex-prompt-4',
      lessonId: 'les-prompt-4',
      title: 'CoT Fikrlash Zanjiri Promptini Yozing',
      description: 'Dasturdagi bug (xato)ni tahlil qilish uchun qadam-baqadam fikrlashni talab qiluvchi prompt tuzing.',
      instructions: [
        'cotInstruction nomli o‘zgaruvchi e’lon qiling.',
        'Unda "1-qadam:", "2-qadam:" va "Qadam-baqadam fikrlang" jumlalari qatnashsin.',
        'console.log(cotInstruction) orqali chiqaring.',
      ],
      starterCode: `// CoT promptini tuzing\nconst cotInstruction = \`Koddagi xatoni tahlil qiling:\n1-qadam: Xatolik kelib chiqqan qatorni aniqlang.\n2-qadam: O'zgaruvchi qiymatini tekshiring.\nQadam-baqadam fikrlang va yakuniy yechimni bering.\`;\n\nconsole.log(cotInstruction);\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-prompt-4-1',
          description: 'Promptda "1-qadam:" matni mavjud bo‘lishi kerak',
          expectedOutput: '1-qadam:',
          type: 'contains',
        },
        {
          id: 'tc-prompt-4-2',
          description: 'Promptda "2-qadam:" matni mavjud bo‘lishi kerak',
          expectedOutput: '2-qadam:',
          type: 'contains',
        },
        {
          id: 'tc-prompt-4-3',
          description: 'Promptda "Qadam-baqadam fikrlang" matni mavjud bo‘lishi kerak',
          expectedOutput: 'Qadam-baqadam fikrlang',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: cotInstruction matnida "1-qadam:", "2-qadam:" va "Qadam-baqadam fikrlang" bo‘lishi kerak.',
        '2-bosqich: console.log(cotInstruction) buyrug‘ini qoldiring.',
      ],
      solutionExplanation: 'Qadam-baqadam ko‘rsatma AI ning diqqatini tartibli tahlilga yo‘naltiradi.',
      passingScore: 100,
      expectedConcepts: ['chain-of-thought', 'prompting', 'steps'],
    },
  },

  // 5-Dars: Dasturlashda AI dan Foydalanish va Gallyutsinatsiya Nazorati
  {
    lesson: {
      id: 'les-prompt-5',
      moduleId: 'mod-prompt-3',
      courseId: 'course-prompt',
      title: 'Dasturlashda AI va Gallyutsinatsiya Nazorati',
      slug: 'dasturlashda-ai-va-hallucination',
      description: 'Kod yozdirishda cheklovlar (Constraints), mavjud bo‘lmagan funksiyalarni to‘qishni to‘xtatish va xavfsiz prompt andozalari.',
      objectives: [
        'Sun’iy intellekt gallyutsinatsiyasi (hallucination) nima ekanini bilish',
        'AI ga qat’iy man etuvchi va chegaralovchi cheklovlar (Negative Constraints) qo‘yish',
        'Dasturlashda unumdorlikni 10 barobarga oshiruvchi xavfsiz promptlarni yozish',
      ],
      estimatedMinutes: 25,
      order: 5,
      published: true,
      content: {
        title: 'Dasturlashda AI va Gallyutsinatsiya Nazorati',
        learningObjective: 'Dasturchi sifatida AI dan toza, xatosiz, zamonaviy kod olish va gallyutsinatsiyalarni butunlay to‘xtatish.',
        realLifeAnalogy: 'Tasavvur qiling, yosh stajyorga topshiriq berdingiz. Agar u bilmaydigan mavzu tushib qolsa, iymanib yoki o‘zini ko‘rsatish uchun xayoliga kelgan yolg‘onni to‘qib gapirishi mumkin. Siz unga: "Faqat aniq bilgan faktlaringni ayt, agar bilmasang yoki shubhang bo‘lsa, bilmayman deb ochiq ayt!" deb tayinlasangiz, u hech qachon aldamaydi. AI ga ham aynan shunday chegara qo‘yish shart!',
        theory: [
          {
            type: 'heading',
            content: 'Gallyutsinatsiya (Hallucination) nima?',
          },
          {
            type: 'text',
            content: 'Gallyutsinatsiya — bu sun’iy intellekt o‘zi bilmagan ma’lumotga duch kelganda, ishonchli ohang bilan mavjud bo‘lmagan funksiyalar, kutubxonalar yoki noto‘g‘ri kodlarni to‘qib chiqarishidir.',
          },
          {
            type: 'heading',
            content: 'Cheklovlar (Negative Constraints) orqali nazorat qilish',
          },
          {
            type: 'text',
            content: 'AI dan toza kod olish uchun har doim nimalar QILINMASLIGI kerakligini ta’kidlang: \n1. "Eski var kalit so‘zini ishlatmang, faqat const va let ishlating."\n2. "Hech qanday tashqi npm kutubxona qo‘shmang, faqat Vanilla JavaScript bo‘lsin."\n3. "Agar aniq yechimni bilmasangiz, taxmin qilmang, ochiq ayting."\n4. "Faqat kodni ber, hech qanday matnli salomlashish yoki tushuntirish yozma."',
          },
          {
            type: 'note',
            content: 'Dasturchining oltin qoidasi: AI sizning o‘rningizga dasturchi bo‘la olmaydi, lekin AI dan to‘g‘ri foydalanadigan dasturchi boshqa barcha dasturchilardan 10 barobar tezroq va samaraliroq ishlaydi!',
          },
        ],
        interactiveExample: {
          title: 'Professional Dasturchi Prompti (Cheklovlar bilan)',
          description: 'Qat’iy talablar va cheklovlar qo‘yilgan to‘liq dasturchilik prompti.',
          language: 'javascript',
          code: `const developerPrompt = \`Siz Senior JavaScript mutaxassisisiz.\n\nVazifa: Berilgan matndan barcha email manzillarni ajratib oluvchi extractEmails funksiyasini yozing.\n\nCheklovlar (Constraints):\n- Faqat zamonaviy ES6+ sintaksisi ishlatilsin.\n- Tashqi kutubxonalar umuman ishlatilmasin.\n- Faqat toza kodni bering, ortiqcha tushuntirish yozmang.\n- Agar matnda email topilmasa, bo'sh massiv [] qaytarsin.\`;\n\nconsole.log(developerPrompt);`,
          expectedOutput: "Siz Senior JavaScript mutaxassisisiz.\n\nVazifa: Berilgan matndan barcha email manzillarni ajratib oluvchi extractEmails funksiyasini yozing.\n\nCheklovlar (Constraints):\n- Faqat zamonaviy ES6+ sintaksisi ishlatilsin.\n- Tashqi kutubxonalar umuman ishlatilmasin.\n- Faqat toza kodni bering, ortiqcha tushuntirish yozmang.\n- Agar matnda email topilmasa, bo'sh massiv [] qaytarsin.",
          lineExplanations: {
            1: 'Senior mutaxassis roli berildi.',
            5: 'Cheklovlar bloki modelni qat’iy doirada ushlab turadi.',
            7: 'Tashqi kutubxonalardan tiyadi.',
            8: 'Ortiqcha gap-so‘zlarsiz faqat toza kod olish kafolatlanadi.',
          },
        },
        commonMistakes: [
          {
            title: 'Kutubxona versiyalarini ko‘rsatmaslik',
            wrongCode: '// "React da modal oyna yoz" (AI 5 yil oldingi eski class komponent yozib berishi mumkin)',
            correctCode: '// "React 19 da TypeScript va Tailwind CSS yordamida funksional modal komponent yozing."',
            explanation: 'Texnologiya versiyasini ko‘rsatmaslik eski va eskirgan uslubdagi kodga olib keladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-prompt-5-1',
            question: 'Sun’iy intellektda "Gallyutsinatsiya" nima?',
            type: 'multiple-choice',
            options: [
              'Modelning tezligi 2 barobar oshishi',
              'AI ning mavjud bo‘lmagan faktlar, kutubxonalar yoki xato kodlarni ishonch bilan to‘qib chiqarishi',
              'Faqat kompyuter ekranining miltillashi',
              'Baza hajmining to‘lib qolishi',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Gallyutsinatsiya — bu sun’iy intellektning mavjud bo‘lmagan narsani haqiqatdek taqdim etishidir.',
          },
          {
            id: 'q-prompt-5-2',
            question: 'Gallyutsinatsiyani kamaytirish uchun promptda nima berilishi shart?',
            type: 'multiple-choice',
            options: [
              'Faqat kulgili emojilar',
              'Aniq cheklovlar (Constraints), manbalar va "Bilmasang, taxmin qilma" qoidasi',
              'Katta harflar bilan qichqirib yozish',
              'So‘rovni 10 marta takrorlash',
            ],
            correctAnswer: 1,
            explanation: 'Barakalla! Aniq chegaralar va salbiy cheklovlar modelni haqiqiy faktlar doirasida ushlab turadi.',
          },
        ],
        summary: 'Tabriklaymiz! Siz Prompt Engineering kursining barcha asosiy texnikalarini: LLM tamoyillari, RTCO modeli, Few-Shot, CoT va xavfsiz dasturlash chegaralarini to‘liq o‘zlashtirdingiz!',
        nextLessonSlug: undefined,
        nextLessonTitle: undefined,
      },
    },
    exercise: {
      id: 'ex-prompt-5',
      lessonId: 'les-prompt-5',
      title: 'Cheklovli Xavfsiz Dasturchilik Promptini Yozing',
      description: 'Gallyutsinatsiyaning oldini oluvchi, qat’iy cheklovlarga ega to‘liq prompt andozasini yarating.',
      instructions: [
        'safePrompt nomli o‘zgaruvchi e’lon qiling.',
        'Prompt ichida "Cheklovlar:" va "Faqat toza kod" hamda "taxmin qilmang" jumlalari mavjud bo‘lsin.',
        'console.log(safePrompt) orqali chiqaring.',
      ],
      starterCode: `// Xavfsiz va cheklovlarga ega dasturchi promptini tuzing\nconst safePrompt = \`Siz tajribali dasturchisiz.\nVazifa: Ro'yxatdan o'tish formasi validatsiyasi.\nCheklovlar: Faqat toza kod bering, tushuntirish yozmang. Agar noaniq bo'lsa, taxmin qilmang.\`;\n\nconsole.log(safePrompt);\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-prompt-5-1',
          description: 'Promptda "Cheklovlar:" matni mavjud bo‘lishi kerak',
          expectedOutput: 'Cheklovlar:',
          type: 'contains',
        },
        {
          id: 'tc-prompt-5-2',
          description: 'Promptda "Faqat toza kod" matni mavjud bo‘lishi kerak',
          expectedOutput: 'Faqat toza kod',
          type: 'contains',
        },
        {
          id: 'tc-prompt-5-3',
          description: 'Promptda "taxmin qilmang" matni mavjud bo‘lishi kerak',
          expectedOutput: 'taxmin qilmang',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: safePrompt ichida "Cheklovlar:", "Faqat toza kod" va "taxmin qilmang" so‘zlari bo‘lishini tekshiring.',
        '2-bosqich: console.log(safePrompt) buyrug‘ini qoldiring.',
      ],
      solutionExplanation: 'Aniq cheklovlar modelni gallyutsinatsiya qilishdan asraydi va eng toza ishlab chiqarishga tayyor kodni taqdim etadi.',
      passingScore: 100,
      expectedConcepts: ['constraints', 'hallucination control', 'prompt engineering'],
    },
  },
];
