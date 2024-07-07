import { lazy, Suspense, useEffect, useState } from 'react';

const useDynamicScript = (args: any) => {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement('script');

    element.src = args.url;
    element.type = 'text/javascript';
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      setReady(true);
    };

    element.onerror = () => {
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      document.head.removeChild(element);
    };
  }, [args.url]);

  return {
    ready,
    failed,
  };
};

const loadComponent = (scope: any, module: any) => {
  return async () => {
    //@ts-ignore
    await __webpack_init_sharing__('default');
    const container = window[scope]; // or get the container somewhere else
    //@ts-ignore
    await container.init(__webpack_share_scopes__.default);
    const factory = await (window[scope] as any).get(module);

    return factory();
  };
};

export function MicroAppLoader({
  scope,
  module,
  url,
}: {
  scope: string;
  module: string;
  url: string;
}) {
  const { ready, failed } = useDynamicScript({
    url: module && url,
  });

  if (!module) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {url}</h2>;
  }

  const Component = lazy(loadComponent(scope, module));

  return (
    <Suspense fallback={`Loading Module ${module}`}>
      <Component />
    </Suspense>
  );
}
