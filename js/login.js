async function login(){
const email=document.getElementById("email").value;
const { error } = await supabase.auth.signInWithOtp({ email });
if(error) alert("失敗"); else alert("請查Email");
}