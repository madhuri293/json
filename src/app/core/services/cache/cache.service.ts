import { Injectable } from '@angular/core';
export class LocalStorageSave {
  key: string;
  data: any;
}
@Injectable({
  providedIn: 'root'
})

export class CacheService {

  constructor() { }

  save(data: LocalStorageSave) {
    const record = {
      value: typeof data.data === 'string' ? data.data : JSON.stringify(data.data)
    };
    localStorage.setItem(data.key, JSON.stringify(record));
  }

  load(key: string) {
    const item = localStorage.getItem(key);
    if (item !== null) {
      const record = JSON.parse(item);
      return JSON.parse(record.value);
    }
    return null;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  cleanLocalStorage() {
    localStorage.clear();
  }
}
