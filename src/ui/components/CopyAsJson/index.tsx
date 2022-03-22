import React from 'react';

import { CopyTwoTone } from '@ant-design/icons';
import { Button } from 'antd';

export const CopyAsJson = ({ content }: { content: {} }) => (
  <Button
    onClick={() => navigator.clipboard.writeText(JSON.stringify(content))}
    icon={<CopyTwoTone />}
  >
    Copy
  </Button>
);
