import type { MentorMode, MentorMessage } from '@/types';

export interface MentorContext {
  lessonTitle?: string;
  code?: string;
  language?: string;
  lastError?: string;
  hints?: string[];
  hintsUsedCount?: number;
}

export function generateMentorResponse(
  mode: MentorMode,
  context: MentorContext,
  userPrompt?: string
): MentorMessage {
  const now = new Date().toISOString();
  let content = '';

  switch (mode) {
    case 'explain':
      content = `Salom! "${context.lessonTitle || 'Bu mavzu'}" bo‘yicha kod qismini ko‘rib chiqyapman.\n\n` +
        `Bu kodning asosiy vazifasi — kompyuterga aniq ketma-ketlikda amallarni bajartirishdir. Har bir qatorda ma’lumot saqlanadi yoki qayta ishlanadi. ` +
        `Agar biron qator sizga tushunarsiz bo‘lsa, qaysi qatorda to‘xtalganingizni aytsangiz, uni hayotiy misol bilan soddalashtirib beraman!`;
      break;

    case 'hint': {
      const hints = context.hints || [];
      const used = context.hintsUsedCount || 0;
      if (hints.length === 0) {
        content = `Hozircha asosiy maslahat: Vazifa shartini diqqat bilan o‘qing va qaysi o‘zgaruvchilar kerakligini belgilab oling.`;
      } else if (used === 0 && hints[0]) {
        content = `**1-bosqich maslahat (Yo‘nalish):**\n${hints[0]}`;
      } else if (used === 1 && hints[1]) {
        content = `**2-bosqich maslahat (Aniqroq ko‘rsatma):**\n${hints[1]}`;
      } else if (hints[2]) {
        content = `**3-bosqich maslahat (Yechim siri):**\n${hints[2]}`;
      } else {
        content = `Siz barcha maslahatlardan foydalandingiz. Koddagi har bir qatorni darsdagi namuna bilan solishtirib chiqing!`;
      }
      break;
    }

    case 'error':
      if (context.lastError) {
        content = `Sizning kodingizda xatolik yuz berdi: \`${context.lastError}\`.\n\n` +
          `Xavotir olmang, dasturlashda xato qilish tabiiy holat! Ko‘pincha bu qavs yoki qo‘shtirnoq yopilmagani yoki o‘zgaruvchi nomi noto‘g‘ri yozilgani sabab bo‘ladi. Qator oxirlarini va harflar registrini (katta/kichik harflar) tekshirib chiqing.`;
      } else {
        content = `Hozircha kodingizda qat’iy sintaksis xatosi ko‘rinmayapti. "Kodni tekshirish" tugmasini bosib, test natijalarini ko‘rishingiz mumkin!`;
      }
      break;

    case 'review':
      if (!context.code || context.code.trim().length === 0) {
        content = `Siz hali kod yozmadingiz. Muharrirga kod yozing, men uni bajonidil ko‘rib chiqaman!`;
      } else {
        const lines = context.code.split('\n').length;
        content = `**Kod sharhi (Code Review):**\n\n` +
          `- Kod hajmi: ${lines} qator\n` +
          `- Uslub: Kod o‘qilishi qulay va tushunarli tuzilgan.\n` +
          `- Maslahat: Har doim o‘zgaruvchilarga ma’noli nomlar bering (masalan \`x\` emas, \`ball\` yoki \`ism\`).\n` +
          `- Endi test case larni ishga tushirib, natijani tekshirib ko‘ring!`;
      }
      break;

    case 'simplify':
      content = `Keling, buni juda oddiy tushuntiraman: Dasturlash xuddi pazandachilik retseptiga o‘xshaydi. Siz narsalarni tayyorlaysiz (o‘zgaruvchilar), ularni aralashtirasiz (amallar) va tayyor taomni tortasiz (natija). Murakkab tuyulgan joyini birma-bir mayda qismlarga bo‘lib bajaramiz!`;
      break;

    case 'real-world':
      content = `**Real loyihalarda qayerda ishlatiladi?**\n\n` +
        `Ushbu o‘rganayotgan tushunchangiz (masalan shartlar yoki formalar) har bir zamonaviy saytda bor: ` +
        `Telegram botlarda xabarlarni filtrlashda, Instagram da parolni tekshirishda yoki Click / Payme da to‘lov summasini hisoblashda aynan shu mantiq ishlaydi!`;
      break;

    case 'question':
      content = `Qani, bitta tezkor savol:\n\nAgar kompyuterga 2 ta matnni birlashtirish buyrug‘ini bermoqchi bo‘lsangiz, qaysi belgidan foydalanasiz? (+ mi yoki - mi?)`;
      break;

    case 'test':
      content = `Keling, o‘zlashtirishni tekshiramiz! Agar kodingizdagi o‘zgaruvchini console.log ga qo‘shtirnoq ichida bersangiz nima chiqadi? Javobingizni o‘ylab ko‘ring!`;
      break;

    default:
      content = userPrompt
        ? `Sizning savolingiz: "${userPrompt}". O‘rganish jarayonida qiynalayotgan joyingiz bo‘lsa, aniq dars yoki qatorni aytsangiz, yordam beraman!`
        : `Salom! Men sizning shaxsiy Code Mentor yordamchingizman. Savolingiz bormi?`;
  }

  return {
    id: crypto.randomUUID(),
    role: 'mentor',
    content,
    mode,
    timestamp: now,
  };
}
