import React from 'react';

import {
  CheckCircleFilled,
  CloseCircleFilled,
  DownCircleFilled,
  RightCircleFilled,
  UpCircleFilled,
} from '@ant-design/icons';
import {
  Statement,
} from 'trueblocks-sdk';

export const ReconIcon = ({ statement }: { statement: Statement }) => {
  if (!statement) return <></>;
  let icon = <></>;
  if (statement.reconciled) {
    const okay = { color: 'green' };
    switch (statement.reconciliationType) {
      case 'partial-nextdiff':
        icon = <DownCircleFilled style={okay} />;
        break;
      case 'prevdiff-partial':
        icon = <UpCircleFilled style={okay} />;
        break;
      case 'partial-partial':
        icon = <RightCircleFilled style={okay} />;
        break;
      case 'regular':
      case 'by-trace':
      default:
        icon = <CheckCircleFilled style={okay} />;
        break;
    }
  } else {
    const notOkay = { color: 'red' };
    icon = <CloseCircleFilled style={notOkay} />;
  }
  return <div>{icon}</div>;
};
