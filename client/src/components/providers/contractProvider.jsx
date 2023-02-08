import {createContext, useState} from 'react';

export const ContractContext = createContext({});

export const ContractProvider = ({children}) => {
  const [functions, functionsSet] = useState([])
  const [contractVars, contractVarsSet] = useState(null)
  const [stringKeys, stringKeysSet] = useState(null)
  const [displayVars, displayVarsSet] = useState(false)
  const [balanceList, balanceListSet] = useState(null)
  const [hasData, hasDataSet] = useState(false)
  const [scid, scidSet] = useState(true)
  const [cSymbols, cSymbolsSet] = useState([])


  // State for when executing a contract function
  const [dataString, dataStringSet] = useState('');

  const context = {
    functions, functionsSet,
    contractVars, contractVarsSet,
    stringKeys, stringKeysSet,
    displayVars, displayVarsSet,
    balanceList, balanceListSet,
    hasData, hasDataSet,
    scid, scidSet,
    dataString, dataStringSet,
    cSymbols, cSymbolsSet
  }

  return (
    <ContractContext.Provider value={context}>{children}</ContractContext.Provider>
  )
}