/**
 * CodeQuest — Robo-Ustoz Natural Uzbek Speech and Dialogue Engine
 * 
 * Provides natural conversational Uzbek dialogues, pedagogy, 
 * error diagnostics, line-by-line code debugging, and encouragement.
 */

export interface RobotSpeechScript {
  id: string;
  mood: 'idle' | 'talking' | 'alert' | 'celebrate' | 'thinking';
  title: string;
  speechText: string;     // Text sent to TTS audio engine
  displayText: string;    // Rich text shown in speech bubble
  actionButton?: {
    label: string;
    action: () => void;
  };
}

/**
 * Clean up and phoneticize text for natural spoken Uzbek:
 * Converts English programming terms, abbreviations, syntax symbols, 
 * and specific affixes into natural, native Uzbek spoken sounds.
 */
export function formatTextForSpeech(text: string): string {
  if (!text) return '';

  let t = text;

  // 1. Remove emojis and markdown formatting
  t = t.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // markdown links
  t = t.replace(/[`*#_~]/g, ' '); // markdown symbols
  t = t.replace(/[{}]/g, ' ');

  // 2. Safe HTML / XML tags conversion for SSML TTS engine
  t = t.replace(/<\/([a-zA-Z0-9_-]+)>/g, ' $1 yopilish tegi ');
  t = t.replace(/<([a-zA-Z0-9_-]+)>/g, ' $1 tegi ');
  t = t.replace(/[<>]/g, ' ');

  // 3. Remove English curriculum tags in parentheses
  t = t.replace(/\s*\(\s*hints?\s*\)\s*/gi, ' ');
  t = t.replace(/\s*\(\s*quiz\s*\)\s*/gi, ' ');
  t = t.replace(/\s*\(\s*live preview\s*\)\s*/gi, ' ');
  t = t.replace(/\s*\(\s*preview\s*\)\s*/gi, ' ');
  t = t.replace(/\s*\(\s*console\s*\)\s*/gi, ' ');

  // 4. Programming Languages & File Extensions -> Authentic Uzbek speech
  t = t.replace(/\bJavaScript\b/gi, 'Javaskript');
  t = t.replace(/\bTypeScript\b/gi, 'Taypskript');
  t = t.replace(/\bPython\b/gi, 'Payton');
  t = t.replace(/\bJS\b/g, 'Javaskript');
  t = t.replace(/\bTS\b/g, 'Taypskript');
  t = t.replace(/\bHTML5?\b/gi, 'Ashtemel');
  t = t.replace(/\bCSS3?\b/gi, 'Si-Es-Es');
  t = t.replace(/index\.html/gi, 'indeks ashtemel');
  t = t.replace(/style\.css/gi, 'stayl si-es-es');
  t = t.replace(/script\.js/gi, 'skript javaskript');

  // 5. Code commands, functions & concepts
  t = t.replace(/console\.log/gi, 'konsol log');
  t = t.replace(/\bconsole\b/gi, 'konsol');
  t = t.replace(/\bfunction\b/gi, 'funksiya');
  t = t.replace(/\breturn\b/gi, 'qaytarish');
  t = t.replace(/\bAPI\b/g, 'Ey-Pi-Ay');
  t = t.replace(/\bDOM\b/g, 'Dom');
  t = t.replace(/\bXP\b/g, 'ochko');
  t = t.replace(/\bVS Code\b/gi, 'Vi-Es Kod');
  t = t.replace(/\bUI\b/g, 'interfeys');
  t = t.replace(/\bfrontend\b/gi, 'front-end');
  t = t.replace(/\bbackend\b/gi, 'bek-end');
  t = t.replace(/\bReact\b/gi, 'Riekt');
  t = t.replace(/\bNext\.js\b/gi, 'Nekst ji-es');
  t = t.replace(/\bNode\.js\b/gi, 'Nod ji-es');
  t = t.replace(/\bJSON\b/g, 'Jey-son');

  // 6. CSS & Web design terms
  t = t.replace(/\bbackground-color\b/gi, 'orqa fon rangi');
  t = t.replace(/\bfont-size\b/gi, 'shrift o‘lchami');
  t = t.replace(/\bborder-radius\b/gi, 'burchak radiusi');
  t = t.replace(/\btext-align\b/gi, 'matn tekislash');
  t = t.replace(/\bpadding\b/gi, 'pedding ichki oraliq');
  t = t.replace(/\bmargin\b/gi, 'marjin tashqi oraliq');
  t = t.replace(/\bflexbox\b/gi, 'fleksboks');
  t = t.replace(/\bpx\b/gi, 'piksel');

  // 7. JavaScript Errors & debugging
  t = t.replace(/\bSyntaxError\b/gi, 'sintaksis xatoligi');
  t = t.replace(/\bReferenceError\b/gi, 'o‘zgaruvchi topilmadi xatosi');
  t = t.replace(/\bTypeError\b/gi, 'tur xatoligi');
  t = t.replace(/\bRangeError\b/gi, 'chegara xatoligi');
  t = t.replace(/\bquizni\b/gi, 'test savolini');
  t = t.replace(/\bquiz\b/gi, 'test');
  t = t.replace(/\bhints\b/gi, 'maslahatlar');
  t = t.replace(/\bhint\b/gi, 'maslahat');
  t = t.replace(/\btimeout\b/gi, 'taym-aut');
  t = t.replace(/\bstring\b/gi, 'matnli satr');
  t = t.replace(/\bboolean\b/gi, 'mantiqiy tur');
  t = t.replace(/\bnumber\b/gi, 'son turi');
  t = t.replace(/\btrue\b/gi, 'to‘g‘ri');
  t = t.replace(/\bfalse\b/gi, 'noto‘g‘ri');
  t = t.replace(/\bnull\b/gi, 'bo‘sh qiymat');
  t = t.replace(/\bundefined\b/gi, 'aniqlanmagan qiymat');
  t = t.replace(/\bArray\b/gi, 'massiv');
  t = t.replace(/\bObject\b/gi, 'obyekt');

  // 8. Operators & Special Syntax
  t = t.replace(/===/g, 'qat’iy teng');
  t = t.replace(/!==/g, 'qat’iy teng emas');
  t = t.replace(/==/g, 'teng');
  t = t.replace(/!=/g, 'teng emas');
  t = t.replace(/=>/g, 'strelkali funksiya');
  t = t.replace(/&&/g, 'va');
  t = t.replace(/\|\|/g, 'yoki');
  t = t.replace(/<=/g, 'kichik yoki teng');
  t = t.replace(/>=/g, 'katta yoki teng');
  t = t.replace(/\+\+/g, 'birga oshirish');
  t = t.replace(/--/g, 'birga kamaytirish');

  // 9. Clean up quotes & apostrophes for smooth neural pronunciation
  t = t.replace(/[ʻ’‘`]/g, "‘");
  t = t.replace(/["“”«»]/g, ' ');

  // 10. Collapse whitespace
  t = t.replace(/\s+/g, ' ').trim();

  return t;
}

export interface TeacherLectureContext {
  lessonTitle: string;
  learningObjective?: string;
  realLifeAnalogy?: string;
  theory?: Array<{ type?: string; content: string }>;
  interactiveExample?: {
    title: string;
    code: string;
    expectedOutput?: string;
    lineExplanations?: Record<string, string>;
  };
  commonMistakes?: Array<{
    title: string;
    wrongCode: string;
    correctCode: string;
    explanation: string;
  }>;
  exercise?: {
    title: string;
    description: string;
    instructions: string[];
    starterCode?: string;
    expectedConcepts?: string[];
  };
}

export interface ComprehensiveLectureStep {
  id: string;
  elementId: string;
  title: string;
  pointingDirection: 'left' | 'right';
  speechText: string;
  displayText: string;
}

/**
 * Generate deep, step-by-step master teacher lecture explaining WHY, WHAT, WHEN,
 * line-by-line mechanics, common mistakes, and hands-on guidance.
 */
export function generateComprehensiveLectureSteps(ctx: TeacherLectureContext): ComprehensiveLectureStep[] {
  const cleanTitle = ctx.lessonTitle.replace(/^(\d+-Dars:?\s*)/i, '').trim();
  const lowerTitle = cleanTitle.toLowerCase();
  const lowerCode = (ctx.interactiveExample?.code || '').toLowerCase();
  const concepts = (ctx.exercise?.expectedConcepts || []).map(c => c.toLowerCase());

  const isVariables = lowerTitle.includes('o‘zgaruvchi') || lowerTitle.includes('ozgaruvchi') || 
    lowerTitle.includes('turlar') || lowerTitle.includes('variable') || 
    concepts.includes('const') || concepts.includes('let') || lowerCode.includes('const') || lowerCode.includes('let');

  const isConditionals = lowerTitle.includes('shart') || lowerTitle.includes('if') || 
    lowerTitle.includes('mantiq') || concepts.includes('if') || concepts.includes('else');

  const isLoops = lowerTitle.includes('sikl') || lowerTitle.includes('takrorlan') || 
    lowerTitle.includes('loop') || concepts.includes('for') || concepts.includes('while');

  const steps: ComprehensiveLectureStep[] = [];

  // Step 1: Lesson Title & Teacher Welcome
  steps.push({
    id: 'step-title',
    elementId: 'lesson-title-section',
    title: `1. Mavzu: ${cleanTitle}`,
    pointingDirection: 'left',
    speechText: formatTextForSpeech(
      `Assalomu alaykum, aziz do‘stim! Men sizning dasturlash ustozingiz Robo-Ustozman. Bugun biz siz bilan birgalikda dasturlashning eng muhim poydevorlaridan biri bo‘lgan "${cleanTitle}" darsini to‘liq va chuqur o‘rganamiz. Diqqat bilan tinglang, har bir buyruq nima uchun va qanday yozilishini birma-bir tushuntirib beraman!`
    ),
    displayText: `🎓 **Mavzu: ${cleanTitle}**\n\nAssalomu alaykum! Bugungi darsimizda har bir kod nima uchun yozilishi va qanday ishlashini to‘liq tahlil qilamiz.`,
  });

  // Step 2: Learning Objective & The "Why"
  if (ctx.learningObjective) {
    steps.push({
      id: 'step-objective',
      elementId: 'lesson-objective-section',
      title: '2. Nima Uchun Bu Kodlar Kerak?',
      pointingDirection: 'left',
      speechText: formatTextForSpeech(
        `Keling, eng asosiy savolga javob beraylik: Nima uchun biz bu kodlarni yozishimiz kerak? Darsimizning asosiy maqsadi: ${ctx.learningObjective}. Dasturlashda kompyuter inson kabi ma’lumotlarni eslab qolishi, solishtirishi va ekranga chiqarishi kerak. Agar biz ma’lumotlarni qayerga va qanday saqlashni to‘g‘ri ko‘rsatmasak, kompyuter ularni xotirasida eslab qola olmaydi va dasturimiz ishlamaydi. Shuning uchun ma’lumotlarni to‘g‘ri tashkil qilish — dasturchining eng birinchi vazifasidir!`
      ),
      displayText: `🎯 **Nima Uchun Bu Kerak?**\n\n${ctx.learningObjective}\n\nKompyuter xotirasida ma’lumotlarni tartibli saqlash va boshqarish dasturning poydevoridir.`,
    });
  }

  // Step 3: Real-Life Analogy
  if (ctx.realLifeAnalogy) {
    steps.push({
      id: 'step-analogy',
      elementId: 'lesson-analogy-section',
      title: '3. Hayotiy Misol orqali Tasavvur Qilish',
      pointingDirection: 'left',
      speechText: formatTextForSpeech(
        `Mavzuni tasavvur qilish oson bo‘lishi uchun hayotiy misolga qaraymiz: ${ctx.realLifeAnalogy}. Xuddi kundalik hayotimizda turli narsalarni har xil idishlarga solganimizdek, dasturlashda ham har bir ma’lumot turi o‘ziga mos shakl va qoidaga ega!`
      ),
      displayText: `💡 **Hayotiy Misol:**\n\n${ctx.realLifeAnalogy}\n\nHar bir ma’lumot turi o‘ziga mos idish va qoidaga ega.`,
    });
  }

  // Step 4: Deep Theoretical Breakdown (const, let, console.log, types, etc.)
  if (isVariables) {
    steps.push({
      id: 'step-theory',
      elementId: 'lesson-theory-section',
      title: '4. const, let va console.log Farqi',
      pointingDirection: 'left',
      speechText: formatTextForSpeech(
        `Endi eng asosiy tushunchalarni o‘rganamiz: const, let va konsol log nima, nega va qachon ishlatiladi? ` +
        `Birinchisi: o‘zgaruvchi — bu kompyuter xotirasidagi nomlangan qutidir. ` +
        `Ikkinchisi: const — inglizcha constant, ya’ni o‘zgarmas so‘zidan olingan. Unga bir marta qiymat berilsa, uni dastur davomida boshqa o‘zgartirib bo‘lmaydi. Masalan, sayt yoki platforma nomi, matematikadagi Pi soni. Qachon ishlatiladi? Agar qiymat keyinchalik o‘zgarmasligi kerak bo‘lsa, xavfsizlik uchun har doim const tanlanadi! ` +
        `Uchinchisi: let — o‘zgaruvchan qiymatlar uchun xizmat qiladi. Ya’ni, uning qiymati dastur ishlashi davomida yangilanib turishi mumkin. Masalan, o‘yindagi ochkolar, hisoblagichlar, dars raqami yoki foydalanuvchi yoshi. Qachon ishlatiladi? Agar qiymat keyinroq o‘zgarishi kutilsa, aynan let ishlatiladi! ` +
        `To‘rtinchisi: konsol log — dasturchining eng asosiy ko‘zoynagidir! Agar biz o‘zgaruvchini saqlab, lekin konsol log yozmasak, kompyuter uni xotirada saqlab turaveradi, ammo natijani biz ekranda ko‘ra olmaymiz. konsol log xotiradagi ma’lumotni dastur konsoliga chiqarib beradi! ` +
        `Yana bir muhim qoida: matnli ma’lumotlar har doim qo‘shtirnoq ichida yoziladi. Sonlar esa qo‘shtirnoqsiz to‘g‘ridan-to‘g‘ri yoziladi!`
      ),
      displayText: `📘 **const, let va console.log Tahlili:**\n\n` +
        `• **\`const\`** — O‘zgarmas (konstanta). Bir marta qiymat beriladi va butun dastur davomida o‘zgarmaydi. Xavfsizlik uchun tavsiya etiladi.\n` +
        `• **\`let\`** — O‘zgaruvchan qiymat (hisoblagich, ball, o‘zgarib turuvchi holat). Qiymati keyinroq yangilanishi mumkin.\n` +
        `• **\`console.log()\`** — Xotiradagi ma’lumotni ekranga (konsolga) chiqarib ko‘rish buyrug‘i. Dasturchining asosiy tekshirish vositasi.\n` +
        `• **Matn (String)** — Doimo \`"qo‘shtirnoq"\` ichida bo‘ladi.\n` +
        `• **Son (Number)** — Qo‘shtirnoqsiz to‘g‘ridan-to‘g‘ri yoziladi.`,
    });
  } else if (isConditionals) {
    steps.push({
      id: 'step-theory',
      elementId: 'lesson-theory-section',
      title: '4. Shartli Mantiq (if / else) va === Operatorlari',
      pointingDirection: 'left',
      speechText: formatTextForSpeech(
        `Shartli operatorlar nima uchun kerak? Dastur inson kabi mustaqil qaror qabul qilishi uchun! ` +
        `if — agar degani. U shartni tekshiradi, agar shart to‘g‘ri bo‘lsa, jingalak qavs ichidagi kod bajariladi. ` +
        `else esa — aks holda degani. Shart noto‘g‘ri bo‘lsa, else bloki ishga tushadi. ` +
        `Taqqoslash uchun har doim uchta tenglik, ya’ni qat’iy tenglik operatori ishlatiladi! Bitta tenglik esa o‘zgaruvchiga qiymat berish uchundir.`
      ),
      displayText: `📘 **Shartli Operatorlar Tahlili:**\n\n` +
        `• **\`if (shart)\`** — Agar shart to‘g‘ri bo‘lsa, blok ichidagi kod bajariladi.\n` +
        `• **\`else\`** — Aks holda, ya’ni shart bajarilmaganda ishga tushadi.\n` +
        `• **\`===\`** — Qat’iy tenglik operatori (ikkita qiymat tengligini tekshiradi).\n` +
        `• **\`=\`** — Qiymat berish (o‘zlashtirish) operatori.`,
    });
  } else if (isLoops) {
    steps.push({
      id: 'step-theory',
      elementId: 'lesson-theory-section',
      title: '4. Sikllar Nima va Nega Kerak?',
      pointingDirection: 'left',
      speechText: formatTextForSpeech(
        `Sikllar nima uchun kerak? Tasavvur qiling, bir xil amalni 100 marta bajarish kerak. Yuzta qator kod yozib o‘tirmaymiz-ku! ` +
        `Sikl orqali biz kompyuterga: "mana bu amalni hisoblagich 100 ga yetguncha takrorla" deb 3 qatorda buyruq beramiz. ` +
        `for sikli aniq necha marta takrorlash kerakligini bilganimizda, while sikli esa ma’lum bir shart bajarilib turguncha takrorlashda ishlatiladi!`
      ),
      displayText: `📘 **Sikllar Tahlili:**\n\n` +
        `• **\`for\`** — Takrorlanishlar soni aniq ma’lum bo‘lganda.\n` +
        `• **\`while\`** — Shart to‘g‘ri bo‘lib turguncha takrorlashda.\n` +
        `• Kompyuterga bir xil amallarni avtomatlashtirish imkonini beradi.`,
    });
  } else {
    // Custom theory fallback
    const theorySummary = (ctx.theory || []).map(b => b.content).filter(Boolean).join(' ');
    steps.push({
      id: 'step-theory',
      elementId: 'lesson-theory-section',
      title: '4. Asosiy Nazariya va Qoidalar',
      pointingDirection: 'left',
      speechText: formatTextForSpeech(
        `Ushbu darsning asosiy qoidalariga e’tibor bering: ${theorySummary || 'Qoidalarni yaxshilab o‘rganib chiqing.'}`
      ),
      displayText: `📘 **Asosiy Nazariya:**\n\n${theorySummary || 'Dars qoidalari bilan tanishib chiqing.'}`,
    });
  }

  // Step 5: Interactive Example Line-by-Line Breakdown
  if (ctx.interactiveExample && ctx.interactiveExample.code) {
    let exampleSpeech = `Endi chap tomondagi kod namunasiga qarang, har bir qatorni birma-bir tahlil qilamiz: `;
    if (isVariables && ctx.interactiveExample.code.includes('platforma')) {
      exampleSpeech += `Birinchi qatorda: const platforma teng qo‘shtirnoqda CodeQuest deb yozdik. Nega const? Chunki platformamiz nomi o‘zgarmaydi! Matn bo‘lgani uchun qo‘shtirnoq ichida yozdik. ` +
        `Ikkinchi qatorda: let darsRaqami teng 1 deb yozdik. Nega let? Chunki dars raqami keyingi darslarga o‘tganingiz sari 2, 3 bo‘lib o‘zgarib boradi! Son bo‘lgani uchun qo‘shtirnoqsiz yozdik. ` +
        `Uchinchi va to‘rtinchi qatorlarda esa: konsol log orqali xotiradagi o‘sha qiymatlarni dastur konsoliga chiqaryapmiz. Ko‘rib turganingizdek, har bir qatorda nima uchun va qanday yozilishi aniq sababga ega!`;
    } else if (ctx.interactiveExample.lineExplanations && Object.keys(ctx.interactiveExample.lineExplanations).length > 0) {
      Object.entries(ctx.interactiveExample.lineExplanations).forEach(([line, exp]) => {
        exampleSpeech += `${line}-qatorda: ${exp} `;
      });
      exampleSpeech += `Mana shunday qilib har bir buyruq o‘z vazifasini bajaradi!`;
    } else {
      exampleSpeech += `Kod blokidagi qatorlar ketma-ketligiga e’tibor bering. Kompyuter buyruqlarni yuqoridan pastga qarab navbatma-navbat bajaradi.`;
    }

    steps.push({
      id: 'step-example',
      elementId: 'lesson-example-section',
      title: '5. Kod Namunasi: Qatorma-Qator Tahlil',
      pointingDirection: 'left',
      speechText: formatTextForSpeech(exampleSpeech),
      displayText: `💻 **Kod Namunasi Tahlili:**\n\n\`\`\`javascript\n${ctx.interactiveExample.code}\n\`\`\`\n\n` +
        (ctx.interactiveExample.lineExplanations
          ? Object.entries(ctx.interactiveExample.lineExplanations).map(([l, exp]) => `• **${l}-qator:** ${exp}`).join('\n')
          : 'Buyruqlar yuqoridan pastga qarab bajariladi.'),
    });
  }

  // Step 6: Common Mistakes
  if (ctx.commonMistakes && ctx.commonMistakes.length > 0) {
    const firstMistake = ctx.commonMistakes[0];
    steps.push({
      id: 'step-mistakes',
      elementId: 'lesson-mistakes-section',
      title: '6. Ko‘p Uchraydigan Xatolar',
      pointingDirection: 'left',
      speechText: formatTextForSpeech(
        `Keling, yangi o‘rganuvchilar eng ko‘p yo‘l qo‘yadigan xatoga to‘xtalamiz: ${firstMistake.title}! ${firstMistake.explanation}. Masalan, const deb e’lon qilingan o‘zgaruvchining qiymatini keyinchalik qayta o‘zgartirib bo‘lmaydi. Agar qiymat o‘zgarishi kerak bo‘lsa, const emas, let ishlatish shart! Buni hech qachon unutmang!`
      ),
      displayText: `⚠️ **Ko‘p Uchraydigan Xatodan Ehtiyot Bo‘ling!**\n\n` +
        `• **Xatolik:** ${firstMistake.title}\n` +
        `• **Sabab:** ${firstMistake.explanation}\n` +
        `• ❌ **Xato kod:** \`${firstMistake.wrongCode.replace(/\n/g, ' ')}\`\n` +
        `• ✅ **To‘g‘ri kod:** \`${firstMistake.correctCode.replace(/\n/g, ' ')}\``,
    });
  }

  // Step 7: Call to Action — Monaco Code Editor
  const exerciseDesc = ctx.exercise?.description || 'Topshiriq shartiga muvofiq kodingizni yozing.';
  const exerciseInstructions = (ctx.exercise?.instructions || []).join('. ');
  steps.push({
    id: 'step-editor',
    elementId: 'lesson-code-editor',
    title: '7. Amaliy Topshiriqni Bajarish',
    pointingDirection: 'right',
    speechText: formatTextForSpeech(
      `Ofarin! Nazariyani to‘liq tushunib oldingiz. Endi o‘ng tomondagi kod muharririga qarang! Topshiriq sharti: ${exerciseDesc}. ${exerciseInstructions}. Qani, kodingizni yozib, ko‘k rangli "Ishga tushirish" tugmasini bosing. Agar biror xatolik bo‘lsa, men darhol o‘sha xato qatoringizga uchib borib, yordam beraman. Qani, boshlang!`
    ),
    displayText: `🚀 **Amaliyot Vaqti!**\n\n` +
      `**Topshiriq:** ${ctx.exercise?.title || cleanTitle}\n\n` +
      `${exerciseDesc}\n\n` +
      `Kodingizni o‘ng tomondagi muharrirda yozing va **"Ishga tushirish"** tugmasini bosing. Men har qadamda sizga yordamga tayyorman!`,
  });

  return steps;
}

/**
 * Generate welcome greeting for the current lesson
 */
export function getLessonGreeting(lessonTitle: string, objective?: string): RobotSpeechScript {
  const cleanTitle = lessonTitle.replace(/^(\d+-Dars:?\s*)/i, '');
  const objectiveNote = objective ? ` Asosiy maqsadimiz: ${objective}.` : '';
  const speechText = `Assalomu alaykum, do‘stim! Men sizning yordamchingiz Robo-Ustozman. Bugun birgalikda "${cleanTitle}" mavzusini o‘rganamiz.${objectiveNote} Agar darsni to‘liq tushunmoqchi bo‘lsangiz, yuqoridagi "Robo-Ustoz tushuntirsin" tugmasini bosing, men har bir kod nima uchun yozilishini batafsil tushuntirib beraman!`;

  return {
    id: 'lesson-greeting',
    mood: 'talking',
    title: 'Robo-Ustoz siz bilan!',
    speechText: formatTextForSpeech(speechText),
    displayText: `Assalomu alaykum! Bugun **${cleanTitle}** darsini o‘rganamiz.${objective ? `\n\n🎯 *Maqsad: ${objective}*` : ''}\n\nDarsni to‘liq tushunish uchun yuqoridagi **"🎓 Robo-Ustoz tushuntirsin"** tugmasini bosing! 🚀`,
  };
}

/**
 * Deep diagnostic analysis of student's code errors with natural voice guidance
 */
export function diagnoseErrorForSpeech(
  error: { type?: string; message: string; line?: number; originalMessage?: string },
  userCode = ''
): RobotSpeechScript {
  const lineNum = error.line || 1;
  const msg = (error.message || '').toLowerCase();
  const origMsg = (error.originalMessage || '').toLowerCase();

  const lines = userCode ? userCode.split('\n') : [];
  const faultyLine = lines[lineNum - 1]?.trim() || '';
  const codeSnippetDisplay = faultyLine ? `> Kod: \`${faultyLine}\`\n\n` : '';

  let explanationUzbek = '';
  let solutionUzbek = '';

  // 1. Missing parentheses or brackets
  if (msg.includes('unexpected token') || msg.includes('missing )') || msg.includes('missing }') || msg.includes('syntaxerror')) {
    if (msg.includes(')') || origMsg.includes(')')) {
      explanationUzbek = `Kodingizning ${lineNum}-qatorida qavs yopilmagan yoki ortiqcha belgi qolib ketgan.`;
      solutionUzbek = `Ochilgan barcha qavslar to‘g‘ri yopilganligini tekshirib chiqing.`;
    } else if (msg.includes('}') || origMsg.includes('}')) {
      explanationUzbek = `Kodingizning ${lineNum}-qatorida jingalak qavs yopilmagan.`;
      solutionUzbek = `Funksiya yoki blok oxiriga yopuvchi jingalak qavs qo‘yishni unutmang.`;
    } else {
      explanationUzbek = `Kodingizning ${lineNum}-qatorida sintaktik xatolik bor. JavaScript bu yozuvni tushuna olmadi.`;
      solutionUzbek = `Nuqtali vergul, qavslar yoki qo‘shtirnoqlarning juft ekanini tekshiring.`;
    }
  }
  // 2. ReferenceError (Variable not defined)
  else if (msg.includes('is not defined') || msg.includes('referenceerror')) {
    const varMatch = error.message.match(/(\w+)\s+is not defined/i) || error.originalMessage?.match(/(\w+)\s+is not defined/i);
    const varName = varMatch ? varMatch[1] : 'nomli o‘zgaruvchi';
    explanationUzbek = `Kodingizning ${lineNum}-qatorida ${varName} topilmadi. JavaScript uni xotirada mavjud emas deb hisoblayapti.`;
    solutionUzbek = `Ushbu o‘zgaruvchini ishlatishdan oldin uni let yoki const yordamida e’lon qildingizmi? Shuni tekshiring.`;
  }
  // 3. TypeError
  else if (msg.includes('is not a function') || msg.includes('typeerror')) {
    explanationUzbek = `Kodingizning ${lineNum}-qatorida funksiya bo‘lmagan qiymatni funksiya kabi chaqirishga urinish bo‘ldi.`;
    solutionUzbek = `Funksiya nomi to‘g‘ri yozilganini va o‘sha o‘zgaruvchi haqiqatan ham funksiya ekanligini ko‘rib chiqing.`;
  }
  // 4. Infinite Loop / Timeout
  else if (msg.includes('timeout') || msg.includes('infinite loop') || msg.includes('cheksiz')) {
    explanationUzbek = `Diqqat! Kodingizda cheksiz sikl paydo bo‘ldi va dastur qotib qolmasligi uchun to‘xtatildi.`;
    solutionUzbek = `Sikl hisoblagichi oshib borayotganini va to‘xtash sharti to‘g‘ri yozilganini tekshiring.`;
  }
  // 5. General / Test Failures
  else {
    explanationUzbek = `Kodingizda kutilmagan natija yuz berdi: ${error.message}`;
    solutionUzbek = `Topshiriq ko‘rsatmasini qaytadan o‘qib, kutilayotgan natijaga e’tibor bering.`;
  }

  const speech = `E’tibor bering! ${explanationUzbek} Buni to‘g‘irlash uchun: ${solutionUzbek}`;
  const display = `⚠️ **Xatolik aniqlandi (${lineNum}-qator):**\n\n${codeSnippetDisplay}${explanationUzbek}\n\n💡 **Yechim:** ${solutionUzbek}`;

  return {
    id: `error-${Date.now()}`,
    mood: 'alert',
    title: `Xatolik: ${lineNum}-qator`,
    speechText: formatTextForSpeech(speech),
    displayText: display,
  };
}

/**
 * Celebration on successful test pass
 */
export function getSuccessCelebration(xpEarned = 50): RobotSpeechScript {
  const speech = `Ofarin! Barakalla! Barcha testlar muvaffaqiyatli o‘tdi. Siz topshiriqni a’lo darajada bajardingiz va ${xpEarned} tajriba ballini qo‘lga kiritdingiz!`;
  const display = `🎉 **Ofarin! A’lo natija!**\n\nBarcha testlar muvaffaqiyatli o‘tdi. Siz **+${xpEarned} XP** oldingiz! Keyingi darsga o‘tishingiz mumkin! 🚀`;

  return {
    id: `success-${Date.now()}`,
    mood: 'celebrate',
    title: 'Topshiriq bajarildi! 🌟',
    speechText: formatTextForSpeech(speech),
    displayText: display,
  };
}

/**
 * Encouragement / Hint narration
 */
export function getHintSpeech(hintText: string, hintIndex: number): RobotSpeechScript {
  const speech = `Sizga ${hintIndex}-maslahatni beraman: ${hintText}. Shoshilmasdan kodingizni yana bir bor ko‘rib chiqing.`;
  const display = `💡 **${hintIndex}-Maslahat:**\n\n${hintText}`;

  return {
    id: `hint-${hintIndex}-${Date.now()}`,
    mood: 'talking',
    title: `${hintIndex}-Maslahat`,
    speechText: formatTextForSpeech(speech),
    displayText: display,
  };
}
