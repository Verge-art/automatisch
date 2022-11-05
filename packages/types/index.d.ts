import type { AxiosInstance, AxiosRequestConfig } from 'axios';
export type IHttpClient = AxiosInstance;

// Type definitions for automatisch

export type IJSONValue = string | number | boolean | IJSONObject | IJSONArray;
export type IJSONArray = Array<IJSONValue>;
export interface IJSONObject {
  [x: string]: IJSONValue;
}

export interface IConnection {
  id: string;
  key: string;
  data: string;
  formattedData?: IJSONObject;
  userId: string;
  verified: boolean;
  count?: number;
  flowCount?: number;
  appData?: IApp;
  createdAt: string;
}

export interface IExecutionStep {
  id: string;
  executionId: string;
  stepId: IStep['id'];
  step: IStep;
  dataIn: IJSONObject;
  dataOut: IJSONObject;
  errorDetails: IJSONObject;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IExecution {
  id: string;
  flowId: string;
  flow: IFlow;
  testRun: boolean;
  executionSteps: IExecutionStep[];
  updatedAt: string;
  createdAt: string;
}

export interface IStep {
  id: string;
  name?: string;
  flowId: string;
  key?: string;
  appKey?: string;
  iconUrl: string;
  type: 'action' | 'trigger';
  connectionId?: string;
  status: string;
  position: number;
  parameters: IJSONObject;
  connection?: Partial<IConnection>;
  flow: IFlow;
  executionSteps: IExecutionStep[];
  // FIXME: remove this property once execution steps are properly exposed via queries
  output?: IJSONObject;
  appData?: IApp;
}

export interface IFlow {
  id: string;
  name: string;
  userId: string;
  active: boolean;
  steps: IStep[];
  createdAt: string;
  updatedAt: string;
  lastInternalId: () => Promise<string>;
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  connections: IConnection[];
  flows: IFlow[];
  steps: IStep[];
}

export interface IFieldDropdown {
  key: string;
  label: string;
  type: 'dropdown';
  required: boolean;
  readOnly?: boolean;
  value?: string | boolean;
  placeholder?: string | null;
  description?: string;
  docUrl?: string;
  clickToCopy?: boolean;
  variables?: boolean;
  dependsOn?: string[];
  options?: IFieldDropdownOption[];
  source?: IFieldDropdownSource;
}

export interface IFieldDropdownSource {
  type: string;
  name: string;
  arguments: {
    name: string;
    value: string;
  }[];
}

export interface IFieldDropdownOption {
  label: string;
  value: boolean | string | number;
}

export interface IFieldText {
  key: string;
  label: string;
  type: 'string';
  required?: boolean;
  readOnly?: boolean;
  value?: string;
  placeholder?: string | null;
  description?: string;
  docUrl?: string;
  clickToCopy?: boolean;
  variables?: boolean;
  dependsOn?: string[];
}

export type IField = IFieldDropdown | IFieldText;

export interface IAuthenticationStepField {
  name: string;
  value: string | null;
  properties?: {
    name: string;
    value: string;
  }[];
}

export interface IAuthenticationStep {
  type: 'mutation' | 'openWithPopup';
  name: string;
  arguments: IAuthenticationStepField[];
}

export interface IApp {
  name: string;
  key: string;
  iconUrl: string;
  docUrl?: string;
  authDocUrl: string;
  primaryColor: string;
  supportsConnections: boolean;
  apiBaseUrl: string;
  baseUrl: string;
  auth?: IAuth;
  connectionCount?: number;
  flowCount?: number;
  beforeRequest?: TBeforeRequest[];
  data?: IData;
  triggers?: ITrigger[];
  actions?: IAction[];
  connections?: IConnection[];
}

export type TBeforeRequest = {
  ($: IGlobalVariable, requestConfig: AxiosRequestConfig): AxiosRequestConfig;
};

export interface IData {
  [index: string]: any;
}

export interface IAuth {
  createAuthData?($: IGlobalVariable): Promise<void>;
  verifyCredentials($: IGlobalVariable): Promise<any>;
  isStillVerified($: IGlobalVariable): Promise<boolean>;
  fields: IField[];
  authenticationSteps: IAuthenticationStep[];
  reconnectionSteps?: IAuthenticationStep[];
}

export interface IService {
  authenticationClient?: IAuthentication;
  triggers?: any;
  actions?: any;
  data?: any;
}

export interface ITriggerOutput {
  data: ITriggerItem[];
  error?: IJSONObject;
}

export interface ITriggerItem {
  raw: IJSONObject;
  meta: {
    internalId: string;
  };
}

export interface IBaseTrigger {
  name: string;
  key: string;
  pollInterval?: number;
  description: string;
  getInterval?(parameters: IStep['parameters']): string;
  run($: IGlobalVariable): Promise<void>;
  sort?(item: ITriggerItem, nextItem: ITriggerItem): number;
}

export interface IRawTrigger extends IBaseTrigger {
  arguments?: IField[];
}

export interface ITrigger extends IBaseTrigger {
  substeps?: ISubstep[];
}

export interface IActionOutput {
  data: IActionItem;
  error?: IJSONObject;
}

export interface IActionItem {
  raw: IJSONObject;
}

export interface IBaseAction {
  name: string;
  key: string;
  description: string;
  run($: IGlobalVariable): Promise<void>;
}

export interface IRawAction extends IBaseAction {
  arguments?: IField[];
}

export interface IAction extends IBaseAction {
  substeps?: ISubstep[];
}

export interface IAuthentication {
  client: unknown;
  verifyCredentials(): Promise<IJSONObject>;
  isStillVerified(): Promise<boolean>;
}

export interface ISubstep {
  key: string;
  name: string;
  arguments?: IField[];
}

export type IHttpClientParams = {
  $: IGlobalVariable;
  baseURL?: string;
  beforeRequest?: TBeforeRequest[];
};

export type IGlobalVariable = {
  auth: {
    set: (args: IJSONObject) => Promise<null>;
    data: IJSONObject;
  };
  app: IApp;
  http?: IHttpClient;
  flow?: {
    id: string;
    lastInternalId: string;
    isAlreadyProcessed?: (internalId: string) => boolean;
  };
  step?: {
    id: string;
    appKey: string;
    parameters: IJSONObject;
  };
  nextStep?: {
    id: string;
    appKey: string;
    parameters: IJSONObject;
  };
  execution?: {
    id: string;
    testRun: boolean;
  };
  triggerOutput?: ITriggerOutput;
  actionOutput?: IActionOutput;
  pushTriggerItem?: (triggerItem: ITriggerItem) => void;
  setActionItem?: (actionItem: IActionItem) => void;
};

declare module 'axios' {
  interface AxiosResponse {
    httpError?: IJSONObject;
  }

  interface AxiosRequestConfig {
    additionalProperties?: Record<string, unknown>;
  }
}
