import type { ErrorExplanation } from '@/types';

interface ErrorRule {
  pattern: RegExp | string;
  type: string;
  cause: string;
  explanation: string;
  whatToChange: string;
  hint: string;
  similarExample: string;
  reflectionQuestion: string;
}

const ERROR_RULES: ErrorRule[] = [
  {
    pattern: /is not defined/i,
    type: 'ReferenceError (Mavjud bo‘lmagan nom)',
    cause: 'Dastur hali e’lon qilinmagan yoki noto‘g‘ri yozilgan o‘zgaruvchi/funksiyani ishlatishga urindi.',
    explanation: 'JavaScript bu nomdagi o‘zgaruvchini xotiradan topa olmadi. Ko‘pincha harf xatosi yoki "let" / "const" bilan e’lon qilish unutilganda yuz beradi.',
    whatToChange: 'O‘zgaruvchi nomining to‘g‘ri yozilganini (katta-kichik harflar) va u ishlatilishidan oldin e’lon qilinganini tekshiring.',
    hint: 'O‘zgaruvchini console.log dan yuqorida let yoki const bilan e’lon qilganmisiz?',
    similarExample: '// Xato:\nconsole.log(ball);\n\n// To\'g\'ri:\nlet ball = 100;\nconsole.log(ball);',
    reflectionQuestion: 'Kompyuter siz aytmoqchi bo‘lgan so‘zni oldindan bilishi mumkinmi, yoki avval tanishtirish shartmi?',
  },
  {
    pattern: /Unexpected token/i,
    type: 'SyntaxError (Kutilmagan belgi)',
    cause: 'Koddagi qavs, qo‘shtirnoq yoki tinish belgisi noto‘g‘ri joyda qo‘yilgan yoki yopilmay qolgan.',
    explanation: 'JavaScript bu qatorda grammatika qoidalariga mos kelmaydigan belgini uchratdi. Ko‘pincha qavslar yoki qo‘shtirnoqlar juftligi buzilganda sodir bo‘ladi.',
    whatToChange: 'Ochilgan barcha qavslar (), {} va qo‘shtirnoqlar "" to‘g‘ri yopilganini tekshiring.',
    hint: 'Satr oxiriga e’tibor bering: qavs yoki qo‘shtirnoq yopilmagan bo‘lishi mumkin.',
    similarExample: '// Xato: console.log("Salom);\n// To\'g\'ri: console.log("Salom");',
    reflectionQuestion: 'Gap yozganingizda qavs ochib yopmasangiz nima bo‘ladi?',
  },
  {
    pattern: /missing \) after argument list/i,
    type: 'SyntaxError (Yopuvchi qavs qolib ketgan)',
    cause: 'Funksiya chaqiruvida ochilgan qavs yopilmagan.',
    explanation: 'console.log() yoki boshqa funksiya ichiga parametr berilgandan so‘ng oxirgi ")" qavs qo‘yilmagan.',
    whatToChange: 'Satr oxiriga yopuvchi qavs ")" va nuqtali vergul ";" qo‘shing.',
    hint: 'console.log( ochilgandan keyin oxirida ) yopildimi?',
    similarExample: 'console.log("Xush kelibsiz");',
    reflectionQuestion: 'Har bir ochilgan qavs o‘z juftiga ega bo‘lishi shartligini unutmadingizmi?',
  },
  {
    pattern: /Assignment to constant variable/i,
    type: 'TypeError (O‘zgarmas qiymatni o‘zgartirish)',
    cause: 'const bilan e’lon qilingan o‘zgaruvchiga yangi qiymat berishga urinish.',
    explanation: 'const (konstanta) faqat bir marta boshlang‘ich qiymat oladi va keyinchalik o‘zgarmaydi.',
    whatToChange: 'Agar o‘zgaruvchi qiymati o‘zgarishi kerak bo‘lsa, "const" o‘rniga "let" kalit so‘zidan foydalaning.',
    hint: 'O‘zgaruvchini e’lon qilish qatorida const o‘rniga let deb yozib ko‘ring.',
    similarExample: 'let hisob = 0;\nhisob = 10; // Endi xatosiz ishlaydi',
    reflectionQuestion: 'Doimiy o‘zgarmas narsalar (masalan, PI soni) bilan o‘zgaruvchi ballarning farqi nimada?',
  },
  {
    pattern: /Cannot read propert/i,
    type: 'TypeError (Bo‘sh obyekt xususiyati)',
    cause: 'Mavjud bo‘lmagan (null yoki undefined) element ichidan ma’lumot olishga urinish.',
    explanation: 'Dastur topa olmagan element ustida amal bajaryapsiz (masalan sahifada yo‘q tugmani bosish).',
    whatToChange: 'Element sahifada haqiqatan borligini va ID si to‘g‘ri yozilganini tekshiring.',
    hint: 'document.getElementById ichidagi nom HTML dagi id bilan bir xilmi?',
    similarExample: 'const tugma = document.getElementById("btn");\nif (tugma) { ... }',
    reflectionQuestion: 'Qutining ichida hech narsa bo‘lmasa, undan narsa olib bo‘ladimi?',
  },
  {
    pattern: /is not a function/i,
    type: 'TypeError (Funksiya emas)',
    cause: 'Oddiy son yoki matnni funksiya kabi qavs () bilan chaqirishga urinildi.',
    explanation: 'Faqat funksiyalargina `nomi()` ko‘rinishida ishga tushirilishi mumkin.',
    whatToChange: 'Chaqirilayotgan nom haqiqatan funksiya ekanini yoki nomida adashmaganingizni tekshiring.',
    hint: 'O‘zgaruvchi nomidan keyin keraksiz qavslar qo‘yilmaganmi?',
    similarExample: 'let ism = "Ali";\n// ism() deb chaqirib bo\'lmaydi!',
    reflectionQuestion: 'Nom funksiyami yoki oddiy o‘zgaruvchimi?',
  },
  {
    pattern: /timeout|cheksiz|infinite loop/i,
    type: 'Timeout / Infinite Loop (Cheksiz sikl)',
    cause: 'Sikl to‘xtash sharti hech qachon bajarilmayapti yoki hisoblagich (i++) oshirilmayapti.',
    explanation: 'Dastur sikldan chiqib keta olmay, bir xil amalni cheksiz takrorlamoqda. Brauzer qotib qolmasligi uchun himoya tizimi kodni to‘xtatdi.',
    whatToChange: 'Sikl ichida hisoblagich oshirilayotganini (masalan, i++) va to‘xtash sharti (masalan, i < 5) to‘g‘ri qo‘yilganini tekshiring.',
    hint: 'Sikl ichida i++ yoki o‘zgaruvchini yangilashni unutmaganmisiz?',
    similarExample: '// Xato:\nlet i = 0;\nwhile (i < 5) {\n  console.log(i);\n  // i++ yo\'q!\n}\n\n// To\'g\'ri:\nlet i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}',
    reflectionQuestion: 'Sikl qachon to‘xtashini kompyuter biladimi? Har bir qadamda maqsadga yaqinlashyapmizmi?',
  },
];

export function explainError(errorMessage: string, line?: number): ErrorExplanation {
  for (const rule of ERROR_RULES) {
    const matches = typeof rule.pattern === 'string'
      ? errorMessage.includes(rule.pattern)
      : rule.pattern.test(errorMessage);

    if (matches) {
      return {
        errorType: rule.type,
        line,
        cause: rule.cause,
        explanation: rule.explanation,
        whatToChange: rule.whatToChange,
        hint: rule.hint,
        similarExample: rule.similarExample,
        reflectionQuestion: rule.reflectionQuestion,
      };
    }
  }

  // Fallback for unknown errors
  return {
    errorType: 'Runtime Error (Ijro xatosi)',
    line,
    cause: 'Kodni bajarish jarayonida kutilmagan to‘xtalish yuz berdi.',
    explanation: `Dastur quyidagi xabarni berdi: "${errorMessage}". Kod tuzilishini va o‘zgaruvchilar tartibini qayta ko‘rib chiqing.`,
    whatToChange: 'Xato ko‘rsatilgan qatordagi amallar va sintaksisni tekshiring.',
    hint: 'Dars nazariyasidagi kod namunasi bilan o‘z kodingizni taqqoslab chiqing.',
    reflectionQuestion: 'Kodni qadam-baqadam ko‘zdan kechirib, qayerda nomutanosiblik borligini ko‘ra olasizmi?',
  };
}
