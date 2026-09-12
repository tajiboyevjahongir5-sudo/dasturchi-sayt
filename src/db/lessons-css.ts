import type { Lesson, Exercise } from '@/types';

export const CSS_LESSONS: { lesson: Lesson; exercise: Exercise }[] = [
  // 1-Dars
  {
    lesson: {
      id: 'les-css-1',
      moduleId: 'mod-css-1',
      courseId: 'course-css',
      title: 'CSS Nima va Selektorlar?',
      slug: 'css-nima-va-selektorlar',
      description: 'CSS (Cascading Style Sheets) tili, ranglar, shriftlar va elementlarni tanlab olish (selectors).',
      objectives: [
        'CSS vazifasini tushunish',
        'Teg, sinf (class) va identifikator (id) selektorlarini farqlash',
        'color va background-color xususiyatlarini qo‘llash',
      ],
      estimatedMinutes: 20,
      order: 1,
      published: true,
      content: {
        title: 'CSS Nima va Selektorlar?',
        learningObjective: 'HTML elementlarini CSS orqali tanlab olib, ularga rang va uslub berishni o‘rganish.',
        realLifeAnalogy: 'HTML — bu odamning skeleti bo‘lsa, CSS — uning ustidagi kiyimlari, ranglari va ko‘rinishidir.',
        theory: [
          {
            type: 'heading',
            content: 'CSS sintaksisi',
          },
          {
            type: 'text',
            content: 'selektor {\n  xususiyat: qiymat;\n}',
          },
          {
            type: 'heading',
            content: 'Selektor turlari',
          },
          {
            type: 'text',
            content: '1. Teg selektori: h1 { color: red; }\n2. Klass selektori: .matn { color: blue; }\n3. ID selektori: #asosiy { color: green; }',
          },
        ],
        interactiveExample: {
          title: 'Elementga rang berish',
          description: 'Sarlavhaga ko‘k rang va fon rangini beramiz.',
          language: 'css',
          code: `h1 {\n  color: #2563eb;\n  background-color: #dbeafe;\n  padding: 10px;\n}`,
          expectedOutput: 'Ko‘k rangli sarlavha',
          lineExplanations: {
            2: 'color — matnning o‘z rangini belgilaydi.',
            3: 'background-color — orqa fon rangini belgilaydi.',
          },
        },
        commonMistakes: [
          {
            title: 'Klass oldiga nuqta qo‘yishni unutish',
            wrongCode: 'tugma {\n  color: red;\n}',
            correctCode: '.tugma {\n  color: red;\n}',
            explanation: 'Klasslarga murojaat qilish uchun nuqta (.tugma) qo‘yilishi shart.',
            language: 'css',
          },
        ],
        quiz: [
          {
            id: 'q-css-1-1',
            question: 'CSS da class selektori qaysi belgi bilan boshlanadi?',
            type: 'multiple-choice',
            options: ['# (panjara)', '. (nuqta)', '@ (kuchukcha)', '$ (dollar)'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Klasslar nuqta (.) bilan boshlanadi.',
          },
        ],
        summary: 'Siz CSS sintaksisi, selektorlar va rang berishni o‘rgandingiz.',
        nextLessonSlug: 'box-model-asoslari',
        nextLessonTitle: 'Box Model Asoslari (Margin, Padding, Border)',
      },
    },
    exercise: {
      id: 'ex-css-1',
      lessonId: 'les-css-1',
      title: 'Sarlavhaga rang bering',
      description: '`h1` selektoriga `color: red;` xususiyatini yozing.',
      instructions: [
        'h1 selektorini yozing.',
        'Figurali qavs oching {}.',
        'Ichiga color: red; yozing.',
      ],
      starterCode: `/* Bu yerda h1 ga qizil rang bering */\n`,
      language: 'css',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-css-1-1',
          description: 'h1 uchun color: red; bo‘lishi kerak',
          expectedOutput: 'color: red',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: h1 { ... }',
        '2-bosqich: h1 {\n  color: red;\n}',
      ],
      solutionExplanation: 'h1 { color: red; } barcha h1 larni qizil rangga bo‘yaydi.',
      passingScore: 100,
      expectedConcepts: ['css', 'selector', 'color'],
    },
  },

  // 2-Dars
  {
    lesson: {
      id: 'les-css-2',
      moduleId: 'mod-css-1',
      courseId: 'course-css',
      title: 'Box Model Asoslari (Margin, Padding, Border)',
      slug: 'box-model-asoslari',
      description: 'Brauzerdagi har bir element qutidir! Ichki va tashqi bo‘shliqlar hamda hoshiyalar.',
      objectives: [
        'Box Model tushunchasini to‘liq o‘rganish',
        'Padding va Margin farqini bilish',
        'Border qo‘yishni o‘rganish',
      ],
      estimatedMinutes: 20,
      order: 2,
      published: true,
      content: {
        title: 'Box Model Asoslari (Margin, Padding, Border)',
        learningObjective: 'Elementlar atrofidagi masofalarni boshqarish.',
        realLifeAnalogy: 'Rasm romi (ramka): Rasm — Content, oq bo‘shliq — Padding, ramka — Border, devordagi boshqa narsalar bilan masofa — Margin.',
        theory: [
          {
            type: 'heading',
            content: 'Box Model 4 qismdan iborat',
          },
          {
            type: 'text',
            content: '1. Content — kontentning o‘zi.\n2. Padding — ichki masofa.\n3. Border — ramka.\n4. Margin — tashqi masofa.',
          },
        ],
        interactiveExample: {
          title: 'Box model xususiyatlari',
          description: 'Karta ko‘rinishidagi element.',
          language: 'css',
          code: `.karta {\n  padding: 20px;\n  border: 2px solid #3b82f6;\n  margin: 15px;\n}`,
          expectedOutput: 'Karta ko‘rinishi',
          lineExplanations: {
            2: 'padding: 20px — ichki bo‘shliq.',
            3: 'border: 2px solid — ramka.',
            4: 'margin: 15px — tashqi surilish.',
          },
        },
        commonMistakes: [
          {
            title: 'Margin va Paddingni almashtirib qo‘yish',
            wrongCode: '/* Fon rangi ichki masofada ko‘rinsin desangiz margin ishlatmang */',
            correctCode: '/* Fon rangi ichki masofada ko‘rinishi uchun padding ishlatiladi */',
            explanation: 'Padding elementi fon rangiga kiradi, Margin esa tashqi bo‘shliqdir.',
            language: 'css',
          },
        ],
        quiz: [
          {
            id: 'q-css-2-1',
            question: 'Elementning ichidagi matn bilan ramkasi orasidagi ichki masofa nima deyiladi?',
            type: 'multiple-choice',
            options: ['Margin', 'Padding', 'Border', 'Outline'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Ichki masofa — bu Padding.',
          },
        ],
        summary: 'Siz Box Model ustunlarini o‘rgandingiz.',
        nextLessonSlug: 'flexbox-asoslari',
        nextLessonTitle: 'Flexbox Asoslari (Moslashuvchan Tartib)',
      },
    },
    exercise: {
      id: 'ex-css-2',
      lessonId: 'les-css-2',
      title: 'Ichki bo‘shliq bering (Padding)',
      description: '`.quti` klassiga `padding: 20px;` qiymatini bering.',
      instructions: [
        '.quti selektorini yozing.',
        'Ichiga padding: 20px; qo‘shing.',
      ],
      starterCode: `/* .quti klassiga 20px padding bering */\n`,
      language: 'css',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-css-2-1',
          description: '.quti { padding: 20px; } bo‘lishi kerak',
          expectedOutput: 'padding: 20px',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: .quti {\n  padding: 20px;\n}',
      ],
      solutionExplanation: 'padding: 20px; to‘rt tomondan 20px bo‘shliq beradi.',
      passingScore: 100,
      expectedConcepts: ['padding', 'box-model'],
    },
  },

  // 3-Dars
  {
    lesson: {
      id: 'les-css-3',
      moduleId: 'mod-css-1',
      courseId: 'course-css',
      title: 'Flexbox Asoslari (Moslashuvchan Tartib)',
      slug: 'flexbox-asoslari',
      description: 'Elementlarni yonma-yon qo‘yish, markazlashtirish va teng taqsimlashning eng kuchli quroli.',
      objectives: [
        'display: flex ning ishlash mexanizmini tushunish',
        'justify-content va align-items ni bilish',
      ],
      estimatedMinutes: 25,
      order: 3,
      published: true,
      content: {
        title: 'Flexbox Asoslari (Moslashuvchan Tartib)',
        learningObjective: 'Elementlarni bir qatorga chiroyli tizish va o‘rtaga joylashtirishni o‘rganish.',
        realLifeAnalogy: 'Bir qatorda turgan elementlarni tartibga soluvchi o‘qituvchi kabi.',
        theory: [
          {
            type: 'heading',
            content: 'Flexbox qanday ishga tushadi?',
          },
          {
            type: 'text',
            content: 'Ota elementga display: flex; beriladi. Shunda bolalari avtomatik yonma-yon tiziladi.',
          },
        ],
        interactiveExample: {
          title: 'Markazlashtirilgan konteyner',
          description: 'Elementlarni o‘rtaga joylash.',
          language: 'css',
          code: `.konteyner {\n  display: flex;\n  justify-content: center;\n  gap: 10px;\n}`,
          expectedOutput: 'Yonma-yon va markazda',
          lineExplanations: {
            2: 'display: flex; qatorga tizadi.',
            3: 'justify-content o‘q bo‘ylab markazlashtiradi.',
          },
        },
        commonMistakes: [
          {
            title: 'display: flex ni bolaga berish',
            wrongCode: '/* Bolaga berilsa ishlamaydi */',
            correctCode: '/* Ota elementga berish kerak */',
            explanation: 'display: flex bolalarning otasiga berilishi kerak.',
            language: 'css',
          },
        ],
        quiz: [
          {
            id: 'q-css-3-1',
            question: 'Flexbox da elementlarni gorizontal o‘rtaga qo‘yish qaysi xususiyat bilan bajariladi?',
            type: 'multiple-choice',
            options: ['text-align: center', 'justify-content: center', 'align-items: center', 'float: center'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! justify-content: center gorizontal markazlashtiradi.',
          },
        ],
        summary: 'Siz Flexbox yordamida elementlarni tartiblashni o‘rgandingiz.',
        nextLessonSlug: 'grid-layout-asoslari',
        nextLessonTitle: 'Grid Layout Asoslari',
      },
    },
    exercise: {
      id: 'ex-css-3',
      lessonId: 'les-css-3',
      title: 'Flexbox konteyner yarating',
      description: '`.menu` klassiga `display: flex;` va `gap: 15px;` xususiyatlarini bering.',
      instructions: [
        '.menu selektorini oching.',
        'display: flex; deb yozing.',
        'gap: 15px; qo‘shing.',
      ],
      starterCode: `/* .menu klassiga display: flex va gap bering */\n`,
      language: 'css',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-css-3-1',
          description: '.menu da display: flex bo‘lishi kerak',
          expectedOutput: 'display: flex',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: .menu { display: flex; gap: 15px; }',
      ],
      solutionExplanation: 'display: flex; bolalarni bir qatorga teradi.',
      passingScore: 100,
      expectedConcepts: ['flexbox', 'gap'],
    },
  },

  // 4-Dars
  {
    lesson: {
      id: 'les-css-4',
      moduleId: 'mod-css-1',
      courseId: 'course-css',
      title: 'Grid Layout Asoslari',
      slug: 'grid-layout-asoslari',
      description: '2 o‘lchamli jadval tuzilishi: ustunlar va qatorlar bilan murakkab maketlar yasash.',
      objectives: [
        'display: grid ning flexbox dan farqini bilish',
        'grid-template-columns va repeat() bilan ishlash',
      ],
      estimatedMinutes: 20,
      order: 4,
      published: true,
      content: {
        title: 'Grid Layout Asoslari',
        learningObjective: 'Saytni ustun va qatorlar to‘ri ko‘rinishida tartiblash.',
        realLifeAnalogy: 'Shaxmat taxtasi yoki Instagram galereyasi kataklari kabi.',
        theory: [
          {
            type: 'heading',
            content: 'CSS Grid qanday ishlaydi?',
          },
          {
            type: 'text',
            content: 'display: grid; va grid-template-columns: repeat(3, 1fr); orqali 3 ta teng ustun yaratiladi.',
          },
        ],
        interactiveExample: {
          title: '3 ustunli to‘r',
          description: 'Galereyani 3 ta ustunga bo‘lish.',
          language: 'css',
          code: `.galereya {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}`,
          expectedOutput: '3 ta ustunli grid',
          lineExplanations: {
            2: 'display: grid; to‘r tizimini yoqadi.',
            3: 'repeat(3, 1fr) — 3 ta teng ustun.',
          },
        },
        commonMistakes: [
          {
            title: 'Kataklar orasini margin bilan berish',
            wrongCode: '/* Har bir elementga margin berish */',
            correctCode: '/* Konteynerga gap: 20px; berish */',
            explanation: 'Grid da masofalarni gap bilan berish qulay.',
            language: 'css',
          },
        ],
        quiz: [
          {
            id: 'q-css-4-1',
            question: '3 ta teng ustun yaratish uchun qaysi ifoda to‘g‘ri?',
            type: 'multiple-choice',
            options: [
              'grid-template-columns: repeat(3, 1fr)',
              'grid-columns: 3',
              'columns: 3fr',
              'display: columns-3',
            ],
            correctAnswer: 0,
            explanation: 'To‘g‘ri! repeat(3, 1fr) 3 ta teng ustun beradi.',
          },
        ],
        summary: 'Siz CSS Grid asoslarini o‘rgandingiz.',
        nextLessonSlug: 'responsive-dizayn-va-media-queries',
        nextLessonTitle: 'Responsive Dizayn va Media Queries',
      },
    },
    exercise: {
      id: 'ex-css-4',
      lessonId: 'les-css-4',
      title: '2 ustunli Grid yarating',
      description: '`.grid-quti` klassiga `display: grid;` va `grid-template-columns: 1fr 1fr;` bering.',
      instructions: [
        '.grid-quti selektorini yozing.',
        'display: grid; bering.',
        'grid-template-columns: 1fr 1fr; qo‘shing.',
      ],
      starterCode: `/* .grid-quti klassiga 2 ustunli grid bering */\n`,
      language: 'css',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-css-4-1',
          description: 'grid-template-columns bo‘lishi kerak',
          expectedOutput: 'grid-template-columns',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: .grid-quti { display: grid; grid-template-columns: 1fr 1fr; }',
      ],
      solutionExplanation: 'grid-template-columns: 1fr 1fr; ekranni 2 ta teng ustunga ajratadi.',
      passingScore: 100,
      expectedConcepts: ['grid', 'grid-template-columns'],
    },
  },

  // 5-Dars
  {
    lesson: {
      id: 'les-css-5',
      moduleId: 'mod-css-1',
      courseId: 'course-css',
      title: 'Responsive Dizayn va Media Queries',
      slug: 'responsive-dizayn-va-media-queries',
      description: 'Saytingiz telefon, planshet va kompyuterda birdek chiroyli ko‘rinsin!',
      objectives: [
        'Responsive dizayn mohiyatini bilish',
        '@media (max-width: ...) dan foydalanish',
      ],
      estimatedMinutes: 25,
      order: 5,
      published: true,
      content: {
        title: 'Responsive Dizayn va Media Queries',
        learningObjective: 'Har qanday ekran o‘lchamiga moslashuvchi saytlar yaratish.',
        realLifeAnalogy: 'Suv har qanday idish shakliga moslashgani kabi, responsive sayt ham har qanday ekranga moslashadi.',
        theory: [
          {
            type: 'heading',
            content: 'Media Query nima?',
          },
          {
            type: 'text',
            content: '@media qoidasi ekran kengligiga qarab boshqa stillarni qo‘llash imkonini beradi.',
          },
        ],
        interactiveExample: {
          title: 'Mobil moslashuvchanlik',
          description: 'Kichik ekran uchun fon.',
          language: 'css',
          code: `@media (max-width: 600px) {\n  body {\n    background-color: #f1f5f9;\n  }\n}`,
          expectedOutput: 'Mobil uslub',
          lineExplanations: {
            1: 'max-width: 600px — ekran 600px dan kichik bo‘lganda ishlaydi.',
          },
        },
        commonMistakes: [
          {
            title: 'Qat’iy piksellar berib qo‘yish',
            wrongCode: 'width: 1200px; /* Telefonda sig‘maydi */',
            correctCode: 'max-width: 100%;',
            explanation: 'Kichik ekranlarda foiz yoki max-width ishlatish zarur.',
            language: 'css',
          },
        ],
        quiz: [
          {
            id: 'q-css-5-1',
            question: 'Mobil ekranlar uchun shartli uslub yozish qaysi qoida bilan boshlanadi?',
            type: 'multiple-choice',
            options: ['@screen', '@media', '@mobile', '@responsive'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! @media qoidasi ishlatiladi.',
          },
        ],
        summary: 'Tabriklaymiz! Siz CSS asoslari kursini yakunladingiz.',
        nextLessonSlug: 'ozgaruvchilar-va-malumot-turlari',
        nextLessonTitle: 'O‘zgaruvchilar va Ma’lumot Turlari',
      },
    },
    exercise: {
      id: 'ex-css-5',
      lessonId: 'les-css-5',
      title: 'Media Query yozing',
      description: 'Ekran kengligi 768px dan kichik bo‘lganda `body` fonini o‘zgartiruvchi `@media (max-width: 768px)` qoidasini yozing.',
      instructions: [
        '@media (max-width: 768px) { deb oching.',
        'Ichiga body { font-size: 14px; } yozing.',
        '} bilan yoping.',
      ],
      starterCode: `/* Bu yerda @media (max-width: 768px) qoidasini yozing */\n`,
      language: 'css',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-css-5-1',
          description: '@media (max-width: 768px) bo‘lishi kerak',
          expectedOutput: '@media',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: @media (max-width: 768px) {\n  body { font-size: 14px; }\n}',
      ],
      solutionExplanation: '@media planshet va telefon ekranlari uchun maxsus qoidalarni belgilaydi.',
      passingScore: 100,
      expectedConcepts: ['media-queries', 'responsive'],
    },
  },
];
