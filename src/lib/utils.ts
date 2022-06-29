/**
 * A sample async function (to demo Typescript's es7 async/await down-leveling).
 *
 * ### Example (es imports)
 * ```js
 * import { asyncABC } from 'typescript-starter'
 * console.log(await asyncABC())
 * // => ['a','b','c']
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var double = require('typescript-starter').asyncABC;
 * asyncABC().then(console.log);
 * // => ['a','b','c']
 * ```
 *
 * @returns a Promise which should contain `['a','b','c']`
 */
export const asyncABC = async () => {
  const somethingSlow = (index: 0 | 1 | 2) => {
    const storage = 'abc'.charAt(index);
    return new Promise<string>((resolve) =>
      // later...
      resolve(storage)
    );
  };
  const a = await somethingSlow(0);
  const b = await somethingSlow(1);
  const c = await somethingSlow(2);
  return [a, b, c];
};

/**
 * Multiplies a value by 2. (Also a full example of TypeDoc's functionality.)
 *
 * ### Example (es module)
 * ```js
 * import { double } from 'typescript-starter'
 * console.log(double(4))
 * // => 8
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var double = require('typescript-starter').double;
 * console.log(double(4))
 * // => 8
 * ```
 *
 * @param value - Comment describing the `value` parameter.
 * @returns Comment describing the return type.
 * @anotherNote Some other value.
 */
export const double = (value: number) => {
  return value * 2;
};

/**
 * Raise the value of the first parameter to the power of the second using the
 * es7 exponentiation operator (`**`).
 *
 * ### Example (es module)
 * ```js
 * import { power } from 'typescript-starter'
 * console.log(power(2,3))
 * // => 8
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var power = require('typescript-starter').power;
 * console.log(power(2,3))
 * // => 8
 * ```
 * @param base - the base to exponentiate
 * @param exponent - the power to which to raise the base
 */
export const power = (base: number, exponent: number) => {
  /**
   * This es7 exponentiation operator is transpiled by TypeScript
   */
  return base ** exponent;
};

/**
 * Default max for random number generator.
 */
export const defaultMaxRandomNumber = 100;

/**
 * Return a random number between 0 and max. Default max is @see defaultMaxRandomNumber
 *
 * @param max maximum number to generate
 * @returns
 */
export const randomNumber = (max?: number): number =>
  Math.floor(Math.random() * (max || defaultMaxRandomNumber));

/**
 * Return a random element from the array.
 *
 * ```ts
 *  const randomFruit = randomElement<string>(['apple', 'banana', 'orange', 'melon'])
 * ```
 *
 * @param array options to choose from
 * @returns random element of provided array, typed as provided type or any
 */
export const randomElement = <T = unknown>(array: readonly T[]): T =>
  array[Math.floor(Math.random() * array.length)];
