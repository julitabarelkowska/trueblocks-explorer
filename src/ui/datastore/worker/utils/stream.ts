type ReadWholeStream = <StreamItem>(
  stream: ReadableStream<StreamItem>,
  onData: (item: StreamItem) => void,
  onDone?: () => void,
) => void;
export const readWholeStream: ReadWholeStream = async (stream, onData, onDone = () => { }) => {
  const reader = stream.getReader();

  await (async function readFromStream(): Promise<void> {
    const { done, value } = await reader.read();

    if (!value) {
      return Promise.resolve();
    }

    if (done) {
      onDone();
      return Promise.resolve();
    }

    onData(value);

    return readFromStream();
  }());
};

type GetStreamForArray = <ArrayItem>(array: ArrayItem[]) => ReadableStream<ArrayItem>;
export const getStreamForArray: GetStreamForArray = (array) => {
  let cancelled = false;
  let currentIndex = 0;

  const streamSource: UnderlyingSource = {
    pull(controller) {
      if (!Array.isArray(array) || cancelled) {
        controller.close();
        return;
      }

      if (currentIndex > array.length - 1) {
        controller.close();
      }

      currentIndex += 1;
      controller.enqueue(array[currentIndex]);
    },
    cancel() {
      cancelled = true;
    },
  };

  return new ReadableStream(streamSource);
};
