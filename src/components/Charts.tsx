import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function WeeklyChart({ data }: { data: Array<{ day: string; wpm: number; accuracy: number }> }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,.08)" />
          <XAxis dataKey="day" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#111522', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8 }} />
          <Line type="monotone" dataKey="wpm" stroke="#35f48c" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="accuracy" stroke="#42c7ff" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpeedChart({ data }: { data: Array<{ second: number; wpm: number }> }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="speed" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#35f48c" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#35f48c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.08)" />
          <XAxis dataKey="second" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#111522', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8 }} />
          <Area type="monotone" dataKey="wpm" stroke="#35f48c" fill="url(#speed)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
