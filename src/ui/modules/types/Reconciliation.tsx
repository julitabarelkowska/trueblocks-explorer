import { Statement } from 'trueblocks-sdk';

//-----------------------------------------------------------------
export const priceReconciliation = (statementIn: Statement, denom: string) => {
  if (denom === 'ether') { return statementIn; }

  const statement: Statement = JSON.parse(JSON.stringify(statementIn));
  const properties: Array<keyof Statement> = [
    'prevBal',
    'begBal',
    'begBalDiff',
    'amountIn',
    'amountOut',
    'internalIn',
    'internalOut',
    'selfDestructIn',
    'selfDestructOut',
    'minerBaseRewardIn',
    'minerNephewRewardIn',
    'minerTxFeeIn',
    'minerUncleRewardIn',
    'prefundIn',
    'gasOut',
    'endBal',
    'endBalCalc',
    'endBalDiff',
    'amountNet',
    'totalIn',
    'totalOut',
    'totalOutLessGas',
  ];

  properties.forEach((property) => {
    const value = statementIn[property] as string;

    // TODO: the line below should probably use BigNum/BigInt for safe arithmetics
    const computed = String((parseFloat(value) || 0) * statementIn.spotPrice);
    (statement[property] as unknown) = computed;
  });

  return statement;
};
