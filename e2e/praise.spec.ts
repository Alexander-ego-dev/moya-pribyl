import {test,expect} from '@playwright/test';

test('похвала только за новый доход строго больше 8000 рублей',async({page})=>{
 await page.goto('/');
 const praise=page.getByText('Умничка, горжусь вами!',{exact:true});
 for(const [kind,amount,comment,celebrate] of [
  ['Доход','7999','Меньше порога',false],
  ['Доход','8000','Ровно порог',false],
  ['Расход','9000','Расход',false],
  ['Доход','8000,01','Большой доход',true],
 ] as const){
  await page.getByRole('button',{name:kind,exact:true}).click();
  await page.getByLabel('Сумма, ₽',{exact:true}).fill(amount);
  await page.getByRole('combobox',{name:'Категория',exact:true}).selectOption({label:kind==='Доход'?'Татуировки':'Материалы'});
  await page.getByLabel('Комментарий').fill(comment);
  await page.getByRole('button',{name:'Сохранить операцию'}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  if(celebrate){
   await expect(praise).toBeVisible();
   await expect(page.locator('.praise-notice')).toHaveCSS('opacity','1');
   await page.screenshot({path:'test-results/praise-notice.png'});
   await expect(praise).toBeHidden({timeout:10000});
  }else{await expect(page.getByText('Операция сохранена',{exact:true})).toBeVisible();await expect(praise).toHaveCount(0);}
 }
 await page.getByRole('button',{name:/Татуировки.*Большой доход/}).click();
 await page.getByLabel('Сумма, ₽',{exact:true}).fill('12000');
 await page.getByRole('button',{name:'Сохранить операцию'}).click();
 await expect(page.getByText('Операция сохранена',{exact:true})).toBeVisible();
 await expect(praise).toHaveCount(0);
});
