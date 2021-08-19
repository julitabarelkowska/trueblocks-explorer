import React from 'react';
import { createUseStyles } from 'react-jss';
import { useGlobalState } from '../../../State';

const themeList = [
  { theme: 'Blue on Black', primaryColor: 'lightblue', secondaryColor: 'black' },
  { theme: 'Yellow on Green', primaryColor: 'yellow', secondaryColor: 'forestgreen' },
  { theme: 'Orange on Black', primaryColor: 'orange', secondaryColor: 'black' },
];

const useStyles = createUseStyles({
  skinContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    cursor: 'pointer',
  },
  skinItem: {
    width: '400px',
    padding: '8px',
  },
  skinTitle: (theme: any) => ({
    borderBottom: theme ? `2px solid ${theme.primaryColor}` : '2px solid black',
  }),
});

export const Skins = () => {
  const { theme, setTheme } = useGlobalState();
  const styles = useStyles(theme);

  return (
    <div>
      <h2 className={styles.skinTitle}>Skins</h2>
      {themeList.map((theme) => (
        <div key={theme.theme} className={styles.skinContainer} onClick={() => setTheme(theme)}>
          <div style={{ backgroundColor: theme.secondaryColor }} className={styles.skinItem}>
            <div style={{ color: theme.primaryColor }}>{theme.theme}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
