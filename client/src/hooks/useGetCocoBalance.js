import {useCallback, useContext} from 'react';
import to from 'await-to-js';
import {BridgeContext} from '../components/providers/bridgeProvider';
import {LoginContext} from '../LoginProvider';

export const useGetCocoBalance = () => {
  const {deroBridgeApi} = useContext(BridgeContext);
  const {setState} = useContext(LoginContext);

  const getCocoBalance = useCallback(async (cocoScid) => {
    if (deroBridgeApi && cocoScid) {
      try {
        const [err, res] = await to(deroBridgeApi.wallet("get-balance", {
            scid: cocoScid
          })
        );
        if (res && res.data) {
          console.log("balance:", res.data);
          setState((state) => ({...state, cocoBalance: res.data.result.balance}))
        }
      } catch(err) {
        console.log('Error: getCocoBalance', err);
      }
    }
  }, [deroBridgeApi])

  return {getCocoBalance}
}
