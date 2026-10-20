import { useEffect, useState } from 'react';

// The scale runs from BMI 15 to 40. Segment widths follow the standard BMI bands.
const MIN = 15;
const MAX = 40;
const percent = (bmi) => Math.min(100, Math.max(0, ((bmi - MIN) / (MAX - MIN)) * 100));

export default function BmiGauge({ bmi, category }) {
  // Start the marker at the left edge, then let it slide to the real value once.
  const [position, setPosition] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setPosition(percent(bmi)));
    return () => cancelAnimationFrame(id);
  }, [bmi]);

  return (
    <div className="gauge" role="img" aria-label={`BMI ${bmi}, ${category}`}>
      <div className="gauge-track">
        <span className="seg seg-under" style={{ width: `${percent(18.5)}%` }} />
        <span className="seg seg-normal" style={{ width: `${percent(25) - percent(18.5)}%` }} />
        <span className="seg seg-over" style={{ width: `${percent(30) - percent(25)}%` }} />
        <span className="seg seg-obese" style={{ width: `${100 - percent(30)}%` }} />
        <span className="gauge-marker" style={{ left: `${position}%` }} />
      </div>
      <div className="gauge-scale" aria-hidden="true">
        <span style={{ left: `${percent(18.5)}%` }}>18.5</span>
        <span style={{ left: `${percent(25)}%` }}>25</span>
        <span style={{ left: `${percent(30)}%` }}>30</span>
      </div>
    </div>
  );
}
