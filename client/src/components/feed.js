import React from 'react'
import { NavLink ,Link} from 'react-router-dom';
import IslandCard from './islandCard';
import { LoginContext } from '../LoginContext';
import PostCard from './postcard';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';
import Post from './post';
import to from 'await-to-js';

export default function Feed(){
    const [posts,setPosts] = React.useState([])
    const [feed,setFeed] = React.useState("")
    const [state, setState] = React.useContext(LoginContext);
    const [formType, setFormType] = React.useState("cid");

    function hex2a(hex) {
        var str = '';
        for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    const getPost = async (e) => {
        e.preventDefault();
        let encryptedPost=""
        if(formType === 'cid'){
            for await (const buf of state.ipfs.cat(e.target.cid.value)){
                try{
                    encryptedPost = buf.toString()
                    let decryptedPost=CryptoJS.AES.decrypt(encryptedPost.substring(1,encryptedPost.length-1),e.target.key.value).toString()
                    let post = JSON.parse(hex2a(decryptedPost))
                    setFeed([<Post post={post}/>])
                }catch(error){
                    console.log(error)
                }
            }
        }else if(formType === 'txid'){
          const deroBridgeApi = state.deroBridgeApiRef.current
          const [err0, res0] = await to(deroBridgeApi.daemon('get-transaction', {
            "txs_hashes": [`${e.target.txid.value}`]
          }))
          var scData = res0.data.result.txs_as_hex[0]
           encryptedPost = scData.match(/3030303030(.*?)3030303030/)[1]
           console.log(encryptedPost)
           encryptedPost = hex2a(encryptedPost)
           console.log(encryptedPost)
           let decryptedPost = CryptoJS.AES.decrypt(encryptedPost,e.target.key.value).toString()
           console.log(decryptedPost)
           console.log(hex2a(decryptedPost))
  
           let post = JSON.parse(hex2a(decryptedPost))
           setFeed([<Post post={post}/>])
          
        }
    }

    return(
        <div>
            <button onClick={() => setFormType(formType === "cid" ? "txid" : "cid")}>Toggle Form</button>
            <form onSubmit={getPost}>
                <h3>Get Posts from your Dero TX History</h3>
                {formType === "cid" ? (
                    <>
                        <label>CID:</label>
                        <input id="cid" placeholder='cid' type='text'/>
                    </>
                ) : (
                    <>
                        <label>TXID:</label>
                        <input id="txid" placeholder='txid' type='text'/>
                    </>
                )}
                <label>Decryption Key:</label>
                <input id="key" placeholder='decryption key' type='text'/>
                <button type="submit">Get Post</button>
            </form>
            {feed?<div className="function">{feed}</div>:""}
        </div>
    );
}
