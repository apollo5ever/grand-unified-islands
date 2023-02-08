import {useCallback, useContext} from 'react';
import to from 'await-to-js';
import {BridgeContext} from '../components/providers/bridgeProvider';
import {ContractContext} from '../components/providers/contractProvider';
import {ContractUtils} from '../utils/contractHelper';
import {IslandUtils} from '../utils/islandHelper';

/*
 This hook will query the chain to get all the data from provided contract
 By default we don't bother fetching & parsing the functions themselves

 The parsed data from the contract is assigned to the ContractContext for reference
 Note: stringKeys === the data returned from the contract, the variables, as 'stringkeys'
       contractVars is the same data, but formatted into an name & value object
 */
export const useGetContractData = () => {
  const {deroBridgeApi} = useContext(BridgeContext);
  const {scidSet, hasDataSet, balanceListSet, contractVarsSet, functionsSet, stringKeys, stringKeysSet} = useContext(ContractContext);

  const getContractData = useCallback(async (contractId, code = false) => {
    let contractData = undefined;
    hasDataSet(false);
    const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
      scid: contractId,
      code: code,
      variables: true
    }))

    // If err, status not 'OK', or no contract data, let's try w/out bridge using community node
    if (err || (res && res.data.result.status !== 'OK')) {
      console.log('GETTING Contract data from community node')
      contractData = await IslandUtils.getPrivateIslandFromCommunityNode()
    }  else {
      contractData = res.data;
    }

    if (contractData) {
      scidSet(contractId)
      if (code) {
        functionsSet(ContractUtils.getFunctionData(contractData.result.code))
      }
      contractVarsSet(ContractUtils.getVariables(contractData.result.stringkeys))
      stringKeysSet(contractData.result.stringkeys)
      balanceListSet(ContractUtils.getBalances(contractData.result.balances))
      hasDataSet(true);
    }
  }, [deroBridgeApi])

  return {getContractData}
}