
const DEFAULT={
 site:{noticeTitle:"ভর্তি বিজ্ঞপ্তি",noticeText:"নতুন ব্যাচে ভর্তি চলছে",phoneOne:"01960003102",phoneTwo:"01796275372",address:"মেইন শো-রুম এর ২য় তলা, শ্রীপুর, রায়পুরা, নরসিংদী",students:"500+",years:"5+"},
 courses:[
  {id:1,title:"Web Design",type:"free",price:"সম্পূর্ণ ফ্রি",duration:"৩ মাস / ৩৬০ ঘণ্টা",seats:"২৪ জন",icon:"fa-code",desc:"HTML, CSS, JavaScript এবং responsive website design-এর হাতে-কলমে প্রশিক্ষণ।"},
  {id:2,title:"Professional Digital Content Management",type:"paid",price:"৳ ৫,০০০",duration:"৩ মাস",seats:"সীমিত আসন",icon:"fa-photo-film",desc:"Professional content creation, graphic tools, social media content এবং digital marketing workflow।"}
 ],
 applications:[]
};
function data(){try{return JSON.parse(localStorage.getItem("alifAcademyData"))||structuredClone(DEFAULT)}catch(e){return structuredClone(DEFAULT)}}
function save(d){localStorage.setItem("alifAcademyData",JSON.stringify(d))}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toast(m){let t=document.getElementById("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function showPage(page){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 const el=document.getElementById(page+"Page");if(el)el.classList.add("active");
 document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
 const titles={dashboard:"Dashboard",courses:"Course Management",applications:"Admission Applications",settings:"Website Settings",preview:"Public Website"};
 document.getElementById("pageTitle").textContent=titles[page]||"Dashboard"; render();
}
function render(){
 const d=data(), free=d.courses.filter(c=>c.type==="free").length, paid=d.courses.filter(c=>c.type==="paid").length;
 mCourses.textContent=d.courses.length;mFree.textContent=free;mPaid.textContent=paid;mApps.textContent=d.applications.length;appCount.textContent=d.applications.length;
 courseAdminList.innerHTML=d.courses.map(c=>`<div class="course-admin"><div class="ci"><i class="fa-solid ${esc(c.icon)}"></i></div><div class="ca"><h4>${esc(c.title)}</h4><p><span class="badge ${c.type}">${c.type==="free"?"FREE":"PAID"}</span> &nbsp; ${esc(c.price)} · ${esc(c.duration)}</p></div><div class="row-actions"><button class="icon-btn edit" data-edit="${c.id}"><i class="fa-solid fa-pen"></i></button><button class="icon-btn delete" data-delete="${c.id}"><i class="fa-solid fa-trash"></i></button></div></div>`).join("")||'<p class="hint">No courses added.</p>';
 courseAdminList.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openCourse(Number(b.dataset.edit)));
 courseAdminList.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteCourse(Number(b.dataset.delete)));
 appTable.innerHTML=d.applications.map(a=>`<tr><td>${esc(a.name)}</td><td>${esc(a.phone)}</td><td>${esc(a.course)}</td><td>${esc(a.date)}</td><td>${esc(a.message||"—")}</td></tr>`).join("")||'<tr><td colspan="5">কোনো আবেদন পাওয়া যায়নি।</td></tr>';
 const s=d.site; const f=settingsForm.elements; for(const k of Object.keys(s)){if(f[k])f[k].value=s[k]}
}
function openCourse(id=null){
 const modal=document.getElementById("courseModal"), form=document.getElementById("courseForm"), d=data();
 form.reset();form.elements.id.value="";
 if(id){const c=d.courses.find(x=>x.id===id);if(!c)return;Object.keys(c).forEach(k=>{if(form.elements[k])form.elements[k].value=c[k]});modalTitle.textContent="Edit Course"}else modalTitle.textContent="Add Course";
 modal.classList.add("show");
}
function deleteCourse(id){if(!confirm("এই কোর্সটি মুছে ফেলবেন?"))return;const d=data();d.courses=d.courses.filter(c=>c.id!==id);save(d);render();toast("Course deleted")}
document.getElementById("loginForm").onsubmit=e=>{e.preventDefault();const user=username.value.trim(),pass=password.value;const stored=localStorage.getItem("alifAdminPassword")||"admin12345";if(user==="admin"&&pass===stored){sessionStorage.setItem("alifAdminLogged","1");loginView.classList.add("hidden");appView.classList.remove("hidden");render()}else loginError.innerHTML='<p style="color:#c52f3d;font-size:12px;margin-top:10px">Username বা password সঠিক নয়।</p>'};
function init(){if(sessionStorage.getItem("alifAdminLogged")==="1"){loginView.classList.add("hidden");appView.classList.remove("hidden")}else{appView.classList.add("hidden")}render()}
document.querySelectorAll(".nav-item[data-page],.quick-admin button[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
mobileAdminMenu.onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
logout.onclick=()=>{sessionStorage.removeItem("alifAdminLogged");location.reload()};
addCourseBtn.onclick=()=>openCourse();
closeModal.onclick=()=>courseModal.classList.remove("show");
courseModal.addEventListener("click",e=>{if(e.target===courseModal)courseModal.classList.remove("show")});
courseForm.onsubmit=e=>{e.preventDefault();const d=data(),f=new FormData(e.target),id=Number(f.get("id"));const c={id:id||Date.now(),title:f.get("title"),type:f.get("type"),price:f.get("price"),duration:f.get("duration"),seats:f.get("seats"),icon:f.get("icon"),desc:f.get("desc")};if(id){const i=d.courses.findIndex(x=>x.id===id);if(i>=0)d.courses[i]=c}else d.courses.push(c);save(d);courseModal.classList.remove("show");render();toast("Course saved successfully")};
settingsForm.onsubmit=e=>{e.preventDefault();const d=data(),f=new FormData(e.target);for(const [k,v] of f.entries())d.site[k]=v;save(d);toast("Website settings saved")};
passwordForm.onsubmit=e=>{e.preventDefault();const p=e.target.newPass.value;if(p.length<8)return toast("Password must be at least 8 characters");localStorage.setItem("alifAdminPassword",p);e.target.reset();toast("Admin password changed")};
clearApps.onclick=()=>{if(confirm("সব আবেদন মুছে ফেলবেন?")){const d=data();d.applications=[];save(d);render();toast("Applications cleared")}};
init();
