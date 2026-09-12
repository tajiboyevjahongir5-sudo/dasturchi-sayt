import type { TestCase, TestResult, CodeRunResult, CodeError } from '@/types';

export interface RunOptions {
  code: string;
  language: 'javascript' | 'html' | 'css' | 'python';
  testCases?: TestCase[];
  timeoutMs?: number;
}

/**
 * Deterministic client-side code runner with sandbox, timeout, console capture, and test runner.
 */
export async function executeCode({
  code,
  language,
  testCases = [],
  timeoutMs = 2500,
}: RunOptions): Promise<CodeRunResult> {
  const startTime = performance.now();

  // Python: Coming Soon
  if (language === 'python') {
    return {
      success: false,
      output: 'ℹ️ Python tilida kod ishga tushirish tez orada qo‘shiladi (Pyodide sandbox tayyorlanmoqda). Hozircha HTML, CSS va JavaScript kurslarini to‘liq ishlatishingiz mumkin.',
      errors: [
        {
          type: 'runtime',
          message: 'Python runner tez kunda ishga tushadi',
          originalMessage: 'Python execution coming soon',
        },
      ],
      executionTime: 0,
      testResults: [],
    };
  }

  // HTML / CSS code execution: DOM and structure tests
  if (language === 'html' || language === 'css') {
    return executeMarkup(code, language, testCases, startTime);
  }

  // JavaScript execution: Web Worker / Sandboxed Eval with timeout
  return executeJavaScript(code, testCases, timeoutMs, startTime);
}

function executeMarkup(
  code: string,
  language: 'html' | 'css',
  testCases: TestCase[],
  startTime: number
): CodeRunResult {
  const testResults: TestResult[] = [];
  let allPassed = true;

  for (const tc of testCases) {
    let passed = false;
    let actual = '';

    if (tc.type === 'contains') {
      const cleanCode = code.replace(/\s+/g, ' ').toLowerCase();
      const cleanExpected = tc.expectedOutput.replace(/\s+/g, ' ').toLowerCase();
      passed = cleanCode.includes(cleanExpected);
      actual = passed ? tc.expectedOutput : 'Kutilgan element topilmadi';
    } else if (tc.type === 'regex') {
      const re = new RegExp(tc.expectedOutput, 'i');
      passed = re.test(code);
      actual = passed ? 'Mos keldi' : 'Mos kelmadi';
    } else {
      passed = code.includes(tc.expectedOutput);
      actual = passed ? tc.expectedOutput : 'Topilmadi';
    }

    if (!passed) allPassed = false;
    testResults.push({
      testCaseId: tc.id,
      passed,
      actual,
      expected: tc.expectedOutput,
      description: tc.description,
    });
  }

  return {
    success: allPassed,
    output: allPassed ? '✅ Barcha HTML/CSS testlar muvaffaqiyatli bajarildi!' : '⚠️ Ayrim testlar o‘tmadi.',
    errors: [],
    executionTime: Math.round(performance.now() - startTime),
    testResults,
  };
}

function executeJavaScript(
  code: string,
  testCases: TestCase[],
  timeoutMs: number,
  startTime: number
): Promise<CodeRunResult> {
  return new Promise(async (resolve) => {
    // 1. Static infinite loop syntax guards for immediate feedback
    const isUnboundedLoop =
      (/\bwhile\s*\(\s*(true|1|!\s*0)\s*\)/i.test(code) && !code.includes('break')) ||
      (/\bfor\s*\(\s*;\s*;\s*\)/.test(code) && !code.includes('break'));

    if (isUnboundedLoop) {
      resolve({
        success: false,
        output: '',
        errors: [
          {
            type: 'timeout',
            message: 'Cheksiz sikl aniqlandi (Infinite loop). Sikl to‘xtash shartini tekshiring.',
            originalMessage: 'Potential infinite loop detected: unbounded loop without break',
          },
        ],
        executionTime: 0,
        testResults: [],
      });
      return;
    }

    // 2. Client-side Web Worker execution (true background thread with instant worker.terminate())
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined' && typeof Blob !== 'undefined') {
      const workerScript = `
        self.onmessage = function(e) {
          var code = e.data.code;
          var logs = [];
          var customConsole = {
            log: function() {
              var args = Array.prototype.slice.call(arguments);
              logs.push(args.map(function(a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' '));
            },
            warn: function() { logs.push('⚠️ ' + Array.prototype.slice.call(arguments).join(' ')); },
            error: function() { logs.push('❌ ' + Array.prototype.slice.call(arguments).join(' ')); },
            info: function() { logs.push('ℹ️ ' + Array.prototype.slice.call(arguments).join(' ')); }
          };

          try {
            var fn = new Function('console', "'use strict';\\n" + code);
            var res = fn(customConsole);
            if (res && typeof res.then === 'function') {
              res.then(function() {
                setTimeout(function() { self.postMessage({ success: true, logs: logs }); }, 20);
              }).catch(function(err) {
                self.postMessage({
                  success: false,
                  logs: logs,
                  error: {
                    name: err.name || 'Error',
                    message: err.message || String(err),
                    stack: err.stack,
                    string: err.toString()
                  }
                });
              });
            } else {
              setTimeout(function() {
                self.postMessage({ success: true, logs: logs });
              }, 20);
            }
          } catch(err) {
            self.postMessage({
              success: false,
              logs: logs,
              error: {
                name: err.name,
                message: err.message,
                stack: err.stack,
                string: err.toString()
              }
            });
          }
        };
      `;

      let finished = false;
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      const cleanup = () => {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };

      const timerId = setTimeout(() => {
        if (!finished) {
          finished = true;
          cleanup();
          resolve({
            success: false,
            output: '',
            errors: [
              {
                type: 'timeout',
                message: `Dastur ishlash vaqti ${timeoutMs}ms dan oshib ketdi. Cheksiz sikl (infinite loop) aniqlandi. Sikl to‘xtash shartini tekshiring.`,
                originalMessage: 'Execution timeout in Web Worker',
              },
            ],
            executionTime: timeoutMs,
            testResults: [],
          });
        }
      }, timeoutMs);

      worker.onmessage = (ev) => {
        if (finished) return;
        finished = true;
        clearTimeout(timerId);
        cleanup();

        const { success: execSuccess, logs = [], error } = ev.data;
        if (!execSuccess && error) {
          let errorType: CodeError['type'] = 'runtime';
          if (error.name === 'SyntaxError') errorType = 'syntax';
          if (error.name === 'TypeError') errorType = 'type';

          let errorLine: number | undefined;
          const stack = error.stack || '';
          const lineMatch = stack.match(/<anonymous>:(\d+):(\d+)/) || stack.match(/:(\d+):(\d+)/);
          if (lineMatch) {
            errorLine = Math.max(1, parseInt(lineMatch[1], 10) - 2);
          }

          resolve({
            success: false,
            output: logs.join('\n'),
            errors: [
              {
                type: errorType,
                message: error.message,
                line: errorLine,
                originalMessage: error.string,
              },
            ],
            executionTime: Math.round(performance.now() - startTime),
            testResults: [],
          });
          return;
        }

        // Test cases verification
        const output = logs.join('\n');
        const testResults: TestResult[] = [];
        let allPassed = true;

        for (const tc of testCases) {
          let passed = false;
          if (tc.type === 'contains') {
            passed = output.includes(tc.expectedOutput);
          } else if (tc.type === 'output') {
            passed = output.trim() === tc.expectedOutput.trim();
          } else if (tc.type === 'regex') {
            const re = new RegExp(tc.expectedOutput, 'i');
            passed = re.test(output);
          } else {
            passed = output.includes(tc.expectedOutput);
          }

          if (!passed) allPassed = false;
          testResults.push({
            testCaseId: tc.id,
            passed,
            actual: output.trim() || '(Bo‘sh chiqish)',
            expected: tc.expectedOutput,
            description: tc.description,
          });
        }

        resolve({
          success: allPassed,
          output,
          errors: [],
          executionTime: Math.round(performance.now() - startTime),
          testResults,
        });
      };

      worker.onerror = (errEvent) => {
        if (finished) return;
        finished = true;
        clearTimeout(timerId);
        cleanup();

        resolve({
          success: false,
          output: '',
          errors: [
            {
              type: 'runtime',
              message: errEvent.message || 'Xatolik yuz berdi',
              line: errEvent.lineno ? Math.max(1, errEvent.lineno - 2) : undefined,
              originalMessage: String(errEvent),
            },
          ],
          executionTime: Math.round(performance.now() - startTime),
          testResults: [],
        });
      };

      worker.postMessage({ code });
      return;
    }

    // 3. Fallback for Node.js / SSR test environments without browser Worker
    const logs: string[] = [];
    const errors: CodeError[] = [];

    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push(
          args
            .map((arg) => {
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg);
                } catch {
                  return String(arg);
                }
              }
              return String(arg);
            })
            .join(' ')
        );
      },
      warn: (...args: unknown[]) => logs.push('⚠️ ' + args.join(' ')),
      error: (...args: unknown[]) => logs.push('❌ ' + args.join(' ')),
      info: (...args: unknown[]) => logs.push('ℹ️ ' + args.join(' ')),
    };

    let timerId: NodeJS.Timeout | null = null;
    let finished = false;

    timerId = setTimeout(() => {
      if (!finished) {
        finished = true;
        resolve({
          success: false,
          output: logs.join('\n'),
          errors: [
            {
              type: 'timeout',
              message: `Dastur ishlash vaqti ${timeoutMs}ms dan oshib ketdi. Cheksiz sikl (infinite loop) mavjud bo‘lishi mumkin.`,
              originalMessage: 'Execution timeout',
            },
          ],
          executionTime: timeoutMs,
          testResults: [],
        });
      }
    }, timeoutMs);

    try {
      const safeRunner = new Function(
        'console',
        `
        'use strict';
        ${code}
      `
      );

      const runnerRes = safeRunner(customConsole);
      if (runnerRes && typeof runnerRes.then === 'function') {
        await runnerRes;
      }
      await new Promise((r) => setTimeout(r, 25));

      if (timerId) clearTimeout(timerId);
      finished = true;

      const output = logs.join('\n');
      const testResults: TestResult[] = [];
      let allPassed = true;

      for (const tc of testCases) {
        let passed = false;

        if (tc.type === 'contains') {
          passed = output.includes(tc.expectedOutput);
        } else if (tc.type === 'output') {
          passed = output.trim() === tc.expectedOutput.trim();
        } else if (tc.type === 'regex') {
          const re = new RegExp(tc.expectedOutput, 'i');
          passed = re.test(output);
        } else {
          passed = output.includes(tc.expectedOutput);
        }

        if (!passed) allPassed = false;

        testResults.push({
          testCaseId: tc.id,
          passed,
          actual: output.trim() || '(Bo‘sh chiqish)',
          expected: tc.expectedOutput,
          description: tc.description,
        });
      }

      resolve({
        success: allPassed && errors.length === 0,
        output,
        errors,
        executionTime: Math.round(performance.now() - startTime),
        testResults,
      });
    } catch (err: unknown) {
      if (timerId) clearTimeout(timerId);
      finished = true;

      const errorObj = err as Error;
      let errorType: CodeError['type'] = 'runtime';
      if (errorObj.name === 'SyntaxError') errorType = 'syntax';
      if (errorObj.name === 'TypeError') errorType = 'type';

      let errorLine: number | undefined;
      const stack = errorObj.stack || '';
      const lineMatch = stack.match(/<anonymous>:(\d+):(\d+)/) || stack.match(/:(\d+):(\d+)/);
      if (lineMatch) {
        errorLine = Math.max(1, parseInt(lineMatch[1], 10) - 2);
      }

      resolve({
        success: false,
        output: logs.join('\n'),
        errors: [
          {
            type: errorType,
            message: errorObj.message,
            line: errorLine,
            originalMessage: errorObj.toString(),
          },
        ],
        executionTime: Math.round(performance.now() - startTime),
        testResults: [],
      });
    }
  });
}

export interface MultiFileRunOptions {
  files: {
    'index.html': string;
    'style.css': string;
    'script.js': string;
  };
  testCases?: TestCase[];
  timeoutMs?: number;
}

/**
 * Executes a multi-file web project (HTML + CSS + JS) against test cases
 */
export async function executeMultiFileProject({
  files,
  testCases = [],
  timeoutMs = 2500,
}: MultiFileRunOptions): Promise<CodeRunResult> {
  const startTime = performance.now();
  const html = files['index.html'] || '';
  const css = files['style.css'] || '';
  const js = files['script.js'] || '';

  // 1. Run JavaScript in sandbox to capture logs and errors
  const jsResult = await executeJavaScript(js, [], timeoutMs, startTime);

  // If JS encountered execution or timeout errors, return with failure
  if (jsResult.errors.length > 0) {
    return {
      success: false,
      output: jsResult.output,
      errors: jsResult.errors,
      executionTime: jsResult.executionTime,
      testResults: testCases.map((tc) => ({
        testCaseId: tc.id,
        passed: false,
        actual: `JavaScript xatoligi: ${jsResult.errors[0]?.message || 'Xato'}`,
        expected: tc.expectedOutput,
        description: tc.description,
      })),
    };
  }

  // 2. Evaluate test cases against HTML, CSS, and JS output
  const testResults: TestResult[] = [];
  let allPassed = true;

  for (const tc of testCases) {
    let passed = false;
    let actual = '';

    const target = tc.targetFile || (
      tc.type === 'html-check' ? 'index.html' :
      tc.type === 'css-check' ? 'style.css' :
      tc.type === 'js-check' ? 'script.js' : 'all'
    );

    const sourceToTest =
      target === 'index.html' ? html :
      target === 'style.css' ? css :
      target === 'script.js' ? (tc.type === 'output' ? jsResult.output : `${js}\n${jsResult.output}`) :
      `${html}\n${css}\n${jsResult.output}`;

    if (tc.type === 'contains' || tc.type === 'html-check' || tc.type === 'css-check') {
      const cleanSource = sourceToTest.replace(/\s+/g, ' ').toLowerCase();
      const cleanExpected = tc.expectedOutput.replace(/\s+/g, ' ').toLowerCase();
      passed = cleanSource.includes(cleanExpected);
      actual = passed ? tc.expectedOutput : 'Kutilgan element yoki uslub topilmadi';
    } else if (tc.type === 'regex') {
      const re = new RegExp(tc.expectedOutput, 'i');
      passed = re.test(sourceToTest);
      actual = passed ? 'Mos keldi' : 'Mos kelmadi';
    } else if (tc.type === 'output') {
      passed = jsResult.output.trim().includes(tc.expectedOutput.trim());
      actual = jsResult.output.trim() || '(Bo‘sh konsol)';
    } else {
      passed = sourceToTest.includes(tc.expectedOutput);
      actual = passed ? tc.expectedOutput : 'Topilmadi';
    }

    if (!passed) allPassed = false;
    testResults.push({
      testCaseId: tc.id,
      passed,
      actual,
      expected: tc.expectedOutput,
      description: tc.description,
    });
  }

  return {
    success: allPassed,
    output: jsResult.output,
    errors: [],
    executionTime: Math.round(performance.now() - startTime),
    testResults,
  };
}

/**
 * Creates a complete HTML string for the sandboxed preview iframe.
 * Security: Sandboxed iframe runs with allow-scripts (NO allow-same-origin).
 * It communicates logs and errors to the parent window via strict postMessage schema.
 */
export function createSandboxedPreviewHtml(files: {
  'index.html': string;
  'style.css': string;
  'script.js': string;
}): string {
  const html = files['index.html'] || '';
  const css = files['style.css'] || '';
  const js = files['script.js'] || '';

  return `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset & base styling */
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    /* User CSS */
    ${css}
  </style>
</head>
<body>
  ${html}

  <script>
    (function() {
      // CodeQuest iframe watchdog & execution timer
      var __cq_watchdog = {
        startTime: Date.now(),
        check: function() {
          if (Date.now() - this.startTime > 3000) {
            throw new Error('Ijro vaqti 3000ms dan oshib ketdi (Cheksiz sikl aniqlandi)');
          }
        }
      };
      var _maxIterations = 50000;
      var _iter = 0;

      // Error handler
      window.addEventListener('error', function(e) {
        try {
          window.parent.postMessage({
            type: 'CODEQUEST_CONSOLE_LOG',
            payload: {
              level: 'error',
              message: e.message || 'Kutilmagan xatolik',
              line: e.lineno,
              col: e.colno
            }
          }, '*');
        } catch(err) {}
      });

      // Console interceptor
      function _dispatch(level, args) {
        try {
          var items = Array.prototype.slice.call(args).map(function(item) {
            if (typeof item === 'object') {
              try { return JSON.stringify(item); } catch(e) { return String(item); }
            }
            return String(item);
          });
          window.parent.postMessage({
            type: 'CODEQUEST_CONSOLE_LOG',
            payload: {
              level: level,
              message: items.join(' ')
            }
          }, '*');
        } catch(err) {}
      }

      console.log = function() { _dispatch('log', arguments); };
      console.warn = function() { _dispatch('warn', arguments); };
      console.error = function() { _dispatch('error', arguments); };
      console.info = function() { _dispatch('info', arguments); };
    })();
  </script>

  <script>
    try {
      ${js}
    } catch(err) {
      window.parent.postMessage({
        type: 'CODEQUEST_CONSOLE_LOG',
        payload: {
          level: 'error',
          message: err.name + ': ' + err.message,
          line: err.lineNumber
        }
      }, '*');
    }
  </script>
</body>
</html>`;
}
