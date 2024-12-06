import { Color } from ".pnpm/chalk@4.1.2/node_modules/chalk";

export interface CliOptions {
  badgeMessages: string[];
  bannerColor: typeof Color;
}

export default (): CliOptions => ({
  badgeMessages: [],
  bannerColor: "green",
});
