import React from 'react'
import { useSearchParams } from 'react-router-dom'

export default function About() {

 const [searchParams,setSearchParams] = useSearchParams()


    

      
    
    return (
        <div className="function" >
          <h1>Welcome to Private Islands</h1>
          <div className="icons">
               <div className="icons-treasure" onClick={()=>{setSearchParams({view:"features"})}}><div className="icons-text">Features</div></div><div className="icons-signal" onClick={()=>{setSearchParams({view:"constitution"})}}><div className="icons-text">Constitution</div></div><div className="icons-mail" onClick={()=>{setSearchParams({view:"documentation"})}}><div className="icons-text">Documentation</div></div>
          </div>
          
          {searchParams.get("view")=="features"?<><h2>What We Offer</h2>
          <p>Private Islands is gradually becoming the world's most resilient financial support network. All data is stored in a decentralized, censorship-resistant manner. Flow of funds is directed by smart contract, making it transparent and trustless. The currency of choice here is Dero, meaning once the money is raised, subsequent transactions are private. We offer three different models of financial support.</p>

          <h3>Buried Treasure Bounties</h3>
          <p>When there is a task you'd like to see completed, create a Buried Treasure Bounty. Dero is stored in the smart contract until someone completes the task. Once created, anyone can add Dero to the bounty. The judge decides who has earned the treasure. It can be multiple people. The executer approves or vetos the judge's decision. If nobody is chosen to receive the treasure before the expiration date, donors can retrieve their funds.</p>
          <h3>Smoke Signal Fundraisers</h3>
          <p>When you need to raise money for your cause, use a Smoke Signal Fundraiser. Set a goal, and a deadline. Users donate dero, which is then stored in the contract. If the goal is met, dero is sent to the fundee. If the deadline is past and the goal is not met, users are refunded.<a href="https://odysee.com/@apollo5ever:1/private-islands-ssf-demo:3" target="_blank">Video</a></p>
          <h3>Message-in-a-Bottle Subscriptions</h3>
          <p>If you have something to offer on a subscription-basis, create a Message-in-a-Bottle subscription tier. Specify an amount and an interval. For example, 10 Dero per month for access to a newsletter. When you create content for your subscribers, it is encrypted and stored with filecoin and ipfs. Subscribers receive cid and decryption key via dero transaction.<a href="https://odysee.com/@apollo5ever:1/private-islands-mib-demo:4" target="_blank">Video</a></p></>
          :searchParams.get("view")=="constitution"?
          <>
            <h3>Our Mission</h3>
          <p>
            We are building the world's most resilient support network. A place where people can come together to support projects without fear that their funds will be seized or their networks wiped. We've seen legacy platforms like Patreon ban users for differences of opinion. When this happens, creator-supporter relationships are deleted. Here on Private Islands, creator-supporter relationships are stored on the Dero blockchain. We've also seen legacy platforms like GoFundMe confiscate funds over differences of opinion. Here funds are either sent directly to their recipient, or in some cases they are held in a smart contract for a period of time. We've also seen how fundraising with Bitcoin is susceptible to blacklisting and confiscation. That's why we've decided to build on the only private chain with smart contracts, Dero.
          </p>
          </>
          :searchParams.get("view")=="documentation"?
          <>
           <h3>How Do I Start?</h3>

<p>In order to use this website you need two things.</p><ol><li>A Dero wallet running with the rpc-server turned on.</li><li>The Dero RPC Bridge Extension<a href="https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd" target="_blank" rel="noopener noreferrer">(chrome store)</a><a href="https://addons.mozilla.org/en-CA/firefox/addon/dero-rpc-bridge/" target="_blank">(firefox)</a></li></ol> 

          </>
          :""}

        
        
         
            
        </div>
    )
}