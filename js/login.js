async function login() {
  const email = document.getElementById("email").value.trim();
  const status = document.getElementById("loginStatus");

  if (!email) {
    status.textContent = "請輸入 Email。";
    return;
  }

  const redirectTo = window.location.href.replace("login.html", "admin.html");

  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo }
  });

  if (error) {
    status.textContent = "登入失敗：" + error.message;
    return;
  }

  status.textContent = "已寄出登入連結，請到 Email 收信。";
}

async function logout() {
  await supabaseClient.auth.signOut();
  document.getElementById("loginStatus").textContent = "已登出。";
}
