// 60갑자 일주 계산 로직
// 기준일: 2024-01-01 (UTC) = 갑자일 (index 0)
// 검증: 2026-07-02 = 정축일 (index 13) 과 대조하여 확인됨

const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const STEM_HANJA = {
  갑: '甲', 을: '乙', 병: '丙', 정: '丁', 무: '戊',
  기: '己', 경: '庚', 신: '辛', 임: '壬', 계: '癸'
};
const BRANCH_HANJA = {
  자: '子', 축: '丑', 인: '寅', 묘: '卯', 진: '辰', 사: '巳',
  오: '午', 미: '未', 신: '申', 유: '酉', 술: '戌', 해: '亥'
};

// 이미지 파일명은 한글 인코딩 문제를 피하기 위해 로마자로 저장되어 있음
const STEM_ROMAN = {
  갑: 'gap', 을: 'eul', 병: 'byeong', 정: 'jeong', 무: 'mu',
  기: 'gi', 경: 'gyeong', 신: 'sin', 임: 'im', 계: 'gye'
};
const BRANCH_ROMAN = {
  자: 'ja', 축: 'chuk', 인: 'in', 묘: 'myo', 진: 'jin', 사: 'sa',
  오: 'o', 미: 'mi', 신: 'sin', 유: 'yu', 술: 'sul', 해: 'hae'
};

const REF_DATE_UTC = Date.UTC(2024, 0, 1); // 2024-01-01, index 0 (갑자)
const DAY_MS = 24 * 60 * 60 * 1000;

function calcIljuIndex(dateStr) {
  // dateStr: "YYYY-MM-DD" (양력, 사용자가 로컬 기준으로 입력한 날짜)
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetUTC = Date.UTC(y, m - 1, d);
  const diffDays = Math.round((targetUTC - REF_DATE_UTC) / DAY_MS);
  let idx = diffDays % 60;
  if (idx < 0) idx += 60;
  return idx;
}

function getIlju(dateStr) {
  const idx = calcIljuIndex(dateStr);
  const stem = STEMS[idx % 10];
  const branch = BRANCHES[idx % 12];
  return {
    hangul: stem + branch,
    hanja: STEM_HANJA[stem] + BRANCH_HANJA[branch],
    roman: STEM_ROMAN[stem] + BRANCH_ROMAN[branch]
  };
}

// ---- DOM 처리 ----

const form = document.getElementById('ilju-form');
const nameInput = document.getElementById('name-input');
const birthInput = document.getElementById('birth-input');
const errorMsg = document.getElementById('error-msg');

const introSection = document.getElementById('intro-section');
const resultSection = document.getElementById('result-section');
const resultEyebrow = document.getElementById('result-eyebrow');
const resultTitle = document.getElementById('result-title');
const resultImage = document.getElementById('result-image');
const resetBtn = document.getElementById('reset-btn');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  errorMsg.textContent = '';

  const name = nameInput.value.trim();
  const birth = birthInput.value;

  if (!name) {
    errorMsg.textContent = '이름을 입력해주세요.';
    return;
  }
  if (!birth) {
    errorMsg.textContent = '생년월일을 입력해주세요.';
    return;
  }

  const ilju = getIlju(birth);
  const imgPath = 'images/' + ilju.roman + '.png';

  resultEyebrow.textContent = name + '님의 일주 리포트';
  resultTitle.textContent = ilju.hangul + ' (' + ilju.hanja + ')';
  resultImage.src = imgPath;
  resultImage.alt = ilju.hangul + ' 일주 리포트';

  introSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

resetBtn.addEventListener('click', function () {
  resultSection.classList.add('hidden');
  introSection.classList.remove('hidden');
});
