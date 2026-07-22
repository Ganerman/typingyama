import { Activity, Bug, Flame, Gauge, Medal, Skull, Star, Target, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WeeklyChart } from '../components/Charts';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { RankBadge } from '../components/ui/RankBadge';
import { StatCard } from '../components/ui/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { achievements, activities, weeklyProgress } from '../data/mockData';
import { getNextRank, getRankProgress } from '../utils/calculations';

export function DashboardPage() {
  const { profile } = useAuth();
  const nextRank = getNextRank(profile.totalXp);
  const progress = getRankProgress(profile.totalXp);

  return (
    <div className="grid gap-5">
      <section className="panel grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
        <div>
          <RankBadge rank={profile.currentRank} />
          <h1 className="mt-4 text-3xl font-black text-white">Current Level {profile.level}</h1>
          <p className="mt-2 max-w-2xl text-slate-300">Keep your streak alive and push toward {nextRank?.name ?? 'the top of TypeRush'}.</p>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>{profile.totalXp.toLocaleString()} XP</span>
              <span>{progress}% to next rank</span>
            </div>
            <ProgressBar value={progress} label="Rank progress" />
          </div>
        </div>
        <Card className="bg-rush-green/10">
          <p className="text-sm font-bold text-rush-green">Daily Challenge</p>
          <h2 className="mt-2 text-2xl font-black text-white">Hit 65 WPM at 94% accuracy</h2>
          <p className="mt-2 text-sm text-slate-300">Reward: 120 XP and 45 coins</p>
          <Link className="mt-4 inline-flex rounded-lg bg-rush-green px-4 py-2 text-sm font-black text-rush-ink" to="/daily">Play Challenge</Link>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Best WPM" value={profile.bestWpm} icon={Gauge} />
        <StatCard label="Average WPM" value={profile.averageWpm} icon={Zap} accent="text-rush-blue" />
        <StatCard label="Best Accuracy" value={`${profile.bestAccuracy}%`} icon={Target} accent="text-rush-purple" />
        <StatCard label="Typing Streak" value={`${profile.currentStreak} days`} icon={Flame} accent="text-orange-300" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <Card>
          <h2 className="mb-4 text-xl font-black text-white">Weekly Progress</h2>
          <WeeklyChart data={weeklyProgress} />
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black text-white">Achievement Progress</h2>
          <div className="grid gap-3">
            {achievements.slice(0, 5).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                <achievement.icon className={`h-5 w-5 ${achievement.unlockedAt ? 'text-rush-green' : 'text-slate-500'}`} />
                <div>
                  <p className="font-bold text-white">{achievement.name}</p>
                  <p className="text-xs text-slate-400">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <Card>
          <h2 className="mb-4 text-xl font-black text-white">Quick Modes</h2>
          <div className="grid gap-2">
            {[
              ['/typing-test', 'Classic Typing Test', Gauge],
              ['/race', 'Typing Race', Trophy],
              ['/word-rain', 'Word Rain', Star],
              ['/worm-words', 'Worm Words', Bug],
              ['/boss-battle', 'Boss Battle', Skull],
              ['/code', 'Code Typing Mode', Medal],
            ].map(([to, label, Icon]) => (
              <Link key={String(to)} to={String(to)} className="focus-ring flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 font-bold text-slate-100 hover:bg-white/10">
                <Icon className="h-5 w-5 text-rush-green" /> {String(label)}
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white"><Activity className="h-5 w-5 text-rush-green" /> Recent Activities</h2>
          <div className="grid gap-3">
            {activities.map((activity) => (
              <div key={activity.id} className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-3 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-bold text-white">{activity.mode} · {activity.detail}</p>
                  <p className="text-xs text-slate-400">{activity.date}</p>
                </div>
                <p className="text-sm text-slate-300">{activity.wpm} WPM · {activity.accuracy}% · +{activity.xp} XP</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
