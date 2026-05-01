async function loadHandbook(){
const { data } = await supabase.from("TblP38Handbook").select("*").order("display_order");
const c = document.getElementById("content");
data.forEach(i=>{
let d=document.createElement("div");
d.innerHTML=`<h2>${i.section_title}</h2><p>${i.content}</p>`;
c.appendChild(d);
});
}