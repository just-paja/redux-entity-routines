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

export interface Routine<InputType> {
  (): FluxAction<void>;
  (payload: InputType): FluxAction<InputType>;
  (payload: InputType, meta: any): FluxAction<InputType>;
  trigger: ActionCreator<InputType>;
  TRIGGER: string;
}

export interface AsyncRoutine<InputType, OutputType> extends Routine<InputType> {
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
}

export type Ident = any;

export interface RoutineDict<Model> {
  [key: string]: AsyncRoutine<any, Model>;
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

export interface ItemReducer<Model> {
  (state: Model, action: FluxAction<Partial<Model>>): Model
}

export interface ReducerMap<Model> {
  [key: string]: ItemReducer<Model>
}

export interface IdentResolver<Model> {
  (item: Model): Ident;
}

export type IdentSource = string | string[] | IdentResolver<any>;

export interface EntityConfig<Model> {
  clearedBy?: (AsyncRoutine<any, Model>|AsyncRoutine<any, Model[]>)[];
  collectionReducers?: ReducerMap<Model[]>;
  deletedBy?: (AsyncRoutine<any, Model>|AsyncRoutine<any, Model[]>)[];
  identSource: IdentSource
  name: string;
  on?: ReducerMap<Model>;
  providedBy?: (AsyncRoutine<any, Model>|AsyncRoutine<any, Model[]>)[];
}

declare module 'redux-entity-store' {
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
