import React, {useContext} from 'react'
import {LoginContext} from '../LoginProvider';
import CryptoJS from 'crypto-js';
import Post from './post';


export default function FutureFeed(){

  const {state} = useContext(LoginContext);
    const [posts,setPosts] = React.useState([])
    const [feed,setFeed] = React.useState("")



    


    function hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
  }

  const getFeed = async (h)=>{
   
 var postArray = []
    let history = JSON.parse(h).filter(x=>x.payload_rpc)
    for(var i=0;i<history.length;i++){
     
   var post = await getPost(history[i].payload_rpc[0].value,history[i].payload_rpc[1].value)
   postArray.push(post)
   console.log(post)
    }
    console.log(history)
    setFeed(postArray.map(x=><div className="function"><Post post={x}/></div>))

  }


    const getPost = async (cid,key) => {
      let encryptedPost=""
      for await (const buf of state.ipfs.cat(cid)){
        try{
        encryptedPost = buf.toString()
      
       
        
    }catch(error){
      console.log(error)
    }
    
  console.log(typeof(encryptedPost),encryptedPost) // this returns what I put in for manual decryption 
    
      let decryptedPost=CryptoJS.AES.decrypt(encryptedPost.substring(1,encryptedPost.length-1),key).toString()


      console.log(decryptedPost)

        let post = JSON.parse(hex2a(decryptedPost))

        return post
    }
}

const handleFile = (e) => {
  const content = e.target.result;
  console.log('file content',  content)
  getFeed(content)
  // You can set content in state and show it in render.
}


const handleChangeFile = (file) => {
  let fileData = new FileReader();
  fileData.onloadend = handleFile;
  fileData.readAsText(file);
}




    
      return(
         <div>
          <input type="file" onChange={e=>handleChangeFile(e.target.files[0])}/>
          {feed?feed:""}
         </div>
      )

}
