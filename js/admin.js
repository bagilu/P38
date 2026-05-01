async function addContent(){
await fetch("https://mfljkyvdadxlrbxlboce.supabase.co/functions/v1/swift-action",{
method:"POST",
body:JSON.stringify({
section_title:document.getElementById("title").value,
content:document.getElementById("content").value,
display_order:parseInt(document.getElementById("order").value)
})
});
alert("完成");
}