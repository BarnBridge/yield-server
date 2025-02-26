const sdk = require('@defillama/sdk');
const axios = require('axios');
const utils = require('../utils');

const token = '0xc3d088842dcf02c13699f936bb83dfbbc6f721ab';
const weth = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const getApy = async () => {
  const tvl =
    (await sdk.api.erc20.totalSupply({ target: token })).output / 1e18;

  const vToken = await utils.getData('https://api.bifrost.app/api/site');

  const priceKeys = [
    'ethereum',
    'filecoin',
    'polkadot',
    'kusama',
    'bifrost-native-coin',
    'moonbeam',
    'moonriver',
  ]
    .map((t) => `coingecko:${t}`)
    .join(',');
  const { coins: prices } = await utils.getData(
    `https://coins.llama.fi/prices/current/${priceKeys}`
  );

  const vDOT = {
    pool: 'polkadot-vdot',
    chain: 'Polkadot',
    project: 'bifrost-liquid-staking',
    symbol: 'vDOT',
    tvlUsd: vToken.vDOT.tvm * prices['coingecko:polkadot'].price,
    apyBase: Number(vToken.vDOT.apyBase),
    apyReward: Number(vToken.vDOT.apyReward),
    rewardTokens: ['DOT'],
  };

  const vGLMR = {
    pool: 'moonbeam-vglmr',
    chain: 'Moonbeam',
    project: 'bifrost-liquid-staking',
    symbol: 'vGLMR',
    tvlUsd: vToken.vGLMR.tvm * prices['coingecko:moonbeam'].price,
    apyBase: Number(vToken.vGLMR.apyBase),
    apyReward: Number(vToken.vGLMR.apyReward),
    rewardTokens: ['GLMR'],
  };

  const vFIL = {
    pool: 'filecoin-vfil',
    chain: 'Filecoin',
    project: 'bifrost-liquid-staking',
    symbol: 'vFIL',
    tvlUsd: vToken.vFIL.tvm * prices['coingecko:filecoin'].price,
    apyBase: Number(vToken.vFIL.apyBase),
    apyReward: Number(vToken.vFIL.apyReward),
    rewardTokens: ['FIL'],
  };

  const vMOVR = {
    pool: 'moonriver-vmovr',
    chain: 'Moonriver',
    project: 'bifrost-liquid-staking',
    symbol: 'vMOVR',
    tvlUsd: vToken.vMOVR.tvm * prices['coingecko:moonriver'].price,
    apyBase: Number(vToken.vMOVR.apyBase),
    apyReward: Number(vToken.vMOVR.apyReward),
    rewardTokens: ['MOVR'],
  };

  const vBNC = {
    pool: 'bifrost-vbnc',
    chain: 'Bifrost',
    project: 'bifrost-liquid-staking',
    symbol: 'vBNC',
    tvlUsd: vToken.vBNC.tvm * prices['coingecko:bifrost-native-coin'].price,
    apyBase: Number(vToken.vBNC.apyBase),
    apyReward: Number(vToken.vBNC.apyReward),
    rewardTokens: ['BNC'],
  };

  const vKSM = {
    pool: 'kusama-vksm',
    chain: 'Kusama',
    project: 'bifrost-liquid-staking',
    symbol: 'vKSM',
    tvlUsd: vToken.vKSM.tvm * prices['coingecko:kusama'].price,
    apyBase: Number(vToken.vKSM.apyBase),
    apyReward: Number(vToken.vKSM.apyReward),
    rewardTokens: ['KSM'],
  };

  const vETH = {
    pool: token,
    chain: 'ethereum',
    project: 'bifrost-liquid-staking',
    symbol: 'veth',
    tvlUsd: tvl * prices['coingecko:ethereum'].price,
    apyBase: vToken.vETH.stakingApy,
    apyReward: Number(vToken.vETH.mevApy) + Number(vToken.vETH.gasFeeApy),
    underlyingTokens: [weth],
    rewardTokens: ['ETH'],
  };

  return [vETH, vDOT, vGLMR, vMOVR, vKSM, vBNC, vFIL];
};

module.exports = {
  timetravel: false,
  apy: getApy,
  url: 'https://bifrost.app/vstaking',
};
