import Dexie,{type Table} from 'dexie';
import type {Backup,Category,Goal,Operation} from './models';
import {LIMIT,validDate,totals} from './finance';
export class ProfitDB extends Dexie {operations!:Table<Operation,string>;categories!:Table<Category,string>;goals!:Table<Goal,string>;constructor(name='moya-pribyl'){super(name);this.version(1).stores({operations:'id,date,type,categoryId',categories:'id,type',goals:'id,&[year+month]'});}}
export const db=new ProfitDB();
export async function initialize(){await db.transaction('rw',db.categories,async()=>{if(await db.categories.count()===0){await db.categories.bulkAdd((['Татуировки','Фотосессии','Дизайн','Прочее'].map((name,i)=>({id:`income-${i}`,name,type:'income' as const,archived:false}))).concat([]));await db.categories.bulkAdd(['Материалы','Аренда','Транспорт','Оборудование','Реклама','Прочее'].map((name,i)=>({id:`expense-${i}`,name,type:'expense' as const,archived:false})));}});}
const record=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const str=(x:unknown,max=500)=>typeof x==='string'&&x.length>0&&x.length<=max;
const amount=(x:unknown)=>typeof x==='number'&&Number.isSafeInteger(x)&&x>0&&x<=LIMIT;
const stamp=(x:unknown)=>str(x)&&Number.isFinite(Date.parse(x as string));
export function validateBackup(x:unknown):Backup{
 if(!record(x)||x.version!==1||!stamp(x.exportedAt)||!Array.isArray(x.categories)||!Array.isArray(x.operations)||!Array.isArray(x.goals))throw Error('Неверный формат или версия резервной копии.');
 const unique=(items:unknown[])=>{const ids=new Set();for(const item of items){if(!record(item)||!str(item.id,100)||ids.has(item.id))throw Error('Некорректные или повторяющиеся идентификаторы.');ids.add(item.id);}};
 unique(x.categories);unique(x.operations);unique(x.goals);
 for(const c of x.categories)if(!record(c)||!str(c.name,60)||!['income','expense'].includes(String(c.type))||typeof c.archived!=='boolean')throw Error('Некорректная категория.');
 const cats=new Map((x.categories as Category[]).map(c=>[c.id,c]));
 for(const o of x.operations){if(!record(o)||typeof o.date!=='string'||!validDate(o.date)||!amount(o.amountKopecks)||!['income','expense'].includes(String(o.type))||typeof o.comment!=='string'||o.comment.length>500||!stamp(o.createdAt)||!stamp(o.updatedAt)||cats.get(String(o.categoryId))?.type!==o.type)throw Error('Некорректная операция.');}
 const months=new Set();for(const g of x.goals){if(!record(g)||!Number.isInteger(g.year)||Number(g.year)<1900||Number(g.year)>9999||!Number.isInteger(g.month)||Number(g.month)<1||Number(g.month)>12||!amount(g.targetAmountKopecks)||!stamp(g.createdAt)||!stamp(g.updatedAt)||months.has(`${g.year}-${g.month}`))throw Error('Некорректная или повторная цель.');months.add(`${g.year}-${g.month}`);}
 totals(x.operations as Operation[]); return x as unknown as Backup;
}
export async function exportBackup(database=db):Promise<Backup>{return database.transaction('r',database.operations,database.categories,database.goals,async()=>({version:1,exportedAt:new Date().toISOString(),operations:await database.operations.toArray(),categories:await database.categories.toArray(),goals:await database.goals.toArray()}));}
export async function restoreBackup(value:unknown,database=db){const b=validateBackup(value);await database.transaction('rw',database.operations,database.categories,database.goals,async()=>{await database.operations.clear();await database.categories.clear();await database.goals.clear();await database.categories.bulkAdd(b.categories);await database.operations.bulkAdd(b.operations);await database.goals.bulkAdd(b.goals);});}
export function csv(b:Backup){const escape=(s:string)=>`"${s.replace(/"/g,'""')}"`;const cats=new Map(b.categories.map(c=>[c.id,c.name]));return '\ufeff'+['Дата;Тип;Сумма ₽;Категория;Комментарий',...b.operations.sort((a,b)=>a.date.localeCompare(b.date)).map(o=>[o.date,o.type==='income'?'Доход':'Расход',(o.amountKopecks/100).toFixed(2).replace('.',','),cats.get(o.categoryId)||'',o.comment].map(s=>escape(/^[=+@\-\t\r]/.test(s)?`'${s}`:s)).join(';'))].join('\r\n');}

