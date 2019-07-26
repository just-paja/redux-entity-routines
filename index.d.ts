export type RoutineList = string[];

export interface FluxAction<Model> {
  meta?: any;
  payload?: Model;
  type: string;
}

export interface ActionCreator<Model> {
  (payload: Model): FluxAction<Model>
  (payload: Model, meta: any): FluxAction<Model>
}

export interface AsyncRoutine<InputType, OutputType> {
  (payload: InputType): FluxAction<InputType>,
  (payload: InputType, meta: any): FluxAction<InputType>,
  failure: ActionCreator<Error>;
  FAILURE: string;
  fulfill: ActionCreator<InputType>;
  FULFILL: string;
  getError: (state: any) => Error;
  isInitialized: (state: any) => boolean;
  isLoading: (state: any) => boolean;
  request: ActionCreator<InputType>;
  REQUEST: string;
  success: ActionCreator<OutputType>;
  SUCCESS: string;
  trigger: ActionCreator<InputType>;
  TRIGGER: string;
}

export type Ident = any;

export interface RoutineDict<Model> {
  [key: string]: Routine<any, Model>;
}

export interface EntitySelector<StateType, Model> {
  (state: StateType): Model;
  (state: StateType, ident: Ident): Model;
}


export interface IdentSelector<StateType> {
  (state: StateType): Ident;
}

export interface PropSelector<StateType, PropType> {
  (state: StateType, ident: Ident): PropType;
}

export interface EntityStore<Model> {
  createFindSelector: (identSelector: IdentSelector<any>) => EntitySelector<any, Model>;
  getAll: EntitySelector<any, Model[]>;
  getCollection: EntitySelector<any, Model[]>;
  getObject: EntitySelector<any, Model>;
  getProp: PropSelector<any, any>;
  getFlag: PropSelector<any, boolean>;
  getSize: EntitySelector<any, number>;
  isEmpty: EntitySelector<any, boolean>;
  name: string;
}

export type Routine<InputType, OutputType> = AsyncRoutine<InputType, OutputType>;

export interface ItemReducer<Model> {
  (state: Model, action: FluxAction<Partial<Model>>): Model
}

export interface ReducerMap<Model> {
  [key: string]: ItemReducer<Model>
}

export interface IdentResolver<Model> {
  (item: Model): Ident;
}

export interface StoreConfig<Model> {
  clearedBy?: (Routine<any, Model>|Routine<any, Model[]>)[];
  collectionReducers?: ReducerMap<Model[]>;
  deletedBy?: (Routine<any, Model>|Routine<any, Model[]>)[];
  identAttr?: string;
  identResolver?: IdentResolver<Model>;
  on?: ReducerMap<Model>;
  providedBy?: (Routine<any, Model>|Routine<any, Model[]>)[];
}

declare module 'redux-entity-routines' {
  function createAsyncRoutine<InputType, OutputType>(
    baseName: string
  ): AsyncRoutine<InputType, OutputType>;

  function createEntityRoutines<Model>(
    entity: string,
    routines: RoutineList,
    sync?: boolean
  ): RoutineDict<Model>;

  function createEntityStore<Model>(
    storeName: string,
    storeConfig: StoreConfig<Model>,
  ): EntityStore<Model>

  function createEntitiesReducer(...stores: EntityStore<any>[]): any;

  function operations(state: any, action: FluxAction<any>): any;
}
