import React from 'react'

export default function IslandCard(props) {
    return (

<div class="profile-card">

<div class="profile-card__back">
  <p>{props.tagline}</p>
</div>

<div class="profile-card__front">
 <img src={props.image}/>
 <h2>{props.name}</h2>
</div>
</div>

    )
}