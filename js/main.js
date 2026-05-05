document.addEventListener("DOMContentLoaded", loadHandbook);
async function loadHandbook(){
  const status=document.getElementById("status"), content=document.getElementById("content"), tocList=document.getElementById("tocList");
  status.textContent="正在讀取手冊內容..."; content.innerHTML=""; tocList.innerHTML="";
  const {data,error}=await supabaseClient.from("TblP38Handbook").select("id, section_title, content, display_order, is_active, updated_at").eq("is_active",true).order("display_order",{ascending:true});
  if(error){status.textContent="讀取資料失敗："+error.message; return;}
  if(!data||data.length===0){status.textContent="目前尚無手冊內容。請先執行 SQL 種子資料，或使用 admin.html 新增。"; tocList.textContent="尚無章節"; return;}
  status.textContent=`已載入 ${data.length} 個章節。`;
  data.forEach(item=>{
    const sectionId="section-"+item.id;
    const tocLink=document.createElement("a"); tocLink.href="#"+sectionId; tocLink.textContent=`${item.display_order}. ${item.section_title}`; tocList.appendChild(tocLink);
    const section=document.createElement("article"); section.className="handbook-section"; section.id=sectionId;
    const title=document.createElement("h2"); title.textContent=item.section_title;
    const body=document.createElement("div"); body.className="section-content"; body.textContent=item.content;
    section.appendChild(title); section.appendChild(body); content.appendChild(section);
  });
}
