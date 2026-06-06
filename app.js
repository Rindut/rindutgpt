const habits = [
  { id: 'protein', title: 'Protein 100g', detail: 'Prioritas utama untuk kenyang dan jaga otot', xp: 20 },
  { id: 'steps', title: '8.000 langkah', detail: 'Walking ringan untuk defisit tanpa cardio berat', xp: 20 },
  { id: 'workout', title: 'Workout / mobility', detail: 'Strength Selasa & Kamis, jalan di hari lain', xp: 25 },
  { id: 'water', title: 'Air putih 2.5L', detail: 'Bantu energi dan kurangi craving', xp: 15 },
  { id: 'no-sugar', title: 'No sugary drink', detail: 'Hindari kalori cair yang mudah terlupakan', xp: 15 },
  { id: 'sleep', title: 'Sleep goal 7h+', detail: 'Recovery untuk mood dan kontrol lapar', xp: 20 },
];

const foods = [
  { name: '150g Chicken Breast', protein: 46, calories: 248 },
  { name: '2 Telur + Greek Yogurt', protein: 30, calories: 310 },
  { name: '1 scoop Whey', protein: 24, calories: 120 },
  { name: '150g Ikan / Tuna', protein: 38, calories: 210 },
];

const state = {
  checkedHabits: new Set(),
  protein: 0,
};

const habitList = document.querySelector('#habit-list');
const foodGrid = document.querySelector('#food-grid');
const dailyScore = document.querySelector('#daily-score');
const scoreMessage = document.querySelector('#score-message');
const xpTotal = document.querySelector('#xp-total');
const proteinTotal = document.querySelector('#protein-total');
const proteinProgress = document.querySelector('#protein-progress');
const resetProtein = document.querySelector('#reset-protein');
const streakBadge = document.querySelector('#streak-badge');

function renderHabits() {
  habitList.innerHTML = habits
    .map(
      (habit) => `
        <label class="habit-item" for="${habit.id}">
          <input id="${habit.id}" type="checkbox" data-habit="${habit.id}" />
          <span>
            <strong>${habit.title}</strong>
            <span>${habit.detail}</span>
          </span>
          <span class="xp-value">+${habit.xp} XP</span>
        </label>
      `,
    )
    .join('');
}

function renderFoods() {
  foodGrid.innerHTML = foods
    .map(
      (food) => `
        <button class="food-card" type="button" data-protein="${food.protein}">
          <strong>${food.name}</strong>
          <span>${food.calories} kcal · ${food.protein}g protein</span>
        </button>
      `,
    )
    .join('');
}

function updateScore() {
  const xp = habits
    .filter((habit) => state.checkedHabits.has(habit.id))
    .reduce((total, habit) => total + habit.xp, 0);
  const score = Math.min(100, Math.round((xp / 115) * 100));
  const proteinPercent = Math.min(100, state.protein);

  dailyScore.textContent = score;
  xpTotal.textContent = xp;
  proteinTotal.textContent = state.protein;
  proteinProgress.style.width = `${proteinPercent}%`;
  proteinProgress.parentElement.setAttribute('aria-valuenow', proteinPercent);

  if (score >= 85) {
    scoreMessage.textContent = 'Excellent. Hari ini sudah mendukung target acara.';
    streakBadge.textContent = 'Diamond pace';
  } else if (score >= 60) {
    scoreMessage.textContent = 'Good. Tambahkan satu habit lagi untuk naik level.';
    streakBadge.textContent = 'Silver pace';
  } else {
    scoreMessage.textContent = 'Mulai dari protein, steps, dan no sugary drink.';
    streakBadge.textContent = 'Bronze';
  }
}

habitList.addEventListener('change', (event) => {
  const habitId = event.target.dataset.habit;

  if (!habitId) return;

  if (event.target.checked) {
    state.checkedHabits.add(habitId);
  } else {
    state.checkedHabits.delete(habitId);
  }

  updateScore();
});

foodGrid.addEventListener('click', (event) => {
  const card = event.target.closest('[data-protein]');

  if (!card) return;

  state.protein = Math.min(160, state.protein + Number(card.dataset.protein));

  if (state.protein >= 100) {
    state.checkedHabits.add('protein');
    document.querySelector('#protein').checked = true;
  }

  updateScore();
});

resetProtein.addEventListener('click', () => {
  state.protein = 0;
  state.checkedHabits.delete('protein');
  document.querySelector('#protein').checked = false;
  updateScore();
});

renderHabits();
renderFoods();
updateScore();
