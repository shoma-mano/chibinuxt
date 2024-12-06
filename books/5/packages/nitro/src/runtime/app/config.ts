import destr from ".pnpm/destr@1.2.2/node_modules/destr/dist";

const runtimeConfig = process.env.RUNTIME_CONFIG as any;

for (const type of ["private", "public"]) {
  for (const key in runtimeConfig[type]) {
    runtimeConfig[type][key] = destr(
      process.env[key] || runtimeConfig[type][key]
    );
  }
}

const $config = (global.$config = {
  ...runtimeConfig.public,
  ...runtimeConfig.private,
});

export default {
  public: runtimeConfig.public,
  private: $config,
};
