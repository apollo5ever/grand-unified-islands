import {DeroDecimalPlaces, ZeroAddress} from '../enums/DeroContractConstants';
import hex2a from '../components/hex2a';

const varTypes = {
  string: 'S',
  number: 'U',
  String: 'S',
  Uint64: 'U'
}

export class ContractUtils {
  static packageContractPayload = (formData, name, code, args) => {
    let data = [];
    let currentDataSignature = '';
    let scRpcData = [];
    let transferData = [];
    let feeData = 0;
    // Move data into array I know how to access :) & create dependency string for useCallback -- TODO Modify to useRef??
    for (let [key, value] of formData.entries()) {
      currentDataSignature += value.replace(/\s+/g, '')
      data.push({'key': key, 'value': value})
    }

    // Add entry point
    scRpcData.push({name: 'entrypoint', datatype:'S', value: name})

    // Add any arg data to scPrcData & create any transferData objects for monetary fields
    data.forEach((element) =>  {
      switch (element.key) {
        case args.find(arg => arg.name === element.key)?.name:
          const currentArgType = varTypes[args.find(arg => arg.name === element.key).type];
          const dataValue = currentArgType === varTypes.number ? element.value.match(/\./g) ? parseFloat(element.value) : parseInt(element.value) : element.value
          scRpcData.push({name: element.key, datatype: currentArgType, value: dataValue})
          break;
        case 'deroAmount':
          if (element.value) {
            const wallet = data.find(item => item.key === 'destination')
            transferData.push({destination: wallet.value, burn: parseInt(element.value)})
          }
          break;
        case 'tokenAmount':
          if (element.value) {
            const assetScid = data.find(item => item.key === 'tokenScid')
            transferData.push({scid: assetScid.value, burn: parseInt(element.value)})
          }
          break;
        case 'fee':
          feeData = parseInt(element.value)
          break;
        default:
          if (element.key !== 'tokenScid' && element.key !== 'destination') {
            console.warn('ALERT - contract execution data not accounted for', element)
          }
          break;
      }
    })

    console.log('TransferDATA', transferData);

    return {scRpcData, transferData, feeData, currentDataSignature}
  }

  static getFunctionData = (codeBlock) => {
    // Regex's to extract elements of the contract code
    const functionSearch = /Function(.{1,}\r*\n){1,}End Function/gm
    const argSearch = /\(.*\)/
    const nameSearch = /\w+/g

    // Jump through some hoops to get rid of blank lines within each function
    const tempcode = codeBlock.split('End Function');
    let code = tempcode.reduce((compactedSegments, segment) => {
      let modifiedSegment = segment.split(/[\r\n]+/).join('\n');
      if (modifiedSegment.length) {
        compactedSegments.push(modifiedSegment.trim());
      }
      return compactedSegments;
    }, []).join('\nEnd Function\n\n').concat('\nEnd Function\n');

    // Create an array of the contract's functions
    let functionArray = code.match(functionSearch).map(item => new Object({"code": item}))

    // Extract elements from each function
    for (let f = 0; f < functionArray.length; f++) {
      functionArray[f].name = functionArray[f].code.match(nameSearch)[1]
      functionArray[f].args = (functionArray[f].code.match(argSearch)[0]).replace(/[()]/g,'').split(',').reduce((functionArgs, arg) => {
        const argItem = arg.trim().split(/\s+/);
        if (argItem[0]) {
          return [...functionArgs, {name: argItem[0], type: argItem[1]}]
        }
      }, [])
    }

    return functionArray;
  }

  static getBalances = (balances) => {
    let formattedBalances = [];
    const values = Object.values(balances);
    Object.keys(balances).forEach((balance, index) => {
      formattedBalances.push(new Object({'wallet': balance, 'value': values[index]}))
    });

    return formattedBalances
  }

  static getVariables = (stringKeys) => {
    return Object.keys(stringKeys).sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map(key => new Object({'name': key, 'value': stringKeys[key]}))
  }

  static getFundList = (stringKeys) => {
    let scData = this.getVariables(stringKeys)
    let search = new RegExp(`.*_bm`)
    return Object.keys(scData)
      .filter(key => search.test(key))
      .map(key => [hex2a(scData[key]), scData[key.substring(0, key.length - 2) + "E"], scData[key.substring(0, key.length - 2) + "T"], scData[key.substring(0, key.length - 2) + "J"], key.substring(0, key.length - 3), Object.keys(scData).filter(key2 => new RegExp(`${island+key.substring(key.length-4,key.length-3)}*_J[0-9]`).test(key2)), scData[key.substring(0, key.length - 2) + "JN"], scData[key.substring(0, key.length - 2) + "JE"], scData[key.substring(0, key.length - 2) + "JT"], Object.keys(scData).filter(key3 => new RegExp(`${island+key.substring(key.length-4,key.length-3)}*_X[0-9]`).test(key3)), scData[key.substring(0, key.length - 2) + "XN"], scData[key.substring(0, key.length - 2) + "XE"], scData[key.substring(0, key.length - 2) + "XT"], scData[key.substring(0, key.length - 2) + "X"], Object.keys(scData).filter(key4 => new RegExp(`${island+key.substring(key.length-4,key.length-3)}*_R_[0-9]`).test(key4)), Object.keys(scData).filter(key5 => new RegExp(`\\${island+key.substring(key.length-4,key.length-3)}\*_W_[0-9]`).test(key5)), scData[key.substring(0, key.length - 2) + "JF"]])
  }

  static atomicUnitsToDero = (atomicUnits) => {
    const factor = Math.pow(10, DeroDecimalPlaces.DERO_DECIMAL_PLACES);
    return atomicUnits / factor
  }

  static hexToString = (hexData) => {
    let hex  = hexData.toString();
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }

    return str;
  }
}