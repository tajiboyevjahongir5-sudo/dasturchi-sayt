import type { Lesson, Exercise } from '@/types';

export const EXTENDED_LESSONS: { lesson: Lesson; exercise: Exercise }[] = [
  // ============================================================
  // 1. LINUX TERMINAL & CLI
  // ============================================================
  {
    lesson: {
      id: 'les-term-1',
      moduleId: 'mod-terminal-1',
      courseId: 'course-terminal',
      title: 'Terminal Nima va Navigatsiya (pwd, ls, cd)',
      slug: 'terminal-nima-va-navigatsiya',
      description: 'Buyruqlar satrida harakatlanish: joriy yo‘lni bilish (pwd), fayllarni ko‘rish (ls) va papkalarga kirish (cd).',
      objectives: [
        'Terminal va GUI (grafik interfeys) farqini bilish',
        'pwd, ls va cd buyruqlarini mukammal qo‘llash',
        'Fayl tizimi daraxti bo‘ylab erkin harakatlanish',
      ],
      estimatedMinutes: 15,
      order: 1,
      published: true,
      content: {
        title: 'Terminal Nima va Navigatsiya (pwd, ls, cd)',
        learningObjective: 'Grafik sichqonchasiz faqat buyruqlar yordamida fayl tizimida chaqqon harakatlanishni o‘rganish.',
        realLifeAnalogy: 'Tasavvur qiling, ulkan ko‘p qavatli kutubxonadasiz. pwd buyrug‘i — bu siz hozir aynan qaysi qavat va qaysi zalda turganingizni ko‘rsatuvchi xaritadir. ls buyrug‘i — o‘sha zaldagi barcha javonlar va kitoblar ro‘yxatini ko‘rsatadi. cd buyrug‘i esa — sizni bir xonadan boshqa xonaga eltuvchi eshikdir!',
        theory: [
          {
            type: 'heading',
            content: 'CLI (Command Line Interface) nima?',
          },
          {
            type: 'text',
            content: 'Dasturchilar va server ma’murlari sichqoncha bilan sekin tugma bosib o‘tirishmaydi. Ular to‘g‘ridan-to‘g‘ri operatsion tizim yadrosi (Shell) bilan matnli buyruqlar orqali chaqmoqdek tez muloqot qiladilar.',
          },
          {
            type: 'heading',
            content: 'Asosiy Navigatsiya Buyruqlari',
          },
          {
            type: 'text',
            content: '1. pwd (print working directory) — Siz hozir qaysi papkada ekaningizni to‘liq yo‘lini chiqaradi.\n2. ls (list) — Joriy papkadagi barcha fayl va jildlarni sanab beradi. ls -la yashirin fayllarni ham ko‘rsatadi.\n3. cd <papka> (change directory) — Ko‘rsatilgan papka ichiga kiradi. cd .. esa bitta yuqori papkaga qaytaradi.',
          },
        ],
        interactiveExample: {
          title: 'Terminal navigatsiya simulyatsiyasi',
          description: 'JavaScript yordamida terminal buyruqlari natijasini ko‘rib chiqamiz.',
          language: 'javascript',
          code: `const currentDir = "/var/www/codequest";\nconst files = ["index.html", "style.css", "app.js", "package.json"];\n\nconsole.log("Joriy papka (pwd): " + currentDir);\nconsole.log("Fayllar ro'yxati (ls): " + files.join(", "));`,
          expectedOutput: "Joriy papka (pwd): /var/www/codequest\nFayllar ro'yxati (ls): index.html, style.css, app.js, package.json",
          lineExplanations: {
            1: 'pwd buyrug‘i chiqargan yo‘l.',
            2: 'ls buyrug‘i topgan fayllar ro‘yxati.',
            4: 'Konsolga natijalarni chiqarish.',
          },
        },
        commonMistakes: [
          {
            title: 'Katta-kichik harflarni adashtirish',
            wrongCode: '// cd Desktop o‘rniga cd desktop deb yozish (Linux da katta va kichik harflar qat’iy farqlanadi)',
            correctCode: '// cd Desktop',
            explanation: 'Linux fayl tizimida "Fayl.txt" va "fayl.txt" mutlaqo ikkita har xil fayldir.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-term-1-1',
            question: 'Siz turgan joriy papkaning to‘liq yo‘lini qaysi buyruq ko‘rsatadi?',
            type: 'multiple-choice',
            options: ['ls', 'pwd', 'cd', 'mkdir'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! pwd (print working directory) joriy yo‘lni ko‘rsatadi.',
          },
          {
            id: 'q-term-1-2',
            question: 'Bitta yuqori (ota) papkaga qaytish uchun qaysi buyruq yoziladi?',
            type: 'multiple-choice',
            options: ['cd ..', 'cd /', 'cd back', 'exit'],
            correctAnswer: 0,
            explanation: 'To‘g‘ri! "cd .." bitta yuqori darajaga qaytaradi.',
          },
        ],
        summary: 'Siz terminal nima ekanini, pwd, ls va cd buyruqlarini o‘rgandingiz.',
        nextLessonSlug: 'fayllar-yaratish-va-boshqarish',
        nextLessonTitle: 'Fayllar Yaratish va Boshqarish (mkdir, touch, rm)',
      },
    },
    exercise: {
      id: 'ex-term-1',
      lessonId: 'les-term-1',
      title: 'Terminal Buyruqlari Zanjirini Tuzing',
      description: 'Terminalda yangi loyiha papkasiga kirib, fayllarni ko‘rish ssenariysini shakllantiring.',
      instructions: [
        'terminalCommands nomli o‘zgaruvchi e’lon qiling.',
        'Unda "pwd", "ls", "cd projects" buyruqlari qatnashsin.',
        'console.log(terminalCommands) orqali chiqaring.',
      ],
      starterCode: `// Terminal navigatsiya buyruqlarini yozing\nconst terminalCommands = \`pwd\ncd projects\nls\`;\n\nconsole.log(terminalCommands);\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-term-1-1',
          description: 'Matnda "pwd" buyrug‘i bo‘lishi kerak',
          expectedOutput: 'pwd',
          type: 'contains',
        },
        {
          id: 'tc-term-1-2',
          description: 'Matnda "cd projects" buyrug‘i bo‘lishi kerak',
          expectedOutput: 'cd projects',
          type: 'contains',
        },
        {
          id: 'tc-term-1-3',
          description: 'Matnda "ls" buyrug‘i bo‘lishi kerak',
          expectedOutput: 'ls',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: terminalCommands ichida "pwd", "cd projects" va "ls" so‘zlari bo‘lsin.',
        '2-bosqich: console.log(terminalCommands) buyrug‘i qolsin.',
      ],
      solutionExplanation: 'Ushbu buyruqlar har kuni dasturchilar tomonidan yuzlab marta ishlatiladi.',
      passingScore: 100,
      expectedConcepts: ['pwd', 'cd', 'ls', 'terminal'],
    },
  },

  // ============================================================
  // 2. GIT VA GITHUB
  // ============================================================
  {
    lesson: {
      id: 'les-git-1',
      moduleId: 'mod-git-1',
      courseId: 'course-git',
      title: 'Git Nima va Asosiy Ish Oqimi (init, add, commit)',
      slug: 'git-nima-va-asosiy-ish-oqimi',
      description: 'Kodingiz vaqt mashinasi: versiyalar nazorati, git init, o‘zgarishlarni keshga olish (git add) va tarixga muhrlash (git commit).',
      objectives: [
        'Versiyalarni nazorat qilish tizimi (VCS) tushunchasini anglash',
        'git init, git add va git commit zanjirini o‘rganish',
        'Commit xabarlarini professional yozishni bilish',
      ],
      estimatedMinutes: 20,
      order: 1,
      published: true,
      content: {
        title: 'Git Nima va Asosiy Ish Oqimi (init, add, commit)',
        learningObjective: 'Kodingizdagi har bir o‘zgarishni xavfsiz tarixga saqlab, istalgan paytda ortga qaytish imkoniyatiga ega bo‘lish.',
        realLifeAnalogy: 'Kompyuter o‘yinlarida qiyin bosqichdan oldin "Save Game" (O‘yinni saqlash) qilasiz-ku? Agar o‘yinda yutqazib qo‘ysangiz, o‘sha saqlangan nuqtadan qayta boshlaysiz. Git ham aynan dasturchining "Save Game" tugmasidir! Har bir commit — bu loyihangizning xavfsiz saqlangan nuqtasi bo‘lib, kodingiz buzilsa, xotirjam o‘tmishga qaytib uni tiklay olasiz.',
        theory: [
          {
            type: 'heading',
            content: 'Git — Dasturchilarning Vaqt Mashinasi',
          },
          {
            type: 'text',
            content: 'Git — bu dunyodagi eng mashhur taqsimlangan versiyalar nazorati tizimi (VCS). U loyihadagi har bir harf o‘zgarishini kim, qachon va nega qilganini sekundigacha yozib boradi.',
          },
          {
            type: 'heading',
            content: 'Asosiy 3 Qadamli Git Sikli',
          },
          {
            type: 'text',
            content: '1. git init — Loyiha papkasini Git omboriga aylantiradi.\n2. git add . — Qilingan barcha o‘zgarishlarni saqlash zonasi (Staging Area)ga kiritadi.\n3. git commit -m "Xabar" — O‘zgarishlarni aniq tushuntirish bilan tarixga abadiy muhrlaydi.',
          },
        ],
        interactiveExample: {
          title: 'Git commit yaratish',
          description: 'Git buyruqlari qanday ketma-ketlikda bajarilishi.',
          language: 'javascript',
          code: `const gitWorkflow = [\n  "git init",\n  "git add .",\n  'git commit -m "feat: login tizimi qo\\'shildi"'\n];\n\nconsole.log("Git qadamlari:\\n" + gitWorkflow.join("\\n"));`,
          expectedOutput: "Git qadamlari:\ngit init\ngit add .\ngit commit -m \"feat: login tizimi qo'shildi\"",
          lineExplanations: {
            2: 'git init omborni boshlaydi.',
            3: 'git add . fayllarni sahnalashtiradi.',
            4: 'git commit saqlash nuqtasini hosil qiladi.',
          },
        },
        commonMistakes: [
          {
            title: 'Commit xabarini ma’nosiz yozish',
            wrongCode: '// git commit -m "nimadirlar o‘zgardi"',
            correctCode: '// git commit -m "fix(auth): parol uzunligini tekshirish tuzatildi"',
            explanation: 'Commit xabari kelajakda boshqa dasturchilar nima o‘zgarganini bir qarashda tushunishi uchun aniq bo‘lishi shart.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-git-1-1',
            question: 'O‘zgarishlarni commit qilishdan oldin keshga (staging area) qaysi buyruq qo‘shadi?',
            type: 'multiple-choice',
            options: ['git push', 'git add .', 'git checkout', 'git branch'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! "git add ." barcha yangi va o‘zgargan fayllarni saqlashga tayyorlaydi.',
          },
        ],
        summary: 'Siz Git ning ishlash tamoyilini va asosiy 3 ta buyrug‘ini o‘rgandingiz.',
        nextLessonSlug: 'shoxlanish-va-github',
        nextLessonTitle: 'Shoxlanish va GitHub (branch, merge, push)',
      },
    },
    exercise: {
      id: 'ex-git-1',
      lessonId: 'les-git-1',
      title: 'Birinchi Commitni Yozing',
      description: 'Git commit buyrug‘ini professional xabar bilan shakllantiring.',
      instructions: [
        'gitCommitCmd nomli o‘zgaruvchi e’lon qiling.',
        'Unda "git add ." va "git commit -m" hamda "feat:" so‘zlari bo‘lsin.',
        'console.log(gitCommitCmd) orqali chiqaring.',
      ],
      starterCode: `// Git workflow buyrug‘ini yozing\nconst gitCommitCmd = \`git add .\ngit commit -m "feat: birinchi dars yakunlandi"\`;\n\nconsole.log(gitCommitCmd);\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-git-1-1',
          description: 'Buyruqda "git add ." bo‘lishi kerak',
          expectedOutput: 'git add .',
          type: 'contains',
        },
        {
          id: 'tc-git-1-2',
          description: 'Buyruqda "git commit -m" bo‘lishi kerak',
          expectedOutput: 'git commit -m',
          type: 'contains',
        },
        {
          id: 'tc-git-1-3',
          description: 'Commit xabarida "feat:" prefiksi bo‘lishi kerak',
          expectedOutput: 'feat:',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: gitCommitCmd ichida "git add .", "git commit -m" va "feat:" qatnashsin.',
      ],
      solutionExplanation: 'Har bir professional dasturchi o‘z kodini shu tarzda saqlaydi.',
      passingScore: 100,
      expectedConcepts: ['git add', 'git commit', 'version control'],
    },
  },

  // ============================================================
  // 3. BACKEND VA SERVERLAR ASOSLARI
  // ============================================================
  {
    lesson: {
      id: 'les-back-1',
      moduleId: 'mod-backend-1',
      courseId: 'course-backend',
      title: 'Server Nima va Client-Server Modeli',
      slug: 'server-nima-va-client-server-modeli',
      description: 'Internet qanday ishlaydi: Client (brauzer), Server (Node.js), HTTP so‘rovlar (Request) va javoblar (Response).',
      objectives: [
        'Client-Server arxitekturasini to‘liq tushunish',
        'HTTP protokoli metodlarini (GET, POST, PUT, DELETE) bilish',
        'Status kodlar (200, 404, 500) ma’nosini anglash',
      ],
      estimatedMinutes: 20,
      order: 1,
      published: true,
      content: {
        title: 'Server Nima va Client-Server Modeli',
        learningObjective: 'Saytlar ortidagi sirli mantiq — server qanday ishlashini va ma’lumotlar qanday almashinishini o‘rganish.',
        realLifeAnalogy: 'Restoranda siz (Mijoz / Client) stolda o‘tiribsiz. Ofitsiant (HTTP Request) orqali oshxonaga buyurtma berasiz. Oshxona — bu Server! U ovqatni tayyorlaydi (ma’lumotlar bazasidan ma’lumot oladi) va ofitsiant sizga tayyor ovqatni (HTTP Response) keltirib beradi. Agar siz so‘ragan taom oshxonada qolmagan bo‘lsa, ofitsiant "404 Not Found" xabarini aytadi!',
        theory: [
          {
            type: 'heading',
            content: 'Client-Server Muloqoti',
          },
          {
            type: 'text',
            content: 'Client — bu foydalanuvchi foydalanayotgan qurilma yoki brauzer (Chrome, Safari, mobil ilova). Server — bu kechayu-kunduz internetga ulangan, ma’lumotlarni hisoblaydigan va xavfsiz saqlaydigan kuchli kompyuter dasturidir.',
          },
          {
            type: 'heading',
            content: 'HTTP So‘rov Metodlari',
          },
          {
            type: 'text',
            content: '• GET — Ma’lumotni o‘qish va yuklab olish (masalan, yangiliklar ro‘yxati).\n• POST — Yangi ma’lumot yuborish (masalan, ro‘yxatdan o‘tish yoki to‘lov qilish).\n• PUT / PATCH — Mavjud ma’lumotni yangilash (profil rasmini o‘zgartirish).\n• DELETE — Ma’lumotni o‘chirib tashlash.',
          },
        ],
        interactiveExample: {
          title: 'Express marshrutini simulyatsiya qilish',
          description: 'Oddiy REST API marshruti qanday yoziladi.',
          language: 'javascript',
          code: `// Express server marshruti:\nconst route = "GET /api/courses";\nconst response = {\n  status: 200,\n  data: ["HTML", "CSS", "JavaScript", "Node.js"]\n};\n\nconsole.log("So'rov: " + route);\nconsole.log("Javob (status " + response.status + "): " + JSON.stringify(response.data));`,
          expectedOutput: "So'rov: GET /api/courses\nJavob (status 200): [\"HTML\",\"CSS\",\"JavaScript\",\"Node.js\"]",
          lineExplanations: {
            2: 'GET metodi orqali kurslar ro‘yxati so‘ralmoqda.',
            3: 'Server 200 OK statusi va JSON formatida javob qaytarmoqda.',
          },
        },
        commonMistakes: [
          {
            title: 'Parol yoki maxfiy ma’lumotni GET orqali yuborish',
            wrongCode: '// GET /api/login?password=123 (URL satrida parol hamma uchun ochiq ko‘rinadi!)',
            correctCode: '// POST /api/login (Ma’lumot xavfsiz Request Body ichida shifrlanib boradi)',
            explanation: 'Maxfiy ma’lumotlar hech qachon GET orqali yuborilmasligi kerak, har doim POST ishlatiladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-back-1-1',
            question: 'Yangi foydalanuvchini bazaga qo‘shish uchun qaysi HTTP metodi to‘g‘ri hisoblanadi?',
            type: 'multiple-choice',
            options: ['GET', 'POST', 'DELETE', 'OPTIONS'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Yangi ma’lumot yaratish uchun POST metodi qo‘llaniladi.',
          },
        ],
        summary: 'Siz Client-Server modelini va HTTP so‘rov turlarini o‘rgandingiz.',
        nextLessonSlug: 'express-rest-api-yaratish',
        nextLessonTitle: 'Node.js va Express REST API Yaratish',
      },
    },
    exercise: {
      id: 'ex-back-1',
      lessonId: 'les-back-1',
      title: 'REST API Javobini Shakllantiring',
      description: 'Serverdan qaytadigan muvaffaqiyatli JSON javob obyektini hosil qiling.',
      instructions: [
        'apiResponse nomli o‘zgaruvchi e’lon qiling.',
        'Undagi status kodi 200 va message qiymati "Muvaffaqiyatli" bo‘lsin.',
        'console.log(JSON.stringify(apiResponse)) orqali chiqaring.',
      ],
      starterCode: `// Server JSON javobini tuzing\nconst apiResponse = {\n  status: 200,\n  message: "Muvaffaqiyatli",\n  success: true\n};\n\nconsole.log(JSON.stringify(apiResponse));\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-back-1-1',
          description: 'Javobda "status":200 bo‘lishi kerak',
          expectedOutput: '"status":200',
          type: 'contains',
        },
        {
          id: 'tc-back-1-2',
          description: 'Javobda "Muvaffaqiyatli" matni bo‘lishi kerak',
          expectedOutput: 'Muvaffaqiyatli',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: apiResponse obyektida status 200 va message "Muvaffaqiyatli" bo‘lsin.',
      ],
      solutionExplanation: 'REST API lar butun dunyoda JSON formati yordamida muloqot qiladi.',
      passingScore: 100,
      expectedConcepts: ['status', 'json', 'api', 'response'],
    },
  },

  // ============================================================
  // 4. MA’LUMOTLAR BAZASI VA SQL
  // ============================================================
  {
    lesson: {
      id: 'les-db-1',
      moduleId: 'mod-database-1',
      courseId: 'course-database',
      title: 'SQL Asoslari: SELECT, FROM, WHERE',
      slug: 'sql-asoslari-select-from-where',
      description: 'Relyatsion jadvallardan ma’lumotlarni chaqqonlik bilan qidirish va filtrlash san’ati.',
      objectives: [
        'Ma’lumotlar bazasi va jadvallar tuzilishini tushunish',
        'SELECT va FROM yordamida ustunlarni tanlash',
        'WHERE orqali ma’lumotlarni aniq shartlar bo‘yicha filtrlash',
      ],
      estimatedMinutes: 20,
      order: 1,
      published: true,
      content: {
        title: 'SQL Asoslari: SELECT, FROM, WHERE',
        learningObjective: 'SQL tili orqali millionlab ma’lumotlar orasidan o‘zingizga kerakli qatorlarni soniyalar ichida topib olish.',
        realLifeAnalogy: 'Excel jadvalini tasavvur qiling: unda "Foydalanuvchilar" degan jadval bor (ism, yosh, shahar). Agar siz o‘qituvchiga: "Menga faqat Toshkentda yashovchi, yoshi 18 dan katta talabalarning ismlarini ko‘rsat" desangiz, SQL da bu aynan shunday yoziladi: SELECT ism FROM foydalanuvchilar WHERE shahar = \'Toshkent\' AND yosh > 18! Xuddi ingliz tilida gaplashgandek oddiy va mantiqiy.',
        theory: [
          {
            type: 'heading',
            content: 'SQL (Structured Query Language) nima?',
          },
          {
            type: 'text',
            content: 'SQL — bu relyatsion ma’lumotlar bazalari (PostgreSQL, MySQL, SQLite) bilan gaplashish uchun xalqaro standart dasturlash tilidir.',
          },
          {
            type: 'heading',
            content: 'SELECT va WHERE sintaksisi',
          },
          {
            type: 'text',
            content: '1. SELECT <ustunlar> — Qaysi ma’lumotlarni ko‘rmoqchisiz? (* belgisi barcha ustunlarni bildiradi).\n2. FROM <jadval> — Qaysi jadvaldan olinsin?\n3. WHERE <shart> — Qaysi talablarga javob beradigan qatorlar kerak?',
          },
        ],
        interactiveExample: {
          title: 'SQL so‘rovini tuzish',
          description: 'Faol foydalanuvchilarni topish uchun SQL so‘rovi.',
          language: 'javascript',
          code: `const sqlQuery = "SELECT id, name, email FROM users WHERE active = 1 ORDER BY name ASC;";\n\nconsole.log("SQL So'rovi:\\n" + sqlQuery);`,
          expectedOutput: "SQL So'rovi:\nSELECT id, name, email FROM users WHERE active = 1 ORDER BY name ASC;",
          lineExplanations: {
            1: 'users jadvalidan active=1 bo‘lganlarni nomlari bo‘yicha tartiblab oladi.',
          },
        },
        commonMistakes: [
          {
            title: 'Katta bazalarda SELECT * ishlatish',
            wrongCode: '// SELECT * FROM big_table (Barcha 50 ta ustunni olib kelib, tarmoqni sekinlashtiradi)',
            correctCode: '// SELECT id, title, price FROM products (Faqat kerakli ustunlarni so‘rang)',
            explanation: 'Faqat kerakli ustunlarni so‘rash so‘rov tezligini 10 barobargacha oshiradi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-db-1-1',
            question: 'SQL da barcha ustunlarni tanlash uchun qaysi belgi qo‘yiladi?',
            type: 'multiple-choice',
            options: ['#', '*', '%', '&'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! "*" (yulduzcha) barcha ustunlarni tanlashni bildiradi.',
          },
        ],
        summary: 'Siz SQL da SELECT, FROM va WHERE buyruqlarini o‘rgandingiz.',
        nextLessonSlug: 'insert-update-delete-sql',
        nextLessonTitle: 'Ma’lumot Qo‘shish va Tahrirlash (INSERT, UPDATE, DELETE)',
      },
    },
    exercise: {
      id: 'ex-db-1',
      lessonId: 'les-db-1',
      title: 'SQL Qidiruv So‘rovini Yozing',
      description: 'Talabalar jadvalidan bahosi 80 dan yuqori bo‘lganlarni tanlab oluvchi SQL so‘rovini shakllantiring.',
      instructions: [
        'queryText nomli o‘zgaruvchi e’lon qiling.',
        'Unda "SELECT", "FROM students", "WHERE score > 80" qatnashsin.',
        'console.log(queryText) orqali chiqaring.',
      ],
      starterCode: `// SQL so‘rovini yozing\nconst queryText = "SELECT name, score FROM students WHERE score > 80;";\n\nconsole.log(queryText);\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-db-1-1',
          description: 'So‘rovda "SELECT" bo‘lishi kerak',
          expectedOutput: 'SELECT',
          type: 'contains',
        },
        {
          id: 'tc-db-1-2',
          description: 'So‘rovda "FROM students" bo‘lishi kerak',
          expectedOutput: 'FROM students',
          type: 'contains',
        },
        {
          id: 'tc-db-1-3',
          description: 'So‘rovda "WHERE score > 80" bo‘lishi kerak',
          expectedOutput: 'WHERE score > 80',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: queryText satrida SELECT, FROM students va WHERE score > 80 bo‘lishini ta’minlang.',
      ],
      solutionExplanation: 'SQL so‘rovlari yordamida backend dasturchilar ma’lumotlarni filtrlashadi.',
      passingScore: 100,
      expectedConcepts: ['SELECT', 'FROM', 'WHERE', 'SQL'],
    },
  },

  // ============================================================
  // 5. REACT ASOSLARI: ZAMONAVIY UI
  // ============================================================
  {
    lesson: {
      id: 'les-react-1',
      moduleId: 'mod-react-1',
      courseId: 'course-react',
      title: 'React Komponentlari va JSX Asoslari',
      slug: 'react-komponentlari-va-jsx',
      description: 'Qayta ishlatiluvchi UI bloklari: funksional komponentlar, JSX sintaksisi va Props orqali ma’lumot uzatish.',
      objectives: [
        'React nima va nima uchun komponentli yondashuv inqilobiy ekanini bilish',
        'JSX sintaksisi (JavaScript + XML) qoidalarini o‘rganish',
        'Props orqali ota komponentdan bola komponentga ma’lumot berish',
      ],
      estimatedMinutes: 25,
      order: 1,
      published: true,
      content: {
        title: 'React Komponentlari va JSX Asoslari',
        learningObjective: 'Saytni alohida mustaqil lego g‘ishtchalaridek (komponentlar) qurishni o‘rganish.',
        realLifeAnalogy: 'Lego konstruktorini o‘ynaganmisiz? Har bir g‘ishtcha mustaqil, chiroyli va istalgan joyda qayta ishlatiladi. React ham aynan shunday! Sahifadagi "Tugma", "Foydalanuvchi kartasi" yoki "Qidiruv paneli" alohida komponent sifatida bir marta yoziladi va butun sayt bo‘ylab 100 marta qayta ishlatiladi.',
        theory: [
          {
            type: 'heading',
            content: 'React — Dunyodagi 1-Raqamli UI Kutubxona',
          },
          {
            type: 'text',
            content: 'React — Meta (Facebook) tomonidan yaratilgan kutubxona bo‘lib, zamonaviy interaktiv Single Page Applications (SPA) yaratishda standart hisoblanadi.',
          },
          {
            type: 'heading',
            content: 'Komponent nima?',
          },
          {
            type: 'text',
            content: 'React komponenti — bu oddiy JavaScript funksiyasi bo‘lib, u ekranga nima chiqishi kerakligini JSX formatida qaytaradi (return qiladi). Komponent nomlari har doim Bosh Harf bilan boshlanadi: Button, UserCard, Navbar.',
          },
        ],
        interactiveExample: {
          title: 'Birinchi React komponenti',
          description: 'Props qabul qiluvchi oddiy React komponenti.',
          language: 'javascript',
          code: `function WelcomeCard({ name, role }) {\n  return \`Karta: \${name} - \${role}\`;\n}\n\nconst userUI = WelcomeCard({ name: "Jahongir", role: "Frontend Dasturchi" });\nconsole.log(userUI);`,
          expectedOutput: "Karta: Jahongir - Frontend Dasturchi",
          lineExplanations: {
            1: 'WelcomeCard komponenti props qabul qiladi.',
            5: 'Komponent ishga tushirilib, natija olinadi.',
          },
        },
        commonMistakes: [
          {
            title: 'Komponent nomini kichik harf bilan yozish',
            wrongCode: '// function userCard() { return <div/>; } (React buni oddiy HTML tegi deb o‘ylaydi)',
            correctCode: '// function UserCard() { return <div/>; } (Har doim bosh harf bilan boshlanishi shart)',
            explanation: 'React faqat bosh harf bilan boshlangan funksiyalarnigina komponent sifatida tan oladi.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-react-1-1',
            question: 'React komponentlari qaysi harf bilan boshlanishi shart?',
            type: 'multiple-choice',
            options: ['Kichik harf bilan', 'Bosh (katta) harf bilan', 'Raqam bilan', '_ belgisi bilan'],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! React komponentlari har doim Katta (Bosh) harf bilan boshlanadi.',
          },
        ],
        summary: 'Siz React komponentlari va JSX tushunchalarini o‘rgandingiz.',
        nextLessonSlug: 'usestate-va-hodisalar',
        nextLessonTitle: 'State Boshqaruvi va useState Hooki',
      },
    },
    exercise: {
      id: 'ex-react-1',
      lessonId: 'les-react-1',
      title: 'React Komponent Funksiyasini Yozing',
      description: 'Title qabul qilib, uni formatlab qaytaruvchi BadgedButton komponentini tuzing.',
      instructions: [
        'BadgedButton nomli funksiya e’lon qiling.',
        'U { label } obyektini parametr sifatida qabul qilsin va "[ " + label + " ]" qiymatini qaytarsin.',
        'console.log(BadgedButton({ label: "Kursni boshlash" })) orqali chiqaring.',
      ],
      starterCode: `// React komponentini yozing\nfunction BadgedButton({ label }) {\n  return "[ " + label + " ]";\n}\n\nconsole.log(BadgedButton({ label: "Kursni boshlash" }));\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-react-1-1',
          description: 'Natijada "[ Kursni boshlash ]" chiqishi kerak',
          expectedOutput: '[ Kursni boshlash ]',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: BadgedButton funksiyasi label qabul qilsin va "[ " + label + " ]" qaytarsin.',
      ],
      solutionExplanation: 'React funksiyalari props qabul qilib dinamik UI qaytaradi.',
      passingScore: 100,
      expectedConcepts: ['component', 'props', 'react'],
    },
  },

  // ============================================================
  // 6. KIBERXAVFSIZLIK VA WEB HIMOYASI
  // ============================================================
  {
    lesson: {
      id: 'les-sec-1',
      moduleId: 'mod-security-1',
      courseId: 'course-security',
      title: 'Veb Xavfsizlik: XSS va SQL Injection Himoyasi',
      slug: 'veb-xavfsizlik-xss-va-sql-injection',
      description: 'Eng mashhur ikki kiberxuruj: XSS (zararli skript kiritish) va SQL Injection (ma’lumotlar bazasini buzish) hamda ulardan himoyalanish.',
      objectives: [
        'XSS (Cross-Site Scripting) nima ekanini va undan saqlanishni bilish',
        'SQL Injection qanday sodir bo‘lishini va Parameterized Queries yordamida himoyalanishni o‘rganish',
        'Foydalanuvchi kiritgan har qanday ma’lumotga ishonmaslik (Sanitization) tamoyili',
      ],
      estimatedMinutes: 20,
      order: 1,
      published: true,
      content: {
        title: 'Veb Xavfsizlik: XSS va SQL Injection Himoyasi',
        learningObjective: 'Xakerlarning hiylalarini oldindan bilib, o‘z dasturlaringizni xavfsiz qalqon bilan ta’minlash.',
        realLifeAnalogy: 'Uy eshigingizga begona odam kelib, "Meni ichkariga kirit, men do‘stingman" desa, ishonmaysiz-ku, to‘g‘rimi? Veb xavfsizlikning 1-oltin qoidasi: "Never trust user input!" (Foydalanuvchi kiritgan ma’lumotga hech qachon ko‘r-ko‘rona ishonmang!). Qidiruv maydoniga yozilgan har qanday matn ichida zararli kod yashiringan bo‘lishi mumkin.',
        theory: [
          {
            type: 'heading',
            content: '1. XSS (Cross-Site Scripting)',
          },
          {
            type: 'text',
            content: 'Xaker izoh yoki ism o‘rniga <script>document.cookie</script> kabi zararli JavaScript kodini kiritadi. Agar sayt bu matnni tekshirmasdan boshqa foydalanuvchilarga ko‘rsatsa — ularning parollari o‘g‘irlanadi! Himoya: innerHTML ishlatmang, har doim textContent yoki React ning avtomatik xavfsiz qochirishidan (escaping) foydalaning.',
          },
          {
            type: 'heading',
            content: '2. SQL Injection',
          },
          {
            type: 'text',
            content: 'Xaker login maydoniga: admin\' OR \'1\'=\'1 deb yozadi. Agar backend so‘rovni to‘g‘ridan-to‘g‘ri matn qilib qo‘shsa, baza parolsiz ochilib ketadi! Himoya: Hech qachon SQL so‘rovini matn ulab (string concat) yozmang, har doim parametrlashtirilgan so‘rovlar (Prepared Statements: ?) ishlating.',
          },
        ],
        interactiveExample: {
          title: 'XSS xavfini zararsizlantirish (Sanitization)',
          description: 'Maxsus belgilarni zararsiz HTML entitilarga o‘girish.',
          language: 'javascript',
          code: `function sanitizeInput(dirtyText) {\n  return dirtyText\n    .replace(/</g, "&lt;")\n    .replace(/>/g, "&gt;");\n}\n\nconst attack = "<script>alert('hack')</script>";\nconst clean = sanitizeInput(attack);\n\nconsole.log("Xavfsiz matn: " + clean);`,
          expectedOutput: "Xavfsiz matn: &lt;script&gt;alert('hack')&lt;/script&gt;",
          lineExplanations: {
            2: '< va > belgilari &lt; va &gt; ga aylantirilib, brauzerda skript sifatida ishlamaydigan qilinadi.',
          },
        },
        commonMistakes: [
          {
            title: 'Parollarni ochiq matn holida saqlash',
            wrongCode: '// password: "meningparolim123" (Baza buzilsa, barcha parollar oshkor bo‘ladi!)',
            correctCode: '// passwordHash: "$2b$10$e8n...bcrypt_hash" (Har doim bcrypt bilan xesh qiling)',
            explanation: 'Dasturchilar ham, adminlar ham foydalanuvchining haqiqiy parolini bilmasligi shart.',
            language: 'javascript',
          },
        ],
        quiz: [
          {
            id: 'q-sec-1-1',
            question: 'SQL Injection xurujidan eng ishonchli himoya usuli nima?',
            type: 'multiple-choice',
            options: [
              'Saytni kechasi o‘chirib qo‘yish',
              'Parametrlashtirilgan so‘rovlar (Prepared Statements / ORM) ishlatish',
              'Faqat qisqa parollarga ruxsat berish',
              'Matnlarni teskari o‘qish',
            ],
            correctAnswer: 1,
            explanation: 'To‘g‘ri! Prepared Statements SQL so‘rovini va ma’lumotlarni alohida ajratib, inyektsiyani 100% to‘xtatadi.',
          },
        ],
        summary: 'Siz XSS va SQL Injection xatarlarini va ulardan himoyalanish sirlarini o‘rgandingiz.',
        nextLessonSlug: undefined,
        nextLessonTitle: undefined,
      },
    },
    exercise: {
      id: 'ex-sec-1',
      lessonId: 'les-sec-1',
      title: 'Xavfsiz Sanitizatsiya Funksiyasini Yozing',
      description: 'Kiritilgan matndagi barcha "<" va ">" belgilarini xavfsiz formatga o‘tkazuvchi funksiyani yozing.',
      instructions: [
        'makeSafe nomli funksiya yozing.',
        'U berilgan matn ichidagi "<" belgisini "&lt;" ga va ">" belgisini "&gt;" ga almashtirsin.',
        'console.log(makeSafe("<script>")) orqali chiqaring.',
      ],
      starterCode: `// XSS himoya funksiyasini yozing\nfunction makeSafe(input) {\n  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");\n}\n\nconsole.log(makeSafe("<script>"));\n`,
      language: 'javascript',
      difficulty: 'easy',
      testCases: [
        {
          id: 'tc-sec-1-1',
          description: 'Natijada "&lt;script&gt;" chiqishi kerak',
          expectedOutput: '&lt;script&gt;',
          type: 'contains',
        },
      ],
      hiddenTests: [],
      hints: [
        '1-bosqich: input.replace(/</g, "&lt;").replace(/>/g, "&gt;") ifodasini return qiling.',
      ],
      solutionExplanation: 'Zararsizlantirish (escaping) foydalanuvchilar brauzerini xakerlikdan himoya qiladi.',
      passingScore: 100,
      expectedConcepts: ['security', 'sanitization', 'xss'],
    },
  },
];
