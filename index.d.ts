export interface StoreMap<Model> {
  [key: string]: Model;
}

export type RoutineList = string[];

export interface FluxAction<Model, MetaType = void> {
  meta?: MetaType;
  payload?: Model;
  type: string;
}

export type ActionCreator<Model, MetaType = void> = (payload: Model, meta: MetaType) => FluxAction<Model>;

export interface Routine<InputType, OutputType=InputType, MetaType = void> {
  (): FluxAction<void>;
  (payload: InputType, meta: MetaType): FluxAction<InputType, MetaType>;
  (payload: InputType): FluxAction<InputType>;
  routineName: string;
  success: ActionCreator<OutputType, MetaType>;
  SUCCESS: string;
  sync: boolean;
  trigger: ActionCreator<InputType, MetaType>;
  TRIGGER: string;
}

export interface AsyncRoutine<InputType, OutputType, MetaType = void> extends Routine<InputType, OutputType, MetaType> {
  failure: ActionCreator<Error, MetaType>;
  FAILURE: string;
  fulfill: ActionCreator<InputType, MetaType>;
  FULFILL: string;
  getError: (state: any) => Error;
  isInitialized: (state: any) => boolean;
  isLoading: (state: any) => boolean;
  request: ActionCreator<InputType, MetaType>;
  REQUEST: string;
}

export type Ident = any;
export type IdentResolver<Model> = (item: Model) => Ident;
export type IdentSource<Model> = string | string[] | IdentResolver<Model>;

export type RoutineDict<Model> = StoreMap<AsyncRoutine<any, Model>>;

export type EntityCollectionSelector<StateType, Model> = (state: StateType) => Model[];
export type EntitySelector<StateType, Model> = (state: StateType, ident?: Ident) => Model;
export type IdentSelector<StateType> = (state: StateType) => Ident;
export type PropSelector<StateType, PropType> = (state: StateType, ident: Ident, propName: string) => PropType;

export type ViewPropMap = StoreMap<any>;
export type ViewSelector<StateType, Model> = (state: StateType) => Model;
export type ViewSelectorMap<StateType, Model> = StoreMap<ViewSelectors<StateType, Model>>;

export interface ViewSelectors<StateType, Model> {
  getEntities: ViewSelector<StateType, Model[]>;
  getProps: ViewSelector<StateType, ViewPropMap>;
}

export interface EntityStore<Model, StateType = any> {
  createFindSelector: (identSelector: IdentSelector<StateType>) => EntitySelector<StateType, Model>;
  getAll: EntityCollectionSelector<StateType, Model>;
  getCollection: EntityCollectionSelector<StateType, Model>;
  getFlag: PropSelector<StateType, boolean>;
  getObject: EntitySelector<StateType, Model>;
  getProp: PropSelector<StateType, any>;
  getSize: EntitySelector<StateType, number>;
  isEmpty: EntitySelector<StateType, boolean>;
  name: string;
  views: ViewSelectorMap<StateType, Model>;
}

export type ItemReducer<Model> = (state: Model, action: FluxAction<Partial<Model>>) => Model;

export type JsonPathMap = StoreMap<string>;
export type ReducerMap<Model> = StoreMap<ItemReducer<Model>>;

export interface RelationConfig {
  attr: string;
  collection: string;
}

export interface ViewConfig<PayloadType, MetaType = void> {
  name: string;
  props?: JsonPathMap;
  routine: Routine<any, PayloadType | PayloadType[], MetaType>;
}

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

export interface EntityConfig<Model, MetaType = void> {
  belongsTo?: RelationConfig[];
  clearedBy?: (AsyncRoutine<any, Model | Model[], MetaType>)[];
  collectionReducers?: ReducerMap<Model[]>;
  deletedBy?: (AsyncRoutine<any, Model | Model[], MetaType>)[];
  hasManyToMany?: RelationConfig[];
  identSource: IdentSource<Model>;
  name: string;
  on?: ReducerMap<Model>;
  providedBy?: (AsyncRoutine<any, Model | Model[], MetaType>)[];
  views?: ViewConfig<Model, MetaType>[];
}

export type EntityMap = StoreMap<string>;

declare module 'redux-entity-store' {
  function createAsyncRoutine<InputType, OutputType, MetaType = void>(
    baseName: string,
    entityMap?: EntityMap
  ): AsyncRoutine<InputType, OutputType, MetaType>;

  function createSyncRoutine<InputType, OutputType=InputType, MetaType = void>(
    baseName: string,
    entityMap?: EntityMap
  ): Routine<InputType, OutputType, MetaType>;

  function createEntityRoutines<Model>(
    entity: string,
    routines: RoutineList,
    sync?: boolean
  ): RoutineDict<Model>;

  function createEntityStore<Model>(storeConfig: EntityConfig<Model>): EntityStore<Model>;

  function createEntitiesReducer(...stores: EntityStore<any>[]): any;

  function connectReducers(mountPoint: string, ...stores: EntityStore<any>[]): GlobalReducerMap;

  function operations(state: any, action: FluxAction<any>): any;
}
