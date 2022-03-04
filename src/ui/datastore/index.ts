/* eslint-disable @typescript-eslint/no-unused-vars, no-restricted-globals */

// Following three lines are required to enable global `connect` function,
// which in turn is needed for the worker to successfully register itself
export { };
declare global {
  function onconnect(e: MessageEvent): void
}

self.onconnect = function connectionHandler(e: MessageEvent) {
  const port = e.ports[0];

  port.addEventListener('message', (e2) => {
    console.log('Worker: got message');
    const workerResult = `Result: ${e2.data[0] * e2.data[1]}`;
    port.postMessage(workerResult);
  });

  port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
};
