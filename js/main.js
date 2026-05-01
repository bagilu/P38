async function loadHandbook() {
  const { data, error } = await supabaseClient
    .from("TblP38Handbook")
    .select("*")
    .order("display_order");

  const c = document.getElementById("content");

  if (error) {
    c.innerHTML = "<p>讀取資料失敗：" + error.message + "</p>";
    return;
  }

  if (!data || data.length === 0) {
    c.innerHTML = "<p>目前尚無手冊內容。</p>";
    return;
  }

  data.forEach(i => {
    let d = document.createElement("div");
    d.innerHTML = `<h2>${i.section_title}</h2><p>${i.content}</p>`;
    c.appendChild(d);
  });
}
