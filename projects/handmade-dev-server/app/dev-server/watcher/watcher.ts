import parcelWatcher, { type SubscribeCallback } from '@parcel/watcher';

interface Params {
  watchPaths: string[];
  subscribeCallback: SubscribeCallback;
}

export const watcher = async ({ watchPaths, subscribeCallback }: Params) => {
  const subscriptions = await Promise.all(
    watchPaths.map((path) => parcelWatcher.subscribe(path, subscribeCallback))
  );

  const cleanUp = async () => {
    await Promise.all(subscriptions.map((subs) => subs.unsubscribe()));
    console.info('[dev-server] 열려있는 watcher을 제거합니다.');
  };

  return cleanUp;
};
