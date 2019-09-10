export interface StoreMap<Model> {
  [key: string]: Model;
}

export type RoutineList = string[];

export interface FluxAction<Model, MetaType = void> {
  meta?: MetaType;
  payload?: Model;
  type: string;
}

export interface ActionCreator<Model, MetaType=void> {
  (payload: Model): FluxAction<Model>;
  (payload: Model, meta: MetaType): FluxAction<Model>;
}

export interface Routine<InputType, MetaType = void> {
  (): FluxAction<void>;
  (payload: InputType): FluxAction<InputType>;
  (payload: InputType, meta: MetaType): FluxAction<InputType, MetaType>;
  trigger: ActionCreator<InputType>;
  TRIGGER: string;
}

export interface AsyncRoutine<InputType, OutputType, MetaType = void> extends Routine<InputType> {
  failure: ActionCreator<Error, MetaType>;
  FAILURE: string;
  fulfill: ActionCreator<InputType, MetaType>;
  FULFILL: string;
  getError: (state: any) => Error;
  isInitialized: (state: any) => boolean;
  isLoading: (state: any) => boolean;
  request: ActionCreator<InputType, MetaType>;
  REQUEST: string;
  success: ActionCreator<OutputType, MetaType>;
  SUCCESS: string;
}

export type Ident = any;

export type RoutineDict<Model> = StoreMap<AsyncRoutine<any, Model>>;

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

export type ReducerMap<Model> = StoreMap<ItemReducer<Model>>;

export interface IdentResolver<Model> {
  (item: Model): Ident;
}

export type IdentSource<Model> = string | string[] | IdentResolver<Model>;

export interface RelationConfig {
  attr: string;
  collection: string;
}

export interface JsonPathMap {
  [key:string]: string;
}

export interface ViewConfig<PayloadType, MetaType = void> {
  name: string;
  props?: JsonPathMap;
  routine: Routine<PayloadType, MetaType>;
}

export type ViewPropMap = StoreMap<any>;

export interface OperationState {
  error?: Error;
  initialized?: boolean;
  loading?: boolean;
}

export interface ViewState {
  entities: string[];
  props: ViewPropMap;
}

export type EntitiesState = StoreMap<object[]>;
export type OperationsState = StoreMap<OperationState>;
export type ViewsState = StoreMap<ViewState>;

export type StoreReducer<Model> = (state: Model, action: FluxAction<any>) => Model;
export type EntitiesReducer = StoreReducer<EntitiesState>;
export type OperationsReducer = StoreReducer<OperationsState>;
export type ViewReducer = StoreReducer<ViewsState>;

export interface GlobalReducerMap {
  entities: EntitiesReducer;
  operations: OperationsReducer;
  views?: ViewReducer;
}

export interface EntityConfig<Model, MetaType=void> {
  belongsTo?: RelationConfig[];
  clearedBy?: (AsyncRoutine<any, Model, MetaType>|AsyncRoutine<any, Model[], MetaType>)[];
  collectionReducers?: ReducerMap<Model[]>;
  deletedBy?: (AsyncRoutine<any, Model, MetaType>|AsyncRoutine<any, Model[], MetaType>)[];
  hasManyToMany?: RelationConfig[];
  identSource: IdentSource<Model>;
  name: string;
  on?: ReducerMap<Model>;
  providedBy?: (AsyncRoutine<any, Model, MetaType>|AsyncRoutine<any, Model[], MetaType>)[];
  views?: ViewConfig<Model, MetaType>[];
}

declare module 'redux-entity-store' {
  function createAsyncRoutine<InputType, OutputType, MetaType=void>(
    baseName: string
  ): AsyncRoutine<InputType, OutputType, MetaType>;

  function createSyncRoutine<InputType, MetaType=void>(
    baseName: string
  ): Routine<InputType, MetaType>;

  function createEntityRoutines<Model>(
    entity: string,
    routines: RoutineList,
    sync?: boolean
  ): RoutineDict<Model>;

  function createEntityStore<Model>(storeConfig: EntityConfig<Model>): EntityStore<Model>

  function createEntitiesReducer(...stores: EntityStore<any>[]): any;

  function connectReducers(mountPoint: string, ...stores: EntityStore<any>[]): GlobalReducerMap;

  function operations(state: any, action: FluxAction<any>): any;
}
