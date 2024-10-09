import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortLoads'
})
export class SortLoadsPipe implements PipeTransform {

  transform(loads: any[], statusPriority: string): any[] {
    if (!loads) return [];
    return loads.sort((a, b) => {
      if (a.statusDescription === statusPriority && b.statusDescription !== statusPriority) {
        return -1;
      } else if (a.statusDescription !== statusPriority && b.statusDescription === statusPriority) {
        return 1;
      }
      return 0; // Maintain existing order if statuses are the same or not the 'Get started'
    });
  }

}
