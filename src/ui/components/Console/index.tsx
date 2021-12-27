import React, { useEffect, useState } from 'react';

import { addActionListener, removeListener } from '../../websockets';
import { useGlobalState } from '../../State';

function getProgress(string: string) {
  const str = string.replace(/\s+/g, ' ');
  const tokens = str.split(' ');
  return { msg: tokens[1], done: tokens[2], total: tokens[4] };
}

//-----------------------------------------------------
export const Console = (props: any) => {
  const [progPct, setProgressPct] = useState<string | 0>(0);
  const [finished, setFinished] = useState(false);
  const [op, setOp] = useState('');

  useEffect(() => {
    const listener = addActionListener('progress', ({ id, content }: { id: any; content: any }) => {
      if (content) {
        const { msg, done, total } = getProgress(content);
        const toPercent = () => ((parseInt(done, 10) / parseInt(total, 10)) * 100).toFixed(0);
        const completed = done == total;
        content = content.replace("Completed", "Fetching");
        content = content.replace("Finished", "Fetching");
        content = content.replace("\n", "");
        const progressPercentage = completed ? 0 : toPercent();
        setOp(completed ? '' : content);
        setProgressPct(progressPercentage);
        setFinished(completed);
      }
    });
    return () => removeListener(listener);
  }, []);

  if (finished) return <></>;

  return (
    <div>
      <progress style={{width: '800px', height: '30px'}} value={progPct} max='100'/>
      <div
        style={{
          backgroundColor: 'black',
          color: 'yellow',
          borderRadius: '4px',
          padding: '4px',
          minWidth: '800px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{fontFamily: 'Courier New,monospace'}}>{op}</div>
      </div>
    </div>
  );
};
