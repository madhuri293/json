import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ManageRecipe } from './recipe.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';


@Injectable({
  providedIn: 'root'
})
export class RecipeService extends AbstractRestService<ManageRecipe> {

  constructor(public httpService: HttpService) {
    super(httpService);
   }
  getAllRecipe() {
    return this.httpService.get(`${environment.recipe_api_url}${environment.manageRecipe}`)
     .pipe(map(data => data));
  }

  getById(id: number) {
    return this.httpService.get(`${environment.recipe_api_url}${environment.manageRecipe}/${id}`)
      .pipe(map(data => data));
  }
  find(recipe: any) {
    return this.httpService.create(`${environment.recipe_api_url}${environment.manageRecipe}/${environment.find}`, recipe)
      .pipe(map(data => data));
  }
  save(recipe: any) {
    return this.httpService.create(`${environment.recipe_api_url}${environment.manageRecipe}`, recipe)
      .pipe(map(data => data));
  }
  update(recipe: any) {
    return this.httpService.update(`${environment.recipe_api_url}${environment.manageRecipe}`, recipe)
      .pipe(map(data => data));
  }
  
  delete(id: number, sk: any) {
    return this.httpService.delete(`${environment.recipe_api_url}${environment.manageRecipe}/${id}/${sk}`)
      .pipe(map(data => data));
  }
}
