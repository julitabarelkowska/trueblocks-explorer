import React from 'react';
import { createUseStyles } from 'react-jss';

import {
  Button, Checkbox, Select,
} from 'antd';

import { useGlobalState } from '../../../../../State';
import { AccountViewParams } from '../../../Dashboard';
import {
  exportToCsv, exportToJson, exportToOfx, exportToTxt,
} from './Export';

export const ViewOptions = ({ params }: { params: AccountViewParams }) => {
  const { denom, setDenom } = useGlobalState();

  const styles = useStyles();
  const { userPrefs } = params;

  const onEther = () => {
    setDenom('ether');
  };

  const onDollars = () => {
    setDenom('dollars');
  };

  const onHideZero = () => {
    userPrefs.setHideZero(userPrefs.hideZero === 'hide' ? 'all' : 'hide');
  };
  const onShowZero = () => {
    userPrefs.setHideZero(userPrefs.hideZero === 'show' ? 'all' : 'show');
  };
  const onShowAll = () => {
    userPrefs.setHideZero(userPrefs.hideZero === 'all' ? 'hide' : 'all');
  };

  const onExportCSV = () => {
    exportToCsv(params.theData);
  };
  const onExportTXT = () => {
    exportToTxt(params.theData);
  };
  const onExportOFX = () => {
    exportToOfx(params.theData);
  };
  const onExportJson = () => {
    exportToJson(params.theData);
  };

  const repOptions = ['by tx', 'by hour', 'by day', 'by week', 'by month', 'by quarter', 'by year'];
  return (
    <div style={{ marginLeft: '2px' }}>
      <h3 className={styles.smallHeader}>options: </h3>
      <div className={styles.smallHeader}>order: </div>
      <Checkbox checked={userPrefs.showReversed} onChange={() => userPrefs.setShowReversed(!userPrefs.showReversed)}>
        reversed
      </Checkbox>
      <p />
      <div className={styles.smallHeader}>head: </div>
      <Checkbox checked={userPrefs.showStaging} onChange={() => userPrefs.setShowStaging(!userPrefs.showStaging)}>
        staging
      </Checkbox>
      <br />
      {/* TODO(tjayrush): should be unripe... */}
      <Checkbox checked={userPrefs.showUnripe} onChange={() => userPrefs.setShowUnripe(!userPrefs.showUnripe)}>
        unripe
      </Checkbox>
      <p />
      <div className={styles.smallHeader}>display: </div>
      <Select
        placeholder='Inserted are removed'
        value={userPrefs.period}
        onChange={(newValue) => userPrefs.setPeriod(newValue)}
        style={{ width: '100%' }}
      >
        {repOptions.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
      <Checkbox checked={userPrefs.hideNamed} onChange={() => userPrefs.setHideNamed(!userPrefs.hideNamed)}>
        unnamed
      </Checkbox>
      <br />
      <Checkbox
        checked={
          userPrefs.hideReconciled
        }
        onChange={() => userPrefs.setHideReconciled(!userPrefs.hideReconciled)}
      >
        unreconciled
      </Checkbox>
      <br />
      <Checkbox checked={userPrefs.showDetails} onChange={() => userPrefs.setShowDetails(!userPrefs.showDetails)}>
        details
      </Checkbox>
      <p />
      <div className={styles.smallHeader}>zero balance: </div>
      <Checkbox checked={userPrefs.hideZero === 'hide'} onChange={() => onHideZero()}>
        hide
      </Checkbox>
      <br />
      <Checkbox checked={userPrefs.hideZero === 'show'} onChange={() => onShowZero()}>
        show
      </Checkbox>
      <br />
      <Checkbox checked={userPrefs.hideZero === 'all'} onChange={() => onShowAll()}>
        show all
      </Checkbox>
      <p />
      <div className={styles.smallHeader}>denomination: </div>
      <Checkbox checked={denom === 'ether'} onChange={() => onEther()}>
        ether
      </Checkbox>
      <br />
      <Checkbox checked={denom === 'dollars'} onChange={() => onDollars()}>
        dollars
      </Checkbox>
      <p />
      <div className={styles.smallHeader}>export: </div>
      <Button onClick={onExportCSV} className={styles.exportBtn}>
        CSV...
      </Button>
      <Button onClick={onExportTXT} className={styles.exportBtn}>
        TXT...
      </Button>
      <Button onClick={onExportJson} className={styles.exportBtn}>
        JSON...
      </Button>
      <Button onClick={onExportOFX} className={styles.exportBtn}>
        QB...
      </Button>
    </div>
  );
};

const useStyles = createUseStyles({
  smallHeader: {
    fontWeight: 800,
    textDecoration: 'underline',
  },
  exportBtn: {
    margin: '0',
    padding: '1',
    paddingLeft: '8px',
    height: '30px',
    width: '70px',
    fontSize: '10pt',
    textAlign: 'left',
  },
});
