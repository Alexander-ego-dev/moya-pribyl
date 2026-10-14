import { LockKeyhole, ChevronRight } from 'lucide-react';
import type { Achievement } from './achievements';
import BusyaEmblem from './BusyaEmblem';

export function AchievementBadge({ achievement }: { achievement: Achievement }) {
  return <span className={`achievement-badge busya-badge tier-${achievement.id} ${achievement.earned ? 'earned' : 'locked'}`} aria-hidden="true">
    <BusyaEmblem tier={achievement.id} />
    {!achievement.earned && <LockKeyhole className="badge-lock" size={12} />}
  </span>;
}

export function AchievementPreview({ items, open }: { items: Achievement[]; open: () => void }) {
  const count = items.filter(item => item.earned).length;
  return <section className="achievements-preview">
    <div className="row"><h2>Ваши достижения</h2><span className="muted">{count} из {items.length}</span></div>
    <button className="achievement-collection" onClick={open} aria-label={`Открыть достижения: получено ${count} из ${items.length}`}>
      <span className="badge-strip">{items.map(item => <AchievementBadge key={item.id} achievement={item} />)}</span>
      <ChevronRight size={18} />
    </button>
    <p className="muted" role="status">{count ? `Получено значков: ${count}. Ваша следующая высота уже ждёт.` : 'Выполните цель месяца на 100% и получите первый значок «Буся на высоте».'}</p>
  </section>;
}

export function AchievementCollection({ items }: { items: Achievement[] }) {
  return <div className="achievement-list">
    <p className="muted">Четыре уровня Буси. Чем выше результат, тем ярче награда. Прошлые месяцы тоже учитываются.</p>
    {items.map(item => <article key={item.id} className={`achievement-item busya-item tier-${item.id} ${item.earned ? 'is-earned' : ''}`}>
      <AchievementBadge achievement={item} />
      <div><div className="row"><h3>{item.name}</h3><span className="achievement-status">{item.earned ? 'Получено' : 'Впереди'}</span></div>
        <p>{item.description}</p>
        <div className="track" role="progressbar" aria-label={item.name} aria-valuemin={0} aria-valuemax={item.target} aria-valuenow={Math.min(item.target, item.progress)}>
          <i style={{ width: `${Math.min(100, item.progress / item.target * 100)}%` }} />
        </div>
        <small>{Math.min(item.target, item.progress).toLocaleString('ru-RU', { maximumFractionDigits: 1 })} / {item.target} {item.unit}</small>
      </div>
    </article>)}
    <p className="muted">Каждый уровень считается по чистой прибыли одного месяца относительно его цели. При достижении 200% открываются все четыре значка. Если изменить операции или цели, результат пересчитается.</p>
  </div>;
}
