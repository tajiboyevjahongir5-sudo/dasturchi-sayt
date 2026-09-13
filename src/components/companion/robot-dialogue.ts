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

/**
 * Generate welcome greeting for the current lesson
 */
export function getLessonGreeting(lessonTitle: string, objective?: string): RobotSpeechScript {
  const cleanTitle = lessonTitle.replace(/^(\d+-Dars:?\s*)/i, '');
  const speechText = `Assalomu alaykum, do‘stim! Men sizning yordamchingiz Robo-Ustozman. Bugun birgalikda juda qiziq mavzu — ${cleanTitle} haqida o‘rganamiz. ${
    objective ? `Asosiy maqsadimiz: ${objective}.` : ''
  } Qani, kodingizni yozishni boshlang, agar qiyinchilik bo‘lsa, men har doim yoningizdaman!`;

  return {
    id: 'lesson-greeting',
    mood: 'talking',
    title: 'Robo-Ustoz siz bilan!',
    speechText: formatTextForSpeech(speechText),
    displayText: `Assalomu alaykum! Bugun **${cleanTitle}** darsini o‘rganamiz. ${objective || ''} Kod yozishga tayyormisiz? 🚀`,
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
