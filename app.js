const demoHotels=[
 {id:"PAR1",name:"Paris Étoile Premium",city:"Paris, France",stars:4,price:118,currency:"EUR",img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"},
 {id:"PAR2",name:"Le Central Paris",city:"Paris, France",stars:3,price:86,currency:"EUR",img:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80"},
 {id:"DXB1",name:"Dubai Marina Resort",city:"Dubai, UAE",stars:5,price:175,currency:"USD",img:"https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80"},
 {id:"DXB2",name:"Downtown City Hotel",city:"Dubai, UAE",stars:4,price:129,currency:"USD",img:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"},
 {id:"IST1",name:"Istanbul Bosphorus",city:"Istanbul, Türkiye",stars:5,price:112,currency:"EUR",img:"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80"},
 {id:"IST2",name:"Sultanahmet Hotel",city:"Istanbul, Türkiye",stars:4,price:72,currency:"EUR",img:"https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=900&q=80"}
];

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const today=new Date();
const tomorrow=new Date(today); tomorrow.setDate(today.getDate()+1);
const plus3=new Date(today); plus3.setDate(today.getDate()+3);
const iso=d=>d.toISOString().slice(0,10);
$("#checkIn").value=iso(tomorrow); $("#checkOut").value=iso(plus3);
$("#bCheckIn").value=iso(tomorrow); $("#bCheckOut").value=iso(plus3);
$("#year").textContent=new Date().getFullYear();

function renderHotels(hotels=demoHotels){
 const grid=$("#hotelGrid"); grid.innerHTML="";
 hotels.forEach(h=>{
  const card=document.createElement("article"); card.className="hotel-card";
  card.innerHTML=`<div class="hotel-img" style="background-image:url('${h.img}')"><span class="stars">${"★".repeat(h.stars)} ${h.stars}/5</span></div>
  <div class="hotel-body"><h3>${h.name}</h3><div class="hotel-location">📍 ${h.city}</div>
  <div class="price"><div><strong>${h.price} ${h.currency}</strong><small> / nuit</small></div><button class="btn primary bookBtn">Réserver</button></div></div>`;
  card.querySelector(".bookBtn").onclick=()=>openBooking(h);
  grid.appendChild(card);
 });
}
renderHotels();

async function searchHotels(){
 const city=$("#destination").value.trim();
 $("#hotelStatus").textContent="Recherche des disponibilités…";
 try{
  const r=await fetch(`/api/hotels?city=${encodeURIComponent(city)}&checkInDate=${$("#checkIn").value}&checkOutDate=${$("#checkOut").value}&adults=${$("#guests").value}`);
  if(!r.ok) throw new Error();
  const data=await r.json();
  if(data.hotels?.length){renderHotels(data.hotels); $("#hotelStatus").textContent=`${data.hotels.length} hébergements trouvés.`}
  else {renderHotels(filterDemo(city)); $("#hotelStatus").textContent="Mode démonstration : ajoutez les clés API Amadeus pour les disponibilités en temps réel."}
 }catch(e){
  renderHotels(filterDemo(city));
  $("#hotelStatus").textContent="Mode démonstration actif. La recherche réelle sera activée après configuration de l’API hôtel.";
 }
}
function filterDemo(city){
 const c=city.toLowerCase();
 return demoHotels.filter(h=>h.city.toLowerCase().includes(c)||h.name.toLowerCase().includes(c)).length?demoHotels.filter(h=>h.city.toLowerCase().includes(c)||h.name.toLowerCase().includes(c)):demoHotels;
}
$("#hotelSearch").addEventListener("submit",e=>{e.preventDefault();searchHotels()});

function openBooking(h){
 $("#selectedHotel").value=h.name; $("#selectedOffer").value=h.id||"";
 $("#modalHotel").textContent=h.name;
 $("#modalOffer").textContent=`${h.city} • ${h.price||"Tarif"} ${h.currency||""} / nuit`;
 $("#bCheckIn").value=$("#checkIn").value; $("#bCheckOut").value=$("#checkOut").value; $("#bGuests").value=$("#guests").value;
 $("#bookingModal").classList.add("show"); $("#bookingModal").setAttribute("aria-hidden","false");
}
$("#closeModal").onclick=()=>$("#bookingModal").classList.remove("show");
$("#bookingModal").addEventListener("click",e=>{if(e.target.id==="bookingModal")$("#bookingModal").classList.remove("show")});

$("#bookingForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const payload={hotel:$("#selectedHotel").value,offerId:$("#selectedOffer").value,firstName:$("#bFirst").value,lastName:$("#bLast").value,phone:$("#bPhone").value,email:$("#bEmail").value,checkIn:$("#bCheckIn").value,checkOut:$("#bCheckOut").value,guests:$("#bGuests").value,notes:$("#bNotes").value};
 try{await fetch("/api/book",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})}catch(_){}
 const text=`Bonjour Kamour Voyages,%0AJe souhaite réserver : ${payload.hotel}%0AArrivée : ${payload.checkIn}%0ADépart : ${payload.checkOut}%0AVoyageurs : ${payload.guests}%0ANom : ${payload.firstName} ${payload.lastName}%0ATéléphone : ${payload.phone}%0AEmail : ${payload.email||"-"}%0A${payload.notes?`Notes : ${payload.notes}`:""}`;
 window.open(`https://wa.me/22247533852?text=${text}`,"_blank");
 $("#bookingModal").classList.remove("show"); toast("Votre demande a été préparée pour WhatsApp.");
});

$("#contactForm").addEventListener("submit",e=>{
 e.preventDefault();
 const text=`Bonjour Kamour Voyages,%0ANom : ${$("#cName").value}%0ATéléphone : ${$("#cPhone").value}%0ASujet : ${$("#cSubject").value}%0AMessage : ${$("#cMessage").value}`;
 window.open(`https://wa.me/22247533852?text=${text}`,"_blank");
});

$$(".tab").forEach(tab=>tab.onclick=()=>{
 $$(".tab").forEach(x=>x.classList.remove("active")); tab.classList.add("active");
 const type=tab.dataset.tab;
 $("#hotelSearch").classList.toggle("hidden",type!=="hotel");
 $("#flightForm").classList.toggle("hidden",type!=="flight");
 $("#visaForm").classList.toggle("hidden",type!=="visa");
});
$(".menu-btn").onclick=()=>{const n=$("#navLinks");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="66px";n.style.left="0";n.style.right="0";n.style.background="#fff";n.style.padding="18px";n.style.flexDirection="column";n.style.borderBottom="1px solid #eee"};
let arabic=false;
$("#langBtn").onclick=()=>{
 arabic=!arabic; document.documentElement.lang=arabic?"ar":"fr";document.documentElement.dir=arabic?"rtl":"ltr";document.body.classList.toggle("rtl",arabic);$("#langBtn").textContent=arabic?"FR":"عربي";
 $$("[data-fr]").forEach(el=>el.textContent=arabic?el.dataset.ar:el.dataset.fr);
};
function toast(t){const x=$("#toast");x.textContent=t;x.style.display="block";setTimeout(()=>x.style.display="none",3500)}
