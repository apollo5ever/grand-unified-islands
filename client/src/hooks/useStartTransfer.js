import {useCallback, useContext} from 'react';
import to from 'await-to-js';
import {BridgeContext} from '../components/providers/bridgeProvider';
import {ContractContext} from '../components/providers/contractProvider';

// Hardcoding for now
const RINGSIZE = 2;

export const useStartTransfer = () => {
  const {deroBridgeApi} = useContext(BridgeContext);
  const {dataString} = useContext(ContractContext);

  const callContract = useCallback(async (scid, scRpc, transfers, fee) => {

    let payload = {scid: scid, ringsize: RINGSIZE, sc_rpc: scRpc}
    if (fee) {
      payload = {fees: fee, ...payload}
    }
    if (transfers.length) {
      payload = {transfers: transfers, ...payload}
    }

    if (scRpc.length) {
      const [err, res] = await to(deroBridgeApi.wallet('start-transfer', payload))
    }
  }, [dataString])

  return {callContract}
}