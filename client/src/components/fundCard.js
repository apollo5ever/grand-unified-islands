import React from 'react'

export default function FundCard(props) {

    var deadline = new Date(props.deadline*1000)
    var deadlinestring = (deadline.getMonth()+1).toString()+"/"+deadline.getDate().toString()

    
    return (
        <div className="ProfileCard" >
            <h1>{props.name}</h1>
            <h3>Initiated by {props.profile}</h3>
            <img src={props.image}/>
            <p>{props.tagline}</p>
            <p>Goal:{props.goal} Dero by {deadlinestring} </p>
            <b>Click to See More</b>
        </div>
    )
}