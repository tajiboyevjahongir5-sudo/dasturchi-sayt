import type { Lesson, Exercise } from '@/types';

export const INTRO_LESSONS: { lesson: Lesson; exercise: Exercise }[] = [
  // 1-Dars
  {
    lesson: {
      id: 'les-intro-1',
      moduleId: 'mod-intro-1',
      courseId: 'course-intro',
      title: 'Dasturlash va Algoritm Nima?',
      slug: 'dasturlash-va-algoritm-nima',
      description: 'Dasturlash tushunchasi, algoritmlar va kundalik hayotdagi qadamlar ketma-ketligi.',
      objectives: [
        'Dasturlash nima ekanini oddiy tushunish',
        'Algoritm tushunchasini hayotiy misol bilan anglash',
        'Kompyuterga aniq buyruqlar berish zarurligini bilish',
      ],
      estimatedMinutes: 15,
      order: 1,
      published: true,
      content: {
        title: 'Dasturlash va Algoritm Nima?',
        learningObjective: 'Ushbu darsda siz dasturlash aslida qanday ishlashini va kompyuterga buyruq berish qoidalarini o‘rganasiz.',
        realLifeAnalogy: 'Tasavvur qiling, oshxonada shirin choy damlayapsiz. Siz qadam-baqadam harakat qilasiz: 1) Choynakka suv quying, 2) Suvni qaynating, 3) Quruq choy soling, 4) Qaynoq suv quying va 5 daqiqa kuting. Agar siz suvni qaynatmasdan choy solsangiz — choy chiqmaydi! Dasturlash ham aynan shunday: kompyuterga buyruqlarni to‘g‘ri va ketma-ket tartibda berish.',
        theory: [
          {
            type: 'heading',
            content: 'Dasturlash — bu kompyuter bilan muloqot tili',
          },
          {
            type: 'text',
            content: 'Kompyuterlar o‘ta tez ishlaydigan, lekin o‘zi mustaqil fikrlay olmaydigan mashinalardir. Ular faqat biz yozgan qadam-baqadam ko‘rsatmalarni (buyruqlarni) so‘zsiz bajaradi. Mana shu ko‘rsatmalar to‘plamiga Dastur (Program), ularni yozish jarayoniga esa Dasturlash (Coding) deyiladi.',
          },
          {
            type: 'note',
            content: 'Algoritm — bu belgilangan natijaga erishish uchun aniq tartibda bajarilishi kerak bo‘lgan qoidalar va harakatlar ketma-ketligidir.',
          },
          {
            type: 'heading',
            content: 'Birinchi buyruq: Konsolga xabar chiqarish',
          },
          {
            type: 'text',
            content: 'Dasturlashda eng ko‘p ishlatiladigan buyruqlardan biri bu kompyuterga ekranga yoki konsolga biror matnni yozib ko‘rsatishni buyurishdir. JavaScript tilida bu buyruq console.log() deb nomlanadi.',
          },
        ],
        interactiveExample: {
          title: 'Konsolga salom xabari chiqarish',
          description: 'Ushbu kod konsolga "Salom, O\'zbekiston!" xabarini chiqaradi.',
          language: 'javascript',
          code: `console.log("Salom, O'zbekiston!");\nconsole.log("Men dasturchi bo'laman!");`,
          expectedOutput: "Salom, O'zbekiston!\nMen dasturchi bo'laman!",
          lineExplanations: {
            1: 'console.log() kompyuterga qavs ichidagi matnni ekranga chiqarishni aytadi.',
            2: 'Har bir yangi satr yangi buyruq sifatida ketma-ket bajariladi.',
          },
        },
        commonMistakes: [
          {
            title: 'Qo‘shtirnoqni yopmaslik',
            wrongCode: 'console.log("Salom Dunyo);',
            correctCode: 'console.log("Salom Dunyo");',
            explanation: 'Matn (string) har doim qo‘shtirnoq yoki bir tirnoq ichiga olinishi va albatta yopilishi kerak.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-intro-1-1',
            question: 'Algoritm nima?',
            type: 'multiple-choice',
            options: [
              'Faqat kompyuter ekranidagi ranglar',
              'Maqsadga erishish uchun aniq qadam-baqadam buyruqlar ketma-ketligi',
              'Kompyuterning qattiq diski',
              'Internetdagi ijtimoiy tarmoq',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Algoritm — bu muayyan natijaga olib boruvchi qadamlar ketma-ketligidir.',
          },
          {
            id: 'q-intro-1-2',
            question: 'Quyidagi kod natijasi nima bo‘ladi: console.log("CodeQuest");',
            type: 'code-output',
            options: [
              'Hech narsa chiqmaydi',
              'CodeQuest matni ekranga chiqadi',
              'Xatolik beradi',
              'Kompuyter o‘chadi',
            ],
            correctAnswer: 1,
            explanation: 'console.log() buyrug‘i qavs ichidagi "CodeQuest" yozuvini konsolga chiqaradi.',
          },
        ],
        summary: 'Siz dasturlash nima ekanini, algoritm tushunchasini va konsolga xabar chiqarish buyrug‘ini o‘rgandingiz.',
        nextLessonSlug: 'kompyuter-qanday-fikrlaydi',
        nextLessonTitle: 'Kompyuter Qanday Fikrlaydi?',
      },
    },
    exercise: {
      id: 'ex-intro-1',
      lessonId: 'les-intro-1',
      title: 'O‘zingizni tanishtiring',
      description: 'Konsolga o‘zingizning dasturchilik shioringizni chiqaring.',
      instructions: [
        'console.log() buyrug‘idan foydalaning.',
        'Konsolga aynan "Salom, CodeQuest!" matnini chiqaring.',
      ],
      starterCode: `// Bu yerda konsolga "Salom, CodeQuest!" yozuvini chiqaring\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-intro-1-1',
          description: 'Konsolga "Salom, CodeQuest!" matni chiqarilishi kerak',
          expectedOutput: 'Salom, CodeQuest!',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: Matn chiqarish uchun console.log(...) sintaksisidan foydalaning.',
        '2-bosqich: Qavs ichida qo‘shtirnoq ichiga matnni yozing: console.log("...")',
        '3-bosqich: Yakuniy yechim: console.log("Salom, CodeQuest!");',
      ],
      solutionExplanation: 'console.log("Salom, CodeQuest!"); buyrug‘i berilgan matnni dastur konsoliga yozadi.',
      passingScore: 100,
      expectedConcepts: ['console.log', 'string'],
    },
  },

  // 2-Dars
  {
    lesson: {
      id: 'les-intro-2',
      moduleId: 'mod-intro-1',
      courseId: 'course-intro',
      title: 'Kompyuter Qanday Fikrlaydi?',
      slug: 'kompyuter-qanday-fikrlaydi',
      description: 'Kompyuter xotirasi, 0 va 1 lar dunyosi hamda o‘zgaruvchilar mohiyati.',
      objectives: [
        'Binar tizim (0 va 1) nima ekanini anglash',
        'Kompyuter ma’lumotlarni xotirada qanday saqlashini bilish',
        'O‘zgaruvchi (variable) tushunchasi bilan tanishish',
      ],
      estimatedMinutes: 20,
      order: 2,
      published: true,
      content: {
        title: 'Kompyuter Qanday Fikrlaydi?',
        learningObjective: 'Kompyuter ma’lumotlarni qanday saqlashini va nima uchun bizga o‘zgaruvchilar kerakligini tushunish.',
        realLifeAnalogy: 'Tasavvur qiling, sizda bir nechta qutilar bor. Bir qutiga "Ism", ikkinchisiga "Yosh" deb yorliq yopishtirdingiz. "Ism" qutisiga "Ali" deb yozilgan qog‘ozni solib qo‘ydingiz. Keyinroq qutini ochib, ichidagi ma’lumotni o‘qishingiz yoki o‘zgartirishingiz mumkin. Dasturlashdagi o‘zgaruvchilar ham aynan shunday yorliqli qutilardir!',
        theory: [
          {
            type: 'heading',
            content: 'Nollar va Birlar (Ikkilik sanoq tizimi)',
          },
          {
            type: 'text',
            content: 'Kompyuter protsessori ichida milliardlab mayda kalitchalar (tranzistorlar) bor. Kalitcha yo o‘chiq bo‘ladi (0), yo yoqiq (1). Barcha videolar, o‘yinlar va matnlar ichkarida faqat 0 va 1 lardan iborat!',
          },
          {
            type: 'heading',
            content: 'O‘zgaruvchilar — xotiradagi qutichalar',
          },
          {
            type: 'text',
            content: 'Dastur ishlash jarayonida biror son yoki matnni eslab qolishi kerak bo‘lsa, biz o‘zgaruvchi (variable) yaratamiz. JavaScript-da o‘zgaruvchi let yoki const so‘zlari yordamida e’lon qilinadi.',
          },
        ],
        interactiveExample: {
          title: 'O‘zgaruvchi yaratish va uning qiymatini chiqarish',
          description: 'Ism va ball o‘zgaruvchilarini yaratib, ularni konsolda ko‘ramiz.',
          language: 'javascript',
          code: `let foydalanuvchi = "Jasur";\nlet ball = 95;\nconsole.log(foydalanuvchi);\nconsole.log(ball);`,
          expectedOutput: 'Jasur\n95',
          lineExplanations: {
            1: 'foydalanuvchi degan quticha ochib, unga Jasur matnini soldik.',
            2: 'ball degan qutichaga 95 sonini saqladik.',
            3: 'console.log(foydalanuvchi) — endi qo‘shtirnoqsiz o‘zgaruvchi nomini yozsak, uning ichidagi qiymat chiqadi.',
          },
        },
        commonMistakes: [
          {
            title: 'O‘zgaruvchi nomini qo‘shtirnoqqa olish',
            wrongCode: 'let yosh = 20;\nconsole.log("yosh");',
            correctCode: 'let yosh = 20;\nconsole.log(yosh);',
            explanation: 'Agar "yosh" deb qo‘shtirnoq bilan yozsangiz, o‘zgaruvchining qiymati (20) emas, so‘zning o‘zi chiqib qoladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-intro-2-1',
            question: 'Dasturlashda o‘zgaruvchi nima uchun kerak?',
            type: 'multiple-choice',
            options: [
              'Faqat kompyuterni o‘chirish uchun',
              'Xotirada ma’lumotlarni saqlash va keyinchalik ishlatish uchun',
              'Faqat internet tezligini oshirish uchun',
              'Faqat viruslardan himoyalanish uchun',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! O‘zgaruvchilar ma’lumotlarni kompyuter xotirasida nom bilan saqlash vositasidir.',
          },
        ],
        summary: 'Siz kompyuter xotirasi qanday ishlashini va let orqali ma’lumotlarni saqlovchi o‘zgaruvchilar yaratishni o‘rgandingiz.',
        nextLessonSlug: 'birinchi-kod-sintaksis',
        nextLessonTitle: 'Birinchi Kod va Sintaksis',
      },
    },
    exercise: {
      id: 'ex-intro-2',
      lessonId: 'les-intro-2',
      title: 'Mening birinchi o‘zgaruvchim',
      description: '`til` nomli o‘zgaruvchi yarating va unga `"JavaScript"` qiymatini bering.',
      instructions: [
        'let kalit so‘zi yordamida til nomli o‘zgaruvchi e’lon qiling.',
        'Unga "JavaScript" qiymatini bering.',
        'console.log(til); orqali uni konsolga chiqaring.',
      ],
      starterCode: `// 1. 'til' o'zgaruvchisini e'lon qiling va "JavaScript" bering:\n\n// 2. Uni konsolga chiqaring:\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-intro-2-1',
          description: 'Konsolga "JavaScript" chiqishi kerak',
          expectedOutput: 'JavaScript',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: O‘zgaruvchini let til = "JavaScript"; deb yozing.',
        '2-bosqich: Konsolga chiqarishda o‘zgaruvchi nomini qo‘shtirnoqsiz yozing.',
        '3-bosqich: To‘liq kod:\nlet til = "JavaScript";\nconsole.log(til);',
      ],
      solutionExplanation: 'let til = "JavaScript"; console.log(til); kodi o‘zgaruvchi ochadi va uni konsolga chiqaradi.',
      passingScore: 100,
      expectedConcepts: ['let', 'variable', 'console.log'],
    },
  },

  // 3-Dars
  {
    lesson: {
      id: 'les-intro-3',
      moduleId: 'mod-intro-1',
      courseId: 'course-intro',
      title: 'Birinchi Kod va Sintaksis',
      slug: 'birinchi-kod-sintaksis',
      description: 'Dasturlash tilining imlo qoidalari: sintaksis, nuqtali vergul va izohlar (comments).',
      objectives: [
        'Sintaksis nima ekanini bilish',
        'Kodda izohlar (comments) yozishni o‘rganish',
        'Matnlarni birlashtirish (string concatenation)ni bajarish',
      ],
      estimatedMinutes: 15,
      order: 3,
      published: true,
      content: {
        title: 'Birinchi Kod va Sintaksis',
        learningObjective: 'Dasturlash tilining grammatik qoidalari (sintaksis) va kodni toza yozishni o‘rganish.',
        realLifeAnalogy: 'Har bir inson tilida imlo qoidalari bor: masalan, gap boshida katta harf, oxirida nuqta qo‘yiladi. Dasturlashda ham qoidalarga qat’iy amal qilinishi shart.',
        theory: [
          {
            type: 'heading',
            content: 'Sintaksis nima?',
          },
          {
            type: 'text',
            content: 'Sintaksis — bu dasturlash tilining qoidalari to‘plami. Qavslar, qo‘shtirnoqlar, nuqtali vergullar qayerda va qanday qo‘yilishini belgilaydi.',
          },
          {
            type: 'heading',
            content: 'Izohlar (Comments) — o‘zimiz uchun eslatma',
          },
          {
            type: 'text',
            content: 'Kod ichida kompyuter e’tibor bermaydigan, faqat dasturchilar o‘qishi uchun yoziladigan matnlar izoh (comment) deyiladi. JavaScriptda bir qatorli izoh // bilan boshlanadi.',
          },
        ],
        interactiveExample: {
          title: 'Matnlarni birlashtirish va izohlar',
          description: 'Izoh yozish va ikkita matnni birlashtirish.',
          language: 'javascript',
          code: `// Bu dastur salomlashuv yaratadi\nlet ism = "Temur";\nlet xabar = "Salom, " + ism + "!";\nconsole.log(xabar);`,
          expectedOutput: 'Salom, Temur!',
          lineExplanations: {
            1: '// bilan boshlangan qator e’tiborga olinmaydi.',
            3: '+ belgisi yordamida ikkita matn bir-biriga ulanadi.',
          },
        },
        commonMistakes: [
          {
            title: 'Katta-kichik harflarni adashtirish',
            wrongCode: 'let ism = "Anvar";\nconsole.log(Ism);',
            correctCode: 'let ism = "Anvar";\nconsole.log(ism);',
            explanation: 'JavaScriptda "ism" va "Ism" ikkita butunlay boshqa nom hisoblanadi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-intro-3-1',
            question: 'JavaScriptda bir qatorli izoh qaysi belgi bilan yoziladi?',
            type: 'multiple-choice',
            options: [
              '# belgi',
              '// ikkita qiya chiziq',
              '<!-- belgi -->',
              '** ikkita yulduzcha',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! JavaScriptda // belgisi bir qatorli izoh yozish uchun xizmat qiladi.',
          },
        ],
        summary: 'Sintaksis qoidalari, izohlar va satrlarni birlashtirishni o‘rgandingiz.',
        nextLessonSlug: 'xatolar-bilan-ishlash',
        nextLessonTitle: 'Xatolar (Buglar) Bilan Ishlash',
      },
    },
    exercise: {
      id: 'ex-intro-3',
      lessonId: 'les-intro-3',
      title: 'Matnlarni ulash',
      description: '`kurs` o‘zgaruvchisiga `"CodeQuest"` qiymatini bering va `"Xush kelibsiz: CodeQuest"` deb chiqaring.',
      instructions: [
        'let kurs = "CodeQuest"; deb yozing.',
        'console.log("Xush kelibsiz: " + kurs); orqali matnlarni birlashtirib chiqaring.',
      ],
      starterCode: `let kurs = "CodeQuest";\n// Quyida "Xush kelibsiz: " matniga kurs o'zgaruvchisini ulab chiqaring:\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-intro-3-1',
          description: '"Xush kelibsiz: CodeQuest" matni chiqishi kerak',
          expectedOutput: 'Xush kelibsiz: CodeQuest',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: Matnlarni ulash uchun + belgisidan foydalaning.',
        '2-bosqich: console.log("Xush kelibsiz: " + kurs);',
      ],
      solutionExplanation: 'console.log("Xush kelibsiz: " + kurs); kodi matnlarni ulaydi va natijani konsolga yozadi.',
      passingScore: 100,
      expectedConcepts: ['concatenation', 'variables'],
    },
  },

  // 4-Dars
  {
    lesson: {
      id: 'les-intro-4',
      moduleId: 'mod-intro-1',
      courseId: 'course-intro',
      title: 'Xatolar (Buglar) Bilan Ishlash',
      slug: 'xatolar-bilan-ishlash',
      description: 'Dasturlashda xato qilish tabiiy holat! Xato xabarlarini o‘qish va ularni oson tuzatish san’ati.',
      objectives: [
        'Xato (Bug) tushunchasi va uning tarixini bilish',
        'Sintaksis xatolarini konsolda o‘qishni o‘rganish',
        'Xatodan qo‘rqmasdan, uni to‘g‘rilashga odatlanish',
      ],
      estimatedMinutes: 20,
      order: 4,
      published: true,
      content: {
        title: 'Xatolar (Buglar) Bilan Ishlash',
        learningObjective: 'Koddagi xatolar xabarini to‘g‘ri o‘qish va mustaqil tuzatish qobiliyatini rivojlantirish.',
        realLifeAnalogy: 'Kichkintoy yura boshlaganida yuzlab marta yiqiladi. Dasturchining ko‘p vaqti xatolarni qidirish va to‘g‘rilash (debugging) bilan o‘tadi. Xato — bu o‘rganishning eng yaxshi ustozi!',
        theory: [
          {
            type: 'heading',
            content: 'Bug va Debugging nima?',
          },
          {
            type: 'text',
            content: 'Koddagi nuqsonlar Bug, ularni bartaraf qilish esa Debugging deyiladi.',
          },
          {
            type: 'heading',
            content: 'Eng ko‘p uchraydigan xatolar',
          },
          {
            type: 'text',
            content: '1. SyntaxError — yozuv qoidasi buzilgan.\n2. ReferenceError — hali mavjud bo‘lmagan o‘zgaruvchi chaqirilgan.',
          },
        ],
        interactiveExample: {
          title: 'Xatoni aniqlash va to‘g‘rilash',
          description: 'Quyida to‘g‘ri yozilgan kod namunasi ko‘rsatilgan.',
          language: 'javascript',
          code: `let xabar = "Xatolardan qo'rqmang!";\nconsole.log(xabar);`,
          expectedOutput: "Xatolardan qo'rqmang!",
          lineExplanations: {
            1: 'Qo‘shtirnoq to‘liq ochilgan va yopilgan.',
            2: 'console.log qavsi to‘liq yopilgan.',
          },
        },
        commonMistakes: [
          {
            title: 'Mavjud bo‘lmagan o‘zgaruvchini chaqirish',
            wrongCode: 'console.log(ball);',
            correctCode: 'let ball = 100;\nconsole.log(ball);',
            explanation: 'ReferenceError: ball is not defined xatosi chiqadi, chunki "ball" oldindan e’lon qilinmagan.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-intro-4-1',
            question: 'Agar qavs yoki qo‘shtirnoq yopilmay qolsa, qanday xato chiqadi?',
            type: 'multiple-choice',
            options: [
              'SyntaxError (Sintaksis xatosi)',
              'MemoryError',
              'NoInternetError',
              'Hech qanday xato chiqmaydi',
            ],
            correctAnswer: 0,
            explanation: 'To‘g‘ri! Sintaksis xatosi kod yozish qoidalari buzilganda yuz beradi.',
          },
        ],
        summary: 'Siz Dasturlashga Kirish kursini muvaffaqiyatli yakunladingiz!',
        nextLessonSlug: 'html-nima-va-sahifa-skeleti',
        nextLessonTitle: 'HTML Nima va Sahifa Skeleti',
      },
    },
    exercise: {
      id: 'ex-intro-4',
      lessonId: 'les-intro-4',
      title: 'Buzilgan kodni tuzating (Bug fixing)',
      description: 'Quyidagi kodda xatolik bor. Uni topib, to‘g‘rilang.',
      instructions: [
        'Koddagi sintaksis xatosini aniqlang.',
        'Kodni ishga tushiring va "Muvaffaqiyat!" so‘zi konsolga chiqishini ta’minlang.',
      ],
      starterCode: `// Bu kodda sintaksis xatosi bor, uni to'g'rilang:\nconsole.log("Muvaffaqiyat!"\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-intro-4-1',
          description: 'Konsolga "Muvaffaqiyat!" chiqishi kerak',
          expectedOutput: 'Muvaffaqiyat!',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: console.log( ochilgan qavsni tekshiring.',
        '2-bosqich: Satr oxirida yopiluvchi qavs ); qolib ketgan.',
        '3-bosqich: To‘g‘ri yozuv: console.log("Muvaffaqiyat!");',
      ],
      solutionExplanation: 'Qavs yopilmagani sababli SyntaxError yuz bergan edi. Yopuvchi ); qo‘shilishi bilan dastur ishladi.',
      passingScore: 100,
      expectedConcepts: ['debugging', 'syntax'],
    },
  },
];
