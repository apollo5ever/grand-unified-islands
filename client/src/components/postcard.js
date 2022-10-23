import React from 'react'

export default function PostCard(props) {

 

    
    return (
        <div className="PostCard" >
            <h1>{props.title} </h1>
            <p>{props.brief}</p>
            
        </div>
    )
}