import {useCallback, useContext} from 'react';
import to from 'await-to-js';
import {BridgeContext} from '../components/providers/bridgeProvider';
import {LoginContext} from '../LoginProvider';
import {ContractUtils} from '../utils/contractHelper';

export const useGetMyIslands = () => {
  const {deroBridgeApi} = useContext(BridgeContext);
  const {state, setState} = useContext(LoginContext);

  const getMyIslands = useCallback(async (scid) => {
    if (deroBridgeApi && scid) {
      try {
        const [err, res] = await to(deroBridgeApi.daemon("get-sc", {
            scid: scid,
            variables: true,
          })
        );

        // Filter data to get _O (owner) ids
        const search = new RegExp(`.*_O`);
        const scData = res.data.result.stringkeys; //.map(x=>x.match(search))
        let myIslands = [];

        /**
         * Filter owner address to those that match the connected user wallet/address
         * @type {[j: number, meta: hex, name: string]}
         *  j: ?
         *  meta: ipfs id
         *  name: User defined island name
         */
        const myList = Object.keys(scData)
          .filter((ownerAddress) => search.test(ownerAddress))
          .filter((ownerAddress) => ContractUtils.hexToString(scData[ownerAddress]) === state.userAddress)
          .map(
            (ownerAddress) =>
              new Object({
                name: ownerAddress.substring(0, ownerAddress.length - 2),
                meta: ContractUtils.hexToString(scData[`${ownerAddress.substring(0, ownerAddress.length - 2)}_M`]),
                j: scData[`${ownerAddress.substring(0, ownerAddress.length - 2)}_j`],
              })
          );

        for (let i = 0; i < myList.length; i++) {
          let ipfsID = myList[i].meta;
          let j = myList[i].j;  // TODO MTS - what is 'j'?  It is an integer assigned somewhere, but what does it represent?
          for await (const buf of state.ipfs.cat(ipfsID)) {
            let metaData = await JSON.parse(buf.toString());
            metaData.j = j;
            myIslands.push(metaData);
          }
        }

        /*
         * myIslands
         * @type{[bio: string, image: url, name: string, tagline: string, tiers: Array]}
         */
        setState((state) => ({...state, myIslands: myIslands, active: 0}));
      } catch(err) {
        console.log('ERROR: getMyIslands', err);
      }
    }
  });

  return {getMyIslands}
}