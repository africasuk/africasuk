"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SearchBox(){

const router=useRouter();

const [query,setQuery]=useState("");


function submit(e:React.FormEvent){

e.preventDefault();

if(!query.trim()) return;

router.push(
`/search?q=${query}`
);

}


return (

<form onSubmit={submit}>

<input
value={query}
onChange={
(e)=>setQuery(e.target.value)
}
placeholder="Search products..."
className="border rounded-lg px-4 py-2 w-full"
/>

</form>

)

}