import React from 'react'

export default function IslandCard(props) {
    return (
        <div className="ProfileCard" > 
            <h1>{props.name}</h1>
            <img src={props.image}/>
            <p>{props.tagline}</p>
            <b>Click to See More</b>
        </div>
    )
}