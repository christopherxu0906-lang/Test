const riddles = [
  {
    question: '一人一张口，口下长只手。（打一字）',
    answer: '拿',
    painting: '牧牛图',
    desc: '老牛缓行，牧童横笛，浓淡墨痕勾勒田园静意。',
  },
  {
    question: '千条线，万条线，落在水里看不见。（打一自然现象）',
    answer: '雨',
    painting: '旭日东升',
    desc: '破晓微明，旭日穿云，淡金与墨色交织天光。',
  },
  {
    question: '不是葱，不是蒜，一层一层裹紫缎。（打一植物）',
    answer: '洋葱',
    painting: '幽兰飘香',
    desc: '空谷幽兰，一笔成叶，清逸香气仿佛溢出纸外。',
  },
  {
    question: '身穿白袍子，头戴红帽子，走路像公子。（打一食物）',
    answer: '荔枝',
    painting: '晶莹剔透',
    desc: '清泉滴露，石上凝光，留白间见冰清玉润之境。',
  },
  {
    question: '有位小姑娘，身穿黄衣裳，你若欺负她，她就戳一枪。（打一昆虫）',
    answer: '蜜蜂',
    painting: '春雷惊蛰',
    desc: '雷动云翻，草木初醒，奔墨飞白写出万物苏生。',
  },
];

const state = {
  index: 0,
  unlocked: [],
};

const loading = document.getElementById('loading');
const app = document.querySelector('.app');
const pages = {
  start: document.getElementById('start-page'),
  riddle: document.getElementById('riddle-page'),
  unlock: document.getElementById('unlock-page'),
  album: document.getElementById('album-page'),
};

const currentIndex = document.getElementById('current-index');
const score = document.getElementById('score');
const riddleText = document.getElementById('riddle-text');
const answerInput = document.getElementById('answer');
const paintingTitle = document.getElementById('painting-title');
const paintingDesc = document.getElementById('painting-desc');
const albumGrid = document.getElementById('album-grid');

const feedbackModal = document.getElementById('feedback-modal');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');

setTimeout(() => {
  loading.classList.remove('active');
  loading.classList.add('hidden');
  app.classList.remove('hidden');
}, 1500);

function showPage(pageKey) {
  Object.values(pages).forEach((page) => page.classList.add('hidden'));
  pages[pageKey].classList.remove('hidden');
}

function typewrite(text) {
  riddleText.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    riddleText.textContent += text[i];
    i += 1;
    if (i >= text.length) {
      clearInterval(interval);
    }
  }, 55);
}

function renderRiddle() {
  const item = riddles[state.index];
  currentIndex.textContent = String(state.index + 1);
  score.textContent = String(state.unlocked.length);
  answerInput.value = '';
  answerInput.focus();
  typewrite(item.question);
}

function openFeedback(title, text) {
  feedbackTitle.textContent = title;
  feedbackText.textContent = text;
  feedbackModal.classList.remove('hidden');
}

function closeFeedback() {
  feedbackModal.classList.add('hidden');
}

function normalize(input) {
  return input.trim().replace(/[。！!？?\s]/g, '');
}

function unlockPainting() {
  const item = riddles[state.index];
  if (!state.unlocked.includes(item.painting)) {
    state.unlocked.push(item.painting);
  }
  paintingTitle.textContent = item.painting;
  paintingDesc.textContent = item.desc;
  showPage('unlock');
}

function renderAlbum() {
  albumGrid.innerHTML = '';
  riddles.forEach((item) => {
    const card = document.createElement('article');
    const unlocked = state.unlocked.includes(item.painting);
    card.className = `album-card ${unlocked ? '' : 'locked'}`.trim();
    card.innerHTML = `
      <h3>${item.painting}</h3>
      <p>${unlocked ? item.desc : '此卷尚未破谜。'}</p>
      ${unlocked ? '<span class="stamp">朱印·已藏</span>' : ''}
    `;
    albumGrid.appendChild(card);
  });
}

function nextStepAfterUnlock() {
  if (state.index >= riddles.length - 1) {
    renderAlbum();
    showPage('album');
    return;
  }
  state.index += 1;
  renderRiddle();
  showPage('riddle');
}

document.getElementById('start-btn').addEventListener('click', () => {
  state.index = 0;
  state.unlocked = [];
  renderRiddle();
  showPage('riddle');
});

document.getElementById('submit-btn').addEventListener('click', () => {
  const current = riddles[state.index];
  const userAnswer = normalize(answerInput.value);
  if (!userAnswer) {
    openFeedback('墨迹未成', '请先写下谜底，再盖章提交。');
    return;
  }
  if (userAnswer === normalize(current.answer)) {
    unlockPainting();
    openFeedback('落印成章', `恭喜解出“${current.painting}”，画卷已舒展！`);
  } else {
    openFeedback('墨误一笔', '此谜尚未点破，再细思片刻。');
  }
});

document.getElementById('modal-btn').addEventListener('click', closeFeedback);
document.getElementById('next-btn').addEventListener('click', nextStepAfterUnlock);
document.getElementById('to-album-btn').addEventListener('click', () => {
  renderAlbum();
  showPage('album');
});

document.getElementById('restart-btn').addEventListener('click', () => {
  state.index = 0;
  state.unlocked = [];
  showPage('start');
});
