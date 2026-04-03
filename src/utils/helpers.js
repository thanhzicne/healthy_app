// Date helpers
export const today = () => new Date().toISOString().split('T')[0];

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

export const formatDateLong = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
};

export const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

export const getLast30Days = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

export const getLastNMonths = (n) => {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
};

// Health calculations
export const calcBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  return (weightKg / (h * h)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  const v = parseFloat(bmi);
  if (v < 18.5) return { label: 'Thiếu cân', color: '#00d4ff' };
  if (v < 23) return { label: 'Bình thường', color: '#00e5a0' };
  if (v < 27.5) return { label: 'Thừa cân', color: '#ff7b35' };
  return { label: 'Béo phì', color: '#ff4f8b' };
};

export const calcWaterGoal = (weightKg) => {
  if (!weightKg) return 2000;
  return Math.round(weightKg * 35);
};

export const calcStepGoal = () => 10000;

// Format numbers
export const fmtNumber = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n;
};

export const pct = (value, goal) => {
  if (!goal) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
};

// Generate demo data for past days
export const generateDemoSteps = () => {
  const days = getLast7Days();
  return days.slice(0, -1).map(date => ({
    date,
    count: Math.floor(Math.random() * 8000 + 3000),
  }));
};

export const generateDemoWater = () => {
  const days = getLast7Days();
  return days.slice(0, -1).map(date => ({
    date,
    amount: Math.floor(Math.random() * 1500 + 800),
    logs: [],
  }));
};

export const generateDemoWeight = () => {
  const days = getLast30Days();
  let w = 70;
  return days.slice(0, -1).map(date => {
    w = +(w + (Math.random() - 0.52) * 0.5).toFixed(1);
    return { date, value: w };
  });
};
