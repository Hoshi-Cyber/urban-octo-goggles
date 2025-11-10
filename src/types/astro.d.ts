// Minimal shim so TS accepts `.astro` imports in .ts/.tsx barrels
declare module "*.astro" {
  const Component: any;
  export default Component;
}
