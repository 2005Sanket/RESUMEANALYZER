interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  color?: string;
}

export function ScoreGauge({ score, label, size = 120, color }: ScoreGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const autoColor =
    score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const strokeColor = color || autoColor;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{score}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}
