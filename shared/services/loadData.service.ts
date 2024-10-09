import { Injectable } from '@angular/core';
import { Load } from '../../load/load-management/load-management.metadata';

@Injectable({
  providedIn: 'root'
})
export class LoadService {
  load: any;
}
