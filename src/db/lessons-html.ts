import type { Lesson, Exercise } from '@/types';

export const HTML_LESSONS: { lesson: Lesson; exercise: Exercise }[] = [
  // 1-Dars
  {
    lesson: {
      id: 'les-html-1',
      moduleId: 'mod-html-1',
      courseId: 'course-html',
      title: 'HTML Nima va Sahifa Skeleti?',
      slug: 'html-nima-va-sahifa-skeleti',
      description: 'HTML tushunchasi, teglarning ishlash prinsipi va har qanday veb-saytning asosiy strukturasi.',
      objectives: [
        'HTML (HyperText Markup Language) nima ekanini bilish',
        'Teglar (ochiluvchi va yopiluvchi) bilan tanishish',
        '<!DOCTYPE html>, <html>, <head>, <body> tuzilishini o‘rganish',
      ],
      estimatedMinutes: 20,
      order: 1,
      published: true,
      content: {
        title: 'HTML Nima va Sahifa Skeleti?',
        learningObjective: 'Ushbu darsda siz veb-sahifaning asosiy suyak tuzilishini yaratishni o‘rganasiz.',
        realLifeAnalogy: 'Uy qurilishini tasavvur qiling: avval poydevor qo‘yiladi, g‘ishtlar terilib, beton quyiladi — bu uyning skeleti. HTML ham aynan veb-saytning skeletidir!',
        theory: [
          {
            type: 'heading',
            content: 'Teglar nima?',
          },
          {
            type: 'text',
            content: 'HTML tili teglar (tags) orqali yoziladi. Ko‘pchilik teglar ochiladi va yopiladi: masalan, <p> ochiladi va </p> yopiladi.',
          },
          {
            type: 'heading',
            content: 'Veb sahifaning standart skeleti',
          },
          {
            type: 'text',
            content: '- <!DOCTYPE html> — HTML5 standarti.\n- <html> — sahifa qobig‘i.\n- <head> — texnik ma’lumotlar.\n- <body> — ekranda ko‘rinadigan barcha narsalar.',
          },
        ],
        interactiveExample: {
          title: 'Oddiy HTML hujjati',
          description: 'Sarlavha va matndan iborat sahifa.',
          language: 'html',
          code: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Mening Sahifam</title>\n</head>\n<body>\n  <h1>Salom, Dunyo!</h1>\n  <p>Bu mening birinchi veb-sahifam.</p>\n</body>\n</html>`,
          expectedOutput: 'Salom, Dunyo!\nBu mening birinchi veb-sahifam.',
          lineExplanations: {
            7: 'h1 — sahifaning eng katta asosiy sarlavhasi.',
            8: 'p — oddiy matn paragrafi.',
          },
        },
        commonMistakes: [
          {
            title: 'Tegni yopishda slesh (/) belgisini unutish',
            wrongCode: '<h1>Salom Dunyo<h1>',
            correctCode: '<h1>Salom Dunyo</h1>',
            explanation: 'Yopiluvchi tegda teg nomidan oldin slesh (/) bo‘lishi kerak.',
            language: 'html',
          },
        ],
        quiz: [
          {
            id: 'q-html-1-1',
            question: 'Foydalanuvchi ekranda ko‘radigan barcha matn va rasmlar qaysi teg ichida bo‘ladi?',
            type: 'multiple-choice',
            options: [
              '<head> tegi ichida',
              '<body> tegi ichida',
              '<title> tegi ichida',
              '<!DOCTYPE> tegi ichida',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Sahifaning ko‘rinadigan qismi body tegi ichida joylashadi.',
          },
        ],
        summary: 'Siz HTML ning vazifasi, teglarning ochilishi va yopilishi hamda asosiy sahifa skeletini o‘rgandingiz.',
        nextLessonSlug: 'matnlar-va-sarlavhalar',
        nextLessonTitle: 'Matnlar va Sarlavhalar (h1-h6, p)',
      },
    },
    exercise: {
      id: 'ex-html-1',
      lessonId: 'les-html-1',
      title: 'Birinchi HTML sahifangizni yarating',
      description: '`<h1>` tegi yordamida "Mening Portfolio Sahifam" sarlavhasini yozing.',
      instructions: [
        '<h1> tegini oching.',
        'Ichiga "Mening Portfolio Sahifam" matnini yozing.',
        '</h1> bilan tegni yoping.',
      ],
      starterCode: `<!-- Bu yerda h1 tegi ichiga Mening Portfolio Sahifam deb yozing -->\n`,
      language: 'html',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-html-1-1',
          description: '<h1> tegi ichida "Mening Portfolio Sahifam" bo‘lishi kerak',
          expectedOutput: 'Mening Portfolio Sahifam',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: Sarlavha tegi: <h1>...</h1>',
        '2-bosqich: <h1>Mening Portfolio Sahifam</h1>',
      ],
      solutionExplanation: '<h1>Mening Portfolio Sahifam</h1> kodi sahifada 1-darajali katta sarlavha hosil qiladi.',
      passingScore: 100,
      expectedConcepts: ['h1', 'tags'],
    },
  },

  // 2-Dars
  {
    lesson: {
      id: 'les-html-2',
      moduleId: 'mod-html-1',
      courseId: 'course-html',
      title: 'Matnlar va Sarlavhalar (h1-h6, p)',
      slug: 'matnlar-va-sarlavhalar',
      description: 'Sarlavhalar iyerarxiyasi, paragraflar, qalin va qiya matnlar.',
      objectives: [
        'h1 dan h6 gacha sarlavha darajalarini farqlash',
        '<p> (paragraf) va <br> (yangi qator) dan foydalanish',
        '<strong> (qalin) va <em> (qiya) teglari bilan ishlash',
      ],
      estimatedMinutes: 20,
      order: 2,
      published: true,
      content: {
        title: 'Matnlar va Sarlavhalar (h1-h6, p)',
        learningObjective: 'Matnlarni to‘g‘ri formatlash va tushunarli iyerarxiya hosil qilish.',
        realLifeAnalogy: 'Gazetadagi bosh sarlavha, kichik bo‘limlar va oddiy maqola matni kabi.',
        theory: [
          {
            type: 'heading',
            content: 'Sarlavhalar: h1 dan h6 gacha',
          },
          {
            type: 'text',
            content: '<h1> eng katta sarlavha, <h6> esa eng kichigi hisoblanadi.',
          },
        ],
        interactiveExample: {
          title: 'Sarlavha va matn namunasi',
          description: 'Turli darajadagi sarlavhalar va qalin so‘zlar.',
          language: 'html',
          code: `<h2>Dasturlash Asoslari</h2>\n<p>Dasturlashni o'rganish <strong>juda qiziqarli</strong> va foydali jarayondir.</p>`,
          expectedOutput: 'Dasturlash Asoslari\nDasturlashni o\'rganish juda qiziqarli va foydali jarayondir.',
          lineExplanations: {
            1: 'h2 ikkinchi darajali bo‘lim sarlavhasi.',
            2: 'strong so‘zni qalin qilib ko‘rsatadi.',
          },
        },
        commonMistakes: [
          {
            title: 'Bitta sahifada ko‘plab h1 ishlatish',
            wrongCode: '<h1>Bosh gap</h1>\n<h1>Ikkinchi gap</h1>',
            correctCode: '<h1>Bosh Mavzu</h1>\n<h2>Kichik Bo‘lim</h2>',
            explanation: 'Har bir sahifada bitta h1 bo‘lishi tavsiya etiladi.',
            language: 'html',
          },
        ],
        quiz: [
          {
            id: 'q-html-2-1',
            question: 'Qaysi teg matnni qalin (bold) qilib ko‘rsatadi?',
            type: 'multiple-choice',
            options: ['<italic>', '<strong>', '<header>', '<big>'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! <strong> tegi matnni qalin qiladi.',
          },
        ],
        summary: 'Siz sarlavhalar va matn bezash teglarini o‘rgandingiz.',
        nextLessonSlug: 'havolalar-va-rasmlar',
        nextLessonTitle: 'Havolalar va Rasmlar (a, img)',
      },
    },
    exercise: {
      id: 'ex-html-2',
      lessonId: 'les-html-2',
      title: 'Paragraf va qalin matn yarating',
      description: '`<p>` tegi ichida "Men <strong>CodeQuest</strong> bilan o‘rganmoqdaman" matnini yozing.',
      instructions: [
        '<p> tegini oching.',
        'Ichiga "Men <strong>CodeQuest</strong> bilan o‘rganmoqdaman" deb yozing.',
        '</p> bilan yoping.',
      ],
      starterCode: `<!-- Bu yerda p va strong teglari bilan matn yozing -->\n`,
      language: 'html',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-html-2-1',
          description: '<p> ichida <strong>CodeQuest</strong> bo‘lishi kerak',
          expectedOutput: 'Men <strong>CodeQuest</strong> bilan',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: <p>Men <strong>CodeQuest</strong> bilan o‘rganmoqdaman</p>',
      ],
      solutionExplanation: '<p>Men <strong>CodeQuest</strong> bilan o‘rganmoqdaman</p> so‘zni qalin qilib ajratadi.',
      passingScore: 100,
      expectedConcepts: ['p', 'strong'],
    },
  },

  // 3-Dars
  {
    lesson: {
      id: 'les-html-3',
      moduleId: 'mod-html-1',
      courseId: 'course-html',
      title: 'Havolalar va Rasmlar (a, img)',
      slug: 'havolalar-va-rasmlar',
      description: 'Internet tarmog‘ining asosi: bir sahifadan boshqasiga o‘tish va rasmlar joylashtirish.',
      objectives: [
        '<a> tegi va href atributini o‘rganish',
        '<img> tegi va src atributi bilan ishlash',
      ],
      estimatedMinutes: 20,
      order: 3,
      published: true,
      content: {
        title: 'Havolalar va Rasmlar (a, img)',
        learningObjective: 'Web sahifaga havolalar va rasmlar qo‘shishni o‘rganish.',
        realLifeAnalogy: 'Sahifalarni bir-biriga bog‘lovchi ko‘priklar kabi.',
        theory: [
          {
            type: 'heading',
            content: 'Havola va rasm teglari',
          },
          {
            type: 'text',
            content: '<a href="manzil">Matn</a> havolalar uchun, <img src="rasm.jpg" alt="tavsif"> esa rasmlar uchun xizmat qiladi.',
          },
        ],
        interactiveExample: {
          title: 'Havola namunasi',
          description: 'CodeQuest sahifasiga havola.',
          language: 'html',
          code: `<a href="https://codequest.uz">CodeQuest Sayti</a>`,
          expectedOutput: 'CodeQuest Sayti',
          lineExplanations: {
            1: 'href atributi boradigan manzilni belgilaydi.',
          },
        },
        commonMistakes: [
          {
            title: 'img tegini alohida yopish',
            wrongCode: '<img src="rasm.jpg"></img>',
            correctCode: '<img src="rasm.jpg" alt="Rasm">',
            explanation: 'img tegi alohida yopiluvchi tegga ega emas.',
            language: 'html',
          },
        ],
        quiz: [
          {
            id: 'q-html-3-1',
            question: 'img tegida rasm matnli tavsifini qaysi atribut beradi?',
            type: 'multiple-choice',
            options: ['title', 'alt', 'src', 'link'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! alt atributi rasm tavsifini beradi.',
          },
        ],
        summary: 'Siz havolalar va rasmlar bilan ishlashni o‘rgandingiz.',
        nextLessonSlug: 'royxatlar-va-jadvallar',
        nextLessonTitle: 'Ro‘yxatlar va Jadvallar (ul, ol, table)',
      },
    },
    exercise: {
      id: 'ex-html-3',
      lessonId: 'les-html-3',
      title: 'Havola yarating',
      description: '`href` manzili `https://codequest.uz` bo‘lgan va ichida "Darslarni boshlash" yozilgan havola (`<a>`) yarating.',
      instructions: [
        '<a href="https://codequest.uz"> deb oching.',
        'Ichiga "Darslarni boshlash" matnini yozing.',
        '</a> bilan yoping.',
      ],
      starterCode: `<!-- Bu yerda havola tegi yozing -->\n`,
      language: 'html',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-html-3-1',
          description: '<a href="https://codequest.uz">Darslarni boshlash</a> bo‘lishi kerak',
          expectedOutput: 'Darslarni boshlash',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: <a href="https://codequest.uz">Darslarni boshlash</a>',
      ],
      solutionExplanation: '<a> tegi href orqali boshqa sahifaga olib boradi.',
      passingScore: 100,
      expectedConcepts: ['a', 'href'],
    },
  },

  // 4-Dars
  {
    lesson: {
      id: 'les-html-4',
      moduleId: 'mod-html-1',
      courseId: 'course-html',
      title: 'Ro‘yxatlar va Jadvallar (ul, ol, table)',
      slug: 'royxatlar-va-jadvallar',
      description: 'Tartiblangan va tartiblanmagan ro‘yxatlar hamda ma’lumotlarni jadvalga joylash.',
      objectives: [
        '<ul> va <ol> ro‘yxatlarini bilish',
        '<li> elementi bilan ishlash',
      ],
      estimatedMinutes: 20,
      order: 4,
      published: true,
      content: {
        title: 'Ro‘yxatlar va Jadvallar (ul, ol, table)',
        learningObjective: 'Ma’lumotlarni punktlar shaklida tartiblashni o‘rganish.',
        realLifeAnalogy: 'Bozorlik ro‘yxati yoki retsept bosqichlari kabi.',
        theory: [
          {
            type: 'heading',
            content: 'Ro‘yxat teglari',
          },
          {
            type: 'text',
            content: '<ul> tartibsiz ro‘yxat, <ol> raqamlangan ro‘yxat, <li> esa har bir banddir.',
          },
        ],
        interactiveExample: {
          title: 'Ro‘yxat namunasi',
          description: 'Dasturlash tillari ro‘yxati.',
          language: 'html',
          code: `<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>`,
          expectedOutput: 'HTML\nCSS\nJavaScript',
          lineExplanations: {
            1: 'ul tartibsiz ro‘yxat bloki.',
            2: 'li ro‘yxat elementi.',
          },
        },
        commonMistakes: [
          {
            title: 'li ni ul dan tashqarida yozish',
            wrongCode: '<li>Bitta element</li>',
            correctCode: '<ul>\n  <li>Bitta element</li>\n</ul>',
            explanation: 'li doimo ul yoki ol ichida bo‘lishi kerak.',
            language: 'html',
          },
        ],
        quiz: [
          {
            id: 'q-html-4-1',
            question: 'Raqamlangan ro‘yxat qaysi teg bilan yaratiladi?',
            type: 'multiple-choice',
            options: ['<ul>', '<ol>', '<list>', '<dl>'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! <ol> ordered list demakdir.',
          },
        ],
        summary: 'Siz ro‘yxatlar tuzishni o‘rgandingiz.',
        nextLessonSlug: 'formalar-va-inputlar',
        nextLessonTitle: 'Formalar va Inputlar (form, input, button)',
      },
    },
    exercise: {
      id: 'ex-html-4',
      lessonId: 'les-html-4',
      title: '3 ta banddan iborat ro‘yxat yarating',
      description: '`<ul>` tegi ichida "HTML", "CSS" va "JavaScript" bandlaridan iborat `<li>` elementlarini yozing.',
      instructions: [
        '<ul> tegini oching.',
        '3 ta <li> yarating: <li>HTML</li>, <li>CSS</li>, <li>JavaScript</li>.',
        '</ul> bilan yoping.',
      ],
      starterCode: `<!-- Bu yerda ul va li teglari bilan ro'yxat tuzing -->\n`,
      language: 'html',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-html-4-1',
          description: 'Ro‘yxatda HTML bo‘lishi kerak',
          expectedOutput: '<li>HTML</li>',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: <ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>',
      ],
      solutionExplanation: '<ul> va <li> teglari tartibsiz ro‘yxat yaratadi.',
      passingScore: 100,
      expectedConcepts: ['ul', 'li'],
    },
  },

  // 5-Dars
  {
    lesson: {
      id: 'les-html-5',
      moduleId: 'mod-html-1',
      courseId: 'course-html',
      title: 'Formalar va Inputlar (form, input, button)',
      slug: 'formalar-va-inputlar',
      description: 'Foydalanuvchidan ma’lumot qabul qilish: matn kiritish maydonchalari, tugmalar va jo‘natish.',
      objectives: [
        '<form> tegi va uning vazifasini bilish',
        '<input> va <button> teglari bilan ishlash',
      ],
      estimatedMinutes: 25,
      order: 5,
      published: true,
      content: {
        title: 'Formalar va Inputlar (form, input, button)',
        learningObjective: 'Saytda anketalar va kiritish maydonlari yaratish.',
        realLifeAnalogy: 'Bankdagi blanka yoki anketa to‘ldirish kabi.',
        theory: [
          {
            type: 'heading',
            content: 'Forma elementlari',
          },
          {
            type: 'text',
            content: '<form> barcha maydonlarni o‘rab turadi, <input> ma’lumot kiritish maydoni, <button> esa yuborish tugmasidir.',
          },
        ],
        interactiveExample: {
          title: 'Sodda forma',
          description: 'Ism kiritish va tugma.',
          language: 'html',
          code: `<form>\n  <input type="text" placeholder="Ismingiz">\n  <button type="submit">Yuborish</button>\n</form>`,
          expectedOutput: 'Yuborish',
          lineExplanations: {
            2: 'input kiritish maydoni.',
            3: 'button submit tugmasi.',
          },
        },
        commonMistakes: [
          {
            title: 'Input turini ko‘rsatmaslik',
            wrongCode: '<input placeholder="Parol">',
            correctCode: '<input type="password" placeholder="Parol">',
            explanation: 'type="password" berilmasa belgilar ochiq ko‘rinib qoladi.',
            language: 'html',
          },
        ],
        quiz: [
          {
            id: 'q-html-5-1',
            question: 'Parol kiritish maydoni uchun input type nima bo‘lishi kerak?',
            type: 'multiple-choice',
            options: ['type="secret"', 'type="password"', 'type="hidden"', 'type="lock"'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! type="password" parolni yashiradi.',
          },
        ],
        summary: 'Tabriklaymiz! Siz HTML asoslari kursini muvaffaqiyatli yakunladingiz.',
        nextLessonSlug: 'css-nima-va-selektorlar',
        nextLessonTitle: 'CSS Nima va Selektorlar',
      },
    },
    exercise: {
      id: 'ex-html-5',
      lessonId: 'les-html-5',
      title: 'Tugmali oddiy forma yasang',
      description: '`<form>` ichida bitta `<input type="text">` va "Yuborish" yozilgan `<button>` yarating.',
      instructions: [
        '<form> oching.',
        '<input type="text" placeholder="Ism"> qo‘ying.',
        '<button type="submit">Yuborish</button> qo‘ying.',
        '</form> bilan yoping.',
      ],
      starterCode: `<!-- Bu yerda form, input va button yozing -->\n`,
      language: 'html',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-html-5-1',
          description: '<button type="submit">Yuborish</button> bo‘lishi kerak',
          expectedOutput: 'Yuborish',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: <form> <input type="text"> <button type="submit">Yuborish</button> </form>',
      ],
      solutionExplanation: '<form> va uning ichidagi elementlar ma’lumotlarni qabul qilish imkonini beradi.',
      passingScore: 100,
      expectedConcepts: ['form', 'input', 'button'],
    },
  },
];
