import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Paginate'
})
export class ComponentsPipe implements PipeTransform {

  transform(array: any[], page_size: number | string, page_number: number): any[] {
    if (!array.length) {
      return [];
    }
  
    if (page_size === 'all') {
      return array;
    }
  
    page_size = page_size === null ? 5 : Number(page_size);
    page_number = page_number === null ? 1 : Number(page_number);
    --page_number;
  
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
  }

}
