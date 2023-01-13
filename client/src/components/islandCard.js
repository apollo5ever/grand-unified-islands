import React from 'react'

export default function IslandCard(props) {
const [src, setSrc] = React.useState(props.image);

React.useEffect(() => {
    setSrc(props.image); // update the src when the imageUrl prop changes
  }, [props.image]); // specify imageUrl as a dependency
    
return (

<div class="profile-card">

<div class="profile-card__back">
  <p>{props.tagline}</p>
</div>

<div class="profile-card__front">
<img src={src} onError={() => setSrc("https://privateislands.fund/static/media/logotransparent.ee389a36cdf74af7b010.png")} />
 
 <h2>{props.name}</h2>
</div>
</div>

    )
}
