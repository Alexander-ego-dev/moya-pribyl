import { describe, expect, it } from 'vitest';
import { achievements } from './achievements';
import type { Goal, Operation } from './models';

const stamp = '2026-01-01T12:00:00Z';
const goal = (year: number, month: number, target = 10000): Goal => ({ id: `${year}-${month}`, year, month, targetAmountKopecks: target, createdAt: stamp, updatedAt: stamp });
const op = (date: string, amountKopecks: number, type: 'income' | 'expense' = 'income'): Operation => ({ id: crypto.randomUUID(), date, amountKopecks, type, categoryId: type, comment: '', createdAt: stamp, updatedAt: stamp });
const evaluate = (ops: Operation[], goals: Goal[], today = '2026-10-14') => achievements(ops, goals, today);
describe('достижения за цели', () => {
  it('ровно пять, пустая база без наград', () => { const items = evaluate([], []); expect(items).toHaveLength(5); expect(items.every(item => !item.earned && item.progress === 0)).toBe(true); });
  it('прибыль без цели не выдаёт значки', () => expect(evaluate([op('2026-10-01', 500000)], []).some(item => item.earned)).toBe(false));
  it.each([99, 100, 119, 120, 149, 150])('точные границы %i%%', percent => { const items = evaluate([op('2026-10-01', percent * 100)], [goal(2026, 10)]); expect(items.slice(0, 3).map(item => item.earned)).toEqual([percent >= 100, percent >= 120, percent >= 150]); });
  it('расходы уменьшают чистую прибыль', () => expect(evaluate([op('2026-10-01', 15000), op('2026-10-02', 6000, 'expense')], [goal(2026, 10)])[0].earned).toBe(false));
  it('не округляет 119,999% до награды', () => expect(evaluate([op('2026-10-01', 119999)], [goal(2026, 10, 100000)])[1].earned).toBe(false));
  it('отрицательная прибыль даёт нулевой прогресс', () => expect(evaluate([op('2026-10-01', 5000, 'expense')], [goal(2026, 10)])[0].progress).toBe(0));
  it('не засчитывает будущие операции и цели', () => expect(evaluate([op('2026-10-31', 20000), op('2026-11-01', 20000)], [goal(2026, 10), goal(2026, 11)]).some(item => item.earned)).toBe(false));
  it('прошлые месяцы засчитываются сразу', () => expect(evaluate([op('2026-08-01', 15000)], [goal(2026, 8)]).slice(0, 3).every(item => item.earned)).toBe(true));
  it('три несмежных месяца дают ритм, но не серию', () => { const items = evaluate([op('2026-04-01', 10000), op('2026-06-01', 10000), op('2026-09-01', 10000)], [goal(2026, 4), goal(2026, 6), goal(2026, 9)]); expect(items[3].earned).toBe(true); expect(items[4].earned).toBe(false); });
  it('серия пересекает границу года', () => { const items = evaluate([op('2025-11-01', 10000), op('2025-12-01', 10000), op('2026-01-01', 10000)], [goal(2025, 11), goal(2025, 12), goal(2026, 1)]); expect(items[4].earned).toBe(true); });
  it('незавершённый месяц не продлевает серию', () => { const items = evaluate([op('2026-08-01', 10000), op('2026-09-01', 10000), op('2026-10-01', 10000)], [goal(2026, 8), goal(2026, 9), goal(2026, 10)]); expect(items[4].progress).toBe(2); });
  it('пересчитывает значки после изменения или удаления цели', () => { const ops = [op('2026-10-01', 10000)]; expect(evaluate(ops, [goal(2026, 10)])[0].earned).toBe(true); expect(evaluate(ops, [goal(2026, 10, 20000)])[0].earned).toBe(false); expect(evaluate(ops, [])[0].earned).toBe(false); });
});
