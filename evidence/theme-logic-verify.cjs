// Simulate spec "默认跟随系统 / 用户偏好覆盖" 逻辑（tasks 1.1 / 1.2 / 1.4 兜底）
function decideTheme(stored, systemDark) {
  if (stored) return stored === 'dark' ? 'dark' : 'light';
  return systemDark ? 'dark' : 'light';
}

const cases = [
  { stored: null,      systemDark: false, expected: 'light', name: '首次访问 / 系统 light' },
  { stored: null,      systemDark: true,  expected: 'dark',  name: '首次访问 / 系统 dark' },
  { stored: 'dark',    systemDark: false, expected: 'dark',  name: '用户偏好 dark / 系统 light' },
  { stored: 'light',   systemDark: true,  expected: 'light', name: '用户偏好 light / 系统 dark' },
  { stored: 'invalid', systemDark: false, expected: 'light', name: '非法值 / 回退系统' },
];

let ok = 0, fail = 0;
for (const c of cases) {
  const got = decideTheme(c.stored, c.systemDark);
  const pass = got === c.expected;
  if (pass) ok++; else fail++;
  console.log((pass ? 'PASS' : 'FAIL') + ' | ' + c.name + ' | expected=' + c.expected + ' got=' + got);
}
console.log('\nSummary: ' + ok + ' passed, ' + fail + ' failed');
