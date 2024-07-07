export interface MfPluginOptions {
  name: string;
  exposes?: Record<string, string>;
  remotes?: Record<string, string>;
  shared?: Record<string, any>;
}
