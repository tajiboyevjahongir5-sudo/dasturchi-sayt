import type { Lesson, Exercise } from '@/types';

export const JS_LESSONS: { lesson: Lesson; exercise: Exercise }[] = [
  // 1-Dars
  {
    lesson: {
      id: 'les-js-1',
      moduleId: 'mod-js-1',
      courseId: 'course-js',
      title: 'O‘zgaruvchilar va Ma’lumot Turlari',
      slug: 'ozgaruvchilar-va-malumot-turlari',
      description: 'let, const, sonlar, satrlar (string) va mantiqiy (boolean) qiymatlar bilan ishlash.',
      objectives: [
        'let va const farqini bilish',
        'String, Number, Boolean turlarini tushunish',
      ],
      estimatedMinutes: 20,
      order: 1,
      published: true,
      content: {
        title: 'O‘zgaruvchilar va Ma’lumot Turlari',
        learningObjective: 'JavaScript-da ma’lumotlarni to‘g‘ri saqlash va turlarini ajratish.',
        realLifeAnalogy: 'Har xil narsalarni har xil idishlarda saqlaymiz: suv ko‘zaga, ism matnga, yosh songa mos keladi.',
        theory: [
          {
            type: 'heading',
            content: 'let va const farqi',
          },
          {
            type: 'text',
            content: 'let o‘zgaruvchan qiymat, const esa o‘zgarmas (konstanta) uchun ishlatiladi.',
          },
        ],
        interactiveExample: {
          title: 'Ma’lumot turlari',
          description: 'O‘zgaruvchilar yaratamiz.',
          language: 'javascript',
          code: `const platforma = "CodeQuest";\nlet darsRaqami = 1;\nconsole.log(platforma);\nconsole.log("Dars:", darsRaqami);`,
          expectedOutput: 'CodeQuest\nDars: 1',
          lineExplanations: {
            1: 'const o‘zgarmas o‘zgaruvchi.',
            2: 'let keyinroq qiymati o‘zgarishi mumkin bo‘lgan o‘zgaruvchi.',
          },
        },
        commonMistakes: [
          {
            title: 'const ni qayta o‘zgartirish',
            wrongCode: 'const PI = 3.14;\nPI = 3.15;',
            correctCode: 'let ball = 10;\nball = 20;',
            explanation: 'const o‘zgarmas hisoblanadi. O‘zgarishi kerak bo‘lsa let ishlatiladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-js-1-1',
            question: 'O‘zgarmas qiymat e’lon qilish uchun qaysi kalit so‘z tanlanadi?',
            type: 'multiple-choice',
            options: ['var', 'let', 'const', 'static'],
            correctAnswer: 2,
            explanation: 'To‘g‘ri! const o‘zgarmas qiymatlar uchun xizmat qiladi.',
          },
        ],
        summary: 'Siz let, const va asosiy ma’lumot turlarini o‘rgandingiz.',
        nextLessonSlug: 'shartlar-va-mantiqiy-operatorlar',
        nextLessonTitle: 'Shartlar va Mantiqiy Operatorlar (if/else)',
      },
    },
    exercise: {
      id: 'ex-js-1',
      lessonId: 'les-js-1',
      title: 'Ism va yosh o‘zgaruvchilari',
      description: '`const ism = "Sardor";` deb e’lon qiling va `console.log(ism);` qiling.',
      instructions: [
        'const ism = "Sardor"; deb yozing.',
        'console.log(ism); orqali ismni konsolga chiqaring.',
      ],
      starterCode: `// Bu yerda ism o'zgaruvchisini yarating va konsolga chiqaring:\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-js-1-1',
          description: 'Konsolga "Sardor" chiqishi kerak',
          expectedOutput: 'Sardor',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: const ism = "Sardor";',
        '2-bosqich: console.log(ism);',
      ],
      solutionExplanation: 'const ism = "Sardor"; console.log(ism); to‘g‘ri yechimdir.',
      passingScore: 100,
      expectedConcepts: ['let', 'const', 'console.log'],
    },
  },

  // 2-Dars
  {
    lesson: {
      id: 'les-js-2',
      moduleId: 'mod-js-1',
      courseId: 'course-js',
      title: 'Shartlar va Mantiqiy Operatorlar (if/else)',
      slug: 'shartlar-va-mantiqiy-operatorlar',
      description: 'Dasturga mustaqil qaror qabul qilishni o‘rgatish: if, else va taqqoslashlar.',
      objectives: [
        'if va else bloklarini tuzish',
        '=== orqali tekshirish',
      ],
      estimatedMinutes: 25,
      order: 2,
      published: true,
      content: {
        title: 'Shartlar va Mantiqiy Operatorlar (if/else)',
        learningObjective: 'Turli shartlarga qarab dastur xatti-harakatini o‘zgartirish.',
        realLifeAnalogy: 'Agar yomg‘ir yog‘sa — soyabon olasiz, aks holda — ko‘zoynak olasiz.',
        theory: [
          {
            type: 'heading',
            content: 'if / else strukturasi',
          },
          {
            type: 'text',
            content: 'if (ball >= 70) { console.log("O‘tdingiz!"); } else { console.log("Qayta topshirish kerak"); }',
          },
        ],
        interactiveExample: {
          title: 'Ballni tekshirish',
          description: 'Shart orqali baholash.',
          language: 'javascript',
          code: `let ball = 85;\nif (ball >= 70) {\n  console.log("Yaxshi baho!");\n}`,
          expectedOutput: 'Yaxshi baho!',
          lineExplanations: {
            2: 'Shart rost bo‘lsa ichidagi kod bajariladi.',
          },
        },
        commonMistakes: [
          {
            title: '= va === ni adashtirish',
            wrongCode: 'if (yosh = 18) { ... }',
            correctCode: 'if (yosh === 18) { ... }',
            explanation: 'Solishtirish uchun === ishlatiladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-js-2-1',
            question: 'JavaScript da ikkita qiymatni tenglikka tekshirish qaysi operator bilan amalga oshadi?',
            type: 'multiple-choice',
            options: ['=', '==', '===', 'equals'],
            correctAnswer: 2,
            explanation: 'To‘g‘ri! Qat’iy tenglik uchun === ishlatiladi.',
          },
        ],
        summary: 'Siz if va else shartli mantiqni o‘rgandingiz.',
        nextLessonSlug: 'sikllar-va-takrorlanish',
        nextLessonTitle: 'Sikllar va Takrorlanish (for, while)',
      },
    },
    exercise: {
      id: 'ex-js-2',
      lessonId: 'les-js-2',
      title: 'Kirish huquqini tekshiring',
      description: '`let yosh = 20;` deb yozing. Agar yosh >= 18 bo‘lsa `"Ruxsat berildi"` deb chiqaring.',
      instructions: [
        'let yosh = 20; e’lon qiling.',
        'if (yosh >= 18) shartini yozing.',
        'console.log("Ruxsat berildi"); qiling.',
      ],
      starterCode: `let yosh = 20;\n// Agar yosh 18 dan katta yoki teng bo'lsa, "Ruxsat berildi" chiqaring:\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-js-2-1',
          description: 'Konsolga "Ruxsat berildi" chiqishi kerak',
          expectedOutput: 'Ruxsat berildi',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: if (yosh >= 18) {\n  console.log("Ruxsat berildi");\n}',
      ],
      solutionExplanation: 'if bloki shart to‘g‘ri bo‘lganda xabarni chiqaradi.',
      passingScore: 100,
      expectedConcepts: ['if', 'comparison'],
    },
  },

  // 3-Dars
  {
    lesson: {
      id: 'les-js-3',
      moduleId: 'mod-js-1',
      courseId: 'course-js',
      title: 'Sikllar va Takrorlanish (for, while)',
      slug: 'sikllar-va-takrorlanish',
      description: 'Bir xil amalni yuzlab marta qo‘lda yozmasdan kompyuterga bajartirish: for sikli.',
      objectives: [
        'for sikli ishlashini bilish',
        'Hisoblagich (i++) dan foydalanish',
      ],
      estimatedMinutes: 20,
      order: 3,
      published: true,
      content: {
        title: 'Sikllar va Takrorlanish (for, while)',
        learningObjective: 'Takrorlanuvchi amallarni for sikli bilan avtomatlashtirish.',
        realLifeAnalogy: 'Stadion atrofida 5 marta sanab yugurish kabi.',
        theory: [
          {
            type: 'heading',
            content: 'for sikli sintaksisi',
          },
          {
            type: 'text',
            content: 'for (let i = 1; i <= 5; i++) { console.log(i); }',
          },
        ],
        interactiveExample: {
          title: '1 dan 3 gacha sanash',
          description: 'Sikl orqali qadamlar.',
          language: 'javascript',
          code: `for (let i = 1; i <= 3; i++) {\n  console.log("Qadam:", i);\n}`,
          expectedOutput: 'Qadam: 1\nQadam: 2\nQadam: 3',
          lineExplanations: {
            1: 'i har bir aylanishda 1 ga oshadi.',
          },
        },
        commonMistakes: [
          {
            title: 'Qadamni yozishni unutish',
            wrongCode: 'for (let i = 0; i < 5; ) { ... }',
            correctCode: 'for (let i = 0; i < 5; i++) { ... }',
            explanation: 'i++ bo‘lmasa cheksiz sikl yuz beradi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-js-3-1',
            question: 'i++ amali o‘zgaruvchini nechtaga oshiradi?',
            type: 'multiple-choice',
            options: ['1 taga', '2 taga', '10 taga', 'Oshirmaydi'],
            correctAnswer: 0,
            explanation: 'To‘g‘ri! i++ qiymatni 1 taga oshiradi.',
          },
        ],
        summary: 'Siz for siklining ishlashini o‘rgandingiz.',
        nextLessonSlug: 'funksiyalar-va-qayta-ishlatish',
        nextLessonTitle: 'Funksiyalar va Kodni Qayta Ishlatish',
      },
    },
    exercise: {
      id: 'ex-js-3',
      lessonId: 'les-js-3',
      title: '1 dan 3 gacha konsolga chiqaring',
      description: '`for` sikli yordamida 1, 2 va 3 sonlarini alohida qatorlarda chiqaring.',
      instructions: [
        'for (let i = 1; i <= 3; i++) siklini yozing.',
        'Sikl tanasida console.log(i); qiling.',
      ],
      starterCode: `// Bu yerda for sikli orqali 1 dan 3 gacha sonlarni chiqaring:\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-js-3-1',
          description: 'Konsolga 1, 2, 3 chiqishi kerak',
          expectedOutput: '1\n2\n3',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}',
      ],
      solutionExplanation: 'for sikli sonlarni avtomatik sanab chiqaradi.',
      passingScore: 100,
      expectedConcepts: ['for', 'loops'],
    },
  },

  // 4-Dars
  {
    lesson: {
      id: 'les-js-4',
      moduleId: 'mod-js-1',
      courseId: 'course-js',
      title: 'Funksiyalar va Kodni Qayta Ishlatish',
      slug: 'funksiyalar-va-qayta-ishlatish',
      description: 'Bir marta yozib, istalgan joyda qayta chaqirish: function, parametrlar va return.',
      objectives: [
        'Funksiya e’lon qilish va chaqirishni bilish',
        'return orqali natija qaytarish',
      ],
      estimatedMinutes: 25,
      order: 4,
      published: true,
      content: {
        title: 'Funksiyalar va Kodni Qayta Ishlatish',
        learningObjective: 'Kodni bo‘laklarga ajratib, ularni qayta-qayta chaqirish.',
        realLifeAnalogy: 'Sharbat chiqargich mashinasi: meva solasiz (parametr), sharbat chiqadi (return).',
        theory: [
          {
            type: 'heading',
            content: 'Funksiya sintaksisi',
          },
          {
            type: 'text',
            content: 'function qoshish(a, b) { return a + b; }',
          },
        ],
        interactiveExample: {
          title: 'Yig‘indini hisoblash',
          description: 'Funksiya natija qaytaradi.',
          language: 'javascript',
          code: `function qosh(a, b) {\n  return a + b;\n}\nconsole.log(qosh(10, 20));`,
          expectedOutput: '30',
          lineExplanations: {
            2: 'return natijani chaqiruvchiga beradi.',
          },
        },
        commonMistakes: [
          {
            title: 'return ni yozishni unutish',
            wrongCode: 'function kopaytir(a, b) { a * b; }',
            correctCode: 'function kopaytir(a, b) { return a * b; }',
            explanation: 'return bo‘lmasa funksiya undefined qaytaradi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-js-4-1',
            question: 'Funksiya natijasini tashqariga uzatuvchi kalit so‘z nima?',
            type: 'multiple-choice',
            options: ['give', 'output', 'return', 'send'],
            correctAnswer: 2,
            explanation: 'To‘g‘ri! return qiymat qaytaradi.',
          },
        ],
        summary: 'Siz funksiyalar va return operatorini o‘rgandingiz.',
        nextLessonSlug: 'dom-bilan-ishlash-va-hodisalar',
        nextLessonTitle: 'DOM Bilan Ishlash va Hodisalar (Events)',
      },
    },
    exercise: {
      id: 'ex-js-4',
      lessonId: 'les-js-4',
      title: 'Kvadratini hisoblovchi funksiya',
      description: '`kvadrat(son)` nomli funksiya yarating va `return son * son;` qiling. So‘ng `console.log(kvadrat(5));` qiling.',
      instructions: [
        'function kvadrat(son) { deb oching.',
        'return son * son; yozing.',
        '} bilan yoping.',
        'console.log(kvadrat(5)); orqali chiqaring.',
      ],
      starterCode: `// Bu yerda kvadrat funksiyasini yozing va kvadrat(5) ni konsolga chiqaring:\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-js-4-1',
          description: 'Konsolga 25 chiqishi kerak',
          expectedOutput: '25',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: function kvadrat(son) {\n  return son * son;\n}\nconsole.log(kvadrat(5));',
      ],
      solutionExplanation: 'kvadrat(5) chaqirilganda 5 * 5 = 25 qaytariladi.',
      passingScore: 100,
      expectedConcepts: ['function', 'return'],
    },
  },

  // 5-Dars
  {
    lesson: {
      id: 'les-js-5',
      moduleId: 'mod-js-1',
      courseId: 'course-js',
      title: 'DOM Bilan Ishlash va Hodisalar (Events)',
      slug: 'dom-bilan-ishlash-va-hodisalar',
      description: 'HTML va JavaScriptni bog‘lash: tugma bosilganda sahifani jonlantirish.',
      objectives: [
        'DOM tushunchasini bilish',
        'document.getElementById orqali elementni topish',
      ],
      estimatedMinutes: 30,
      order: 5,
      published: true,
      content: {
        title: 'DOM Bilan Ishlash va Hodisalar (Events)',
        learningObjective: 'Sahifadagi elementlarni JavaScript orqali dinamik boshqarish.',
        realLifeAnalogy: 'Uy kalitini bosganda chiroq yonishi kabi.',
        theory: [
          {
            type: 'heading',
            content: 'DOM nima?',
          },
          {
            type: 'text',
            content: 'Brauzer HTML sahifani DOM daraxtiga aylantiradi. JS shu daraxt orqali elementlarni boshqaradi.',
          },
        ],
        interactiveExample: {
          title: 'Matnni o‘zgartirish',
          description: 'Element matnini yangilash.',
          language: 'javascript',
          code: `let xabar = "Kodni o'rgan. G'oyangni yarat.";\nconsole.log(xabar);`,
          expectedOutput: "Kodni o'rgan. G'oyangni yarat.",
          lineExplanations: {
            2: 'Xabar konsolga chiqarildi.',
          },
        },
        commonMistakes: [
          {
            title: 'getElementById da panjara (#) yozish',
            wrongCode: 'document.getElementById("#btn")',
            correctCode: 'document.getElementById("btn")',
            explanation: 'getElementById ichida faqat toza ID nomi yoziladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-js-5-1',
            question: 'HTML elementini id orqali topuvchi metod qaysi?',
            type: 'multiple-choice',
            options: ['document.findElement()', 'document.getElementById()', 'document.select()', 'document.query()'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! getElementById elementni id bo‘yicha topadi.',
          },
        ],
        summary: 'Tabriklaymiz! Siz JavaScript asoslari kursini yakunladingiz.',
        nextLessonSlug: 'dashboard',
        nextLessonTitle: 'Dashboardga qaytish',
      },
    },
    exercise: {
      id: 'ex-js-5',
      lessonId: 'les-js-5',
      title: 'Interaktiv Hisoblagich Web Loyihasi',
      description: 'index.html, style.css va script.js fayllarini birgalikda ishlatib, tugma bosilganda sonni 1 ga oshiruvchi interaktiv hisoblagich web loyihasini yarating.',
      instructions: [
        'index.html faylida id="counter" bo‘lgan span va id="btn" bo‘lgan button elementlari mavjudligiga ishonch hosil qiling.',
        'style.css faylida #btn yoki .card uchun chiroyli ko‘rinish stili bering.',
        'script.js faylida "Loyiha tayyor!" xabarini console.log orqali chiqaring.',
      ],
      starterCode: '',
      starterFiles: {
        'index.html': `<div class="card">\n  <h2>Interaktiv Hisoblagich</h2>\n  <p>Qiymat: <span id="counter">0</span></p>\n  <button id="btn">Oshirish</button>\n</div>`,
        'style.css': `.card {\n  text-align: center;\n  padding: 24px;\n  font-family: sans-serif;\n}\n\n#btn {\n  background-color: #2563eb;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 16px;\n}\n\n#btn:hover {\n  background-color: #1d4ed8;\n}`,
        'script.js': `// Tugma bosilganda sonni oshirish kodini yozing:\nconsole.log("Loyiha tayyor!");\n`,
      },
      isMultiFile: true,
      language: 'javascript',
      difficulty: 'medium',
      testCases: [
        {
          id: 'tc-js-5-1',
          description: 'index.html da id="counter" bo‘lgan element mavjud bo‘lishi kerak',
          expectedOutput: 'id="counter"',
          type: 'contains',
          targetFile: 'index.html',
        },
        {
          id: 'tc-js-5-2',
          description: 'style.css da #btn selektori va uslublari bo‘lishi kerak',
          expectedOutput: '#btn',
          type: 'contains',
          targetFile: 'style.css',
        },
        {
          id: 'tc-js-5-3',
          description: 'script.js konsolga "Loyiha tayyor!" deb chiqarishi kerak',
          expectedOutput: 'Loyiha tayyor!',
          type: 'output',
          targetFile: 'script.js',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: index.html da <span id="counter">0</span> va <button id="btn">Oshirish</button> yozilganini tekshiring.',
        '2-bosqich: style.css da #btn { ... } uslubi mavjudligini ko‘ring.',
        '3-bosqich: script.js da console.log("Loyiha tayyor!"); kodini yozing va "Run project" tugmasini bosing.',
      ],
      solutionExplanation: 'HTML, CSS va JS fayllari to‘g‘ri birlashtirildi va konsolga xabar chiqarildi.',
      passingScore: 100,
      expectedConcepts: ['dom', 'multi-file', 'events'],
    },
  },
];
