import {useCallback, useContext} from 'react';
import to from 'await-to-js';
import {BridgeContext} from '../components/providers/bridgeProvider';
import {LoginContext} from '../LoginProvider';

export const useGetRandomAddress = () => {
  const {deroBridgeApi} = useContext(BridgeContext);
  const {setState} = useContext(LoginContext);

  const getRandomAddress = useCallback(async () => {
    if (deroBridgeApi) {
      try {
        const [err, res] = await to(deroBridgeApi.daemon('get-random-address', {}));

        if (res && err === null) {
          setState((state) => ({...state, randomAddress: res.data.result.address[0]}))
        }
      } catch(err) {
        console.log('Error: get-random-address-error', err);
      }
    }
  }, [deroBridgeApi]);

  return {getRandomAddress}
}