import React, { useEffect, useState } from 'react';

import { useGlobalState } from '../../State';
import { addActionListener, removeListener } from '../../websockets';

function getProgress(string: string) {
  const str = string.replace(/\s+/g, ' ');
  const tokens = str.split(' ');
  return { done: tokens[2], total: tokens[4] };
}

//-----------------------------------------------------
export const Console = () => {
  const [progPct, setProgressPct] = useState<string | 0>(0);
  const [finished, setFinished] = useState(false);
  const [op, setOp] = useState('');

  useEffect(() => {
    const listener = addActionListener('progress', ({ id, content }: { id: any; content: string }) => {
      if (content) {
        const { done, total } = getProgress(content);
        const toPercent = () => ((parseInt(done, 10) / parseInt(total, 10)) * 100).toFixed(0);

        const completed = done === total;
        setFinished(completed);

        const progressPercentage = completed ? 0 : toPercent();
        setProgressPct(progressPercentage);

        let display = content.replace('\n', '');
        display = display.replace('\r', '');
        display = display.replace('Completed', 'Fetching');
        setOp(completed ? '' : display);
      }
    });
    return () => removeListener(listener);
  }, []);

  if (finished) return <></>;

  return (
    <div>
      <progress style={{ width: '800px', height: '25px' }} value={progPct} max='100' />
      <div
        style={{
          backgroundColor: 'black',
          color: 'yellow',
          borderRadius: '4px',
          padding: '2px',
          minWidth: '800px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <pre style={{ display: 'inline' }}>{op}</pre>
      </div>
    </div>
  );
};
