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
 * Clean up text for natural spoken Uzbek:
 * Expands technical terms and symbols so neural voice pronounces them naturally
 */
export function formatTextForSpeech(text: string): string {
  return text
    .replace(/console\.log/g, 'konsol nuqta log')
    .replace(/===/g, 'qat’iy teng')
    .replace(/!==/g, 'teng emas')
    .replace(/==/g, 'teng')
    .replace(/!=/g, 'teng emas')
    .replace(/=>/g, 'strelkali funksiya')
    .replace(/&&/g, 'va mantiqiy amali')
    .replace(/\|\|/g, 'yoki mantiqiy amali')
    .replace(/HTML/g, 'H-T-M-L')
    .replace(/CSS/g, 'S-S-S')
    .replace(/JS/g, 'Java Skript')
    .replace(/API/g, 'A-P-I')
    .replace(/DOM/g, 'D-O-M')
    .replace(/XP/g, 'ikspi')
    .replace(/[{}]/g, '')
    .replace(/[`*#]/g, '')
    .trim();
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
