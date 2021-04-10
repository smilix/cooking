import {HttpGetConfig, isID, NgEntityService} from '@datorama/akita-ng-entity-service';
import {Observable, of} from 'rxjs';
import {EntityState, EntityStore, getIDType, QueryEntity} from '@datorama/akita';
import {switchMap, take} from 'rxjs/operators';
import {NgEntityServiceParams} from '@datorama/akita-ng-entity-service/lib/types';

export class CachingNgEntityService<S extends EntityState = any> extends NgEntityService<S> {

  constructor(store: EntityStore<S>, private query: QueryEntity<S>, config?: NgEntityServiceParams) {
    super(store, config);
  }

  get<T>(id?: getIDType<S>, config?: HttpGetConfig<T>): Observable<T>;
  get<T>(config?: HttpGetConfig<T>): Observable<T[]>;

  get<T>(idOrConfig?: getIDType<S> | HttpGetConfig<T>, config?: HttpGetConfig<T>): Observable<T> {
    const isSingle = isID(idOrConfig);
    const entityId = isSingle ? (idOrConfig as getIDType<S>) : undefined;
    const conf = (!isSingle ? (idOrConfig as HttpGetConfig<T>) : config) || {};

    let waiting: Observable<any> = of(0);
    if (this.query.getHasCache()) {
      console.log('cache hit: ', this.api, idOrConfig, isSingle);
    } else {
      console.log('cache miss: ', this.api, idOrConfig, isSingle);

      // always load all entitiies to fill the cache
      waiting = super.get(conf);
    }

    return waiting.pipe(
      switchMap(() => {
        // return only the requested entity or entities
        return isSingle ? this.query.selectEntity(entityId!) : this.query.selectAll();
      }),
      take(1)
    ) as unknown as Observable<T>;
  }
}
