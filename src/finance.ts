import type {Operation} from './models';
export const LIMIT=1_000_000_000_000;
export function parseMoney(value:string){if(!/^\d+(?:[.,]\d{1,2})?$/.test(value.trim()))throw Error('Введите сумму: до двух знаков после запятой.');const [r,k='']=value.trim().replace(',','.').split('.');const n=Number(r)*100+Number(k.padEnd(2,'0'));if(!Number.isSafeInteger(n)||n<=0||n>LIMIT)throw Error('Сумма должна быть больше нуля и не больше 10 млрд ₽.');return n;}
export const money=(n:number)=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',minimumFractionDigits:n%100?2:0,maximumFractionDigits:2}).format(n/100);
export function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function validDate(s:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number);const t=new Date(y,m-1,d);return y>=1900&&y<=9999&&t.getFullYear()===y&&t.getMonth()===m-1&&t.getDate()===d;}
export const monthKey=(d:string)=>d.slice(0,7);
export function moveMonth(key:string,delta:number){const [y,m]=key.split('-').map(Number);const d=new Date(y,m-1+delta,1);return monthKey(localDate(d));}
export const monthLabel=(key:string)=>new Date(`${key}-01T12:00:00`).toLocaleDateString('ru-RU',{month:'long',year:'numeric'}).replace(' г.','');
export function totals(ops:Operation[]){let income=0,expense=0;for(const o of ops){if(o.type==='income')income+=o.amountKopecks;else expense+=o.amountKopecks;}if(!Number.isSafeInteger(income)||!Number.isSafeInteger(expense))throw Error('Превышен предел расчёта.');return {income,expense,profit:income-expense};}
export function days(ops:Operation[]){const groups=new Map<string,Operation[]>();for(const o of ops)groups.set(o.date,[...(groups.get(o.date)||[]),o]);return [...groups].sort(([a],[b])=>a.localeCompare(b)).map(([date,items])=>({date,...totals(items)}));}
export function progress(profit:number,target:number){const percent=target>0?Math.max(0,profit/target*100):0;return {percent,bar:Math.min(100,percent),remaining:Math.max(0,target-profit)};}
export function analytics(ops:Operation[]){const daily=days(ops);const earning=daily.filter(d=>d.income>0);return {earningDays:earning.length,average:earning.length?Math.round(earning.reduce((s,d)=>s+d.profit,0)/earning.length):0,best:daily.reduce<(typeof daily)[number]|undefined>((best,d)=>!best||d.profit>best.profit?d:best,undefined)};}
