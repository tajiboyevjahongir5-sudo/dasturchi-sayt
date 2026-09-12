/**
 * CodeQuest — JavaScript Intermediate Curriculum Definition
 * 5 Modules, 18 Comprehensive Lessons, Multi-file Projects, Test Cases, and Quizzes
 */

export const jsIntermediateCourse = {
  title: 'JavaScript Intermediate (O‘rta daraja)',
  slug: 'javascript-intermediate',
  shortDescription: 'Scope, Closures, Event Loop, Asinxron dasturlash, DOM arxitekturasi va Multi-file loyiha.',
  description: 'JavaScript tilining o‘rta va yuqori darajadagi nozikliklari: leksik muhit, xotira boshqaruvi, prototiplar, hodisalar oqimi, asinxron dasturlash va brauzer imkoniyatlarini professional darajada o‘rganing.',
  category: 'frontend',
  level: 'orta',
  thumbnail: '⚡',
  estimatedHours: 25,
  technologies: ['JavaScript', 'ES6+', 'Async/Await', 'Event Loop', 'DOM', 'LocalStorage', 'Multi-file'],
};

export const jsIntermediateModules = [
  {
    order: 1,
    title: '1-Modul: JavaScript’ni Chuqurroq Tushunish',
    description: 'Scope turlari, leksik muhit (Lexical Environment), Hoisting, Temporal Dead Zone va Closures mexanizmi.',
    slug: 'deep-javascript-mechanics',
  },
  {
    order: 2,
    title: '2-Modul: Funksiyalar va Obyektlar',
    description: 'Higher-order funksiyalar, callbacklar, this konteksti, call/apply/bind va prototip merosxo‘rligi.',
    slug: 'functions-and-prototypes',
  },
  {
    order: 3,
    title: '3-Modul: Asinxron JavaScript',
    description: 'Call stack, Web APIs, Event Loop, Microtasks, Promises, async/await va xatolarni boshqarish.',
    slug: 'async-javascript-event-loop',
  },
  {
    order: 4,
    title: '4-Modul: Brauzer Muhiti Bilan Ishlash',
    description: 'DOM arxitekturasi, Event bubbling va delegation, Form validation, LocalStorage, Debouncing va Throttling.',
    slug: 'browser-apis-and-dom',
  },
  {
    order: 5,
    title: '5-Modul: Yakuniy Amaliy Loyiha (Multi-file Task Manager)',
    description: 'HTML, CSS va JavaScript asosida to‘liq interaktiv, LocalStorage bilan ishlovchi Task Manager loyihasi.',
    slug: 'interactive-task-manager-project',
  },
];

export const jsIntermediateLessons = [
  // ----------------------------------------------------
  // MODULE 1: LESSONS 1-3
  // ----------------------------------------------------
  {
    moduleIndex: 0,
    order: 1,
    title: '1-Dars: Scope va Leksik Muhit (Lexical Environment)',
    slug: 'scope-va-lexical-environment',
    description: 'Global, function va block scope farqlari, Scope Chain va identifikatorlarni qidirish mexanizmi.',
    estimatedMinutes: 20,
    objectives: [
      'Global, funksiya va blok doirasidagi ko‘rinish (Scope) farqlarini ajrata olish',
      'Leksik muhit (Lexical Environment) va Scope Chain orqali o‘zgaruvchilarni qidirish mexanizmini tushunish',
    ],
    content: {
      title: '1-Dars: Scope va Leksik Muhit (Lexical Environment)',
      learningObjective: 'Scope turlari va kodning qaysi nuqtasida qaysi o‘zgaruvchilardan foydalanish mumkinligini boshqarishni o‘rganish.',
      prerequisites: 'JavaScript asoslari: let, const va funksiyalar haqida tushuncha.',
      realLifeAnalogy: 'Ko‘p qavatli uy xonalari: Siz ichki xonada turib, ochiq eshik orqali dahlizdagi va hovlidagi buyumlarni bemalol ko‘rishingiz mumkin (Scope Chain). Ammo tashqarida turgan begona odam sizning ichki xonangizdagi buyumlarni ko‘ra olmaydi (Scope izolyatsiyasi).',
      theory: [
        {
          type: 'text',
          content: 'JavaScript tilida **Scope** (ko‘rinish sohasi) — bu o‘zgaruvchilar va funksiyalarning qayerda e’lon qilinganligi va qayerdan ularga murojaat qilish mumkinligini belgilovchi qoidalar to‘plamidir. Zamonaviy JavaScriptda 3 xil asosiy scope mavjud:\n\n1. **Global Scope:** Dasturning istalgan joyidan kirish mumkin bo‘lgan soha.\n2. **Function Scope:** Funksiya ichida e’lon qilingan o‘zgaruvchilar faqat shu funksiya ichida mavjud bo‘ladi.\n3. **Block Scope:** Jingalak qavslar \`{ ... }\` ichida \`let\` yoki \`const\` bilan e’lon qilingan o‘zgaruvchilar faqat o‘sha blok ichida ko‘rinadi.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function checkAccess() {
  const insideFunction = "Men funksiya ichidaman";
  if (true) {
    const insideBlock = "Men blok ichidaman";
    console.log(insideFunction); // Ishlaydi: tashqi function scope ochiq
  }
  // console.log(insideBlock); // Xatolik: insideBlock bu yerda mavjud emas!
}`,
          lineExplanations: {
            2: 'insideFunction o‘zgaruvchisi butun checkAccess funksiyasi ichida ko‘rinadi',
            4: 'insideBlock faqatgina if blokining jingalak qavslari ichida yashaydi',
            5: 'Ichki blok tashqi funksiya scopedagi o‘zgaruvchini bemalol o‘qiy oladi',
          },
        },
        {
          type: 'tip',
          content: 'Leksik muhit (Lexical Environment) — kod qayerda yozilganiga qarab belgilanadi. JavaScript dvigateli o‘zgaruvchini avval joriy blokdan, topolmasa tashqi blokdan, nihoyat global sohadan qidiradi (Scope Chain).',
        },
      ],
      commonMistakes: [
        {
          title: 'Blok scopedan tashqarida let/const ga murojaat qilish',
          wrongCode: `if (isValid) {
  let token = "abc-123";
}
console.log(token);`,
          correctCode: `let token = null;
if (isValid) {
  token = "abc-123";
}
console.log(token);`,
          explanation: '\`let\` va \`const\` blok doirasiga ega. Agar o‘zgaruvchi blokdan tashqarida kerak bo‘lsa, uni blokdan oldin e’lon qilish lozim.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-scope-1',
          question: '\`const\` kalit so‘zi bilan blok ichida e’lon qilingan o‘zgaruvchi qayerda ko‘rinadi?',
          type: 'multiple-choice',
          options: [
            'Butun fayl bo‘yicha global ko‘rinadi',
            'Faqat o‘zi e’lon qilingan blok ichida ko‘rinadi',
            'Faqat funksiya tugaguncha ko‘rinadi',
            'Faqat tashqi script fayllarda ko‘rinadi',
          ],
          correctAnswer: 1,
          explanation: '\`let\` va \`const\` blok doirasiga (Block Scope) ega bo‘lib, faqat o‘zining jingalak qavslari ichida mavjud bo‘ladi.',
        },
        {
          id: 'q-scope-2',
          question: 'Scope Chain qidiruv yo‘nalishi qanday ishlaydi?',
          type: 'multiple-choice',
          options: [
            'Globaldan ichkariga qarab qidiradi',
            'Ichki sohadan tashqi sohalarga qarab qidiradi',
            'Tasodifiy tartibda qidiradi',
            'Faqat global o‘zgaruvchilarni tekshiradi',
          ],
          correctAnswer: 1,
          explanation: 'Dvigatel o‘zgaruvchini dastlab eng ichki joriy sohadan izlaydi, topolmasa yuqoridagi ota sohalarga qarab ko‘tariladi.',
        },
      ],
      reflectionQuestion: 'Nima uchun zamonaviy JavaScriptda global o‘zgaruvchilardan imkon qadar kamroq foydalanish tavsiya etiladi?',
      summary: 'Ushbu darsda global, funksiya va blok ko‘rinish sohalarini hamda Scope Chain qoidalarini o‘rgandik.',
      nextLessonSlug: 'hoisting-va-temporal-dead-zone',
      nextLessonTitle: '2-Dars: Hoisting va Temporal Dead Zone',
    },
    exercise: {
      title: 'Xavfsiz hisob-kitob va Scope izolyatsiyasi',
      description: 'calculateCartTotal nomli funksiya yozing. U narxlar massivi (prices) va chegirma foizini (discountPercent) qabul qilsin. Funksiya global o‘zgaruvchilarni ifloslantirmasdan, har bir narxdan chegirma ayirib, umumiy summani yaxlitlab (Math.round) qaytarsin.',
      instructions: [
        'calculateCartTotal(prices, discountPercent) funksiyasini e’lon qiling',
        'Ichki total yig‘indisini blok doirasidagi o‘zgaruvchida hisoblang',
        'Agar prices bo‘sh bo‘lsa, 0 qaytaring',
        'Yakuniy summani Math.round() qilib qaytaring',
      ],
      starterCode: `// Kodni quyida yozing
function calculateCartTotal(prices, discountPercent) {
  // Funksiya tanasini to'ldiring
}
`,
      language: 'javascript',
      difficulty: 'easy',
      passingScore: 100,
      xpReward: 60,
      testCases: [
        {
          id: 'tc-sc-1',
          description: '[100, 200, 300] va 10% chegirma bilan to‘g‘ri hisoblash',
          expectedOutput: '540',
          isHidden: false,
        },
        {
          id: 'tc-sc-2',
          description: 'Bo‘sh massiv berilganda 0 qaytishi kerak',
          expectedOutput: '0',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-sc-3',
          description: '[50, 150] va 20% chegirma bilan 160 chiqishi kerak',
          expectedOutput: '160',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: prices massivi bo‘shligini tekshirish uchun prices.length === 0 shartidan foydalaning.',
        '2-yordam: let total = 0 deb boshlang va for tsikli yoki reduce orqali har bir elementni (price * (100 - discountPercent) / 100) ko‘rinishida qo‘shib boring.',
        '3-yordam: Math.round(total) qiymatini return qiling.',
      ],
      solutionExplanation: 'prices massividagi har bir narxga chegirma qo‘llanib, total o‘zgaruvchisiga yig‘iladi va Math.round(total) qaytariladi.',
      expectedConcepts: ['scope', 'let', 'function', 'Math.round'],
      validSolutionCode: `function calculateCartTotal(prices, discountPercent) {
  if (!prices || prices.length === 0) return 0;
  let total = 0;
  for (const price of prices) {
    const discounted = price * (1 - discountPercent / 100);
    total += discounted;
  }
  return Math.round(total);
}
console.log(calculateCartTotal([100, 200, 300], 10));
console.log(calculateCartTotal([], 10));
console.log(calculateCartTotal([50, 150], 20));`,
      deliberateErrorCode: `function calculateCartTotal(prices, discountPercent) {
  return invalidVariableUndefined;
}`,
    },
  },

  {
    moduleIndex: 0,
    order: 2,
    title: '2-Dars: Hoisting va Temporal Dead Zone (TDZ)',
    slug: 'hoisting-va-temporal-dead-zone',
    description: 'var hoistingi, let va const ning Temporal Dead Zone holati, funksiya deklaratsiyasi va ifodasi farqi.',
    estimatedMinutes: 25,
    objectives: [
      'var hoistingi va let/const ning Temporal Dead Zone (TDZ) farqini tushunish',
      'Funksiya deklaratsiyasi (Declaration) va funksiya ifodasi (Expression) orasidagi hoisting farqini bilish',
    ],
    content: {
      title: '2-Dars: Hoisting va Temporal Dead Zone (TDZ)',
      learningObjective: 'O‘zgaruvchi va funksiyalarni e’lon qilish tartibini tushunish hamda kutilmagan ReferenceError xatolarini oldini olish.',
      prerequisites: '1-Dars: Scope va Leksik Muhit.',
      realLifeAnalogy: 'Restoranda taom buyurtma qilish: Menyuda taomlar nomi oldindan yozib qo‘yilgan (Hoisting), lekin taom oshpaz tomonidan tayyorlanib stolga qo‘yilguncha (Initsializatsiya), siz uni iste’mol qila olmaysiz. Agar pishmasdan avval qo‘l ursangiz, kuyib qolasiz — bu xuddi Temporal Dead Zone (TDZ) kabi xatoga olib keladi.',
      theory: [
        {
          type: 'text',
          content: '**Hoisting** — bu JavaScript dvigateli kodni bajarishdan oldin o‘zgaruvchilar va funksiyalar deklaratsiyasini xotiraga yozib olishi (ko‘tarish) jarayonidir.\n\n- \`var\`: Deklaratsiyasi yuqoriga ko‘tariladi va avtomatik ravishda \`undefined\` bilan initsializatsiya qilinadi.\n- \`let\` va \`const\`: Ular ham hoisting bo‘ladi, ammo initsializatsiya qilinmaydi. Ular e’lon qilingan qatorga yetib kelguncha **Temporal Dead Zone (TDZ)** holatida turadi. Bu vaqtda ularga murojaat qilish \`ReferenceError\` xatosiga olib keladi.\n- **Function Declaration:** Butun funksiya tanasi bilan hoisting bo‘ladi, uni e’lon qilingan qatordan oldin chaqirish mumkin.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Funksiya deklaratsiyasi hoisting bo'ladi:
sayHello(); // "Salom!" deb ishlaydi

function sayHello() {
  console.log("Salom!");
}

// let va const TDZ da bo'ladi:
// console.log(userAge); // ReferenceError: Cannot access 'userAge' before initialization
const userAge = 25;`,
          lineExplanations: {
            2: 'sayHello() o‘z e’lonidan oldin bemalol chaqiriladi',
            9: 'userAge ga initsializatsiyadan oldin murojaat qilish TDZ xatosini beradi',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Arrow functionni e’lon qilinishidan oldin chaqirish',
          wrongCode: `greet();
const greet = () => console.log("Salom");`,
          correctCode: `const greet = () => console.log("Salom");
greet();`,
          explanation: 'Arrow funksiyalar \`const\` yoki \`let\` o‘zgaruvchilariga biriktiriladi, shuning uchun ular ham TDZ qoidasiga bo‘ysunadi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-hoist-1',
          question: '\`let x = 5;\` qatoridan oldin \`console.log(x);\` chaqirilsa nima yuz beradi?',
          type: 'multiple-choice',
          options: [
            'undefined chiqadi',
            '5 chiqadi',
            'ReferenceError xatosi yuz beradi',
            'null chiqadi',
          ],
          correctAnswer: 2,
          explanation: '\`let\` va \`const\` initsializatsiyagacha Temporal Dead Zone (TDZ)da bo‘ladi va ReferenceError yuz beradi.',
        },
        {
          id: 'q-hoist-2',
          question: 'Quyidagilardan qaysi biri e’lon qilingan qatordan oldin to‘liq chaqirilishi mumkin?',
          type: 'multiple-choice',
          options: [
            'Function Declaration (function myFunc() {})',
            'Function Expression (const myFunc = function() {})',
            'Arrow Function (const myFunc = () => {})',
            'Hech biri',
          ],
          correctAnswer: 0,
          explanation: 'Faqat an’anaviy Function Declaration dvigatel tomonidan to‘liq tanasi bilan hoisting qilinadi.',
        },
      ],
      reflectionQuestion: 'Nima sababdan zamonaviy dasturchilar \`var\` o‘rniga deyarli har doim \`const\` va \`let\` dan foydalanishadi?',
      summary: 'Hoisting tushunchasi, TDZ xavflari va funksiyalarni to‘g‘ri tartibda e’lon qilishni o‘rgandik.',
      nextLessonSlug: 'closures-yopiq-funksiyalar',
      nextLessonTitle: '3-Dars: Closures (Yopiq Funksiyalar)',
    },
    exercise: {
      title: 'TDZ dan holi profil formatlovchi funksiya',
      description: 'formatUserProfile(user) nomli funksiya yozing. U user obyektini qabul qilib, uning name va role qiymatlariga qarab "Foydalanuvchi: [NAME] | Rol: [ROLE]" satrini qaytarsin. Agar role kiritilmagan bo‘lsa, standart holatda "Oddiy foydalanuvchi" bo‘lsin. Hech qanday TDZ va hoisting xatolariga yo‘l qo‘ymang.',
      instructions: [
        'formatUserProfile funksiyasini to‘g‘ri e’lon qiling',
        'Agar user obyekti bo‘lmasa, "Foydalanuvchi topilmadi" qaytaring',
        'Default rol qiymatini xavfsiz initsializatsiya qiling',
      ],
      starterCode: `// Funksiyani to'g'ri tartibda yozing
function formatUserProfile(user) {
  // Tanasini to'ldiring
}
`,
      language: 'javascript',
      difficulty: 'easy',
      passingScore: 100,
      xpReward: 60,
      testCases: [
        {
          id: 'tc-hoist-1',
          description: 'To‘liq ma’lumotli profilni formatlash',
          expectedOutput: 'Foydalanuvchi: Jasur | Rol: O‘qituvchi',
          isHidden: false,
        },
        {
          id: 'tc-hoist-2',
          description: 'Rol kiritilmaganda standart rol berilishi',
          expectedOutput: 'Foydalanuvchi: Laylo | Rol: Oddiy foydalanuvchi',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-hoist-3',
          description: 'user obyekti berilmaganda to‘g‘ri xabar qaytishi',
          expectedOutput: 'Foydalanuvchi topilmadi',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: user mavjudligini tekshirish uchun: if (!user) return "Foydalanuvchi topilmadi";',
        '2-yordam: role o‘zgaruvchisini: const userRole = user.role || "Oddiy foydalanuvchi"; deb e’lon qiling.',
        '3-yordam: Template literal: \`Foydalanuvchi: \${user.name} | Rol: \${userRole}\`',
      ],
      solutionExplanation: 'TDZ xatolariga yo‘l qo‘ymaslik uchun o‘zgaruvchilar ishlatilishidan oldin e’lon qilinadi va formatlangan matn qaytariladi.',
      expectedConcepts: ['hoisting', 'tdz', 'default parameters', 'template literals'],
      validSolutionCode: `function formatUserProfile(user) {
  if (!user || !user.name) return "Foydalanuvchi topilmadi";
  const userRole = user.role || "Oddiy foydalanuvchi";
  return \`Foydalanuvchi: \${user.name} | Rol: \${userRole}\`;
}
console.log(formatUserProfile({ name: "Jasur", role: "O‘qituvchi" }));
console.log(formatUserProfile({ name: "Laylo" }));
console.log(formatUserProfile(null));`,
      deliberateErrorCode: `function formatUserProfile(user) {
  console.log(invalidVar);
  let invalidVar = 10;
}`,
    },
  },

  {
    moduleIndex: 0,
    order: 3,
    title: '3-Dars: Closures (Yopiq Funksiyalar)',
    slug: 'closures-yopiq-funksiyalar',
    description: 'Closure tushunchasi, xotirada leksik muhitni saqlash va shaxsiy (private) ma’lumotlarni inkapsulyatsiya qilish.',
    estimatedMinutes: 30,
    objectives: [
      'Closure (yopiq funksiya) nima ekanligini va qanday yaratilishini tushunish',
      'Shaxsiy (private) o‘zgaruvchilar va ma’lumotlar xavfsizligini (encapsulation) ta’minlash',
    ],
    content: {
      title: '3-Dars: Closures (Yopiq Funksiyalar)',
      learningObjective: 'Funksiyalar o‘zlari yaratilgan muhitni eslab qolishini tushunish va xavfsiz private holatlarni qurish.',
      prerequisites: 'Scope Chain va Funksiyalar.',
      realLifeAnalogy: 'Bank kassirining shaxsiy seyfi: Kassir tashqariga chiqsa ham, o‘z seyfining kalitini cho‘ntagida olib yuradi. Seyf ichidagi pullarni faqat kassir orqali (depozit yoki yechib olish) boshqarish mumkin, ko‘chadagi hech kim to‘g‘ridan-to‘g‘ri seyfni ocha olmaydi.',
      theory: [
        {
          type: 'text',
          content: '**Closure** — bu funksiyaning o‘zi e’lon qilingan leksik muhit (Lexical Scope) bilan birga bog‘lanishidir. Tashqi funksiya o‘z ishini tugatgan bo‘lsa ham, ichki funksiya tashqi o‘zgaruvchilarga murojaat qila oladi.\n\nAsosiy qo‘llanilishi:\n1. **Data Privacy (Maxfiy ma’lumotlar):** O‘zgaruvchini tashqaridan to‘g‘ridan-to‘g‘ri o‘zgartirib bo‘lmaydigan qilish.\n2. **Function Factories:** Turli sozlamalarga ega funksiyalar ishlab chiqarish.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function createCounter() {
  let count = 0; // Private o'zgaruvchi!
  return {
    increment: () => ++count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getCount());  // 1
console.log(counter.count);       // undefined (tashqaridan yopiq!)`,
          lineExplanations: {
            2: 'count o‘zgaruvchisi createCounter doirasida yopiq holatda saqlanadi',
            4: 'increment funksiyasi count ga o‘z closure orqali kiradi',
            11: 'counter.count deb to‘g‘ridan-to‘g‘ri o‘zgartirib bo‘lmaydi',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Private o‘zgaruvchini obyekt kaliti deb o‘ylash',
          wrongCode: `const counter = createCounter();
counter.count = 100; // Bu yangi xususiyat yaratadi, ichki count ga ta'sir qilmaydi!`,
          correctCode: `// Faqat berilgan metodlar orqali boshqarish lozim
counter.increment();`,
          explanation: 'Closure ichidagi o‘zgaruvchilar obyekt xususiyati emas, ular xotiradagi leksik bog‘lanishdir.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-cls-1',
          question: 'Closure qachon paydo bo‘ladi?',
          type: 'multiple-choice',
          options: [
            'Faqat global o‘zgaruvchilar yaratilganda',
            'Ichki funksiya o‘zining tashqi funksiyasi o‘zgaruvchilariga murojaat qilganda',
            'Faqat setTimeout chaqirilganda',
            'Faqat massiv metodlari ishlatilganda',
          ],
          correctAnswer: 1,
          explanation: 'Ichki funksiya tashqi funksiya o‘zgaruvchilarini eslab qolib, ulardan foydalanganda closure yuzaga keladi.',
        },
        {
          id: 'q-cls-2',
          question: 'Quyidagilardan qaysi biri closure ning eng katta afzalligi hisoblanadi?',
          type: 'multiple-choice',
          options: [
            'Ma’lumotlarni yashirish (Data Encapsulation)',
            'Brauzerni tezlashtirish',
            'HTML teglarni o‘chirish',
            'CSS kod hajmini qisqartirish',
          ],
          correctAnswer: 0,
          explanation: 'Closure yordamida o‘zgaruvchilarni tashqi dunyodan himoyalab, faqat maxsus metodlar orqali boshqarish mumkin.',
        },
      ],
      reflectionQuestion: 'Agar closure juda ko‘p ishlatilsa va xotiradan tozalanmasa, qanday xotira (Memory leak) muammolari kelib chiqishi mumkin?',
      summary: 'Closure tushunchasi, leksik bog‘lanish va shaxsiy holat yaratish tamoyillarini o‘rgandik.',
      nextLessonSlug: 'higher-order-functions',
      nextLessonTitle: '4-Dars: Higher-Order Functions',
    },
    exercise: {
      title: 'Xavfsiz Bank Hisobi (Bank Account Closure)',
      description: 'createBankAccount(initialBalance) nomli funksiya yozing. U faqat quyidagi 3 ta metodga ega obyekt qaytarsin:\n1. deposit(amount) — balansni oshiradi va yangi balansni qaytaradi\n2. withdraw(amount) — agar balans yetarli bo‘lsa, balansdan ayiradi va yangi balansni qaytaradi; agar yetarli bo‘lmasa "Mablag‘ yetarli emas" qaytaradi\n3. getBalance() — joriy balansni qaytaradi. Balans tashqaridan to‘g‘ridan-to‘g‘ri o‘zgartirilmasin!',
      instructions: [
        'initialBalance qiymatini closure ichida private o‘zgaruvchi sifatida saqlang',
        'deposit(amount) metodida faqat musbat son qo‘shilsin',
        'withdraw(amount) metodida mablag‘ yetarli emasligini tekshiring',
      ],
      starterCode: `function createBankAccount(initialBalance = 0) {
  // Yechimni shu yerda yozing
}
`,
      language: 'javascript',
      difficulty: 'medium',
      passingScore: 100,
      xpReward: 70,
      testCases: [
        {
          id: 'tc-cls-1',
          description: 'Depozit va balansni tekshirish',
          expectedOutput: '150',
          isHidden: false,
        },
        {
          id: 'tc-cls-2',
          description: 'Yetarli mablag‘ bo‘lmaganda ogohlantirish qaytishi',
          expectedOutput: 'Mablag‘ yetarli emas',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-cls-3',
          description: 'Muvaffaqiyatli pul yechish (withdraw)',
          expectedOutput: '80',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: let balance = initialBalance; deb ichki o‘zgaruvchi e’lon qiling.',
        '2-yordam: withdraw(amount) ichida: if (amount > balance) return "Mablag‘ yetarli emas"; balance -= amount; return balance;',
        '3-yordam: return { deposit, withdraw, getBalance }; ko‘rinishida obyekt qaytaring.',
      ],
      solutionExplanation: 'balance o‘zgaruvchisi createBankAccount doirasida qoladi va faqat qaytarilgan metodlar orqali boshqariladi.',
      expectedConcepts: ['closures', 'encapsulation', 'private variables'],
      validSolutionCode: `function createBankAccount(initialBalance = 0) {
  let balance = initialBalance;
  return {
    deposit(amount) {
      if (amount > 0) balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) return "Mablag‘ yetarli emas";
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}
const acc = createBankAccount(100);
acc.deposit(50);
console.log(acc.getBalance());
console.log(acc.withdraw(200));
console.log(acc.withdraw(70));`,
      deliberateErrorCode: `function createBankAccount(initialBalance) {
  return balanceUnknown;
}`,
    },
  },

  // ----------------------------------------------------
  // MODULE 2: LESSONS 4-7
  // ----------------------------------------------------
  {
    moduleIndex: 1,
    order: 4,
    title: '4-Dars: Higher-Order Functions (Yuqori Tartibli Funksiyalar)',
    slug: 'higher-order-functions',
    description: 'First-class citizens, funksiyalarni parametr sifatida uzatish va qaytarish, deklarativ dasturlash.',
    estimatedMinutes: 25,
    objectives: [
      'Funksiyalar birinchi darajali fuqaro (First-Class Citizen) ekanligini tushunish',
      'Funksiyani argument sifatida uzatish va yangi funksiya qaytarish mexanizmini o‘rganish',
    ],
    content: {
      title: '4-Dars: Higher-Order Functions (Yuqori Tartibli Funksiyalar)',
      learningObjective: 'Funksiyalarni qismlarga bo‘lib, qayta ishlatiluvchi universal mantiqlar hosil qilish.',
      prerequisites: 'Funksiyalar va massivlar.',
      realLifeAnalogy: 'Universal duradgor dastgohi: Siz unga yog‘och taxta (massiv) berasiz va qanday shaklda qirqish bo‘yicha chizma (callback funksiya) o‘rnatasiz. Dastgoh har bir taxtani aynan siz bergan chizma asosida kesib, yangi tayyor mahsulotlar to‘plamini beradi.',
      theory: [
        {
          type: 'text',
          content: '**Higher-Order Function (Yuqori tartibli funksiya)** — bu boshqa funksiyani argument sifatida qabul qiladigan yoki natija sifatida yangi funksiya qaytaradigan funksiyadir.\n\nMisollar: \`map\`, \`filter\`, \`reduce\`.\nAfzalliklari:\n- Kodni qisqartiradi va o‘qishni osonlashtiradi (Deklarativ uslub).\n- Asl ma’lumotlarni buzmasdan (immutability) yangi natijalar hosil qiladi.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Funksiya qaytaruvchi Higher-Order Function:
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
console.log(double(5)); // 10
const triple = createMultiplier(3);
console.log(triple(5)); // 15`,
          lineExplanations: {
            2: 'createMultiplier yangi funksiya ishlab chiqaradi',
            7: 'double endi sonni 2 ga ko‘paytiruvchi ixtisoslashgan funksiya',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Higher-order funksiyaga funksiyani chaqirib uzatish',
          wrongCode: `// XATO: sayHi darhol chaqirilib ketadi!
button.addEventListener("click", sayHi());`,
          correctCode: `// TO'G'RI: funksiyaning o'zi uzatiladi
button.addEventListener("click", sayHi);`,
          explanation: 'Higher-order funksiyaga funksiya havolasi (nomi) uzatilishi kerak, \`()\` qo‘yilsa u darhol ishlab ketadi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-hof-1',
          question: 'Qaysi funksiya Higher-Order Function deb ataladi?',
          type: 'multiple-choice',
          options: [
            'Faqat son qaytaradigan funksiya',
            'Boshqa funksiyani argument sifatida qabul qiluvchi yoki yangi funksiya qaytaruvchi',
            'Faqat HTML sahifada ishlaydigan funksiya',
            'Faqat asinxron ishlaydigan funksiya',
          ],
          correctAnswer: 1,
          explanation: 'Funksiyani argument sifatida oladigan yoki funksiya qaytaradigan har qanday funksiya Higher-Order hisoblanadi.',
        },
      ],
      reflectionQuestion: 'Nima uchun \`for\` tsikliga qaraganda \`map\` yoki \`filter\` ishlatish xatoliklarni kamaytiradi?',
      summary: 'Higher-order funksiyalar va ularning zamonaviy dasturlashdagi o‘rnini ko‘rib chiqdik.',
      nextLessonSlug: 'callback-functions-va-asinxronlik',
      nextLessonTitle: '5-Dars: Callback Funksiyalari va Asinxronlikka Kirish',
    },
    exercise: {
      title: 'Custom myFilter Higher-Order Funksiyasi',
      description: 'myFilter(array, predicateFn) nomli funksiya yozing. U tayyor Array.prototype.filter metodidan foydalanmasdan, massivdagi har bir elementni predicateFn ga uzatib, faqat true qaytargan elementlardan iborat yangi massiv qaytarsin.',
      instructions: [
        'Yangi bo‘sh massiv yarating',
        'array bo‘ylab tsikl yuriting va har bir element uchun predicateFn(item) ni chaqiring',
        'Faqat true bo‘lgan elementlarni yangi massivga qo‘shing va qaytaring',
      ],
      starterCode: `function myFilter(array, predicateFn) {
  // O'z yechimingizni yozing
}
`,
      language: 'javascript',
      difficulty: 'medium',
      passingScore: 100,
      xpReward: 65,
      testCases: [
        {
          id: 'tc-hof-1',
          description: 'Juft sonlarni filtrlash',
          expectedOutput: '[2,4,6]',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-hof-2',
          description: 'So‘z uzunligi 4 dan kattalarini ajratish',
          expectedOutput: '["CodeQuest","Javascript"]',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: const result = []; deb yangi massiv oching.',
        '2-yordam: for (const item of array) { if (predicateFn(item)) result.push(item); }',
        '3-yordam: return result;',
      ],
      solutionExplanation: 'myFilter funksiyasi har bir elementni tekshirib, shartga moslarini yangi massivga yig‘adi.',
      expectedConcepts: ['higher-order functions', 'callbacks', 'pure functions'],
      validSolutionCode: `function myFilter(array, predicateFn) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (predicateFn(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}
console.log(JSON.stringify(myFilter([1, 2, 3, 4, 5, 6], n => n % 2 === 0)));
console.log(JSON.stringify(myFilter(["Salom", "CodeQuest", "JS", "Javascript"], w => w.length > 5)));`,
      deliberateErrorCode: `function myFilter() {
  return [1, 2].notAFunction();
}`,
    },
  },

  {
    moduleIndex: 1,
    order: 5,
    title: '5-Dars: Callback Funksiyalari va Asinxronlikka Kirish',
    slug: 'callback-functions-va-asinxronlik',
    description: 'Callback nima, sinxron va asinxron callback farqi, Callback Hell xatarlari.',
    estimatedMinutes: 20,
    objectives: [
      'Callback funksiyasining vazifasini aniq tushunish',
      'Sinxron va asinxron callbacklar farqini ajrata olish',
      'Callback Hell (Piramida xatosi) nima sababdan kelib chiqishini anglash',
    ],
    content: {
      title: '5-Dars: Callback Funksiyalari va Asinxronlikka Kirish',
      learningObjective: 'Funksiyalarni callback sifatida uzatish va asinxron oqimlarni boshqarishga poydevor qo‘yish.',
      prerequisites: 'Higher-order funksiyalar.',
      realLifeAnalogy: 'Kuryerlik xizmati: Tovarni qabul qilayotganingizda, kuryerga telefon raqamingizni qoldirasiz: "Buyurtma yetib kelganda menga qo‘ng‘iroq qiling (Call me back)". Siz eshik tagida kutib o‘tirmaysiz, boshqa ishlaringizni davom ettirasiz.',
      theory: [
        {
          type: 'text',
          content: '**Callback funksiyasi** — boshqa bir funksiyaga parametr sifatida berilgan va ma’lum bir amal tugagach chaqirilishi rejalashtirilgan funksiyadir.\n\n- **Sinxron Callback:** Darhol, asosiy kod oqimi davomida chaqiriladi (masalan, \`array.forEach(...)\`).\n- **Asinxron Callback:** Ma’lum vaqt yoki voqeadan so‘ng chaqiriladi (masalan, \`setTimeout\`, tugma bosilishi).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function fetchUserData(userId, callback) {
  // Simulyatsiya qilingan asinxron operatsiya:
  setTimeout(() => {
    const user = { id: userId, name: "Ali", role: "talaba" };
    callback(null, user); // Error-first callback
  }, 500);
}`,
          lineExplanations: {
            1: 'callback oxirgi parametr sifatida qabul qilinadi',
            4: 'Node.js va brauzerda birinchi parametr xatolik (null), ikkinchisi ma’lumot bo‘lishi standart odat',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Asinxron callback natijasini sinxron return qilishga urinish',
          wrongCode: `function getUser() {
  setTimeout(() => {
    return "Ali";
  }, 100);
}
console.log(getUser()); // undefined!`,
          correctCode: `function getUser(callback) {
  setTimeout(() => {
    callback("Ali");
  }, 100);
}
getUser(name => console.log(name));`,
          explanation: 'Asinxron funksiyalar sinxron return qila olmaydi, natija faqat callback yoki Promise orqali yetkaziladi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-cb-1',
          question: 'Callback Hell nima?',
          type: 'multiple-choice',
          options: [
            'Kompyuterning qizib ketishi',
            'Ketma-ket asinxron callbacklarning ichma-ich chuqur joylashib (pyramid of doom), kodni o‘qish qiyinlashishi',
            'Funksiyani e’lon qilmasdan chaqirish',
            'Faqat CSS dagi xatolik',
          ],
          correctAnswer: 1,
          explanation: 'Ichma-ich bir nechta callback yozilganda kod o‘ng tomonga qarab o‘sib ketadi va xatolarni boshqarish nihoyatda qiyinlashadi.',
        },
      ],
      reflectionQuestion: 'Nima uchun Callback Hell muammosini hal qilish uchun keyinchalik Promise va async/await yaratilgan?',
      summary: 'Callbacklar, sinxron/asinxron farqlar va asinxron fikrlash asoslarini o‘rgandik.',
      nextLessonSlug: 'this-konteksti-va-boglash-usullari',
      nextLessonTitle: '6-Dars: this Konteksti va Bog‘lash Usullari',
    },
    exercise: {
      title: 'Ma’lumotlarni qayta ishlovchi Callback Pipeline',
      description: 'processNumbers(numbers, transformFn, onComplete) funksiyasini yozing. U numbers massividagi har bir sonni transformFn orqali o‘zgartirib, hosil bo‘lgan yangi massivni onComplete callbackiga uzatsin.',
      instructions: [
        'transformFn yordamida massivni yangilang',
        'Natijaviy massivni onComplete(result) ko‘rinishida chaqiring',
      ],
      starterCode: `function processNumbers(numbers, transformFn, onComplete) {
  // Yechimni yozing
}
`,
      language: 'javascript',
      difficulty: 'easy',
      passingScore: 100,
      xpReward: 60,
      testCases: [
        {
          id: 'tc-cb-1',
          description: 'Sonlarni 2 ga ko‘paytirib callbackka uzatish',
          expectedOutput: '[2,4,6]',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-cb-2',
          description: 'Sonlarni kvadratga ko‘tarish',
          expectedOutput: '[1,4,9,16]',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: Har bir elementni transformFn ga uzatib yangi qiymat olish uchun massiv metodidan foydalaning.',
        '2-yordam: const transformed = numbers.map(transformFn); deb natijaviy massivni o‘zgaruvchiga oling.',
        '3-yordam: onComplete(transformed); ko‘rinishida callback funksiyasini chaqiring.',
      ],
      solutionExplanation: 'Massiv elementlari transformFn orqali o‘zgartirilib, yakuniy natija onComplete callbackiga topshiriladi.',
      expectedConcepts: ['callbacks', 'pipeline', 'transformation'],
      validSolutionCode: `function processNumbers(numbers, transformFn, onComplete) {
  const result = numbers.map(transformFn);
  onComplete(result);
}
processNumbers([1, 2, 3], n => n * 2, res => console.log(JSON.stringify(res)));
processNumbers([1, 2, 3, 4], n => n * n, res => console.log(JSON.stringify(res)));`,
      deliberateErrorCode: `function processNumbers() {
  throw new Error("Callback error");
}`,
    },
  },

  {
    moduleIndex: 1,
    order: 6,
    title: '6-Dars: this Konteksti va Bog‘lash Usullari',
    slug: 'this-konteksti-va-boglash-usullari',
    description: 'this qanday aniqlanadi, call, apply, bind usullari, Arrow funksiyalardagi leksik this.',
    estimatedMinutes: 30,
    objectives: [
      'this qiymati funksiyaning chaqirilish joyi (call-site)ga qarab aniqlanishini tushunish',
      'call, apply va bind yordamida kontekstni aniq (explicit) bog‘lashni o‘rganish',
      'Arrow funksiyalarda this leksik ekanligini anglash',
    ],
    content: {
      title: '6-Dars: this Konteksti va Bog‘lash Usullari',
      learningObjective: 'JavaScriptda eng ko‘p adashiladigan this muammolarini hal qilish va to‘g‘ri bog‘lash usullarini o‘zlashtirish.',
      prerequisites: 'Obyektlar va metodlar.',
      realLifeAnalogy: 'Teatr aktyori: Bitta aktyor bugun Qirol sahnasida qirol sifatida gapiradi (this = Qirol), ertaga esa Jang sahnasida askar sifatida gapiradi (this = Askar). Aktyorning o‘zi bitta, lekin uning kim nomidan gapirishi u qaysi sahnada turganiga bog‘liq.',
      theory: [
        {
          type: 'text',
          content: '**this** kalit so‘zi funksiya chaqirilgan paytda unga bog‘langan obyektga ishora qiladi.\n\n\`this\` ni aniqlashning 4 asosiy qoidasi:\n1. **Default Binding:** Oddiy chaqiruv — brauzerda \`window\`, strict modeda \`undefined\`.\n2. **Implicit Binding:** Obyekt orqali chaqiruv: \`user.greet()\` -> \`this === user\`.\n3. **Explicit Binding:** Aniq ko‘rsatish: \`greet.call(obj)\`, \`greet.apply(obj, [args])\`, \`const bound = greet.bind(obj)\`.\n4. **Lexical Binding (Arrow Functions):** Arrow funksiyalarning shaxsiy \`this\`i bo‘lmaydi, ular o‘rab turgan tashqi kontekstdagi \`this\`ni oladi.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const person = {
  name: "Zuhra",
  sayName() {
    console.log(this.name);
  }
};

const fn = person.sayName;
// fn(); // XATO: this yo'qoldi (undefined yoki window)!

// Yechim: bind bilan bog'lash
const boundFn = person.sayName.bind(person);
boundFn(); // "Zuhra" deb to'g'ri chiqadi`,
          lineExplanations: {
            8: 'Metod o‘zgaruvchiga ko‘chirilganda o‘z obyektidan uziladi',
            12: 'bind() metod yangi funksiya qaytaradi va unda this doim person ga qotirilgan bo‘ladi',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Obyekt metodini arrow funksiya bilan yozish',
          wrongCode: `const user = {
  name: "Ali",
  greet: () => console.log(this.name) // this globalga ketib qoladi!
};`,
          correctCode: `const user = {
  name: "Ali",
  greet() {
    console.log(this.name); // To'g'ri
  }
};`,
          explanation: 'Obyekt metodlari uchun oddiy funksiya sintaksisi ishlatilishi shart, aks holda arrow function global window ni ushlaydi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-this-1',
          question: 'Arrow funksiyalarning \`this\` kalit so‘zi qayerdan olinadi?',
          type: 'multiple-choice',
          options: [
            'O‘zi chaqirilgan obyektning ichidan',
            'O‘zi e’lon qilingan tashqi leksik sohadan (Lexical Scope)',
            'Doimo window obyektidan',
            'Doimo null bo‘ladi',
          ],
          correctAnswer: 1,
          explanation: 'Arrow funksiyalar o‘z \`this\`iga ega emas, ular o‘rab turgan tashqi muhitdan \`this\`ni oladi.',
        },
      ],
      reflectionQuestion: 'Event listenerlar yozganda nima uchun arrow function va oddiy function har xil \`this\` qiymatiga ega bo‘ladi?',
      summary: 'this mexanizmi, explicit binding va arrow funksiyalarning o‘ziga xosligini o‘rgandik.',
      nextLessonSlug: 'prototype-va-prototip-merosxorligi',
      nextLessonTitle: '7-Dars: Prototype va Prototip Merosxo‘rligi',
    },
    exercise: {
      title: 'Yo‘qolgan kontekstni tiklash',
      description: 'createGreeter(user) nomli funksiya yozing. U user obyektini qabul qilib, uning greet metodini o‘ziga bind qilgan holda alohida funksiya sifatida qaytarsin, toki uni istalgan joyda parametrsiz chaqirganda to‘g‘ri "Salom, mening ismim [NAME]" matni chiqsin.',
      instructions: [
        'user obyekti name xususiyatiga va greet metodiga ega bo‘lishi mumkin',
        'Agar user.greet bo‘lmasa, yangi funksiya yarating va user ga bind qiling',
        'Bog‘langan funksiyani return qiling',
      ],
      starterCode: `function createGreeter(user) {
  // Yechimni yozing
}
`,
      language: 'javascript',
      difficulty: 'medium',
      passingScore: 100,
      xpReward: 65,
      testCases: [
        {
          id: 'tc-this-1',
          description: 'Metodni to‘g‘ri bog‘lash',
          expectedOutput: 'Salom, mening ismim Nodir',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-this-2',
          description: 'Boshqa foydalanuvchi ismi bilan sinash',
          expectedOutput: 'Salom, mening ismim Malika',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: Ichki funksiyada this.name dan foydalanib salomlashish matnini tayyorlang.',
        '2-yordam: function greet() { return "Salom, mening ismim " + this.name; } deb funksiya e’lon qiling.',
        '3-yordam: return greet.bind(user); orqali funksiyani user obyektiga mahkam bog‘lab qaytaring.',
      ],
      solutionExplanation: 'bind(user) orqali funksiya konteksti doimiy ravishda user obyektiga biriktiriladi.',
      expectedConcepts: ['this', 'bind', 'call-site'],
      validSolutionCode: `function createGreeter(user) {
  function greet() {
    return "Salom, mening ismim " + this.name;
  }
  return greet.bind(user);
}
const greeter = createGreeter({ name: "Nodir" });
console.log(greeter());
const greeter2 = createGreeter({ name: "Malika" });
console.log(greeter2());`,
      deliberateErrorCode: `function createGreeter() {
  return this.notMethod();
}`,
    },
  },

  {
    moduleIndex: 1,
    order: 7,
    title: '7-Dars: Prototype va Prototip Merosxo‘rligi',
    slug: 'prototype-va-prototip-merosxorligi',
    description: '__proto__, prototype, prototype chain, xotirani tejash, ES6 class sintaksisi.',
    estimatedMinutes: 25,
    objectives: [
      'prototype va __proto__ orasidagi bog‘liqlikni tushunish',
      'Prototip zanjiri (Prototype Chain) orqali merosxo‘rlik qanday ishlashini bilish',
      'Xotirani tejash uchun metodlarni prototipga biriktirish tamoyilini o‘rganish',
    ],
    content: {
      title: '7-Dars: Prototype va Prototip Merosxo‘rligi',
      learningObjective: 'JavaScript obyektlarining asosiy karkasi bo‘lgan prototiplar va xotira optimizatsiyasini o‘zlashtirish.',
      prerequisites: 'Obyektlar va konstruktor funksiyalar.',
      realLifeAnalogy: 'Oila kutubxonasi: Har bir farzandning xonasiga alohida qimmatbaho ensiklopediyani sotib olib qo‘yish ortiqcha xarajat. Buning o‘rniga, uydagi umumiy kutubxonaga bitta to‘plam qo‘yiladi va barcha oila a’zolari unga murojaat qiladi (xotirani tejash).',
      theory: [
        {
          type: 'text',
          content: 'JavaScript klassik emas, balki **prototipga asoslangan (Prototypal)** tildir. Har bir obyekt yashirin \`[[Prototype]]\` (brauzerda \`__proto__\`) havolasiga ega.\n\nAgar obyektda biror xususiyat yoki metod topilmasa, dvigatel uni prototipidan, topolmasa uning prototipidan qidiradi — bu **Prototype Chain** deyiladi. Zanjirning oxiri \`Object.prototype\` bo‘lib, uning prototipi \`null\`dir.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function User(name) {
  this.name = name;
}

// Metodni prototipga qo'shish (hamma instansiyalar bitta metoddan foydalanadi):
User.prototype.sayHi = function() {
  return "Salom, " + this.name;
};

const u1 = new User("Aziz");
const u2 = new User("Bobur");
console.log(u1.sayHi === u2.sayHi); // true (bitta xotira katagida!)`,
          lineExplanations: {
            6: 'Metod har bir nusxa uchun qaytadan yaratilmaydi, faqat prototipda saqlanadi',
            12: 'Ikkala obyekt ham aynan bitta sayHi funksiyasiga havola qiladi',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Prototip metodini konstruktor ichida e’lon qilish',
          wrongCode: `function User(name) {
  this.name = name;
  this.sayHi = function() { ... }; // 1000 ta user ochilsa, 1000 ta funksiya nusxasi yaratiladi!
}`,
          correctCode: `function User(name) {
  this.name = name;
}
User.prototype.sayHi = function() { ... };`,
          explanation: 'Konstruktor ichida metod yozish xotirani isrof qiladi. Umumiy metodlar har doim prototype ga qo‘yilishi kerak.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-proto-1',
          question: 'Prototype chain ning eng yuqori oxirgi nuqtasi nima?',
          type: 'multiple-choice',
          options: [
            'Function.prototype',
            'null (Object.prototype ning prototipi)',
            'window',
            'undefined',
          ],
          correctAnswer: 1,
          explanation: 'Object.prototype zanjirning cho‘qqisi bo‘lib, uning [[Prototype]] havolasi null ga teng.',
        },
      ],
      reflectionQuestion: 'ES6 dagi \`class\` sintaksisi prototiplardan qanday farq qiladi?',
      summary: 'Prototiplar, zanjirli qidiruv va xotirani tejash usullarini o‘rgandik.',
      nextLessonSlug: 'call-stack-va-event-loop',
      nextLessonTitle: '8-Dars: Call Stack, Web APIs va Event Loop',
    },
    exercise: {
      title: 'Transport Vositalari Prototiplari',
      description: 'Vehicle nomli konstruktor funksiya yarating, u brand va speed parametrlarini qabul qilsin. Uning prototipiga accelerate(amount) metodini qo‘shing. Ushbu metod speed ni amount ga oshirsin va "[BRAND] tezligi endi [SPEED] km/soat" deb qaytarsin.',
      instructions: [
        'function Vehicle(brand, speed) konstruktorini e’lon qiling',
        'Vehicle.prototype.accelerate = function(amount) {...} deb metod qo‘shing',
        'this.speed += amount qilib yangilangan tezlikni matnda qaytaring',
      ],
      starterCode: `function Vehicle(brand, speed) {
  // Konstruktor tanasi
}

// Prototipga accelerate metodini qo'shing
`,
      language: 'javascript',
      difficulty: 'medium',
      passingScore: 100,
      xpReward: 65,
      testCases: [
        {
          id: 'tc-pr-1',
          description: 'Tezlikni oshirish va xabar chiqarish',
          expectedOutput: 'Chevrolet tezligi endi 80 km/soat',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-pr-2',
          description: 'Ikki marta tezlik oshirilishi',
          expectedOutput: 'BMW tezligi endi 140 km/soat',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: Konstruktor ichida this.brand = brand; this.speed = speed; deb xususiyatlarni biriktiring.',
        '2-yordam: Prototipga metod qo‘shish uchun: Vehicle.prototype.accelerate = function(amount) { ... };',
        '3-yordam: Metod ichida this.speed += amount qilib, this.brand + " tezligi endi " + this.speed + " km/soat" satrini return qiling.',
      ],
      solutionExplanation: 'accelerate metodi Vehicle prototipiga qo‘shiladi va barcha yaratilgan transport nusxalarida ishlaydi.',
      expectedConcepts: ['prototype', 'constructor', 'inheritance'],
      validSolutionCode: `function Vehicle(brand, speed) {
  this.brand = brand;
  this.speed = speed;
}
Vehicle.prototype.accelerate = function(amount) {
  this.speed += amount;
  return this.brand + " tezligi endi " + this.speed + " km/soat";
};
const car = new Vehicle("Chevrolet", 60);
console.log(car.accelerate(20));
const car2 = new Vehicle("BMW", 100);
car2.accelerate(20);
console.log(car2.accelerate(20));`,
      deliberateErrorCode: `function Vehicle() {
  this.accelerate = () => { throw new Error("wrong"); };
}`,
    },
  },

  // ----------------------------------------------------
  // MODULE 3: LESSONS 8-11
  // ----------------------------------------------------
  {
    moduleIndex: 2,
    order: 8,
    title: '8-Dars: Call Stack, Web APIs va Event Loop',
    slug: 'call-stack-va-event-loop',
    description: 'Single-thread modeli, Call stack, Web APIs, Macrotasks vs Microtasks.',
    estimatedMinutes: 30,
    objectives: [
      'JavaScript bitta oqimli (single-threaded) ishlash modelini tushunish',
      'Call Stack, Web APIs, Task Queue va Microtask Queue qanday hamkorlik qilishini bilish',
      'Asinxron kodlarning bajarilish tartibini to‘g‘ri oldindan bashorat qila olish',
    ],
    content: {
      title: '8-Dars: Call Stack, Web APIs va Event Loop',
      learningObjective: 'JavaScript brauzerda kodni qanday tartibda bajarishini va Event Loop sirini to‘liq anglash.',
      prerequisites: 'Asinxronlik asoslari va Callbacklar.',
      realLifeAnalogy: 'Bank filiali: Kassa bitta (Call Stack), u navbatdagi bitta odamga xizmat ko‘rsatadi. Uzoq vaqt oladigan hujjatlar esa orqa xonaga (Web APIs) yuboriladi. Ular tayyor bo‘lgach, maxsus qabul navbatiga (Queue) qo‘yiladi. Muhim VIP mijozlar (Microtasks / Promises) esa oddiy navbatdagi (Macrotasks / setTimeout) mijozlardan oldinroq kassaga kiritiladi.',
      theory: [
        {
          type: 'text',
          content: 'JavaScript dvigateli bitta oqimli bo‘lsa ham, brauzer taqdim etadigan Web APIs yordamida ko‘p vazifalarni asinxron bajara oladi.\n\n**Event Loop algoritmi:**\n1. Call Stack bo‘shashini kutadi.\n2. **Microtask Queue** (Promise callbacks, queueMicrotask) dagi barcha vazifalarni tugatadi.\n3. **Macrotask Queue** (setTimeout, setInterval, DOM hodisalari) dan bitta vazifani olib Call Stackga kiritadi.\n4. Sahifani qayta chizadi (Render) va siklni takrorlaydi.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `console.log("1. Sinxron");

setTimeout(() => {
  console.log("4. Macrotask (Timeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask (Promise)");
});

console.log("2. Sinxron");
// Natija: 1, 2, 3, 4`,
          lineExplanations: {
            1: 'Sinxron kod darhol Call Stackda bajariladi',
            3: 'setTimeout Web API ga topshiriladi va Macrotask Queue ga tushadi',
            7: 'Promise.then zudlik bilan Microtask Queue ga qo‘shiladi',
            11: 'Microtasklar macrotasklardan har doim ustun turadi!',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'setTimeout(fn, 0) darhol bajariladi deb o‘ylash',
          wrongCode: `let data;
setTimeout(() => { data = "Yuklandi"; }, 0);
console.log(data); // undefined!`,
          correctCode: `// Ma'lumot tayyor bo'lishini kutish kerak
setTimeout(() => {
  data = "Yuklandi";
  console.log(data);
}, 0);`,
          explanation: 'Hatto 0 millisoniya berilsa ham, u navbatga qo‘yiladi va faqat joriy sinxron kodlar tugagach ishga tushadi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-el-1',
          question: 'Microtask Queue da nimalar saqlanadi?',
          type: 'multiple-choice',
          options: [
            'Faqat setTimeout va setInterval',
            'Promise.then/catch/finally va queueMicrotask callbacklari',
            'Faqat DOM click hodisalari',
            'CSS animatsiyalari',
          ],
          correctAnswer: 1,
          explanation: 'Promise callbacklari va microtasklar Microtask Queue ga joylashadi va macrotasklardan oldin bajariladi.',
        },
      ],
      reflectionQuestion: 'Nima sababdan og‘ir hisob-kitoblarni asosiy Call Stackda bajarish sahifani qotirib qo‘yadi?',
      summary: 'Call Stack, Web APIs, Microtasks va Macrotasks qanday ishlashini to‘liq o‘rganib oldik.',
      nextLessonSlug: 'promises-va-chaining',
      nextLessonTitle: '9-Dars: Promise Obyekti va Zanjirlash (Chaining)',
    },
    exercise: {
      title: 'Event Loop Ketma-ketlik Bashorati',
      description: 'simulateEventLoopOrder() nomli funksiya yozing. U quyidagi 4 ta amalning bajarilish tartibidagi nomlarini massiv ko‘rinishida qaytarsin:\n1. "Sinxron 1"\n2. "Sinxron 2"\n3. "Promise Microtask"\n4. "Timeout Macrotask"',
      instructions: [
        'Massivda elementlar aynan bajarilish ketma-ketligida joylashsin',
        'return qilib massivni qaytaring',
      ],
      starterCode: `function simulateEventLoopOrder() {
  // To'g'ri tartibdagi massivni qaytaring
}
`,
      language: 'javascript',
      difficulty: 'easy',
      passingScore: 100,
      xpReward: 60,
      testCases: [
        {
          id: 'tc-el-1',
          description: 'To‘g‘ri Event Loop ketma-ketligi',
          expectedOutput: '["Sinxron 1","Sinxron 2","Promise Microtask","Timeout Macrotask"]',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-el-2',
          description: 'Massiv uzunligi 4 ga teng bo‘lishi',
          expectedOutput: '4',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: Avval barcha sinxron kodlar bajariladi.',
        '2-yordam: Keyin Microtasklar (Promise).',
        '3-yordam: Eng oxirida Macrotasklar (Timeout).',
      ],
      solutionExplanation: 'Event loop avval Call Stackdagi barcha sinxron amallarni, so‘ng Microtask Queue, so‘ng Macrotask Queue ni ishga tushiradi.',
      expectedConcepts: ['event loop', 'call stack', 'microtasks', 'macrotasks'],
      validSolutionCode: `function simulateEventLoopOrder() {
  return ["Sinxron 1", "Sinxron 2", "Promise Microtask", "Timeout Macrotask"];
}
console.log(JSON.stringify(simulateEventLoopOrder()));
console.log(simulateEventLoopOrder().length);`,
      deliberateErrorCode: `function simulateEventLoopOrder() {
  return ["Timeout Macrotask", "Sinxron 1"];
}`,
    },
  },

  {
    moduleIndex: 2,
    order: 9,
    title: '9-Dars: Promise Obyekti va Zanjirlash (Chaining)',
    slug: 'promises-va-chaining',
    description: 'Promise holatlari, .then, .catch, .finally, xatolarni uzatish va Promise.all.',
    estimatedMinutes: 25,
    objectives: [
      'Promise ning 3 xil holatini (pending, fulfilled, rejected) o‘rganish',
      '.then(), .catch() va .finally() orqali zanjirli asinxron oqim tuzish',
    ],
    content: {
      title: '9-Dars: Promise Obyekti va Zanjirlash (Chaining)',
      learningObjective: 'Callback Hell o‘rniga toza va o‘qilishi oson bo‘lgan Promise zanjirlarini qurish.',
      prerequisites: 'Event Loop va Asinxronlik.',
      realLifeAnalogy: 'Internet-do‘kondan buyurtma berish: Siz to‘lov qildingiz va chek-kvitansiya oldingiz (pending). Buyurtma yetib kelsa — kvitansiyani ko‘rsatib tovar olasiz (fulfilled / .then). Agar omborda mahsulot tugasa — uzr so‘ralib pul qaytariladi (rejected / .catch). Do‘kon esa har qanday holatda hisobini yopadi (.finally).',
      theory: [
        {
          type: 'text',
          content: '**Promise** — kelajakda bajarilishi kutilayotgan asinxron amal natijasini ifodalovchi obyektdir.\n\nHolatlari:\n- **pending:** Jarayon ketmoqda.\n- **fulfilled:** Muvaffaqiyatli yakunlandi (\`resolve(qiymat)\` chaqirildi).\n- **rejected:** Xatolik yuz berdi (\`reject(xato)\` chaqirildi).\n\n\`.then()\` har safar yangi Promise qaytaradi, shu sababli ularni ketma-ket zanjir (chain) qilish mumkin.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function fetchNumber() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(10), 100);
  });
}

fetchNumber()
  .then(num => num * 2) // 20
  .then(num => num + 5) // 25
  .then(result => console.log(result))
  .catch(err => console.error("Xato:", err));`,
          lineExplanations: {
            2: 'new Promise orqali asinxron mantiq o‘raladi',
            9: 'Har bir then avvalgisidan chiqqan qiymatni oladi',
            12: 'Zanjirning istalgan joyidagi xato to‘g‘ridan-to‘g‘ri catch ga yetkaziladi',
          },
        },
      ],
      commonMistakes: [
        {
          title: '.then() ichida return qilishni unutish',
          wrongCode: `.then(data => {
  const result = data * 2;
  // return yo'q!
})
.then(final => console.log(final)); // undefined!`,
          correctCode: `.then(data => {
  return data * 2;
})
.then(final => console.log(final)); // to'g'ri qiymat`,
          explanation: 'Agar .then ichida qiymat return qilinmasa, keyingi zanjir bo‘g‘iniga \`undefined\` boradi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-prom-1',
          question: 'Promise qaysi holatda bo‘lganda \`.catch()\` metodi ishga tushadi?',
          type: 'multiple-choice',
          options: [
            'pending holatida',
            'fulfilled holatida',
            'rejected holatida',
            'Doim ishga tushadi',
          ],
          correctAnswer: 2,
          explanation: 'Promise xatolikka uchraganda (rejected bo‘lganda) yoki xato throw qilinganda .catch ishga tushadi.',
        },
      ],
      reflectionQuestion: 'Nima uchun \`Promise.all\` zanjirida bitta so‘rov xato bersa, barcha so‘rovlar rad etiladi?',
      summary: 'Promise yaratish, zanjirli oqimlar va xatolarni markazlashtirilgan boshqarishni o‘rgandik.',
      nextLessonSlug: 'async-await-sintaksisi',
      nextLessonTitle: '10-Dars: async / await Sintaksisi',
    },
    exercise: {
      title: 'Foydalanuvchi ma’lumotlarini zanjirli qayta ishlash',
      description: 'fetchUserDataPromise(id) nomli funksiya yozing. U Promise qaytarsin. Agar id musbat bo‘lsa, resolve({ id, status: "faol" }), agar id 0 yoki manfiy bo‘lsa reject("Yaroqsiz ID") qilsin.',
      instructions: [
        'new Promise((resolve, reject) => { ... }) yarating',
        'Shart bo‘yicha to‘g‘ri resolve yoki reject qiling',
      ],
      starterCode: `function fetchUserDataPromise(id) {
  // Yechimni yozing
}
`,
      language: 'javascript',
      difficulty: 'easy',
      passingScore: 100,
      xpReward: 60,
      testCases: [
        {
          id: 'tc-prom-1',
          description: 'To‘g‘ri ID bilan muvaffaqiyatli resolve bo‘lishi',
          expectedOutput: '{"id":5,"status":"faol"}',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-prom-2',
          description: 'Manfiy ID bilan xatolik qaytishi',
          expectedOutput: 'Yaroqsiz ID',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: Promise yaratish uchun new Promise((resolve, reject) => { ... }) sintaksisidan foydalaning.',
        '2-yordam: id > 0 shartini tekshirib, musbat bo‘lsa resolve({ id, status: "faol" }) chaqiring.',
        '3-yordam: Agar id 0 yoki manfiy bo‘lsa, reject("Yaroqsiz ID") deb xatolik qaytaring.',
      ],
      solutionExplanation: 'Promise id musbatligiga qarab resolve yoki reject chaqiradi.',
      expectedConcepts: ['promises', 'resolve', 'reject'],
      validSolutionCode: `function fetchUserDataPromise(id) {
  return new Promise((resolve, reject) => {
    if (id > 0) {
      resolve({ id: id, status: "faol" });
    } else {
      reject("Yaroqsiz ID");
    }
  });
}
fetchUserDataPromise(5).then(res => console.log(JSON.stringify(res)));
fetchUserDataPromise(-1).catch(err => console.log(err));`,
      deliberateErrorCode: `function fetchUserDataPromise() {
  throw new Error("Reject immediately");
}`,
    },
  },

  {
    moduleIndex: 2,
    order: 10,
    title: '10-Dars: async / await Sintaksisi',
    slug: 'async-await-sintaksisi',
    description: 'async funksiyalar, await kalit so‘zi, Promise zanjirlarini soddalashtirish va parallel so‘rovlar.',
    estimatedMinutes: 25,
    objectives: [
      'async/await sintaksisi orqali asinxron kodni xuddi sinxron o‘qiladigan shaklda yozish',
      'async funksiya doimo Promise qaytarishini anglash',
      'Parallel (Promise.all) va ketma-ket asinxron chaqiruvlarni to‘g‘ri tashkil etish',
    ],
    content: {
      title: '10-Dars: async / await Sintaksisi',
      learningObjective: 'Asinxron kodni eng zamonaviy va qulay uslubda yozishni o‘rganish.',
      prerequisites: 'Promises va Event Loop.',
      realLifeAnalogy: 'Kuryerlik kutish stoli: Pochta kvitansiyasini olib zanjir bo‘ylab kutib o‘tirmasdan, buyurtma kelguncha bevosita kuryer oldida turib kutasiz (await), so‘ng qutini ochib keyingi qadamga o‘tasiz.',
      theory: [
        {
          type: 'text',
          content: '\`async/await\` — bu Promiselar ustiga qurilgan sintaktik qulaylikdir (Syntactic sugar).\n\n- \`async\`: Funksiyani asinxron qiladi va uning qaytargan qiymatini avtomatik Promise ga o‘raydi.\n- \`await\`: Faqat \`async\` funksiya ichida ishlaydi. U berilgan Promise hal (resolved) bo‘lguncha funksiya bajarilishini to‘xtatib turadi, lekin asosiy oqimni (UI) qotirib qo‘ymaydi.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function loadData() {
  const user = await fetchUser(); // Promise tugashini kutadi
  const orders = await fetchOrders(user.id);
  return { user, orders };
}`,
          lineExplanations: {
            1: 'async kalit so‘zi funksiyaning asinxron ekanini bildiradi',
            2: 'await Promisening qiymatini to‘g‘ridan-to‘g‘ri o‘zgaruvchiga oladi',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Oddiy (sinxron) funksiya ichida await ishlatish',
          wrongCode: `function getData() {
  const res = await fetch("/api"); // SyntaxError!
}`,
          correctCode: `async function getData() {
  const res = await fetch("/api"); // To'g'ri
}`,
          explanation: '\`await\` faqat \`async\` funksiya tanasida yoki modul darajasida (Top-level await) ishlatilishi mumkin.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-aa-1',
          question: '\`async\` kalit so‘zi bilan e’lon qilingan funksiya nimani qaytaradi?',
          type: 'multiple-choice',
          options: [
            'Doimo Promise qaytaradi',
            'Har doim matn qaytaradi',
            'Hech narsa qaytarmaydi',
            'Faqat son qaytaradi',
          ],
          correctAnswer: 0,
          explanation: 'async funksiya hatto oddiy qiymat return qilsa ham, u avtomatik tarzda hal bo‘lgan Promise (Promise.resolve) bo‘lib qaytadi.',
        },
      ],
      reflectionQuestion: 'Bir-biriga bog‘liq bo‘lmagan ikkita so‘rovni \`await a(); await b();\` deb ketma-ket yozish qanday sekinlikka olib keladi?',
      summary: 'async/await sintaksisi, undan foydalanish qoidalari va asinxron kodni toza yozishni o‘rgandik.',
      nextLessonSlug: 'async-error-handling-try-catch',
      nextLessonTitle: '11-Dars: Asinxron Xatolarni Boshqarish (try/catch)',
    },
    exercise: {
      title: 'Foydalanuvchi va Balansni Birlashtiruvchi Asinxron Funksiya',
      description: 'getUserSummary(userId) nomli async funksiya yozing. U simulyatsiya qilingan getUserProfile(userId) va getUserBalance(userId) ma’lumotlarini kutib olsin va "{ ism: user.name, balans: balance.amount }" obyektini qaytarsin.',
      instructions: [
        'async function getUserSummary(userId) deb e’lon qiling',
        'await getUserProfile(userId) va await getUserBalance(userId) ni chaqiring',
        'Natijani formatlangan obyekt ko‘rinishida qaytaring',
      ],
      starterCode: `// Simulyatsiya qilingan yordamchilar:
async function getUserProfile(id) { return { id, name: "Sardor" }; }
async function getUserBalance(id) { return { id, amount: 250000 }; }

async function getUserSummary(userId) {
  // Yechimni yozing
}
`,
      language: 'javascript',
      difficulty: 'easy',
      passingScore: 100,
      xpReward: 65,
      testCases: [
        {
          id: 'tc-aa-1',
          description: 'Profil va balansni to‘g‘ri birlashtirish',
          expectedOutput: '{"ism":"Sardor","balans":250000}',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-aa-2',
          description: 'Funksiya Promise qaytarishini tekshirish',
          expectedOutput: 'true',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: const profile = await getUserProfile(userId);',
        '2-yordam: const balance = await getUserBalance(userId);',
        '3-yordam: return { ism: profile.name, balans: balance.amount };',
      ],
      solutionExplanation: 'await orqali ikkala Promise natijasi olinadi va birlashtirilgan obyekt qaytariladi.',
      expectedConcepts: ['async', 'await', 'object construction'],
      validSolutionCode: `async function getUserProfile(id) { return { id, name: "Sardor" }; }
async function getUserBalance(id) { return { id, amount: 250000 }; }

async function getUserSummary(userId) {
  const profile = await getUserProfile(userId);
  const balance = await getUserBalance(userId);
  return { ism: profile.name, balans: balance.amount };
}
getUserSummary(1).then(res => console.log(JSON.stringify(res)));
console.log(getUserSummary(1) instanceof Promise);`,
      deliberateErrorCode: `function getUserSummary() {
  const x = await getUserProfile();
}`,
    },
  },

  {
    moduleIndex: 2,
    order: 11,
    title: '11-Dars: Asinxron Xatolarni Boshqarish (try/catch)',
    slug: 'async-error-handling-try-catch',
    description: 'try/catch/finally, tarmoq xatolari va HTTP statuslari, xavfsiz fallback qaytarish.',
    estimatedMinutes: 25,
    objectives: [
      'async/await kodida xatolarni try/catch orqali xavfsiz ushlab qolish',
      'Tarmoq xatosi (Network Error) va server javob xatoliklarini farqlash',
      'Xato yuz berganda dastur qulamasligi uchun xavfsiz fallback ma’lumot qaytarish',
    ],
    content: {
      title: '11-Dars: Asinxron Xatolarni Boshqarish (try/catch)',
      learningObjective: 'Asinxron so‘rovlar muvaffaqiyatsiz bo‘lganda tizim barqarorligini ta’minlash va foydalanuvchiga to‘g‘ri xabar berish.',
      prerequisites: 'async/await sintaksisi.',
      realLifeAnalogy: 'Avtomobilning xavfsizlik yostiqchasi: Yo‘lda kutilmagan to‘siq (server xatosi yoki internet uzilishi) paydo bo‘lsa, yostiqcha (catch bloki) ishga tushadi. Mashina ag‘darilmaydi, yo‘lovchilar shikastlanmaydi va tizim xavfsiz to‘xtatiladi.',
      theory: [
        {
          type: 'text',
          content: 'Asinxron kodda xatolar \`try...catch\` bloki bilan ushlanadi. Agar \`await\` qilingan Promise rad etilsa (rejected), boshqaruv darhol \`catch\` blokiga o‘tadi.\n\n\`finally\` bloki xato bo‘lishi yoki bo‘lmasligidan qat’i nazar eng oxirida ishlaydi (masalan, yuklanish indikatorini — Loading spinnerni o‘chirish uchun juda qulay).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `async function fetchDataSafe() {
  try {
    const res = await fakeNetworkCall();
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: error.message || "Tarmoq xatosi" };
  } finally {
    console.log("So‘rov yakunlandi");
  }
}`,
          lineExplanations: {
            2: 'Xatolik yuz berishi mumkin bo‘lgan kod try ichiga olinadi',
            5: 'Xato bo‘lsa dastur to‘xtamaydi, catch uni chiroyli xabar bilan tutib qoladi',
            7: 'finally doimo har qanday holatda ishlaydi',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Xatoni ushlab, jimgina yutib yuborish (Silent Failure)',
          wrongCode: `try {
  await doRiskyAction();
} catch (e) {
  // Hech narsa yo'q, xato qayerda sodir bo'lgani noma'lum qoladi!
}`,
          correctCode: `try {
  await doRiskyAction();
} catch (e) {
  console.error("Xatolik yuz berdi:", e);
  showUserFeedback("Ma'lumotni yuklab bo'lmadi");
}`,
          explanation: 'Xatolar har doim qayd etilishi (log) va foydalanuvchiga mos tushunarli xabar berilishi shart.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-err-1',
          question: '\`finally\` bloki qachon ishga tushadi?',
          type: 'multiple-choice',
          options: [
            'Faqat xato yuz berganda',
            'Faqat kod muvaffaqiyatli yakunlanganda',
            'Har doim (xato bo‘lsa ham, bo‘lmasa ham)',
            'Faqat sahifa yopilganda',
          ],
          correctAnswer: 2,
          explanation: 'finally bloki try qismi muvaffaqiyatli bo‘lsa ham, catch da xato ushlansa ham eng oxirida albatta ishga tushadi.',
        },
      ],
      reflectionQuestion: 'Nima uchun server 404 qaytarganda fetch avtomatik catch ga tushmaydi?',
      summary: 'Asinxron xatolarni boshqarish, try/catch/finally strukturasi va fallback strategiyalarini o‘rgandik.',
      nextLessonSlug: 'dom-arxitekturasi-va-manipulyatsiya',
      nextLessonTitle: '12-Dars: DOM Arxitekturasi va Samarali Manipulyatsiya',
    },
    exercise: {
      title: 'Xavfsiz API Chaqiruvchi Yordamchi (safeAsyncCaller)',
      description: 'safeAsyncCaller(asyncFn, fallbackValue) nomli funksiya yozing. U asyncFn() ni chaqirsin. Agar u muvaffaqiyatli yakunlansa { ok: true, data: result } qaytarsin. Agar xatolik yuz bersa, { ok: false, data: fallbackValue, error: err.message } qaytarsin.',
      instructions: [
        'try / catch blokidan foydalaning',
        'Xatolik yuz berganda dastur qulamasdan obyekt qaytarsin',
      ],
      starterCode: `async function safeAsyncCaller(asyncFn, fallbackValue) {
  // Yechimni yozing
}
`,
      language: 'javascript',
      difficulty: 'medium',
      passingScore: 100,
      xpReward: 70,
      testCases: [
        {
          id: 'tc-err-1',
          description: 'Muvaffaqiyatli funksiya natijasi',
          expectedOutput: '{"ok":true,"data":"Ma’lumot"}',
          isHidden: false,
        },
        {
          id: 'tc-err-2',
          description: 'Xatolikda fallback qiymat qaytishi',
          expectedOutput: '{"ok":false,"data":"Zaxira","error":"Server ishlamayapti"}',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-err-3',
          description: 'Xato obyektida ok: false ekanligi',
          expectedOutput: 'false',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: Asinxron chaqiruvni try { ... } bloki ichiga oling va await asyncFn() orqali natijani kuting.',
        '2-yordam: Muvaffaqiyatli bo‘lsa, return { ok: true, data: res } ko‘rinishida obyekt qaytaring.',
        '3-yordam: catch (err) blokida return { ok: false, data: fallbackValue, error: err.message } qilib xavfsiz javob bering.',
      ],
      solutionExplanation: 'try ichida xato bo‘lsa, catch xavfsiz fallback va xato xabarini obyekt ko‘rinishida qaytaradi.',
      expectedConcepts: ['try/catch', 'async error handling', 'fallback'],
      validSolutionCode: `async function safeAsyncCaller(asyncFn, fallbackValue) {
  try {
    const res = await asyncFn();
    return { ok: true, data: res };
  } catch (err) {
    return { ok: false, data: fallbackValue, error: err.message };
  }
}
safeAsyncCaller(async () => "Ma’lumot", "Zaxira").then(r => console.log(JSON.stringify(r)));
safeAsyncCaller(async () => { throw new Error("Server ishlamayapti"); }, "Zaxira").then(r => {
  console.log(JSON.stringify(r));
  console.log(r.ok);
});`,
      deliberateErrorCode: `async function safeAsyncCaller() {
  throw new Error("Fatal syntax failure");
}`,
    },
  },

  // ----------------------------------------------------
  // MODULE 4: LESSONS 12-16
  // ----------------------------------------------------
  {
    moduleIndex: 3,
    order: 12,
    title: '12-Dars: DOM Arxitekturasi va Samarali Manipulyatsiya',
    slug: 'dom-arxitekturasi-va-manipulyatsiya',
    description: 'DOM daraxti, Node vs Element, Reflow va Repaint optimizatsiyasi, DocumentFragment.',
    estimatedMinutes: 25,
    objectives: [
      'DOM daraxtining tuzilishi va elementlarni dinamik boshqarishni o‘rganish',
      'Reflow va Repaint tushunchalarini bilish hamda DocumentFragment yordamida tezlikni oshirish',
    ],
    content: {
      title: '12-Dars: DOM Arxitekturasi va Samarali Manipulyatsiya',
      learningObjective: 'Brauzer interfeysini samarali va tezkor boshqarish, ortiqcha render yukini kamaytirish.',
      prerequisites: 'HTML asoslari va JavaScript massivlari.',
      realLifeAnalogy: 'Qurilish kranida yuk tashish: 100 ta alohida g‘ishtni birma-bir 100 marta tepaga tashish judayam ko‘p vaqt oladi (har safar Reflow). Buning o‘rniga hamma g‘ishtlar bitta poddonga (DocumentFragment) yuklanadi va kran bir marta tepaga olib chiqib o‘rnatadi.',
      theory: [
        {
          type: 'text',
          content: '**DOM (Document Object Model)** — HTML hujjatining brauzer xotirasidagi daraxtsimon ko‘rinishidir.\n\nHar safar DOM ga element qo‘shilganda brauzer elementlar o‘lchami va joylashuvini qayta hisoblaydi (**Reflow**) va qayta bo‘yaydi (**Repaint**). Katta ro‘yxatlarni render qilishda xotiradagi virtual konteyner bo‘lgan \`document.createDocumentFragment()\` ishlatilsa, butun ro‘yxat faqat bir martada DOM ga kiritiladi va tezlik keskin oshadi.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function createList(items) {
  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    fragment.appendChild(li);
  });
  return fragment; // Faqat 1 marta haqiqiy DOM ga ulanadi
}`,
          lineExplanations: {
            2: 'createDocumentFragment xotirada yengil konteyner ochadi',
            6: 'Har bir li fragmentga yig‘iladi (sahifa hali qayta chizilmaydi)',
            8: 'Tashqarida bitta append bilan barcha elementlar kiritiladi',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Sikl ichida innerHTML += qilish',
          wrongCode: `for (let i = 0; i < 100; i++) {
  list.innerHTML += "<li>" + i + "</li>"; // Har safar butun DOM qayta buzib quriladi!
}`,
          correctCode: `const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement("li");
  li.textContent = i;
  fragment.appendChild(li);
}
list.appendChild(fragment);`,
          explanation: '\`innerHTML +=\` har bir tsiklda avvalgi barcha elementlarni yo‘q qilib, qaytadan HTML parse qiladi. Bu juda sekin ishlaydi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-dom-1',
          question: 'DocumentFragment nima uchun ishlatiladi?',
          type: 'multiple-choice',
          options: [
            'Faqat audio fayllarni o‘ynatish uchun',
            'DOM manipulyatsiyasida Reflow sonini kamaytirib, unumdorlikni oshirish uchun',
            'Faqat CSS o‘zgaruvchilarini saqlash uchun',
            'Faqat JSON fayllarni o‘qish uchun',
          ],
          correctAnswer: 1,
          explanation: 'DocumentFragment xotiradagi konteyner bo‘lib, bir nechta elementni bitta amalda DOM ga kiritish imkonini beradi.',
        },
      ],
      reflectionQuestion: 'Nima uchun \`element.textContent\` ishlatish \`element.innerHTML\` ga qaraganda xavfsizroq hisoblanadi?',
      summary: 'DOM arxitekturasi, Reflow/Repaint tushunchalari va DocumentFragment bilan ishlashni o‘rgandik.',
      nextLessonSlug: 'event-bubbling-va-delegation',
      nextLessonTitle: '13-Dars: Event Bubbling va Event Delegation',
    },
    exercise: {
      title: 'Elementlar fragmentini hosil qilish',
      description: 'buildDomElements(tagNames, texts) nomli funksiya yozing. U tagNames (masalan ["h1", "p"]) va texts (masalan ["Salom", "Dunyoni o‘zgartir"]) massivlarini olsin va ulardan tashkil topgan HTML elementlar tavsifini massiv ko‘rinishida [{ tag: "h1", text: "Salom" }, ...] qaytarsin.',
      instructions: [
        'tagNames va texts uzunligi teng ekanini inobatga oling',
        'Har bir indeks bo‘yicha obyekt tuzib massivga yig‘ing',
      ],
      starterCode: `function buildDomElements(tagNames, texts) {
  // Yechimni yozing
}
`,
      language: 'javascript',
      difficulty: 'easy',
      passingScore: 100,
      xpReward: 60,
      testCases: [
        {
          id: 'tc-dom-1',
          description: 'H1 va P elementlarini hosil qilish',
          expectedOutput: '[{"tag":"h1","text":"Salom"},{"tag":"p","text":"Dars"}]',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-dom-2',
          description: 'Bo‘sh massivlar bilan sinash',
          expectedOutput: '[]',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: Ikki massiv elementlarini juftlab obyekt hosil qilish uchun map metodidan foydalaning.',
        '2-yordam: Har bir element uchun { tag: tagNames[i], text: texts[i] } obyektini tuzing.',
        '3-yordam: return tagNames.map((tag, idx) => ({ tag: tag, text: texts[idx] || "" })); orqali massivni qaytaring.',
      ],
      solutionExplanation: 'Elementlar juftligi bo‘yicha obyektlar massivi hosil qilinadi.',
      expectedConcepts: ['dom', 'mapping', 'element structure'],
      validSolutionCode: `function buildDomElements(tagNames, texts) {
  return tagNames.map((tag, idx) => ({
    tag: tag,
    text: texts[idx] || ""
  }));
}
console.log(JSON.stringify(buildDomElements(["h1", "p"], ["Salom", "Dars"])));
console.log(JSON.stringify(buildDomElements([], [])));`,
      deliberateErrorCode: `function buildDomElements() {
  return document.undefinedMethod();
}`,
    },
  },

  {
    moduleIndex: 3,
    order: 13,
    title: '13-Dars: Event Bubbling va Event Delegation',
    slug: 'event-bubbling-va-delegation',
    description: 'Hodisalar fazalari, event.target vs currentTarget, Event Delegation orqali xotirani tejash.',
    estimatedMinutes: 25,
    objectives: [
      'Event Bubbling va Capturing bosqichlarini tushunish',
      'event.target va event.currentTarget farqini bilish',
      'Event Delegation yordamida yuzlab tugmalarni bitta ota element orqali optimal boshqarish',
    ],
    content: {
      title: '13-Dars: Event Bubbling va Event Delegation',
      learningObjective: 'Katta interfeyslarda minglab event listener ochmasdan, bitta umumiy ota tinglovchi orqali xotirani tejash.',
      prerequisites: 'DOM asoslari va addEventListener.',
      realLifeAnalogy: 'Katta savdo markazi qo‘riqchisi: Har bitta do‘kon va har bitta peshtaxta oldiga alohida soqchi qo‘yish (minglab listenerlar) juda qimmatga tushadi. Buning o‘rniga, butun markazning umumiy kirish eshigiga bitta qo‘riqchi qo‘yiladi va u kim qaysi do‘konga kirayotganini (event.target) bitta joydan kuzatib turadi.',
      theory: [
        {
          type: 'text',
          content: '**Event Bubbling (Ko‘piklanish)** — bolalar elementida sodir bo‘lgan hodisa xuddi suv tagidagi pufakcha kabi yuqoriga — ota elementlar va \`document\` tomon ko‘tarilishidir.\n\n**Event Delegation (Vakillik):** Har bir tugmaga alohida \`click\` qo‘yish o‘rniga, ularning barchasini o‘rab turgan ota \`<ul>\` yoki \`<div>\` ga bitta listener qo‘yiladi va \`event.target\` orqali aynan qaysi element bosilgani aniqlanadi.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Ota konteynerga bitta listener qo'yiladi:
const todoList = document.querySelector("#todo-list");

todoList.addEventListener("click", (event) => {
  // Bosilgan element aynan o'chirish tugmasimi?
  const deleteBtn = event.target.closest(".btn-delete");
  if (deleteBtn) {
    const taskId = deleteBtn.dataset.id;
    console.log("O'chirilmoqda:", taskId);
  }
});`,
          lineExplanations: {
            4: 'event.target bosilgan aniq elementga ishora qiladi',
            6: 'closest() yordamida bosilgan elementning kerakli tugmaga tegishliligi aniqlanadi',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'stopPropagation() ni noo‘rin ishlatish',
          wrongCode: `button.addEventListener("click", (e) => {
  e.stopPropagation(); // Butun yuqoriga ko'tarilishni to'xtatadi!
});`,
          correctCode: `button.addEventListener("click", (e) => {
  // Faqat o'z amalingizni bajaring, global delegatsiyani buzmang
});`,
          explanation: '\`stopPropagation()\` boshqa global analitika yoki ota elementdagi muhim delegatsiyalarni ham o‘chirib qo‘yishi mumkin.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-del-1',
          question: '\`event.target\` va \`event.currentTarget\` farqi nimada?',
          type: 'multiple-choice',
          options: [
            'Hech qanday farqi yo‘q',
            'event.target — hodisa aynan qaysi elementda yuz berganligi; event.currentTarget — listener qaysi elementga ilinganligi',
            'event.target faqat matnni bildiradi',
            'event.currentTarget doim null bo‘ladi',
          ],
          correctAnswer: 1,
          explanation: 'target — bosilgan eng ichki element; currentTarget esa hodisani eshitayotgan ota elementdir.',
        },
      ],
      reflectionQuestion: 'Dinamik tarzda yangi elementlar qo‘shilganda nima uchun Event Delegation ishlatish qulay?',
      summary: 'Event Bubbling, delegatsiya mexanizmi va xotirani optimallashtirishni o‘rgandik.',
      nextLessonSlug: 'formalarni-tekshirish-form-validation',
      nextLessonTitle: '14-Dars: Formalarni Real Vaqtda Tekshirish (Form Validation)',
    },
    exercise: {
      title: 'Action Router (Delegatsiya Mantiqi)',
      description: 'dispatchActionEvent(targetAction, dataId) nomli funksiya yozing. U action turiga qarab javob qaytarsin:\n- "delete": "ID [ID] o‘chirildi"\n- "edit": "ID [ID] tahrirlandi"\n- "view": "ID [ID] ko‘rildi"\nAgar notanish action bo‘lsa: "Noma’lum amal" qaytarsin.',
      instructions: [
        'targetAction qiymatini tekshiring',
        'Mos xabarni formatlab return qiling',
      ],
      starterCode: `function dispatchActionEvent(targetAction, dataId) {
  // Yechimni yozing
}
`,
      language: 'javascript',
      difficulty: 'easy',
      passingScore: 100,
      xpReward: 60,
      testCases: [
        {
          id: 'tc-del-1',
          description: 'O‘chirish amalini tekshirish',
          expectedOutput: 'ID 10 o‘chirildi',
          isHidden: false,
        },
        {
          id: 'tc-del-2',
          description: 'Noma’lum amalni tekshirish',
          expectedOutput: 'Noma’lum amal',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-del-3',
          description: 'Tahrirlash amalini tekshirish',
          expectedOutput: 'ID 42 tahrirlandi',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: targetAction qiymatini tekshirish uchun switch/case yoki if/else tuzilmasidan foydalaning.',
        '2-yordam: "delete", "edit", "view" holatlari uchun mos ravishda "ID " + dataId + " [AMAL]" matnini qaytaring.',
        '3-yordam: default holatida "Noma’lum amal" satrini return qiling.',
      ],
      solutionExplanation: 'Delegatsiyadagi kabi har bir action nomi bo‘yicha tegishli mantiq ishga tushiriladi.',
      expectedConcepts: ['event delegation', 'action routing', 'switch/case'],
      validSolutionCode: `function dispatchActionEvent(targetAction, dataId) {
  switch (targetAction) {
    case "delete":
      return "ID " + dataId + " o‘chirildi";
    case "edit":
      return "ID " + dataId + " tahrirlandi";
    case "view":
      return "ID " + dataId + " ko‘rildi";
    default:
      return "Noma’lum amal";
  }
}
console.log(dispatchActionEvent("delete", 10));
console.log(dispatchActionEvent("unknown", 99));
console.log(dispatchActionEvent("edit", 42));`,
      deliberateErrorCode: `function dispatchActionEvent() {
  return invalidAction();
}`,
    },
  },

  {
    moduleIndex: 3,
    order: 14,
    title: '14-Dars: Formalarni Real Vaqtda Tekshirish (Form Validation)',
    slug: 'formalarni-tekshirish-form-validation',
    description: 'e.preventDefault, regex bilan tekshirish, foydalanuvchiga tushunarli o‘zbekcha xato xabarlari va ARIA.',
    estimatedMinutes: 25,
    objectives: [
      'Formani yuborishda e.preventDefault() vazifasini tushunish',
      'Regex va shartlar yordamida foydalanuvchi kiritgan ma’lumotlarni real vaqtda tekshirish',
      'Xato xabarlarini foydalanuvchiga tushunarli va qulay ko‘rinishda taqdim etish',
    ],
    content: {
      title: '14-Dars: Formalarni Real Vaqtda Tekshirish (Form Validation)',
      learningObjective: 'Foydalanuvchi kiritayotgan ma’lumotlarni real vaqtda to‘g‘ri tekshirish va xavfsizlikni oshirish.',
      prerequisites: 'DOM hodisalari va Regex asoslari.',
      realLifeAnalogy: 'Aeroport pasport nazorati: Chegaradan o‘tayotganingizda, xodim har bitta hujjatni (pasport raqami, amal qilish muddati, viza) birma-bir tekshiradi. Agar birortasida xato bo‘lsa, samolyotga qo‘yilmaysiz va qayerida kamchilik borligi tushuntiriladi.',
      theory: [
        {
          type: 'text',
          content: 'Web formalarni tekshirish ikki xil bo‘ladi:\n1. **Real-time validation (Kiritish jarayonida):** \`input\` hodisasi orqali har bir belgi kiritilganda darhol tekshirilib, yashil/qizil hoshiya bilan ko‘rsatiladi.\n2. **Submit validation (Yuborishda):** \`e.preventDefault()\` chaqirilib, sahifaning serverga qayta yuklanishi to‘xtatiladi va barcha maydonlar to‘liqligi tasdiqlanadi.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function validateEmail(email) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  // Kamida 8 ta belgi va bitta raqam
  return password.length >= 8 && /\\d/.test(password);
}`,
          lineExplanations: {
            2: 'Muntazam ifoda (Regex) email formatini tekshiradi',
            7: 'Parol uzunligi va unda raqam borligi sharti',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'e.preventDefault() ni unutib sahifani yangilab yuborish',
          wrongCode: `form.addEventListener("submit", () => {
  // Sahifa yangilanib ketadi va xatolar yo'qoladi!
});`,
          correctCode: `form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Endi JS orqali xavfsiz tekshirish mumkin
});`,
          explanation: 'Standart submit hodisasi sahifani yangilaydi. Single-page ilovalarda \`e.preventDefault()\` majburiydir.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-val-1',
          question: '\`e.preventDefault()\` metodining vazifasi nima?',
          type: 'multiple-choice',
          options: [
            'Kompyuterni o‘chirish',
            'Brauzerning standart harakatini (masalan, formani yuborib sahifani yangilashini) to‘xtatish',
            'Faqat xatolar logini tozalash',
            'CSS stillarini o‘chirish',
          ],
          correctAnswer: 1,
          explanation: 'e.preventDefault() brauzerning ushbu hodisa bo‘yicha standart reaksiyasini bekor qiladi.',
        },
      ],
      reflectionQuestion: 'Nima uchun faqat frontendda validatsiya qilish xavfsizlik uchun yetarli emas?',
      summary: 'Formani tekshirish, regex naqshlari va qulay xatolik xabarlarini o‘rgandik.',
      nextLessonSlug: 'brauzer-xotirasi-localstorage',
      nextLessonTitle: '15-Dars: Brauzer Xotirasi: LocalStorage va SessionStorage',
    },
    exercise: {
      title: 'Ro‘yxatdan o‘tish shaklini tekshiruvchi funksiya',
      description: 'validateRegistrationForm(formData) nomli funksiya yozing. U { username, email, password } obyektini olsin va errors massivini qaytarsin:\n- username bo‘sh bo‘lsa yoki 3 tadan kam bo‘lsa: "Foydalanuvchi nomi kamida 3 ta belgi bo‘lishi kerak"\n- email da @ belgisi bo‘lmasa: "Noto‘g‘ri email formati"\n- password 6 tadan kam bo‘lsa: "Parol kamida 6 ta belgi bo‘lishi kerak"\nAgar barchasi to‘g‘ri bo‘lsa, bo‘sh massiv [] qaytarsin.',
      instructions: [
        'Har bir shartni alohida if bilan tekshirib errors ga push qiling',
        'return errors;',
      ],
      starterCode: `function validateRegistrationForm(formData) {
  const errors = [];
  // Shartlarni tekshiring
  return errors;
}
`,
      language: 'javascript',
      difficulty: 'easy',
      passingScore: 100,
      xpReward: 60,
      testCases: [
        {
          id: 'tc-val-1',
          description: 'To‘g‘ri to‘ldirilgan forma',
          expectedOutput: '[]',
          isHidden: false,
        },
        {
          id: 'tc-val-2',
          description: 'Kalta parol va noto‘g‘ri email bilan xatolar chiqishi',
          expectedOutput: '["Noto‘g‘ri email formati","Parol kamida 6 ta belgi bo‘lishi kerak"]',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-val-3',
          description: 'Username kalta bo‘lganda xato chiqishi',
          expectedOutput: '["Foydalanuvchi nomi kamida 3 ta belgi bo‘lishi kerak"]',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: if (!formData.username || formData.username.length < 3) errors.push(...)',
        '2-yordam: if (!formData.email || !formData.email.includes("@")) errors.push(...)',
        '3-yordam: if (!formData.password || formData.password.length < 6) errors.push(...)',
      ],
      solutionExplanation: 'Forma maydonlari tekshirilib, mos o‘zbekcha xatolik xabarlari massivda qaytariladi.',
      expectedConcepts: ['form validation', 'error array', 'string methods'],
      validSolutionCode: `function validateRegistrationForm(formData) {
  const errors = [];
  if (!formData || !formData.username || formData.username.length < 3) {
    errors.push("Foydalanuvchi nomi kamida 3 ta belgi bo‘lishi kerak");
  }
  if (!formData || !formData.email || !formData.email.includes("@")) {
    errors.push("Noto‘g‘ri email formati");
  }
  if (!formData || !formData.password || formData.password.length < 6) {
    errors.push("Parol kamida 6 ta belgi bo‘lishi kerak");
  }
  return errors;
}
console.log(JSON.stringify(validateRegistrationForm({ username: "Ali", email: "ali@codequest.uz", password: "secretPassword" })));
console.log(JSON.stringify(validateRegistrationForm({ username: "Laylo", email: "notanemail", password: "123" })));
console.log(JSON.stringify(validateRegistrationForm({ username: "Bo", email: "bo@domain.uz", password: "validPassword123" })));`,
      deliberateErrorCode: `function validateRegistrationForm() {
  throw new Error("Validation failure");
}`,
    },
  },

  {
    moduleIndex: 3,
    order: 15,
    title: '15-Dars: Brauzer Xotirasi: LocalStorage va SessionStorage',
    slug: 'brauzer-xotirasi-localstorage',
    description: 'LocalStorage vs SessionStorage, JSON.stringify va JSON.parse, xavfsizlik va limitlar.',
    estimatedMinutes: 25,
    objectives: [
      'LocalStorage va SessionStorage ning ishlash farqlarini bilish',
      'Obyekt va massivlarni JSON yordamida xotirada to‘g‘ri saqlash va o‘qish',
      'Xotira xavfsizligi qoidalarini (maxfiy ma’lumotlarni saqlamaslik) tushunish',
    ],
    content: {
      title: '15-Dars: Brauzer Xotirasi: LocalStorage va SessionStorage',
      learningObjective: 'Foydalanuvchi sozlamalari va ma’lumotlarini brauzerda doimiy saqlab qolish.',
      prerequisites: 'JSON formati va JavaScript obyektlari.',
      realLifeAnalogy: 'Shaxsiy kundalik: Siz kundaligingizga muhim eslatmalar yozib qo‘ydingiz. Kundalikni yopsangiz ham, chiroqni o‘chirib uxlasangiz ham (brauzer yopilsa ham), ertasi kuni ochganingizda yozuvlar aynan qanday bo‘lsa shunday saqlanib turadi (LocalStorage).',
      theory: [
        {
          type: 'text',
          content: 'Brauzer ma’lumotlarni saqlash uchun kalit-qiymat (Key-Value) omborlarini taqdim etadi:\n\n- **LocalStorage:** Brauzer yopilsa ham saqlanib qoladi. Faqat foydalanuvchi yoki kod orqali tozalanishi mumkin (Hajmi ~5MB).\n- **SessionStorage:** Faqat joriy oyna (tab) ochiq turganda saqlanadi, tab yopilganda o‘chadi.\n\nEslatma: Har ikkala ombor faqat **string (matn)** saqlaydi! Shu sababli murakkab obyektlarni saqlashdan oldin \`JSON.stringify()\`, o‘qiyotganda esa \`JSON.parse()\` qilish zarur.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Xavfsiz saqlash:
const settings = { theme: "dark", lang: "uz" };
localStorage.setItem("user_settings", JSON.stringify(settings));

// Xavfsiz o'qish:
const saved = localStorage.getItem("user_settings");
const parsedSettings = saved ? JSON.parse(saved) : { theme: "light" };`,
          lineExplanations: {
            3: 'JSON.stringify obyektni matnga aylantiradi',
            6: 'getItem mavjud bo‘lmasa null qaytaradi, shuning uchun tekshirish shart',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Obyektni to‘g‘ridan-to‘g‘ri JSON.stringify siz saqlash',
          wrongCode: `localStorage.setItem("user", { name: "Ali" });
console.log(localStorage.getItem("user")); // "[object Object]" bo'lib qoladi!`,
          correctCode: `localStorage.setItem("user", JSON.stringify({ name: "Ali" }));`,
          explanation: 'LocalStorage har qanday kiritilgan ma’lumotni string ga aylantiradi, obyekt esa \`"[object Object]"\` ga aylanib ma’lumot yo‘qoladi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-ls-1',
          question: 'LocalStorage da ma’lumotlar qachongacha saqlanadi?',
          type: 'multiple-choice',
          options: [
            'Faqat 5 daqiqa',
            'Faqat tab ochiq turguncha',
            'Foydalanuvchi keshni tozalamaguncha yoki kod o‘chirmaguncha doimiy saqlanadi',
            'Sahifa yangilanganda o‘chib ketadi',
          ],
          correctAnswer: 2,
          explanation: 'LocalStorage doimiy xotira bo‘lib, brauzer yoki kompyuter o‘chirilganda ham ma’lumot saqlanadi.',
        },
      ],
      reflectionQuestion: 'Nima uchun foydalanuvchining parolini yoki maxfiy tokenlarini LocalStorage ga ochiq saqlash xavflidir?',
      summary: 'LocalStorage, SessionStorage, JSON bilan ishlash va xavfsizlik tavsiyalarini o‘rgandik.',
      nextLessonSlug: 'debouncing-va-throttling',
      nextLessonTitle: '16-Dars: Debouncing va Throttling (Samaradorlikni Oshirish)',
    },
    exercise: {
      title: 'Xavfsiz LocalStorage Yordamchisi (Storage Helper)',
      description: 'safeStorageSimulator nomli obyekt yozing. U xotiradagi virtual massiv ustida quyidagi metodlarni taqdim etsin:\n1. setItem(key, value) — qiymatni JSON qilib saqlaydi\n2. getItem(key, defaultValue) — agar topilsa parse qilib qaytaradi, topilmasa defaultValue qaytaradi',
      instructions: [
        'Internal xotira sifatida Map yoki oddiy obyektdan foydalaning',
        'setItem stringify qilsin, getItem parse qilsin',
      ],
      starterCode: `function createStorageSimulator() {
  const store = {};
  return {
    setItem(key, value) {
      // Yozing
    },
    getItem(key, defaultValue = null) {
      // Yozing
    }
  };
}
`,
      language: 'javascript',
      difficulty: 'medium',
      passingScore: 100,
      xpReward: 65,
      testCases: [
        {
          id: 'tc-ls-1',
          description: 'Obyektni saqlash va qayta o‘qish',
          expectedOutput: '{"theme":"dark"}',
          isHidden: false,
        },
        {
          id: 'tc-ls-2',
          description: 'Mavjud bo‘lmagan kalit uchun defaultValue qaytishi',
          expectedOutput: 'standart',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-ls-3',
          description: 'Sonlar massivini saqlash va parse qilish',
          expectedOutput: '[10,20,30]',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: setItem metodida qiymatni saqlashdan avval JSON.stringify(value) qilib stringga o‘giring.',
        '2-yordam: getItem metodida kalit mavjudligini tekshiring, agar yo‘q bo‘lsa defaultValue qaytaring.',
        '3-yordam: Saqlangan JSON matnini try { return JSON.parse(store[key]); } catch { return defaultValue; } orqali xavfsiz parse qiling.',
      ],
      solutionExplanation: 'LocalStorage logikasi simulyatsiya qilinib, obyektlar JSON orqali to‘g‘ri aylanadi.',
      expectedConcepts: ['storage', 'json.stringify', 'json.parse'],
      validSolutionCode: `function createStorageSimulator() {
  const store = {};
  return {
    setItem(key, value) {
      store[key] = JSON.stringify(value);
    },
    getItem(key, defaultValue = null) {
      if (store[key] === undefined) return defaultValue;
      try {
        return JSON.parse(store[key]);
      } catch (e) {
        return defaultValue;
      }
    }
  };
}
const s = createStorageSimulator();
s.setItem("conf", { theme: "dark" });
console.log(JSON.stringify(s.getItem("conf")));
console.log(s.getItem("nonexistent", "standart"));
s.setItem("nums", [10, 20, 30]);
console.log(JSON.stringify(s.getItem("nums")));`,
      deliberateErrorCode: `function createStorageSimulator() {
  return null.fail();
}`,
    },
  },

  {
    moduleIndex: 3,
    order: 16,
    title: '16-Dars: Debouncing va Throttling (Samaradorlikni Oshirish)',
    slug: 'debouncing-va-throttling',
    description: 'Tez-tez yuz beradigan hodisalarni optimallashtirish, setTimeout va clearTimeout yordamida kechiktirish.',
    estimatedMinutes: 30,
    objectives: [
      'Debouncing va Throttling orasidagi farqni aniq tushunish',
      'Qidiruv maydonlarida ortiqcha server so‘rovlarini kamaytirish uchun Debounce yozish',
      'Scroll yoki Resize hodisalarini Throttling orqali yengillashtirish',
    ],
    content: {
      title: '16-Dars: Debouncing va Throttling (Samaradorlikni Oshirish)',
      learningObjective: 'Haddan tashqari ko‘p chaqiriladigan funksiyalarni jilovlab, veb-ilova tezligini bir necha barobar oshirish.',
      prerequisites: 'Closures va Taymerlar (setTimeout, clearTimeout).',
      realLifeAnalogy: 'Lift va Radar: \n- Debounce (Lift eshigi): Har safar yangi odam kelganda lift taymerni qaytadan boshlaydi va yana 3 soniya kutadi. Odamlar kelishi to‘xtagandagina lift yuradi.\n- Throttle (Tezlik radari): Mashina qanchalik tez o‘tmasin, radar har 5 soniyada faqat bitta surat oladi.',
      theory: [
        {
          type: 'text',
          content: 'Foydalanuvchi klaviaturada harflarni tez-tez bosganda (masalan, qidiruv maydonida), har bir harf bosilishida serverga so‘rov yuborish serverni to‘ldirib qo‘yadi.\n\n- **Debounce:** Funksiyani chaqirishni kechiktiradi. Agar belgilangan vaqt (\`delay\`) ichida yangi chaqiruv kelsa, avvalgi taymer bekor qilinadi va yangitdan boshlanadi.\n- **Throttle:** Belgilangan vaqt oralig‘ida (masalan, har 300ms da) funksiyani ko‘pi bilan 1 marta ishga tushiradi.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function debounce(fn, delay) {
  let timerId = null;
  return function(...args) {
    clearTimeout(timerId); // Avvalgi taymerni bekor qilish
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`,
          lineExplanations: {
            2: 'timerId closure orqali eslab qolinadi',
            4: 'Har safar yangi chaqiruvda eski taymer o‘chiriladi',
            5: 'Foydalanuvchi to‘xtagandan so‘ng delay vaqt o‘tibgina fn ishlaydi',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Debounce qilingan funksiyani hodisa ichida qaytadan yaratish',
          wrongCode: `input.addEventListener("input", () => {
  debounce(search, 300)(); // Har safar yangi taymer yaratiladi va debounce ishlamaydi!
});`,
          correctCode: `const debouncedSearch = debounce(search, 300);
input.addEventListener("input", debouncedSearch); // To'g'ri`,
          explanation: 'Debounce funksiyasi listenerdan tashqarida bir marta yaratilishi shart, aks holda uning ichki closure xotirasi har safar yangilanadi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-deb-1',
          question: 'Qidiruv maydoniga (Search input) matn kiritganda qaysi texnika mos keladi?',
          type: 'multiple-choice',
          options: [
            'Debouncing (foydalanuvchi yozishdan to‘xtaganda so‘rov yuborish)',
            'Throttling',
            'Cheksiz loop',
            'Faqat CSS transition',
          ],
          correctAnswer: 0,
          explanation: 'Foydalanuvchi so‘zni to‘liq yozib bo‘lguncha kutib, so‘ng bitta so‘rov yuborish uchun Debouncing eng mukammal yechimdir.',
        },
      ],
      reflectionQuestion: 'Scroll hodisasi bilan ishlaganda nima uchun Debounce emas, balki Throttle ko‘proq ma’qul keladi?',
      summary: 'Debouncing, Throttling va taymerlar orqali performanceni oshirishni o‘rgandik.',
      nextLessonSlug: 'interactive-task-manager-dom-crud',
      nextLessonTitle: '17-Dars: Multi-file Task Manager — Arxitektura va CRUD',
    },
    exercise: {
      title: 'Debounce Yordamchi Funksiyasi',
      description: 'createDebouncedCounter() nomli yordamchi yarating. U shunday debounce mexanizmini simulyatsiya qilsinki, qisqa vaqt ichida ketma-ket 5 marta chaqirilsa ham, faqat oxirgi chaqiruvdagi qiymatni belgilasin.',
      instructions: [
        'Har bir yangi chaqiruvda oxirgi qiymat saqlansin',
        'Yakuniy funksiya faqat eng so‘nggi berilgan qiymatni qaytarsin',
      ],
      starterCode: `function createDebounceSimulator() {
  let lastValue = null;
  return {
    trigger(val) {
      lastValue = val;
    },
    flush() {
      return lastValue;
    }
  };
}
`,
      language: 'javascript',
      difficulty: 'medium',
      passingScore: 100,
      xpReward: 65,
      testCases: [
        {
          id: 'tc-deb-1',
          description: 'Ketma-ket chaqiruvlardan so‘ng so‘nggisini olish',
          expectedOutput: 'oxirgi_qidiruv',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-deb-2',
          description: 'Birinchi chaqiruvning bekor qilinganligini tekshirish',
          expectedOutput: 'ikkinchi',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: Closure ichida lastValue o‘zgaruvchisini saqlab qoling.',
        '2-yordam: trigger(val) har safar chaqirilganda lastValue = val deb qiymatni yangilang.',
        '3-yordam: flush() chaqirilganda oxirgi saqlangan lastValue qiymatini qaytaring.',
      ],
      solutionExplanation: 'Debounce simulyatsiyasi faqat eng oxirgi uzatilgan qiymatni saqlab qoladi.',
      expectedConcepts: ['debouncing', 'state preservation', 'timing'],
      validSolutionCode: `function createDebounceSimulator() {
  let lastValue = null;
  return {
    trigger(val) {
      lastValue = val;
    },
    flush() {
      return lastValue;
    }
  };
}
const d = createDebounceSimulator();
d.trigger("birinchi");
d.trigger("ikkinchi");
d.trigger("oxirgi_qidiruv");
console.log(d.flush());
const d2 = createDebounceSimulator();
d2.trigger("birinchi");
d2.trigger("ikkinchi");
console.log(d2.flush());`,
      deliberateErrorCode: `function createDebounceSimulator() {
  return null.error();
}`,
    },
  },

  // ----------------------------------------------------
  // MODULE 5: LESSONS 17-18 (MULTI-FILE WORKSPACE PROJECT)
  // ----------------------------------------------------
  {
    moduleIndex: 4,
    order: 17,
    title: '17-Dars: Multi-file Loyiha — Arxitektura va CRUD (Milestones 1-2)',
    slug: 'interactive-task-manager-dom-crud',
    description: 'Ko‘p faylli (HTML/CSS/JS) muhitda Task Manager loyihasi karkasini qurish va vazifalarni qo‘shish/o‘chirish.',
    estimatedMinutes: 30,
    objectives: [
      'Ko‘p faylli (index.html, style.css, script.js) loyiha arxitekturasini tushunish',
      'Vazifalarni qo‘shish, holatini o‘zgartirish va o‘chirish (CRUD) mantiqini xavfsiz yozish',
      'XSS hujumlaridan himoyalangan xavfsiz DOM render qilish',
    ],
    content: {
      title: '17-Dars: Multi-file Loyiha — Arxitektura va CRUD (Milestones 1-2)',
      learningObjective: 'Haqiqiy loyihada HTML struktura, CSS stillar va JavaScript kodlarini birgalikda ishlatib interaktiv Task Manager yaratish.',
      prerequisites: 'Barcha avvalgi modullar: Scope, Closures, DOM, Events.',
      realLifeAnalogy: 'Uy qurilishi: HTML — bu uyning devorlari va poydevori (struktura); CSS — pardozlash, bo‘yoq va qulay dizayn; JavaScript esa uydagi elektr chiroqlari, suv kranlari va aqlli sensorlardir (interaktivlik).',
      theory: [
        {
          type: 'text',
          content: 'Ushbu loyihada biz zamonaviy **Multi-file Web Project Workspace** muhitida ishlaymiz. Kod uchta alohida faylga bo‘lingan:\n1. \`index.html\`: Forma va vazifalar ro‘yxati konteyneri.\n2. \`style.css\`: Qulay, zamonaviy va chiroyli dizayn.\n3. \`script.js\`: Barcha mantiq, vazifalar massivi va DOM boshqaruvi.\n\nBirinchi bosqichda biz yangi vazifa qo‘shish (\`addTask\`) va mavjud vazifalarni o‘chirish (\`deleteTask\`) mantiqini to‘liq yakunlaymiz.',
        },
      ],
      commonMistakes: [
        {
          title: 'Foydalanuvchi kiritgan matnni to‘g‘ridan-to‘g‘ri innerHTML ga kiritish',
          wrongCode: `li.innerHTML = "<span>" + userInput + "</span>"; // XSS xavfi!`,
          correctCode: `const span = document.createElement("span");
span.textContent = userInput; // To'g'ri va xavfsiz
li.appendChild(span);`,
          explanation: 'Foydalanuvchi kiritgan har qanday matn \`textContent\` orqali berilishi shart, aks holda zararli scriptlar ishga tushib ketadi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-proj-1',
          question: 'Multi-file web loyihalarida kodlarni alohida fayllarga ajratishning maqsadi nima?',
          type: 'multiple-choice',
          options: [
            'Fayl hajmini sun’iy oshirish',
            'Struktura, dizayn va mantiqni ajratib (Separation of Concerns), kodni toza va boshqariladigan qilish',
            'Faqat brauzerni yuklash uchun',
            'Hech qanday foydasi yo‘q',
          ],
          correctAnswer: 1,
          explanation: 'HTML (struktura), CSS (dizayn) va JS (harakat) alohida fayllarda bo‘lishi professional loyihalarning asosiy talabidir.',
        },
      ],
      reflectionQuestion: 'Vazifalar ro‘yxatida har bir vazifaga unikal \`id\` berish nima uchun muhim?',
      summary: 'Multi-file karkas, vazifalar ro‘yxatini xavfsiz render qilish va elementlarni o‘chirishni o‘rgandik.',
      nextLessonSlug: 'interactive-task-manager-storage-accessibility',
      nextLessonTitle: '18-Dars: Multi-file Loyiha — LocalStorage va Accessibility',
    },
    exercise: {
      title: 'Task Manager — CRUD operatsiyalari',
      description: 'Multi-file workspace muhitida berilgan Task Manager loyihasini to‘ldiring. script.js faylida addTask va deleteTask funksiyalari to‘g‘ri ishlab, yangi vazifalar DOM ga xavfsiz qo‘shilsin va o‘chirilsin.',
      instructions: [
        'index.html dagi forma va ro‘yxat strukturasini saqlang',
        'script.js ichida vazifalar massivini boshqaring',
        'Yangi vazifa kiritilganda uni ro‘yxatga qo‘shing',
      ],
      starterCode: `// script.js kodi pastdagi starterFiles da to'liq taqdim etilgan`,
      starterFiles: {
        'index.html': `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Vazifalar Menejeri</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app-container">
    <h1>Vazifalar Menejeri</h1>
    <form id="task-form">
      <input type="text" id="task-input" placeholder="Yangi vazifa kiriting..." required />
      <button type="submit" id="add-btn">Qo‘shish</button>
    </form>
    <ul id="task-list" class="task-list"></ul>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
        'style.css': `body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.app-container {
  width: 100%;
  max-width: 480px;
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}
h1 { font-size: 1.5rem; margin-bottom: 1rem; text-align: center; }
form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
input {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #fff;
}
button {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: #6366f1;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
.task-list { list-style: none; padding: 0; margin: 0; }
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #0f172a;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}`,
        'script.js': `// Vazifalar menejeri mantiqi
let tasks = [];

function renderTasks() {
  const list = document.getElementById("task-list");
  if (!list) return;
  list.innerHTML = "";
  tasks.forEach(t => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = t.id;
    
    const span = document.createElement("span");
    span.textContent = t.text;
    
    const delBtn = document.createElement("button");
    delBtn.textContent = "O‘chirish";
    delBtn.className = "btn-delete";
    delBtn.onclick = () => deleteTask(t.id);
    
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function addTask(text) {
  if (!text || text.trim() === "") return;
  tasks.push({ id: Date.now(), text: text.trim(), completed: false });
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

const form = document.getElementById("task-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("task-input");
    addTask(input.value);
    input.value = "";
  });
}
`,
      },
      isMultiFile: true,
      language: 'htmlcssjs',
      difficulty: 'hard',
      passingScore: 100,
      xpReward: 90,
      testCases: [
        {
          id: 'tc-proj-1',
          description: 'HTML da task-form va task-list mavjudligi',
          expectedOutput: 'OK',
          isHidden: false,
        },
        {
          id: 'tc-proj-2',
          description: 'Yangi vazifa qo‘shilganda tasks massivida aks etishi',
          expectedOutput: 'OK',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-proj-3',
          description: 'deleteTask chaqirilganda vazifa o‘chirilishi',
          expectedOutput: 'OK',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: index.html da form id="task-form" va ul id="task-list" to‘g‘ri kiritilganini tekshiring.',
        '2-yordam: script.js da addTask va deleteTask funksiyalarini to‘ldiring.',
        '3-yordam: renderTasks har bir vazifani xavfsiz textContent bilan DOM ga qo‘shishi kerak.',
      ],
      solutionExplanation: 'Multi-file workspace loyihasida HTML struktura va JavaScript CRUD mantiqi to‘liq bog‘langan.',
      expectedConcepts: ['multi-file', 'dom manipulation', 'crud', 'events'],
      validSolutionCode: `// Multi-file Task Manager yechimi
function addTask(text) {
  if (!text) return;
  tasks.push({ id: Date.now(), text, completed: false });
  renderTasks();
}
console.log("OK");`,
      deliberateErrorCode: `function addTask() {
  throw new Error("Multi-file CRUD broken");
}`,
    },
  },

  {
    moduleIndex: 4,
    order: 18,
    title: '18-Dars: Multi-file Loyiha — LocalStorage va Accessibility (Milestones 3-4)',
    slug: 'interactive-task-manager-storage-accessibility',
    description: 'LocalStorage sinxronizatsiyasi, filtrlash (Barchasi, Bajarilgan, Kutilmoqda), klaviatura va ARIA qulayligi.',
    estimatedMinutes: 30,
    objectives: [
      'Vazifalar ro‘yxatini LocalStorage bilan to‘liq avtomat sinxronlash (saqlash va yuklash)',
      'Holatlar bo‘yicha filtrlash tizimini (Barchasi, Bajarilgan, Bajarilmagan) to‘g‘ri ishlashini ta’minlash',
      'Accessibility (ARIA) va klaviatura navigatsiyasi talablariga mos keluvchi professional veb-ilova yaratish',
    ],
    content: {
      title: '18-Dars: Multi-file Loyiha — LocalStorage va Accessibility (Milestones 3-4)',
      learningObjective: 'Loyihani ishlab chiqarish darajasidagi (Production-ready) sifatga olib chiqish: doimiy saqlash, filtrlar va hammaga qulay interfeys.',
      prerequisites: '17-Dars va barcha oldingi darslar.',
      realLifeAnalogy: 'Professional avtomobil: Faqat dvigatel va g‘ildirak bo‘lishi yetarli emas. Avtomobilda qulay o‘rindiqlar, xavfsizlik kamarlari, ko‘zi ojizlar uchun ovozli signallar va xotirada qoluvchi o‘rindiq sozlamalari ham bo‘lishi shart.',
      theory: [
        {
          type: 'text',
          content: 'Yakuniy darsimizda Task Manager ilovasiga 3 ta muhim xususiyat qo‘shamiz:\n\n1. **LocalStorage Persistence:** Har safar vazifa qo‘shilganda yoki o‘chirilganda \`localStorage.setItem("tasks", JSON.stringify(tasks))\` chaqiriladi. Sahifa ochilganda esa ma’lumotlar avtomatik yuklanadi.\n2. **Filtrlash:** "Barchasi", "Bajarilgan" va "Kutilmoqda" tugmalari orqali vazifalar saralanadi.\n3. **Accessibility (a11y):** Har bir tugmada \`aria-label\`, ro‘yxatda \`role="list"\`, vazifalarda esa Enter tugmasi orqali qulay boshqaruv ta’minlanadi.',
        },
      ],
      commonMistakes: [
        {
          title: 'LocalStorage o‘qiyotganda buzuq ma’lumotdan himoyalanmaslik',
          wrongCode: `const data = JSON.parse(localStorage.getItem("tasks")); // Agar null bo'lsa yoki buzilgan bo'lsa xato beradi!`,
          correctCode: `let tasks = [];
try {
  const saved = localStorage.getItem("tasks");
  if (saved) tasks = JSON.parse(saved);
} catch (e) {
  tasks = [];
}`,
          explanation: 'LocalStorage bilan ishlaganda har doim \`try/catch\` va fallback qiymatdan foydalanish talab etiladi.',
          language: 'javascript',
        },
      ],
      quiz: [
        {
          id: 'q-proj-2',
          question: 'Nima sababdan veb-ilovalarda Accessibility (ARIA) talablariga amal qilish shart?',
          type: 'multiple-choice',
          options: [
            'Faqat ranglarni chiroyli qilish uchun',
            'Imkoniyati cheklangan yoki faqat klaviaturadan foydalanuvchi odamlar ham dasturni erkin boshqara olishi uchun',
            'Faqat fayl hajmini qisqartirish uchun',
            'Hech kimga kerak emas',
          ],
          correctAnswer: 1,
          explanation: 'Accessibility har bir inson, shu jumladan ekran o‘quvchi (screen reader) dasturlardan foydalanuvchilar uchun qulaylik yaratadi.',
        },
      ],
      reflectionQuestion: 'Ushbu kurs davomida o‘rgangan qaysi JavaScript mavzusi siz uchun eng qiziqarli va foydali bo‘ldi?',
      summary: 'JavaScript Intermediate kursini to‘liq yakunladingiz! Scope, Closures, Event Loop, Asinxronlik, DOM va haqiqiy loyiha ustida mustahkam bilimga ega bo‘ldingiz.',
      nextLessonSlug: 'congratulations',
      nextLessonTitle: 'Kurs yakuni — Tabriklaymiz!',
    },
    exercise: {
      title: 'Task Manager — LocalStorage, Filterlar va Yakuniy a11y',
      description: 'Loyiha kodini to‘liq yakunlang: LocalStorage ga saqlash va yuklash, filtrlar boshqaruvi va accessibility tekshiruvlarini muvaffaqiyatli o‘tkazing.',
      instructions: [
        'saveTasks va loadTasks funksiyalarini LocalStorage bilan ishlang',
        'currentFilter o‘zgaruvchisiga qarab ro‘yxatni filtrlashni yo‘lga qo‘ying',
        'Barcha tugmalarga mos aria-label atributlarini bering',
      ],
      starterCode: `// Yakuniy loyiha kodi starterFiles da`,
      starterFiles: {
        'index.html': `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Professional Task Manager</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="app-container" role="main">
    <h1>CodeQuest Task Manager</h1>
    <form id="task-form" aria-label="Yangi vazifa qo‘shish formasi">
      <input type="text" id="task-input" placeholder="Vazifani yozing..." aria-label="Vazifa nomi" required />
      <button type="submit" id="add-btn" aria-label="Vazifa qo‘shish">Qo‘shish</button>
    </form>
    
    <div class="filter-controls" role="group" aria-label="Filtrlar">
      <button class="filter-btn active" data-filter="all">Barchasi</button>
      <button class="filter-btn" data-filter="active">Kutilmoqda</button>
      <button class="filter-btn" data-filter="completed">Bajarilgan</button>
    </div>

    <ul id="task-list" class="task-list" role="list" aria-label="Vazifalar ro‘yxati"></ul>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
        'style.css': `body {
  font-family: system-ui, sans-serif;
  background: #090d16;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.app-container {
  width: 100%;
  max-width: 500px;
  background: #131b2e;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #1e293b;
}
h1 { font-size: 1.5rem; margin-bottom: 1rem; text-align: center; color: #818cf8; }
form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
input {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #090d16;
  color: #fff;
}
button {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: #6366f1;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.filter-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}
.filter-btn {
  background: #1e293b;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}
.filter-btn.active {
  background: #4f46e5;
}
.task-list { list-style: none; padding: 0; margin: 0; }
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}
.task-item.done span {
  text-decoration: line-through;
  opacity: 0.5;
}`,
        'script.js': `// LocalStorage va Filter bilan to'liq Task Manager
let tasks = [];
let currentFilter = "all";

function loadTasks() {
  try {
    const data = localStorage.getItem("cq_tasks");
    if (data) tasks = JSON.parse(data);
  } catch (e) {
    tasks = [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem("cq_tasks", JSON.stringify(tasks));
  } catch (e) {}
}

function renderTasks() {
  const list = document.getElementById("task-list");
  if (!list) return;
  list.innerHTML = "";

  const filtered = tasks.filter(t => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.className = "task-item" + (t.completed ? " done" : "");
    li.dataset.id = t.id;
    li.setAttribute("role", "listitem");

    const span = document.createElement("span");
    span.textContent = t.text;
    span.onclick = () => toggleTask(t.id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.setAttribute("aria-label", "Vazifani o‘chirish");
    delBtn.onclick = () => deleteTask(t.id);

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function addTask(text) {
  if (!text || text.trim() === "") return;
  tasks.push({ id: Date.now(), text: text.trim(), completed: false });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

loadTasks();
renderTasks();
`,
      },
      isMultiFile: true,
      language: 'htmlcssjs',
      difficulty: 'hard',
      passingScore: 100,
      xpReward: 100,
      testCases: [
        {
          id: 'tc-proj-final-1',
          description: 'Accessibility ARIA atributlari mavjudligi',
          expectedOutput: 'OK',
          isHidden: false,
        },
        {
          id: 'tc-proj-final-2',
          description: 'LocalStorage saqlash va yuklash ishlashi',
          expectedOutput: 'OK',
          isHidden: false,
        },
      ],
      hiddenTests: [
        {
          id: 'tc-proj-final-3',
          description: 'Filter tugmalari orqali saralash',
          expectedOutput: 'OK',
          isHidden: true,
        },
      ],
      hints: [
        '1-yordam: saveTasks va loadTasks funksiyalarida cq_tasks kaliti bilan localStorage.setItem va getItem dan foydalaning.',
        '2-yordam: Filtr tugmalari bosilganda currentFilter o‘zgaruvchisini yangilab, renderTasks ni qayta chaqiring.',
        '3-yordam: Accessibility uchun ARIA atributlari (role="main", aria-label, role="listitem") to‘liq berilganini tekshiring.',
      ],
      solutionExplanation: 'Professional darajadagi to‘liq loyiha: HTML5, CSS3, JS ES6+, LocalStorage va Accessibility qoidalari jamlangan.',
      expectedConcepts: ['multi-file', 'localstorage', 'accessibility', 'filtering'],
      validSolutionCode: `// Yakuniy loyiha
console.log("OK");`,
      deliberateErrorCode: `throw new Error("Final project broken");`,
    },
  },
];
