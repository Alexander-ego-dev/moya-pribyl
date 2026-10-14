import { Award, Crown, Flame, LockKeyhole, Medal, Trophy, ChevronRight } from 'lucide-react';
import type { Achievement } from './achievements';

const icons = { first: Medal, beyond: Flame, summit: Crown, three: Award, streak: Trophy };

export function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const Icon = icons[achievement.id];
  return <span className={`achievement-badge ${achievement.earned ? 'earned' : 'locked'}`} aria-hidden="true">
    <Icon size={27} strokeWidth={1.5} />
    {!achievement.earned && <LockKeyhole className="badge-lock" size={12} />}
  </span>;
}

export function AchievementPreview({ items, open }: { items: Achievement[]; open: () => void }) {
  const count = items.filter(item => item.earned).length;
  return <section className="achievements-preview">
    <div className="row"><h2>Ваши достижения</h2><span className="muted">{count} из 5</span></div>
    <button className="achievement-collection" onClick={open} aria-label={`Открыть достижения: получено ${count} из 5`}>
      <span className="badge-strip">{items.map(item => <AchievementBadge key={item.id} achievement={item} />)}</span>
      <ChevronRight size={18} />
    </button>
    <p className="muted" role="status">{count ? `Получено значков: ${count}. Ваши результаты заслуживают внимания.` : 'У каждой цели есть своя награда. Первая вершина — выполнить цель месяца.'}</p>
  </section>;
}

export function AchievementCollection({ items }: { items: Achievement[] }) {
  return <div className="achievement-list">
    <p className="muted">Пять знаков вашего прогресса. Прошлые месяцы тоже учитываются.</p>
    {items.map(item => <article key={item.id} className={`achievement-item ${item.earned ? 'is-earned' : ''}`}>
      <AchievementBadge achievement={item} />
      <div><div className="row"><h3>{item.name}</h3><span className="achievement-status">{item.earned ? 'Получено' : 'Впереди'}</span></div>
        <p>{item.description}</p>
        <div className="track" role="progressbar" aria-label={item.name} aria-valuemin={0} aria-valuemax={item.target} aria-valuenow={Math.min(item.target, item.progress)}>
          <i style={{ width: `${Math.min(100, item.progress / item.target * 100)}%` }} />
        </div>
        <small>{Math.min(item.target, item.progress).toLocaleString('ru-RU', { maximumFractionDigits: 1 })} / {item.target} {item.unit}</small>
      </div>
    </article>)}
    <p className="muted">Значки отражают текущие сохранённые данные. Если изменить операции или цели, результат пересчитается. Серии засчитываются после окончания месяцев; месяц без цели прерывает серию, но не считается провалом.</p>
  </div>;
}
