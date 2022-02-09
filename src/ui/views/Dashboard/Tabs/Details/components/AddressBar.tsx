import React from 'react';
import { createUseStyles } from 'react-jss';

import {
  Progress,
} from 'antd';

import { useGlobalNames, useGlobalState } from '../../../../../State';
import { AccountViewParams } from '../../../Dashboard';

export const AddressBar = ({ params }: { params: AccountViewParams }) => {
  const styles = useStyles();
  const { currentAddress } = useGlobalState();
  const { namesMap } = useGlobalNames();

  if (!namesMap || !currentAddress) return <></>;
  if (namesMap.get(currentAddress)?.name === undefined) return <></>;

  return (
    <div className={styles.currentAddr}>
      <h3>
        {`${namesMap.get(currentAddress)?.name} (${currentAddress})`}
      </h3>
      <div>
        <ProgressBar params={params} />
      </div>
      <div />
    </div>
  );
};

const ProgressBar = ({ params }: { params: AccountViewParams }): JSX.Element => {
  const { theData, totalRecords } = params;
  if (!theData) return <></>;
  if (!totalRecords) return <></>;
  if (theData.length === totalRecords) return <></>;
  const done = (totalRecords - theData.length) === 1; // for some reason, it's off by one
  if (done) return <></>;

  const pct = Math.floor((theData.length / (totalRecords || 1)) * 100);
  return (
    <div>
      <Progress style={{ display: 'inline' }} percent={pct} strokeLinecap='square' />
    </div>
  );
};

const useStyles = createUseStyles({
  currentAddr: {
    marginLeft: '300px',
    marginTop: '-50px',
    paddingLeft: '10px',
    fontSize: '16pt',
    backgroundColor: '#fafafa',
    width: '80%',
    border: 'groove 2px #f0f0f0',
    display: 'grid',
    gridTemplateColumns: '20fr 4fr 1fr',
    alignItems: 'center',
  },
});
