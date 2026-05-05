document.addEventListener("DOMContentLoaded", async () => {
  await showSessionStatus();
  await loadAdminSections();
});

async function showSessionStatus() {
  const status = document.getElementById("adminStatus");
  const { data } = await supabaseClient.auth.getSession();
  status.textContent = data.session
    ? "已登入：" + data.session.user.email
    : "目前未登入。此版本可測試 Edge Function；正式上線建議加 Admin 權限檢查。";
}

function clearForm() {
  document.getElementById("sectionId").value = "";
  document.getElementById("sectionTitle").value = "";
  document.getElementById("sectionContent").value = "";
  document.getElementById("displayOrder").value = "1";
  document.getElementById("isActive").value = "true";
}

async function saveSection() {
  const status = document.getElementById("adminStatus");

  const payload = {
    id: document.getElementById("sectionId").value || null,
    section_title: document.getElementById("sectionTitle").value.trim(),
    content: document.getElementById("sectionContent").value.trim(),
    display_order: Number(document.getElementById("displayOrder").value),
    is_active: document.getElementById("isActive").value === "true"
  };

  if (!payload.section_title || !payload.content || !payload.display_order) {
    status.textContent = "請填寫標題、內容與顯示順序。";
    return;
  }

  try {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const accessToken = sessionData?.session?.access_token || "";

    const res = await fetch(APP_CONFIG.UPDATE_HANDBOOK_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { "Authorization": "Bearer " + accessToken } : {})
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok || result.error) {
      status.textContent = "儲存失敗：" + (result.error?.message || result.error || res.statusText);
      return;
    }

    status.textContent = "已儲存。";
    clearForm();
    await loadAdminSections();
  } catch (err) {
    status.textContent = "儲存失敗：" + err.message;
  }
}

async function loadAdminSections() {
  const list = document.getElementById("sectionList");
  list.textContent = "載入中...";

  const { data, error } = await supabaseClient
    .from("TblP38Handbook")
    .select("id, section_title, content, display_order, is_active, updated_at")
    .order("display_order", { ascending: true });

  if (error) {
    list.textContent = "讀取失敗：" + error.message;
    return;
  }

  if (!data || data.length === 0) {
    list.textContent = "目前沒有章節。";
    return;
  }

  list.innerHTML = "";

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "admin-item";
    div.innerHTML = `<h3>${item.display_order}. ${item.section_title}</h3>
      <small>ID: ${item.id}｜狀態: ${item.is_active ? "啟用" : "停用"}｜更新: ${item.updated_at || ""}</small><br>`;

    const editBtn = document.createElement("button");
    editBtn.className = "secondary";
    editBtn.textContent = "編輯";
    editBtn.onclick = () => {
      document.getElementById("sectionId").value = item.id;
      document.getElementById("sectionTitle").value = item.section_title;
      document.getElementById("sectionContent").value = item.content;
      document.getElementById("displayOrder").value = item.display_order;
      document.getElementById("isActive").value = item.is_active ? "true" : "false";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    div.appendChild(editBtn);
    list.appendChild(div);
  });
}
