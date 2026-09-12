import assert from 'node:assert';
import { explainError } from '../src/lib/error-explainer/index.ts';
import { generateMentorResponse } from '../src/lib/mentor/index.ts';

console.log('Testing Uzbek Pedagogical Engines...');

// 1. Error Explainer tests
const err1 = explainError('ReferenceError: x is not defined', 'javascript');
assert(err1.errorType.includes('ReferenceError'));
assert(err1.explanation.includes('topa olmadi') || err1.explanation.includes('xotiradan'));
console.log('1. ReferenceError explanation OK:', err1.explanation);

const err2 = explainError('SyntaxError: Unexpected token )', 'javascript');
assert(err2.errorType.includes('SyntaxError'));
console.log('2. SyntaxError explanation OK:', err2.explanation);

const err3 = explainError('TypeError: Cannot read properties of undefined', 'javascript');
assert(err3.errorType.includes('TypeError'));
console.log('3. TypeError explanation OK:', err3.explanation);

// 2. Mentor advice tests
const advice1 = generateMentorResponse('hint', {
  lessonTitle: 'O‘zgaruvchilar va Ma’lumot Turlari',
  code: 'let ism = "Ali";',
  language: 'javascript',
  hints: ['1-maslahat: let kalit so‘zini ishlating', '2-maslahat: console.log ni chaqiring'],
  hintsUsedCount: 1
});
assert(advice1.content.length > 10);
console.log('4. Mentor hint advice OK:', advice1.content);

const advice2 = generateMentorResponse('explain', {
  lessonTitle: 'HTML Asoslari',
  code: '<h1>Salom</h1>',
  language: 'html'
});
assert(advice2.content.length > 10);
console.log('5. Mentor concept explanation OK:', advice2.content);

console.log('\n>>> ALL PEDAGOGICAL ENGINE CHECKS PASSED! <<<');
