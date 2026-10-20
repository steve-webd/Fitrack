// BMI = weight (kg) / height (m) squared
export const calculateBmi = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  return Number((weightKg / (h * h)).toFixed(1));
};

export const bmiCategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const GOAL_LABELS = {
  lose: 'Lose weight',
  maintain: 'Maintain current weight',
  gain: 'Gain weight or muscle',
};

// Workout dates are stored as UTC midnight, so they are shown in UTC to avoid off-by-one days.
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const toDateInput = (iso) => new Date(iso).toISOString().slice(0, 10);

export const todayInput = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const formatMinutes = (total) => {
  if (total < 60) return `${total} min`;
  const m = total % 60;
  return m ? `${Math.floor(total / 60)} h ${m} min` : `${Math.floor(total / 60)} h`;
};

// '' -> undefined, '70' -> 70 (so empty optional fields are simply not sent)
export const numberOrUndefined = (value) => (value === '' || value == null ? undefined : Number(value));
