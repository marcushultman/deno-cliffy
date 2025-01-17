/** Parse settings. */
export interface IParseOptions {
  flags?: IFlagOptions[];
  parse?: ITypeHandler<unknown>;
  knownFlaks?: Record<string, unknown>;
  stopEarly?: boolean;
  allowEmpty?: boolean;
}

/** Flag settings. */
export interface IFlagOptions extends IFlagArgument {
  name: string;
  args?: IFlagArgument[];
  aliases?: string[];
  standalone?: boolean;
  default?: IDefaultValue;
  required?: boolean;
  depends?: string[];
  conflicts?: string[];
  value?: IFlagValueHandler;
  collect?: boolean;
}

/** Flag argument definition. */
export interface IFlagArgument {
  type?: OptionType | string;
  optionalValue?: boolean;
  requiredValue?: boolean;
  variadic?: boolean;
  list?: boolean;
  separator?: string;
}

/** Available build-in argument types. */
export enum OptionType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
}

/** Default flag value */
export type IDefaultValue = unknown | (() => unknown);

/** Value handler for custom value processing. */
// deno-lint-ignore no-explicit-any
export type IFlagValueHandler = (val: any, previous?: any) => any;

/** Result of the parseFlags method. */
export interface IFlagsResult<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> = Record<string, any>,
> {
  flags: O;
  unknown: string[];
  literal: string[];
}

export interface ITypeInfo {
  label: string;
  type: string;
  name: string;
  value: string;
}

/** Custom type handler/parser. */
// deno-lint-ignore no-explicit-any
export type ITypeHandler<T = any> = (type: ITypeInfo) => T;
