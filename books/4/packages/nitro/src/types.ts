import type { $Fetch } from ".pnpm/ohmyfetch@0.1.8_encoding@0.1.13/node_modules/ohmyfetch/dist";

declare global {
  const $fetch: $Fetch;

  namespace NodeJS {
    interface Global {
      $fetch: $Fetch;
    }
  }
}
