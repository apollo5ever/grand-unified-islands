// Get Private Islands contract hook
import {useCallback, useContext} from 'react';
import to from 'await-to-js';
import {BridgeContext} from '../components/providers/bridgeProvider';
import {LoginContext} from '../LoginProvider';

export const useGetPIScid = () => {
  const {deroBridgeApi} = useContext(BridgeContext);
  const {setState} = useContext(LoginContext);

  const getPiContract = useCallback(async () => {
    console.log('GETTING SCID');
    let piScid = '';
    let cocoScid = '';
    if (deroBridgeApi) {
      try {
        const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
            scid: '0000000000000000000000000000000000000000000000000000000000000001',
            keysstring: ['keystore'],
          })
        );

        try {
          const keystore_scid = '80' + res.data.result.valuesstring[0].substring(2, 64);
          const [err2, res2] = await to(deroBridgeApi.daemon('get-sc', {
              scid: keystore_scid,
              keysstring: ['k:private.islands.scid', 'k:private.islands.coco'],
            })
          );

          piScid = res2.data.result.valuesstring[0];
          cocoScid = res2.data.result.valuesstring[1];
          console.log('SCID & COCOSCID', piScid, cocoScid);
          setState((state) => ({...state, scid: piScid, coco: cocoScid}))
        } catch (err2) {
          console.log('ERROR getPiContract: Could not get keystore_scid', err2)
        }
      } catch (err) {
        console.log('ERROR getPiContract: Could not get keystore', err)
      }
    }
  }, [deroBridgeApi]);

  return {getPiContract}
}