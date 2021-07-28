import { addActionListener, removeListener } from '../../websockets';
import React, { useEffect, useState } from 'react';

function getProgress(string: string) {
  var str = string.replace(/\s+/g, ' ');
  var tokens = str.split(' ');
  return { msg: tokens[1], done: tokens[2], total: tokens[4] };
}

//-----------------------------------------------------
export const Console = (props: any) => {
  const [progPct, setProgressPct] = useState<string | 0>(0);
  const [finished, setFinished] = useState(false);
  const [op, setOp] = useState('');

  useEffect(() => {
    const listener = addActionListener('progress', ({ id, content }: { id: any; content: any }) => {
      //const {content} = content;
      if (content) {
        const { msg, done, total } = getProgress(content);
        const toPercent = () => ((parseInt(done) / parseInt(total)) * 100).toFixed(0);
        const finished = msg.includes('Finished') || msg.includes('Completed');
        const prevPct = progPct;
        const progressPercentage = finished ? 0 : toPercent();
        setOp(finished ? '' : content);
        setProgressPct(progressPercentage);
        setFinished(finished);
      }
    });
    return () => removeListener(listener);
  }, []);

  const item = props.asText ? <pre>Console: {op}</pre> : <progress max='100' value={progPct}></progress>;
  return (
    <>
      {props.asText ? (
        <div
          style={{
            backgroundColor: 'black',
            color: 'yellow',
            borderRadius: '4px',
            padding: '4px',
            minWidth: '600px',
            width: '50%',
            display: 'flex',
            alignItems: 'center',
          }}>
          {item}
        </div>
      ) : (
        <div style={{ ...props.style }}>{item}</div>
      )}
    </>
  );
};
