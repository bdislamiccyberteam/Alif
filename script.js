
const defaultData = {
  site:{
    noticeTitle:"ভর্তি বিজ্ঞপ্তি",
    noticeText:"নতুন ব্যাচে ভর্তি চলছে",
    phoneOne:"01960003102",
    phoneTwo:"01796275372",
    address:"মেইন শো-রুম এর ২য় তলা, শ্রীপুর, রায়পুরা, নরসিংদী",
    students:"500+",
    years:"5+"
  },
  courses:[
    {id:1,title:"Web Design",type:"free",price:"সম্পূর্ণ ফ্রি",duration:"৩ মাস / ৩৬০ ঘণ্টা",seats:"২৪ জন",icon:"fa-code",desc:"HTML, CSS, JavaScript এবং responsive website design-এর হাতে-কলমে প্রশিক্ষণ।"},
    {id:2,title:"Professional Digital Content Management",type:"paid",price:"৳ ৫,০০০",duration:"৩ মাস",seats:"সীমিত আসন",icon:"fa-photo-film",desc:"Professional content creation, graphic tools, social media content এবং digital marketing workflow।"}
  ],
  applications:[]
};

function getData(){
  const saved = localStorage.getItem("alifAcademyData");
  if(!saved){ localStorage.setItem("alifAcademyData",JSON.stringify(defaultData)); return structuredClone(defaultData); }
  try{return JSON.parse(saved)}catch(e){return structuredClone(defaultData)}
}
function saveData(data){localStorage.setItem("alifAcademyData",JSON.stringify(data))}
function renderCourses(filter="all"){
  const data=getData(), grid=document.getElementById("courseGrid"), select=document.getElementById("courseSelect");
  const courses=data.courses.filter(c=>filter==="all"||c.type===filter);
  grid.innerHTML=courses.map(c=>`
    <article class="course">
      <span class="badge ${c.type}">${c.type==="free"?"ফ্রি কোর্স":"পেইড কোর্স"}</span>
      <div class="course-icon"><i class="fa-solid ${c.icon||"fa-book"}"></i></div>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.desc)}</p>
      <div class="course-meta"><span><i class="fa-regular fa-clock"></i> ${escapeHtml(c.duration)}</span><span><i class="fa-solid fa-users"></i> ${escapeHtml(c.seats)}</span><span><i class="fa-solid fa-tag"></i> ${escapeHtml(c.price)}</span></div>
      <a href="#contact" class="btn ${c.type==="free"?"outline":"primary"}">ভর্তি আবেদন <i class="fa-solid fa-arrow-right"></i></a>
    </article>`).join("");
  if(select){
    select.innerHTML='<option value="">কোর্স নির্বাচন করুন</option>'+data.courses.map(c=>`<option>${escapeHtml(c.title)} (${c.type==="free"?"ফ্রি":"পেইড"})</option>`).join("");
  }
  document.getElementById("statCourses").textContent=data.courses.length;
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function applySettings(){
  const d=getData(), s=d.site;
  document.getElementById("noticeTitle").textContent=s.noticeTitle;
  document.getElementById("noticeText").textContent=s.noticeText;
  document.getElementById("phoneOne").textContent=s.phoneOne;
  document.getElementById("phoneTwo").textContent=s.phoneTwo;
  document.getElementById("contactPhoneOne").textContent=s.phoneOne;
  document.getElementById("contactPhoneTwo").textContent=s.phoneTwo;
  document.getElementById("phoneLinkOne").href="tel:"+s.phoneOne.replace(/\s/g,"");
  document.getElementById("phoneLinkTwo").href="tel:"+s.phoneTwo.replace(/\s/g,"");
  document.getElementById("addressText").textContent=s.address;
  document.getElementById("statStudents").textContent=s.students;
  document.getElementById("statYears").textContent=s.years;
}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); renderCourses(btn.dataset.filter);
}));
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));
document.getElementById("admissionForm").addEventListener("submit",e=>{
  e.preventDefault(); const d=getData(), f=new FormData(e.target);
  d.applications.unshift({id:Date.now(),name:f.get("name"),phone:f.get("phone"),course:f.get("course"),message:f.get("message"),date:new Date().toLocaleString("bn-BD")});
  saveData(d); e.target.reset(); showToast("আপনার ভর্তি আবেদন সফলভাবে পাঠানো হয়েছে।");
});
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3200)}
document.getElementById("year").textContent=new Date().getFullYear();
applySettings(); renderCourses();
