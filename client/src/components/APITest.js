export default async function callApi () {
    console.log("API TEST")
    const response = await fetch('http://localhost:5000/islands');
    console.log(response)
    const body = await response.json();
  
    if (response.status !== 200) throw Error(body.message);
   
   console.log(body)
   return(body);
  }