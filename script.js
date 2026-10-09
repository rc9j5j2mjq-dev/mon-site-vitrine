(function(){
var MAIL="baobabdor.burkina@gmail.com",WA="22655446262";
var FORMS={
adhesion:{subject:"Demande d'adhésion",btn:"Envoyer ma demande",fields:[["Nom et prénoms","nom","text",1],["Téléphone","tel","tel",1],["E-mail","email","email",0],["Quartier ou ville","ville","text",0],["Message (facultatif)","msg","textarea",0]],
info:"<h2>Devenir membre</h2><p>Toute personne de bonne moralité, sans distinction de race, d'ethnie, d'opinion politique, de religion ou de philosophie, peut adhérer.</p><div class='fees'><div><b>2 500 FCFA</b>droit d'adhésion</div><div><b>2 000 FCFA</b>cotisation annuelle</div></div><p>Les membres actifs votent en assemblée générale et peuvent être élus aux organes de direction.</p>"},
parrainage:{subject:"Proposition de parrainage",btn:"Proposer mon soutien",fields:[["Organisation ou nom","nom","text",1],["Personne à contacter","contact","text",0],["Téléphone","tel","tel",1],["E-mail","email","email",0],["Type de soutien","type","select:Financier|Matériel|Logistique",1],["Message (facultatif)","msg","textarea",0]],
info:"<h2>Devenir parrain</h2><p>Entreprises, institutions ou particuliers : votre soutien financier, matériel ou logistique nous aide à toucher plus de personnes défavorisées. En retour, nous valorisons votre image :</p><ul class='list'><li>votre logo sur nos affiches, flyers et supports numériques</li><li>des remerciements officiels lors de nos événements</li><li>de la visibilité auprès de la communauté locale et des partenaires</li></ul>"},
don:{subject:"Intention de don",btn:"Annoncer mon don",fields:[["Nom et prénoms","nom","text",1],["Téléphone","tel","tel",1],["E-mail","email","email",0],["Nature du don","type","select:Argent|Vivres|Vêtements|Autre",1],["Montant ou description","montant","text",0],["Message (facultatif)","msg","textarea",0]],
info:"<h2>Faire un don</h2><p>Les dons financent le recensement des personnes sans abri et l'aide aux populations démunies et aux orphelinats.</p><p>Annoncez votre don avec ce formulaire : l'équipe vous rappelle pour convenir de la remise. Les fonds de l'association sont déposés en institution financière et toute opération exige la double signature du président et du trésorier.</p>"},
contact:{subject:"Message depuis le site",btn:"Envoyer mon message",fields:[["Nom et prénoms","nom","text",1],["Téléphone ou e-mail","tel","text",1],["Message","msg","textarea",1]]}
};
var $=function(s,r){return(r||document).querySelector(s)};
function el(t,a,x){var e=document.createElement(t);for(var k in a||{})e.setAttribute(k,a[k]);if(x)e.textContent=x;return e}

function build(key,box){
 var F=FORMS[key];box.textContent="";
 var f=el("form",{novalidate:"",id:"f-"+key});
 F.fields.forEach(function(d){
  var w=el("div"),id=key+"-"+d[1];
  w.appendChild(el("label",{"for":id},d[0]+(d[3]?" *":"")));
  var i;
  if(d[2]=="textarea")i=el("textarea",{rows:4});
  else if(d[2].indexOf("select:")==0){i=el("select");d[2].slice(7).split("|").forEach(function(o){i.appendChild(el("option",{value:o},o))})}
  else i=el("input",{type:d[2]});
  i.id=id;i.name=d[1];if(d[3])i.required=true;
  w.appendChild(i);w.appendChild(el("p",{"class":"err",id:id+"-e","aria-live":"polite"}));f.appendChild(w)});
 f.appendChild(el("button",{type:"submit","class":"btn gold"},F.btn));
 f.addEventListener("submit",function(e){e.preventDefault();submit(key,f,box)});
 box.appendChild(f)}

function submit(key,f,box){
 var F=FORMS[key],ok=true,vals=[];
 F.fields.forEach(function(d){
  var i=f.elements[d[1]],v=i.value.trim(),m="";
  if(d[3]&&!v)m="Ce champ est obligatoire.";
  else if(d[2]=="email"&&v&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))m="Adresse e-mail invalide.";
  else if(d[2]=="tel"&&v&&v.replace(/\D/g,"").length<8)m="Numéro invalide (8 chiffres minimum).";
  $("#"+i.id+"-e").textContent=m;i.setAttribute("aria-invalid",m?"true":"false");
  if(m){if(ok)i.focus();ok=false}
  if(v)vals.push(d[0]+" : "+v)});
 if(!ok)return;
 var body="Bonjour Association Baobab d'Or,\n\n"+F.subject+" :\n\n"+vals.join("\n")+"\n\nMessage envoyé depuis le site web.";
 box.textContent="";
 var r=el("div",{"class":"result",role:"status"});
 r.appendChild(el("h3",null,"Votre message est prêt"));
 r.appendChild(el("p",null,"Choisissez comment l'envoyer à l'association. Il est déjà rédigé pour vous."));
 r.appendChild(el("pre",null,body));
 var b=el("div",{"class":"btns",style:"margin:1rem 0 0"});
 b.appendChild(el("a",{"class":"btn gold",href:"mailto:"+MAIL+"?subject="+encodeURIComponent(F.subject)+"&body="+encodeURIComponent(body)},"Envoyer par e-mail"));
 b.appendChild(el("a",{"class":"btn line",target:"_blank",rel:"noopener",href:"https://wa.me/"+WA+"?text="+encodeURIComponent(body)},"Envoyer sur WhatsApp"));
 var c=el("button",{type:"button","class":"btn line"},"Copier le message");
 c.onclick=function(){var done=function(){c.textContent="Message copié"};
  if(navigator.clipboard)navigator.clipboard.writeText(body).then(done,function(){sel()});else sel();
  function sel(){var rg=document.createRange();rg.selectNodeContents($("pre",r));var s=getSelection();s.removeAllRanges();s.addRange(rg);c.textContent="Texte sélectionné : copiez-le"}};
 b.appendChild(c);
 var n=el("button",{type:"button","class":"btn line"},"Modifier");n.onclick=function(){build(key,box)};b.appendChild(n);
 r.appendChild(b);box.appendChild(r);r.scrollIntoView({block:"nearest"})}

var pages=["home","apropos","actions","agir","contact"],built={};
function route(){
 var h=(location.hash||"#/").replace(/^#\/?/,"").split("/"),p=h[0]||"home";
 if(pages.indexOf(p)<0)p="home";
 pages.forEach(function(n){$("#p-"+n).classList.toggle("on",n==p)});
 document.querySelectorAll("#nav a[data-p]").forEach(function(a){a.toggleAttribute("aria-current",a.dataset.p==p);if(a.dataset.p==p)a.setAttribute("aria-current","page")});
 document.title=($("#p-"+p).dataset.t)+" – Baobab d'Or";
 if(p=="agir"){var k=FORMS[h[1]]&&h[1]!="contact"?h[1]:"adhesion";
  document.querySelectorAll(".tabs a").forEach(function(a){a.setAttribute("aria-current",a.dataset.k==k)});
  if(built.agir!=k){$("#agir-info").innerHTML=FORMS[k].info;build(k,$("#agir-form"));built.agir=k}}
 if(p=="contact"&&!built.contact){build("contact",$("#contact-form"));built.contact=1}
 $("#nav").classList.remove("open");$("#burger").setAttribute("aria-expanded","false");
 window.scrollTo(0,0)}
$("#burger").onclick=function(){var o=$("#nav").classList.toggle("open");this.setAttribute("aria-expanded",o)};
window.addEventListener("hashchange",route);route();
})();