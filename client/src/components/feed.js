import React from 'react'
import { NavLink ,Link} from 'react-router-dom';
import IslandCard from './islandCard';
import { LoginContext } from '../LoginContext';
import PostCard from './postcard';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';
import Post from './post';


export default function Feed(){

    const [posts,setPosts] = React.useState([])
    const [feed,setFeed] = React.useState("")
    const [state, setState] = React.useContext(LoginContext);

    function hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
  }


    const getPost = async (e) => {
      e.preventDefault();
      let encryptedPost=""
      for await (const buf of state.ipfs.cat(e.target.cid.value)){
        try{
        encryptedPost = buf.toString()
      
       
        
    }catch(error){
      console.log(error)
    }
    
  console.log(typeof(encryptedPost),encryptedPost) // this returns what I put in for manual decryption 
    
      let decryptedPost=CryptoJS.AES.decrypt(encryptedPost.substring(1,encryptedPost.length-1),e.target.key.value).toString()


      console.log(decryptedPost)

        let post = JSON.parse(hex2a(decryptedPost))

        setFeed([<Post post={post}/>])
        
       



  }
}








    
      return(
         <div>
          <form onSubmit={getPost}>
            <h3>Get Posts from your Dero TX History</h3>
            <input id="cid" placeholder='cid' type='text'/>
            <input id="key" placeholder='decryption key' type='text'/>
            <button type="submit">Get Post</button>
          </form>
          {feed?<div className="function">{feed}</div>:""}
         </div>
      )

}
