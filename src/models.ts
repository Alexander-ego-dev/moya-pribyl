export type Kind = 'income' | 'expense';
export interface Operation {id:string;date:string;type:Kind;amountKopecks:number;categoryId:string;comment:string;createdAt:string;updatedAt:string}
export interface Category {id:string;name:string;type:Kind;archived:boolean}
export interface Goal {id:string;year:number;month:number;targetAmountKopecks:number;createdAt:string;updatedAt:string}
export interface Backup {version:1;exportedAt:string;operations:Operation[];categories:Category[];goals:Goal[]}
