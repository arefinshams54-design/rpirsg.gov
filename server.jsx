import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════════
const CFG = {
  name: "Rajshahi Polytechnic Institute",
  subtitle: "Rover Scout Group",
  motto: "Service Above Self",
  founded: "1985",
  groupNo: "RSG-024",
  email: "rpirsg@gmail.com",
  phone: "+880 1700-000000",
  address: "Rajshahi Polytechnic Institute, Rajshahi-6000, Bangladesh",
  social: { facebook: "#", youtube: "#", instagram: "#" },
};

const NAV_LINKS = [
  { id: "about",    label: "About" },
  { id: "projects", label: "Projects" },
  { id: "awards",   label: "Awards" },
  { id: "crew",     label: "Crew Council" },
  { id: "alumni",   label: "Alumni" },
  { id: "blood",    label: "Blood Cell" },
  { id: "gallery",  label: "Gallery" },
  { id: "donor",    label: "Be Our Donor" },
  { id: "contact",  label: "Contact" },
  // ADD MORE NAV LINKS HERE ↓
];

const CREW_COUNCIL = {
  RSL: [
    { id:1,  name:"Md. Rahim Uddin",  role:"Rover Scout Leader", badge:"RSL", since:"2022", photo:null },
    { id:2,  name:"Fatema Begum",     role:"Rover Scout Leader", badge:"RSL", since:"2022", photo:null },
    { id:3,  name:"Karim Hassan",     role:"Rover Scout Leader", badge:"RSL", since:"2023", photo:null },
    { id:4,  name:"Nusrat Jahan",     role:"Rover Scout Leader", badge:"RSL", since:"2023", photo:null },
  ],
  SRM: [
    { id:5,  name:"Arif Hossain",     role:"Senior Rover Mate",  badge:"SRM", since:"2023", photo:null },
    { id:6,  name:"Sadia Islam",      role:"Senior Rover Mate",  badge:"SRM", since:"2023", photo:null },
    { id:7,  name:"Rakib Hasan",      role:"Senior Rover Mate",  badge:"SRM", since:"2023", photo:null },
    { id:8,  name:"Mitu Akter",       role:"Senior Rover Mate",  badge:"SRM", since:"2024", photo:null },
  ],
  RM: Array.from({length:8},(_,i)=>({ id:100+i, name:`Rover Mate ${i+1}`, role:"Rover Mate", badge:"RM", since:"2024", photo:null })),
  MEMBERS: Array.from({length:64},(_,i)=>({ id:200+i, name:`Scout Member ${i+1}`, role:"Rover Scout", badge:"RS", since:"2024", photo:null })),
};

const BLOOD_DONORS = [
  { name:"Arif Rahman",    group:"A+",  phone:"+880 1700-111111", available:true  },
  { name:"Sumaiya Khanam", group:"B+",  phone:"+880 1700-222222", available:true  },
  { name:"Mahbub Alam",    group:"O+",  phone:"+880 1700-333333", available:false },
  { name:"Ritu Akter",     group:"AB+", phone:"+880 1700-444444", available:true  },
  { name:"Tanvir Ahmed",   group:"A-",  phone:"+880 1700-555555", available:true  },
  { name:"Nadia Islam",    group:"B-",  phone:"+880 1700-666666", available:true  },
  { name:"Sabbir Hossain", group:"O-",  phone:"+880 1700-777777", available:false },
  { name:"Puja Sharma",    group:"AB-", phone:"+880 1700-888888", available:true  },
];

const PROJECTS = [
  { title:"Tree Plantation Drive",    desc:"Planted 5000+ trees across Rajshahi city for a greener tomorrow.", icon:"🌳", year:"2024", status:"Completed", photo:null },
  { title:"Blood Donation Camp",      desc:"Organized 12 blood donation camps serving 800+ patients annually.", icon:"🩸", year:"2024", status:"Ongoing",   photo:null },
  { title:"Clean Water Initiative",   desc:"Provided clean water access to 20 remote villages.", icon:"💧", year:"2023", status:"Completed", photo:null },
  { title:"Digital Literacy Program", desc:"Teaching 500+ rural students basic computer skills.", icon:"💻", year:"2024", status:"Ongoing",   photo:null },
  { title:"Disaster Relief",          desc:"Rapid response for flood and cyclone affected communities.", icon:"🏠", year:"2023", status:"Active",    photo:null },
  { title:"Youth Leadership Camp",    desc:"Annual camp developing leadership skills in 200+ scouts.", icon:"⛺", year:"2024", status:"Completed", photo:null },
];

const AWARDS = [
  { title:"Best Rover Crew Award",       org:"Bangladesh Scouts",    year:"2024", icon:"🏆" },
  { title:"National Service Excellence", org:"Ministry of Youth",    year:"2023", icon:"🎖️" },
  { title:"Green Bangladesh Champion",   org:"Environment Ministry", year:"2023", icon:"🌿" },
  { title:"Blood Donation Hero Award",   org:"Red Crescent Society", year:"2022", icon:"🩸" },
  { title:"Community Leadership Prize",  org:"Rajshahi City Corp.",  year:"2022", icon:"🏅" },
  { title:"Innovation in Scouting",      org:"Bangladesh Scouts HQ", year:"2021", icon:"💡" },
];

const ALUMNI = [
  { name:"Engr. Zakir Hossain", batch:"2005", position:"Civil Engineer, PWD",         photo:null },
  { name:"Dr. Sharmin Akter",   batch:"2008", position:"Medical Officer, DGHS",        photo:null },
  { name:"Md. Touhidul Islam",  batch:"2010", position:"Senior Lecturer, RUET",        photo:null },
  { name:"Sumaiya Rahman",      batch:"2012", position:"Software Engineer, BRAC IT",   photo:null },
  { name:"Imran Hossain",       batch:"2015", position:"Assistant Director, BSCIC",    photo:null },
  { name:"Nishath Jahan",       batch:"2018", position:"Entrepreneur & Social Worker", photo:null },
];

const GALLERY_ITEMS = [
  { title:"Annual Camp 2024",     category:"Camp",        photo:null },
  { title:"Blood Donation Drive", category:"Service",     photo:null },
  { title:"Tree Plantation",      category:"Environment", photo:null },
  { title:"Award Ceremony 2023",  category:"Awards",      photo:null },
  { title:"Leadership Training",  category:"Training",    photo:null },
  { title:"Parade March",         category:"Events",      photo:null },
  { title:"Community Service",    category:"Service",     photo:null },
  { title:"Scout Jamboree",       category:"Events",      photo:null },
];

// ════════════════════════════════════════════════════════
// THEME
// ════════════════════════════════════════════════════════
const T = {
  bg:      "#f8f5ff",
  white:   "#ffffff",
  surface: "rgba(255,255,255,0.75)",
  border:  "rgba(139,92,246,0.18)",
  borderH: "rgba(139,92,246,0.5)",
  p1:      "#7c3aed",
  p2:      "#8b5cf6",
  p3:      "#a78bfa",
  p4:      "#ede9fe",
  p5:      "#f5f3ff",
  acc:     "#e879f9",
  text:    "#1e1b4b",
  sub:     "#6b7280",
  mute:    "#9ca3af",
  red:     "#ef4444",
  green:   "#22c55e",
};

const BADGE = {
  RSL: { bg:"#7c3aed", fg:"#fff" },
  SRM: { bg:"#8b5cf6", fg:"#fff" },
  RM:  { bg:"#a78bfa", fg:"#fff" },
  RS:  { bg:"#ede9fe", fg:"#7c3aed" },
};

// ════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ════════════════════════════════════════════════════════
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos   = useRef({x:-200,y:-200});
  const lag   = useRef({x:-200,y:-200});
  const rafId = useRef(null);

  useEffect(()=>{
    const onMove = e => { pos.current = {x:e.clientX, y:e.clientY}; };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.13;
      lag.current.y += (pos.current.y - lag.current.y) * 0.13;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x-5}px,${pos.current.y-5}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${lag.current.x-22}px,${lag.current.y-22}px)`;
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    const grow  = () => { if(ringRef.current){ ringRef.current.style.width="54px"; ringRef.current.style.height="54px"; ringRef.current.style.opacity="0.4"; } };
    const shrink= () => { if(ringRef.current){ ringRef.current.style.width="44px"; ringRef.current.style.height="44px"; ringRef.current.style.opacity="0.7"; } };
    document.addEventListener("mousedown", grow);
    document.addEventListener("mouseup",   shrink);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", grow);
      document.removeEventListener("mouseup", shrink);
      cancelAnimationFrame(rafId.current);
    };
  },[]);

  return <>
    <div ref={dotRef}  style={{position:"fixed",top:0,left:0,zIndex:99999,pointerEvents:"none",width:10,height:10,borderRadius:"50%",background:`linear-gradient(135deg,${T.p1},${T.acc})`,boxShadow:`0 0 14px ${T.p2}bb`,transition:"opacity .2s"}} />
    <div ref={ringRef} style={{position:"fixed",top:0,left:0,zIndex:99998,pointerEvents:"none",width:44,height:44,borderRadius:"50%",border:`1.5px solid ${T.p2}`,transition:"width .2s,height .2s,opacity .2s",opacity:.7}} />
  </>;
}

// ════════════════════════════════════════════════════════
// CURSOR TRAIL
// ════════════════════════════════════════════════════════
function Trail() {
  const [sparks, setSparks] = useState([]);
  const counter = useRef(0);
  useEffect(()=>{
    let last=0;
    const mv = e => {
      const now=Date.now(); if(now-last<45) return; last=now;
      const id = counter.current++;
      setSparks(p=>[...p.slice(-16),{id,x:e.clientX,y:e.clientY,hue:270+Math.random()*60}]);
      setTimeout(()=>setSparks(p=>p.filter(s=>s.id!==id)),700);
    };
    window.addEventListener("mousemove",mv);
    return()=>window.removeEventListener("mousemove",mv);
  },[]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:99990,pointerEvents:"none"}}>
      {sparks.map(s=>(
        <div key={s.id} style={{position:"absolute",left:s.x-4,top:s.y-4,width:8,height:8,borderRadius:"50%",background:`hsl(${s.hue},80%,65%)`,animation:"sparkFade .7s forwards"}} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// PHOTO UPLOAD
// ════════════════════════════════════════════════════════
function PhotoUp({ photo, onPhoto, size=80, radius="50%", placeholder="📷", style={} }) {
  const ref = useRef();
  return (
    <div onClick={()=>ref.current.click()} style={{
      width:size, height:size, flexShrink:0,
      borderRadius:radius,
      background: photo ? `url(${photo}) center/cover no-repeat` : `linear-gradient(135deg,${T.p4},${T.p5})`,
      border: `2px dashed ${photo ? T.p2 : T.border}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      cursor:"pointer", position:"relative", overflow:"hidden",
      transition:"all .25s", ...style,
    }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=T.p1; e.currentTarget.style.boxShadow=`0 0 0 4px ${T.p1}22`;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=photo?T.p2:T.border; e.currentTarget.style.boxShadow="none";}}
    >
      {!photo && <span style={{fontSize:size/3.5,opacity:.45}}>{placeholder}</span>}
      <div className="upload-overlay" style={{position:"absolute",inset:0,background:`rgba(124,58,237,.6)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .2s",gap:3}}>
        <span style={{fontSize:size/4,color:"#fff"}}>📷</span>
        <span style={{fontSize:9,color:"#fff",fontWeight:700,letterSpacing:1}}>UPLOAD</span>
      </div>
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onPhoto(ev.target.result);r.readAsDataURL(f);}} />
      <style>{`.upload-overlay:hover{opacity:1!important;}`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// GLASS BUTTON
// ════════════════════════════════════════════════════════
function GBtn({children,onClick,primary=false,style={}}) {
  const [h,setH]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      padding:"11px 28px", borderRadius:50,
      border:`1.5px solid ${primary?T.p1:T.border}`,
      background: primary?(h?`rgba(124,58,237,.16)`:`rgba(124,58,237,.09)`):(h?`rgba(255,255,255,.95)`:`rgba(255,255,255,.78)`),
      color: primary?T.p1:T.text,
      fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:600, letterSpacing:1.5,
      cursor:"pointer",
      backdropFilter:"blur(14px)",
      boxShadow: h?`0 8px 28px rgba(124,58,237,.22),inset 0 1px 0 rgba(255,255,255,.9)`:`0 2px 10px rgba(124,58,237,.1),inset 0 1px 0 rgba(255,255,255,.7)`,
      transition:"all .3s", transform:h?"translateY(-2px)":"none",
      ...style,
    }}>{children}</button>
  );
}

// ════════════════════════════════════════════════════════
// SECTION TITLE
// ════════════════════════════════════════════════════════
function STitle({title,sub}) {
  return (
    <div style={{textAlign:"center",marginBottom:52}}>
      <div style={{color:T.p2,fontSize:10,letterSpacing:5,fontFamily:"'Cinzel',serif",textTransform:"uppercase",marginBottom:10}}>✦ {sub} ✦</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,48px)",color:T.text,margin:0,fontWeight:700}}>{title}</h2>
      <div style={{width:60,height:3,background:`linear-gradient(90deg,transparent,${T.p1},${T.acc},transparent)`,margin:"18px auto 0",borderRadius:2}} />
    </div>
  );
}

// ════════════════════════════════════════════════════════
// CARD
// ════════════════════════════════════════════════════════
function Card({children,style={},onClick}) {
  const [h,setH]=useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick} style={{
      background:T.surface,
      border:`1px solid ${h?T.borderH:T.border}`,
      borderRadius:20, backdropFilter:"blur(18px)",
      WebkitBackdropFilter:"blur(18px)",
      boxShadow:h?`0 14px 44px rgba(124,58,237,.15)`:`0 2px 12px rgba(124,58,237,.06)`,
      transition:"all .3s",
      transform:h?"translateY(-5px)":"none",
      ...style,
    }}>{children}</div>
  );
}

// ════════════════════════════════════════════════════════
// BLOOD CELL SVG ANIMATION
// ════════════════════════════════════════════════════════
function BloodCellCanvas() {
  const svgRef = useRef(null);
  const cells = useRef(Array.from({length:16},()=>({
    x:Math.random()*100, y:Math.random()*100,
    vx:(Math.random()-.5)*.035, vy:(Math.random()-.5)*.035,
    r:14+Math.random()*20, op:.06+Math.random()*.09,
    phase:Math.random()*Math.PI*2, rot:Math.random()*360, rotV:(Math.random()-.5)*.3,
  }))).current;
  const rafId = useRef(null);

  useEffect(()=>{
    const el = svgRef.current;
    if(!el) return;

    const loop = ()=>{
      cells.forEach((c,i)=>{
        c.x+=c.vx; c.y+=c.vy; c.phase+=.018; c.rot+=c.rotV;
        if(c.x<-5||c.x>105) c.vx*=-1;
        if(c.y<-5||c.y>105) c.vy*=-1;
        const pf = 1+Math.sin(c.phase)*0.07;
        const rx = c.r*pf*1.4, ry = c.r*pf;
        const g = el.querySelector(`#cg${i}`);
        const cr = el.querySelector(`#cr${i}`);
        const ci = el.querySelector(`#ci${i}`);
        const ch = el.querySelector(`#ch${i}`);
        if(g) g.setAttribute("transform",`translate(${c.x},${c.y}) rotate(${c.rot})`);
        if(g) g.setAttribute("opacity",c.op);
        if(cr) { cr.setAttribute("rx",rx); cr.setAttribute("ry",ry); }
        if(ci) { ci.setAttribute("rx",rx*.55); ci.setAttribute("ry",ry*.4); }
        if(ch) { ch.setAttribute("rx",rx); ch.setAttribute("ry",ry); }
      });
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(rafId.current);
  },[]);

  return (
    <svg ref={svgRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <radialGradient id="cGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity=".9"/>
          <stop offset="60%" stopColor="#dc2626" stopOpacity=".55"/>
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity=".1"/>
        </radialGradient>
        <radialGradient id="cCenter" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity=".55"/>
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {cells.map((_,i)=>(
        <g key={i} id={`cg${i}`}>
          <ellipse id={`cr${i}`} fill="url(#cGrad)" />
          <ellipse id={`ci${i}`} fill="url(#cCenter)" />
          <ellipse id={`ch${i}`} fill="none" stroke="#fca5a5" strokeWidth=".6" opacity=".35" />
        </g>
      ))}
    </svg>
  );
}

// ════════════════════════════════════════════════════════
// MEMBER CARD
// ════════════════════════════════════════════════════════
function MemberCard({member,small=false}) {
  const [photo,setPhoto]=useState(member.photo);
  const badge=BADGE[member.badge]||BADGE.RS;
  const sz=small?58:82;
  return (
    <Card style={{padding:small?"12px 10px":"22px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:small?6:12,position:"relative"}}>
      <div style={{position:"absolute",top:8,right:8,background:badge.bg,color:badge.fg,fontSize:8,fontWeight:700,borderRadius:4,padding:"2px 6px",letterSpacing:1,fontFamily:"'Cinzel',serif"}}>{member.badge}</div>
      <PhotoUp photo={photo} onPhoto={setPhoto} size={sz} placeholder="👤" />
      <div style={{textAlign:"center"}}>
        <div style={{color:T.text,fontWeight:700,fontSize:small?10:13,fontFamily:"'Playfair Display',serif"}}>{member.name}</div>
        <div style={{color:T.sub,fontSize:small?8:10,marginTop:2}}>{member.role}</div>
        {!small&&<div style={{color:T.p2,fontSize:9,marginTop:4,fontFamily:"'Cinzel',serif",letterSpacing:1}}>Since {member.since}</div>}
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════
function HeroSection({scrollTo}) {
  const canvasRef=useRef(null);
  useEffect(()=>{
    const cv=canvasRef.current; if(!cv) return;
    const ctx=cv.getContext("2d");
    let raf;
    const resize=()=>{cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;};
    resize();
    const pts=Array.from({length:72},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,r:Math.random()*2+.5}));
    const draw=()=>{
      cv.width=cv.offsetWidth; cv.height=cv.offsetHeight;
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>cv.width) p.vx*=-1;
        if(p.y<0||p.y>cv.height) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="rgba(139,92,246,.5)"; ctx.fill();
      });
      pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<120){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(139,92,246,${(1-d/120)*.12})`;ctx.lineWidth=.8;ctx.stroke();}
      }));
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(raf);
  },[]);

  return (
    <section id="home" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:"80px 24px 48px",background:`linear-gradient(155deg,${T.p5} 0%,${T.white} 45%,${T.p4} 100%)`}}>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>
      {/* blobs */}
      {[{l:"-8%",t:"5%",s:"550px",c:"rgba(167,139,250,.1)"},{l:"65%",t:"55%",s:"450px",c:"rgba(232,121,249,.09)"},{l:"25%",t:"75%",s:"380px",c:"rgba(124,58,237,.08)"}].map((b,i)=>(
        <div key={i} style={{position:"absolute",left:b.l,top:b.t,width:b.s,height:b.s,borderRadius:"50%",background:b.c,filter:"blur(80px)",pointerEvents:"none",animation:`blobFloat ${6+i*2}s ease-in-out infinite alternate`}}/>
      ))}

      <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:820}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"rgba(124,58,237,.07)",border:`1px solid ${T.border}`,borderRadius:50,padding:"8px 22px",marginBottom:32,backdropFilter:"blur(12px)"}}>
          <span style={{fontSize:18}}>⚜️</span>
          <span style={{color:T.p1,fontSize:11,letterSpacing:3,fontFamily:"'Cinzel',serif"}}>GROUP NO. {CFG.groupNo}</span>
          <span style={{fontSize:18}}>⚜️</span>
        </div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(34px,7vw,80px)",color:T.text,margin:"0 0 6px",fontWeight:900,lineHeight:1.05,letterSpacing:-1}}>{CFG.name}</h1>
        <h2 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(14px,2.5vw,22px)",color:T.p1,margin:"0 0 24px",fontWeight:400,letterSpacing:5}}>{CFG.subtitle}</h2>
        <p style={{color:T.sub,fontSize:16,maxWidth:520,margin:"0 auto 48px",lineHeight:1.9,fontStyle:"italic"}}>"{CFG.motto}" — Serving humanity with dedication, courage, and brotherhood since {CFG.founded}.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <GBtn primary onClick={()=>scrollTo("about")}>Discover Our Story</GBtn>
          <GBtn onClick={()=>scrollTo("crew")}>Meet The Crew</GBtn>
        </div>
        <div style={{display:"flex",gap:48,justifyContent:"center",marginTop:64,flexWrap:"wrap"}}>
          {[["80+","Members"],["39+","Years"],["50+","Projects"],["15+","Awards"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:38,color:T.p1,fontWeight:700,lineHeight:1}}>{n}</div>
              <div style={{color:T.sub,fontSize:10,letterSpacing:3,marginTop:4,fontFamily:"'Cinzel',serif"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div onClick={()=>scrollTo("about")} style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",cursor:"pointer",animation:"bounce 2s infinite"}}>
        <div style={{width:26,height:42,border:`2px solid ${T.p3}`,borderRadius:13,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"5px 0"}}>
          <div style={{width:4,height:8,background:T.p1,borderRadius:2,animation:"scrollDot 2s infinite"}}/>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// ABOUT
// ════════════════════════════════════════════════════════
function AboutSection() {
  return (
    <section id="about" style={{padding:"96px 24px",background:T.white}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <STitle title="About Our Crew" sub="Our Identity"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
          {[
            {icon:"⚜️",title:"Our Heritage",text:"Founded in 1985, the RPI Rover Scout Group has been a beacon of youth service in Rajshahi. We uphold the rich traditions of the Bangladesh Scout Movement with pride and dedication."},
            {icon:"🎯",title:"Our Mission",text:"To develop responsible, skilled, and community-oriented individuals through scouting, leadership training, and service projects that make a lasting impact on society."},
            {icon:"👁️",title:"Our Vision",text:"A world where every young person has the opportunity to grow into a capable, ethical leader — contributing meaningfully to their community and nation."},
            {icon:"🤝",title:"Our Values",text:"Honor, Service, Brotherhood, Courage, Integrity — the pillars upon which every member of our crew stands, in every action and every decision."},
          ].map(item=>(
            <Card key={item.title} style={{padding:"30px 26px"}}>
              <div style={{fontSize:40,marginBottom:14}}>{item.icon}</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",color:T.p1,fontSize:19,margin:"0 0 10px"}}>{item.title}</h3>
              <p style={{color:T.sub,fontSize:14,lineHeight:1.8,margin:0}}>{item.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// PROJECTS (photo upload per card)
// ════════════════════════════════════════════════════════
function ProjectsSection() {
  const [items,setItems]=useState(PROJECTS);
  const setP=(i,p)=>setItems(arr=>arr.map((x,j)=>j===i?{...x,photo:p}:x));
  const sColor={Completed:"rgba(34,197,94,.12)",Ongoing:"rgba(124,58,237,.12)",Active:"rgba(234,179,8,.12)"};
  const sText={Completed:"#166534",Ongoing:T.p1,Active:"#92400e"};
  return (
    <section id="projects" style={{padding:"96px 24px",background:T.p5}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <STitle title="Our Projects" sub="Community Service"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:22}}>
          {items.map((proj,i)=>(
            <Card key={proj.title} style={{overflow:"hidden"}}>
              {/* photo area */}
              <div style={{height:185,position:"relative",background:proj.photo?`url(${proj.photo}) center/cover`:T.p4,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
                {!proj.photo&&<>
                  <span style={{fontSize:56}}>{proj.icon}</span>
                  <span style={{color:T.p2,fontSize:10,fontFamily:"'Cinzel',serif",letterSpacing:1.5}}>Click to add photo</span>
                </>}
                {/* invisible full overlay upload */}
                <PhotoUp photo={null} onPhoto={p=>setP(i,p)} size={0} style={{position:"absolute",inset:0,width:"100%",height:"100%",borderRadius:0,border:"none",background:"transparent",opacity:0,zIndex:2}} placeholder="" />
                {proj.photo&&<div style={{position:"absolute",inset:0,background:"rgba(124,58,237,.45)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .25s",zIndex:3}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
                  <PhotoUp photo={null} onPhoto={p=>setP(i,p)} size={44} style={{borderRadius:8,border:`1.5px dashed #fff`,background:"rgba(255,255,255,.15)"}} placeholder="📷" />
                </div>}
                <div style={{position:"absolute",top:10,right:10,background:sColor[proj.status]||"rgba(0,0,0,.1)",border:`1px solid`,borderColor:sText[proj.status]||"#666",borderRadius:20,padding:"3px 10px",fontSize:10,color:sText[proj.status]||"#333",fontFamily:"'Cinzel',serif",letterSpacing:1,zIndex:4}}>{proj.status}</div>
              </div>
              <div style={{padding:"20px 22px 24px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:24}}>{proj.icon}</span>
                  <h3 style={{fontFamily:"'Playfair Display',serif",color:T.text,fontSize:17,margin:0}}>{proj.title}</h3>
                </div>
                <p style={{color:T.sub,fontSize:13,lineHeight:1.75,margin:"0 0 12px"}}>{proj.desc}</p>
                <div style={{color:T.p2,fontSize:11,letterSpacing:2,fontFamily:"'Cinzel',serif"}}>📅 {proj.year}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// AWARDS
// ════════════════════════════════════════════════════════
function AwardsSection() {
  return (
    <section id="awards" style={{padding:"96px 24px",background:T.white}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <STitle title="Honours & Awards" sub="Recognition"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:18}}>
          {AWARDS.map(a=>(
            <Card key={a.title} style={{padding:"22px 24px",display:"flex",gap:18,alignItems:"flex-start"}}>
              <div style={{fontSize:38,flexShrink:0}}>{a.icon}</div>
              <div>
                <h3 style={{fontFamily:"'Playfair Display',serif",color:T.p1,fontSize:16,margin:"0 0 4px"}}>{a.title}</h3>
                <div style={{color:T.sub,fontSize:12,marginBottom:4}}>{a.org}</div>
                <div style={{color:T.p3,fontSize:11,letterSpacing:2,fontFamily:"'Cinzel',serif"}}>{a.year}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// CREW COUNCIL
// ════════════════════════════════════════════════════════
function CrewSection() {
  const [tab,setTab]=useState("RSL");
  const lbl={RSL:"Rover Scout Leaders (4)",SRM:"Senior Rover Mates (4)",RM:"Rover Mates (8)",MEMBERS:"Members (64)"};
  const data={RSL:CREW_COUNCIL.RSL,SRM:CREW_COUNCIL.SRM,RM:CREW_COUNCIL.RM,MEMBERS:CREW_COUNCIL.MEMBERS};
  const pyr=[["4 RSL",T.p1,200],["4 SRM",T.p2,260],["8 RM",T.p3,320],["64 Members","#c4b5fd",390]];
  return (
    <section id="crew" style={{padding:"96px 24px",background:T.p5}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <STitle title="Crew Council" sub="Leadership Hierarchy"/>
        {/* pyramid viz */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,marginBottom:48}}>
          {pyr.map(([label,color,w])=>(
            <div key={label} style={{width:w,maxWidth:"90vw",height:40,background:`${color}15`,border:`1.5px solid ${color}44`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontWeight:700,color,fontSize:12,letterSpacing:2,cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=`${color}22`;e.currentTarget.style.transform="scaleX(1.02)";}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${color}15`;e.currentTarget.style.transform="none";}}
            >{label}</div>
          ))}
        </div>
        {/* tabs */}
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:36,flexWrap:"wrap"}}>
          {["RSL","SRM","RM","MEMBERS"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 20px",borderRadius:50,border:`1.5px solid ${tab===t?T.p1:T.border}`,background:tab===t?`${T.p1}12`:"rgba(255,255,255,.85)",color:tab===t?T.p1:T.sub,fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:1.5,cursor:"pointer",transition:"all .25s"}}>{lbl[t]}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:tab==="MEMBERS"?"repeat(auto-fill,minmax(120px,1fr))":"repeat(auto-fill,minmax(175px,1fr))",gap:14}}>
          {data[tab].map(m=><MemberCard key={m.id} member={m} small={tab==="MEMBERS"}/>)}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// ALUMNI
// ════════════════════════════════════════════════════════
function AlumniSection() {
  const [photos,setPhotos]=useState(ALUMNI.map(a=>a.photo));
  return (
    <section id="alumni" style={{padding:"96px 24px",background:T.white}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <STitle title="Our Alumni" sub="Legacy Makers"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:18}}>
          {ALUMNI.map((a,i)=>(
            <Card key={a.name} style={{padding:"20px 22px",display:"flex",gap:16,alignItems:"center"}}>
              <PhotoUp photo={photos[i]} onPhoto={p=>setPhotos(arr=>arr.map((x,j)=>j===i?p:x))} size={66} placeholder="👤"/>
              <div>
                <div style={{color:T.text,fontWeight:700,fontFamily:"'Playfair Display',serif",fontSize:15}}>{a.name}</div>
                <div style={{color:T.p1,fontSize:11,letterSpacing:2,fontFamily:"'Cinzel',serif",margin:"3px 0"}}>Batch {a.batch}</div>
                <div style={{color:T.sub,fontSize:12}}>{a.position}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// GALLERY
// ════════════════════════════════════════════════════════
function GallerySection() {
  const [items,setItems]=useState(GALLERY_ITEMS);
  const [sel,setSel]=useState(null);
  const [filt,setFilt]=useState("All");
  const cats=["All",...new Set(GALLERY_ITEMS.map(g=>g.category))];
  const shown=filt==="All"?items:items.filter(g=>g.category===filt);
  const setP=(title,p)=>setItems(arr=>arr.map(x=>x.title===title?{...x,photo:p}:x));

  return (
    <section id="gallery" style={{padding:"96px 24px",background:T.p5}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <STitle title="Gallery" sub="Memories"/>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:36}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilt(c)} style={{padding:"7px 18px",borderRadius:50,border:`1.5px solid ${filt===c?T.p1:T.border}`,background:filt===c?`${T.p1}12`:"rgba(255,255,255,.85)",color:filt===c?T.p1:T.sub,fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:1,cursor:"pointer",transition:"all .25s"}}>{c}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
          {shown.map(item=>(
            <div key={item.title} style={{height:200,borderRadius:16,overflow:"hidden",position:"relative",background:item.photo?`url(${item.photo}) center/cover`:T.p4,border:`1px solid ${T.border}`,cursor:"pointer",transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.zIndex=2;e.currentTarget.style.boxShadow=`0 20px 40px rgba(124,58,237,.18)`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.zIndex=1;e.currentTarget.style.boxShadow="none";}}
              onClick={()=>{if(item.photo)setSel(item);}}
            >
              {!item.photo?(
                <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
                  <span style={{fontSize:38}}>🖼️</span>
                  <span style={{color:T.p1,fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:1,textAlign:"center",padding:"0 12px"}}>{item.title}</span>
                  <span style={{color:T.mute,fontSize:10}}>{item.category}</span>
                  <PhotoUp photo={null} onPhoto={p=>setP(item.title,p)} size={36} style={{borderRadius:8,border:`1.5px dashed ${T.p2}`,background:"rgba(255,255,255,.9)",marginTop:4}} placeholder="+"/>
                </div>
              ):(
                <div style={{position:"absolute",inset:0,background:`rgba(124,58,237,.5)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .3s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
                  <span style={{color:"#fff",fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:600}}>{item.title}</span>
                  <span style={{color:"rgba(255,255,255,.7)",fontSize:11,marginTop:4}}>{item.category}</span>
                  <span style={{color:"rgba(255,255,255,.6)",fontSize:11,marginTop:8}}>🔍 Click to enlarge</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {sel&&(
          <div onClick={()=>setSel(null)} style={{position:"fixed",inset:0,background:"rgba(30,27,75,.88)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)"}}>
            <div onClick={e=>e.stopPropagation()} style={{maxWidth:720,maxHeight:"80vh",borderRadius:20,overflow:"hidden",border:`1px solid ${T.p2}55`,boxShadow:`0 40px 100px rgba(124,58,237,.3)`}}>
              <img src={sel.photo} style={{width:"100%",height:"100%",objectFit:"contain"}}/>
            </div>
            <div style={{position:"absolute",top:24,right:24,textAlign:"right"}}>
              <button onClick={()=>setSel(null)} style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",width:44,height:44,borderRadius:"50%",fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// BLOOD CELL SECTION
// ════════════════════════════════════════════════════════
function BloodSection() {
  const [filt,setFilt]=useState("ALL");
  const GC={"A":"#dc2626","B":"#ea580c","O":"#16a34a","AB":"#7c3aed"};
  const gc=g=>GC[g.replace(/[+-]/g,"")]||"#dc2626";
  const shown=filt==="ALL"?BLOOD_DONORS:BLOOD_DONORS.filter(d=>d.group===filt);
  const groups=["ALL","A+","A-","B+","B-","O+","O-","AB+","AB-"];

  return (
    <section id="blood" style={{padding:"96px 24px",background:T.white,position:"relative",overflow:"hidden",minHeight:600}}>
      {/* Animated cells BG */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <BloodCellCanvas/>
        {/* Falling drops */}
        {[10,25,40,60,75,90].map((x,i)=>(
          <div key={i} style={{position:"absolute",left:`${x}%`,top:-30,animation:`dropFall ${3+i*.4}s ease-in ${i*.6}s infinite`,pointerEvents:"none"}}>
            <svg width="14" height="20" viewBox="0 0 14 20">
              <path d="M7 1 C7 1, 1 8, 1 13 A6 6 0 0 0 13 13 C13 8 7 1 7 1Z" fill="#ef4444" opacity=".65"/>
              <ellipse cx="4.5" cy="11" rx="1.5" ry="2.5" fill="#fca5a5" opacity=".5"/>
            </svg>
          </div>
        ))}
        {/* Pulse rings */}
        {[1,2,3].map(i=>(
          <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:i*220,height:i*220,borderRadius:"50%",border:"1px solid rgba(220,38,38,.07)",transform:"translate(-50%,-50%)",animation:`pulseRing ${2.5+i*.8}s ease-out ${i*.5}s infinite`,pointerEvents:"none"}}/>
        ))}
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <STitle title="Blood Cell" sub="Save Lives"/>
        <div style={{textAlign:"center",marginBottom:32,background:"rgba(254,242,242,.9)",border:"1px solid rgba(220,38,38,.18)",borderRadius:16,padding:"20px 28px",backdropFilter:"blur(8px)"}}>
          <div style={{fontSize:36,marginBottom:8,animation:"heartbeat 1.5s ease infinite"}}>❤️</div>
          <p style={{color:"#7f1d1d",fontSize:14,margin:0,lineHeight:1.8}}>Our Blood Cell volunteers are always ready to donate. In emergencies, contact any available donor. Every drop saves a life.</p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginBottom:32}}>
          {groups.map(g=>(
            <button key={g} onClick={()=>setFilt(g)} style={{padding:"7px 17px",borderRadius:50,border:`1.5px solid ${filt===g?"#dc2626":"rgba(220,38,38,.2)"}`,background:filt===g?"rgba(220,38,38,.1)":"rgba(255,255,255,.9)",color:filt===g?"#dc2626":"#9f1239",fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:1,cursor:"pointer",transition:"all .25s",backdropFilter:"blur(6px)"}}>{g}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
          {shown.map(d=>(
            <div key={d.name} style={{background:"rgba(255,255,255,.88)",border:`1px solid ${d.available?"rgba(220,38,38,.22)":"rgba(156,163,175,.25)"}`,borderRadius:16,padding:"18px 20px",backdropFilter:"blur(10px)",transition:"all .3s",display:"flex",alignItems:"center",gap:14}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(220,38,38,.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}
            >
              <div style={{width:54,height:54,borderRadius:"50%",background:`${gc(d.group)}12`,border:`2.5px solid ${gc(d.group)}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontWeight:700,color:gc(d.group),fontSize:15,flexShrink:0,animation:d.available?"dropletPulse 2.2s ease infinite":"none"}}>{d.group}</div>
              <div>
                <div style={{color:T.text,fontWeight:600,fontSize:14,fontFamily:"'Playfair Display',serif"}}>{d.name}</div>
                <div style={{color:T.sub,fontSize:12,margin:"2px 0"}}>{d.phone}</div>
                <div style={{display:"inline-block",background:d.available?"rgba(34,197,94,.1)":"rgba(239,68,68,.1)",border:`1px solid ${d.available?"rgba(34,197,94,.4)":"rgba(239,68,68,.3)"}`,borderRadius:20,padding:"2px 10px",fontSize:10,color:d.available?T.green:T.red,letterSpacing:1}}>{d.available?"✓ Available":"✗ Unavailable"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// TEAM DRAWER
// ════════════════════════════════════════════════════════
function TeamDrawer({isOpen,onClose}) {
  const [q,setQ]=useState("");
  const all=[...CREW_COUNCIL.RSL,...CREW_COUNCIL.SRM,...CREW_COUNCIL.RM,...CREW_COUNCIL.MEMBERS.slice(0,20)];
  const shown=all.filter(m=>m.name.toLowerCase().includes(q.toLowerCase())||m.role.toLowerCase().includes(q.toLowerCase()));
  if(!isOpen) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(30,27,75,.55)",zIndex:8000,display:"flex",justifyContent:"flex-end",backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"min(460px,100vw)",height:"100vh",background:T.white,borderLeft:`1px solid ${T.border}`,boxShadow:`-20px 0 60px rgba(124,58,237,.14)`,overflowY:"auto",animation:"slideInRight .35s ease"}}>
        <div style={{position:"sticky",top:0,background:T.white,borderBottom:`1px solid ${T.border}`,padding:"22px 22px 14px",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div style={{color:T.p2,fontSize:10,letterSpacing:4,fontFamily:"'Cinzel',serif"}}>DIRECTORY</div>
              <h3 style={{color:T.text,fontFamily:"'Playfair Display',serif",fontSize:22,margin:0}}>Team Members</h3>
            </div>
            <button onClick={onClose} style={{background:T.p5,border:`1px solid ${T.border}`,color:T.p1,width:40,height:40,borderRadius:"50%",cursor:"pointer",fontSize:18}}>✕</button>
          </div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search members..." style={{width:"100%",padding:"10px 14px",background:T.p5,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:8}}>
          {shown.map(m=>{const b=BADGE[m.badge]||BADGE.RS;return(
            <div key={m.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 12px",background:T.p5,borderRadius:10,border:`1px solid ${T.border}`}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:`${b.bg}18`,border:`2px solid ${b.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👤</div>
              <div style={{flex:1}}>
                <div style={{color:T.text,fontSize:13,fontWeight:600}}>{m.name}</div>
                <div style={{color:T.sub,fontSize:11}}>{m.role}</div>
              </div>
              <div style={{background:b.bg,color:b.fg,fontSize:9,fontWeight:700,borderRadius:4,padding:"2px 6px"}}>{m.badge}</div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// DONOR
// ════════════════════════════════════════════════════════
function DonorSection() {
  const [form,setForm]=useState({name:"",email:"",phone:"",type:"financial",amount:"",message:""});
  const [done,setDone]=useState(false);
  return (
    <section id="donor" style={{padding:"96px 24px",background:T.p5}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <STitle title="Be Our Donor" sub="Support Us"/>
        {done?(
          <div style={{textAlign:"center",padding:60,background:"rgba(124,58,237,.06)",border:`1px solid ${T.border}`,borderRadius:24}}>
            <div style={{fontSize:64,marginBottom:16}}>🙏</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",color:T.p1,fontSize:28,marginBottom:10}}>Thank You!</h3>
            <p style={{color:T.sub,lineHeight:1.8}}>Your support means the world to us. We'll reach out shortly.</p>
            <GBtn primary style={{marginTop:24}} onClick={()=>{setDone(false);setForm({name:"",email:"",phone:"",type:"financial",amount:"",message:""});}}>Submit Another</GBtn>
          </div>
        ):(
          <Card style={{padding:"38px 34px"}}>
            <p style={{color:T.sub,lineHeight:1.8,marginBottom:28,textAlign:"center"}}>Your contribution fuels our community projects, training, and youth development. Every donation makes a difference.</p>
            {[{l:"Full Name *",k:"name",t:"text",p:"Your full name"},{l:"Email Address *",k:"email",t:"email",p:"your@email.com"},{l:"Phone Number",k:"phone",t:"tel",p:"+880 17XX-XXXXXX"},{l:"Donation Amount (BDT)",k:"amount",t:"number",p:"e.g. 1000"}].map(f=>(
              <div key={f.k} style={{marginBottom:18}}>
                <label style={{display:"block",color:T.sub,fontSize:11,letterSpacing:1,fontFamily:"'Cinzel',serif",marginBottom:6}}>{f.l}</label>
                <input type={f.t} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={{width:"100%",padding:"11px 14px",background:T.p5,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{marginBottom:18}}>
              <label style={{display:"block",color:T.sub,fontSize:11,letterSpacing:1,fontFamily:"'Cinzel',serif",marginBottom:6}}>Donation Type</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{width:"100%",padding:"11px 14px",background:T.p5,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:13,outline:"none",boxSizing:"border-box"}}>
                {["financial","equipment","food","medical","volunteer","other"].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div style={{marginBottom:26}}>
              <label style={{display:"block",color:T.sub,fontSize:11,letterSpacing:1,fontFamily:"'Cinzel',serif",marginBottom:6}}>Message (Optional)</label>
              <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} rows={3} style={{width:"100%",padding:"11px 14px",background:T.p5,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:13,outline:"none",boxSizing:"border-box",resize:"vertical"}}/>
            </div>
            <div style={{textAlign:"center"}}>
              <GBtn primary onClick={()=>{if(form.name&&form.email)setDone(true);}}>Submit Donation Intent 💜</GBtn>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// CONTACT
// ════════════════════════════════════════════════════════
function ContactSection() {
  const [form,setForm]=useState({name:"",email:"",subject:"",message:""});
  const [sent,setSent]=useState(false);
  return (
    <section id="contact" style={{padding:"96px 24px",background:T.white}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <STitle title="Get In Touch" sub="Contact Us"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40}}>
          <div>
            <h3 style={{fontFamily:"'Playfair Display',serif",color:T.p1,fontSize:24,marginBottom:28}}>Reach Out</h3>
            {[["📍","Address",CFG.address],["📧","Email",CFG.email],["📞","Phone",CFG.phone],["📅","Founded",CFG.founded]].map(([ic,lb,vl])=>(
              <div key={lb} style={{display:"flex",gap:14,marginBottom:22}}>
                <span style={{fontSize:22,flexShrink:0,width:30}}>{ic}</span>
                <div><div style={{color:T.mute,fontSize:10,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:4}}>{lb}</div><div style={{color:T.text,fontSize:14,lineHeight:1.6}}>{vl}</div></div>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:28}}>
              {Object.entries(CFG.social).map(([k,url])=>(
                <a key={k} href={url} target="_blank" rel="noopener noreferrer" style={{width:42,height:42,borderRadius:"50%",background:T.p5,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,textDecoration:"none",transition:"all .25s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${T.p1}15`;e.currentTarget.style.borderColor=T.p1;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=T.p5;e.currentTarget.style.borderColor=T.border;}}
                >{k==="facebook"?"📘":k==="youtube"?"📺":"📸"}</a>
              ))}
            </div>
          </div>
          <Card style={{padding:"30px"}}>
            {sent?(
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{fontSize:52,marginBottom:14}}>✉️</div>
                <h4 style={{color:T.p1,fontFamily:"'Playfair Display',serif",fontSize:22}}>Message Sent!</h4>
                <p style={{color:T.sub}}>We'll get back to you soon.</p>
                <GBtn onClick={()=>{setSent(false);setForm({name:"",email:"",subject:"",message:""});}} style={{marginTop:16}}>Send Another</GBtn>
              </div>
            ):(
              <>
                {[{l:"Your Name",k:"name",t:"text"},{l:"Email Address",k:"email",t:"email"},{l:"Subject",k:"subject",t:"text"}].map(f=>(
                  <div key={f.k} style={{marginBottom:14}}>
                    <label style={{display:"block",color:T.sub,fontSize:11,letterSpacing:1,fontFamily:"'Cinzel',serif",marginBottom:6}}>{f.l}</label>
                    <input type={f.t} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} style={{width:"100%",padding:"10px 13px",background:T.p5,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                  </div>
                ))}
                <div style={{marginBottom:18}}>
                  <label style={{display:"block",color:T.sub,fontSize:11,letterSpacing:1,fontFamily:"'Cinzel',serif",marginBottom:6}}>Message</label>
                  <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} rows={4} style={{width:"100%",padding:"10px 13px",background:T.p5,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:13,outline:"none",boxSizing:"border-box",resize:"vertical"}}/>
                </div>
                <GBtn primary onClick={()=>{if(form.name&&form.email)setSent(true);}} style={{width:"100%"}}>Send Message →</GBtn>
              </>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// NAVBAR
// ════════════════════════════════════════════════════════
function Navbar({scrollTo,onTeamOpen}) {
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  return (
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:5000,height:62,background:scrolled?"rgba(255,255,255,.94)":"rgba(248,245,255,.7)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${scrolled?T.border:"transparent"}`,boxShadow:scrolled?`0 2px 20px rgba(124,58,237,.09)`:"none",transition:"all .4s",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${T.p1},${T.acc})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 12px ${T.p1}44`}}>⚜️</div>
          <div>
            <div style={{color:T.p1,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,lineHeight:1}}>RPI</div>
            <div style={{color:T.text,fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,lineHeight:1}}>Rover Scouts</div>
          </div>
        </div>
        <div style={{display:"flex",gap:22,alignItems:"center"}}>
          {NAV_LINKS.slice(0,5).map(l=>(
            <button key={l.id} onClick={()=>scrollTo(l.id)} style={{background:"none",border:"none",color:T.sub,fontSize:11,fontFamily:"'Cinzel',serif",letterSpacing:1.5,cursor:"pointer",transition:"color .2s",padding:"4px 0"}} onMouseEnter={e=>e.currentTarget.style.color=T.p1} onMouseLeave={e=>e.currentTarget.style.color=T.sub}>{l.label}</button>
          ))}
        </div>
        <button onClick={()=>setOpen(true)} style={{background:`rgba(124,58,237,.08)`,border:`1px solid ${T.border}`,borderRadius:10,width:42,height:42,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,cursor:"pointer",backdropFilter:"blur(8px)",transition:"all .25s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=`rgba(124,58,237,.15)`;e.currentTarget.style.borderColor=T.p2;}}
          onMouseLeave={e=>{e.currentTarget.style.background=`rgba(124,58,237,.08)`;e.currentTarget.style.borderColor=T.border;}}
        >{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:T.p1}}/>)}</button>
      </nav>

      {open&&(
        <div style={{position:"fixed",inset:0,zIndex:7000,background:"rgba(30,27,75,.45)",backdropFilter:"blur(8px)"}} onClick={()=>setOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:62,left:0,right:0,background:"rgba(255,255,255,.97)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,boxShadow:`0 20px 60px rgba(124,58,237,.1)`,animation:"slideDown .3s ease",padding:"22px 28px 28px"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:8,maxWidth:1000,margin:"0 auto"}}>
              {NAV_LINKS.map(l=>(
                <button key={l.id} onClick={()=>{scrollTo(l.id);setOpen(false);}} style={{background:T.p5,border:`1px solid ${T.border}`,borderRadius:10,padding:"13px 18px",color:T.text,fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:2,cursor:"pointer",textAlign:"left",transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${T.p1}10`;e.currentTarget.style.borderColor=T.p1;e.currentTarget.style.color=T.p1;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=T.p5;e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text;}}
                >{l.label}</button>
              ))}
              <button onClick={()=>{onTeamOpen();setOpen(false);}} style={{background:`${T.p1}10`,border:`1px solid ${T.p2}55`,borderRadius:10,padding:"13px 18px",color:T.p1,fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:2,cursor:"pointer",textAlign:"left"}}>👥 Team Directory</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════
export default function App() {
  const [teamOpen,setTeamOpen]=useState(false);
  const scrollTo=id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cinzel:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{cursor:none;}
        body{background:${T.bg};color:${T.text};font-family:Georgia,serif;overflow-x:hidden;scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:${T.p5};}
        ::-webkit-scrollbar-thumb{background:${T.p2};border-radius:3px;}
        section,nav{position:relative;z-index:1;}
        button,a,input,textarea,select{cursor:none!important;}

        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-8px);}}
        @keyframes scrollDot{0%,100%{opacity:0;transform:translateY(0);}50%{opacity:1;transform:translateY(6px);}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideInRight{from{transform:translateX(100%);}to{transform:translateX(0);}}
        @keyframes sparkFade{0%{opacity:.8;transform:scale(1);}100%{opacity:0;transform:scale(0) translateY(-22px);}}
        @keyframes blobFloat{from{transform:scale(1) translateY(0);}to{transform:scale(1.08) translateY(-20px);}}
        @keyframes dropFall{0%{opacity:0;transform:translateY(-30px);}15%{opacity:.8;}85%{opacity:.5;}100%{opacity:0;transform:translateY(120vh);}}
        @keyframes pulseRing{0%{opacity:.5;transform:translate(-50%,-50%) scale(.4);}100%{opacity:0;transform:translate(-50%,-50%) scale(2.2);}}
        @keyframes heartbeat{0%,100%{transform:scale(1);}14%{transform:scale(1.22);}28%{transform:scale(1);}42%{transform:scale(1.15);}70%{transform:scale(1);}}
        @keyframes dropletPulse{0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,.3);}50%{box-shadow:0 0 0 8px rgba(220,38,38,0);}}

        input::placeholder,textarea::placeholder{color:${T.mute};}
        input:focus,textarea:focus,select:focus{border-color:${T.p1}!important;box-shadow:0 0 0 3px ${T.p1}18!important;outline:none!important;}
        select option{background:#fff;color:${T.text};}

        .upload-overlay:hover{opacity:1!important;}
      `}</style>

      <Cursor/>
      <Trail/>
      <Navbar scrollTo={scrollTo} onTeamOpen={()=>setTeamOpen(true)}/>
      <TeamDrawer isOpen={teamOpen} onClose={()=>setTeamOpen(false)}/>

      <main>
        <HeroSection scrollTo={scrollTo}/>
        <AboutSection/>
        <ProjectsSection/>
        <AwardsSection/>
        <CrewSection/>
        <AlumniSection/>
        <GallerySection/>
        <BloodSection/>
        <DonorSection/>
        <ContactSection/>
        {/* ══ ADD MORE SECTIONS HERE ══ */}
      </main>

      <footer style={{background:`linear-gradient(180deg,${T.white},${T.p5})`,borderTop:`1px solid ${T.border}`,padding:"52px 32px 32px",textAlign:"center"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{width:54,height:54,borderRadius:"50%",background:`linear-gradient(135deg,${T.p1},${T.acc})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px",boxShadow:`0 8px 24px ${T.p1}44`}}>⚜️</div>
          <div style={{fontFamily:"'Playfair Display',serif",color:T.text,fontSize:22,marginBottom:4}}>{CFG.name}</div>
          <div style={{fontFamily:"'Cinzel',serif",color:T.p1,fontSize:11,letterSpacing:3,marginBottom:28}}>{CFG.subtitle}</div>
          <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginBottom:32}}>
            {NAV_LINKS.map(l=>(
              <button key={l.id} onClick={()=>scrollTo(l.id)} style={{background:"none",border:"none",color:T.mute,fontSize:11,fontFamily:"'Cinzel',serif",letterSpacing:1.5,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.color=T.p1} onMouseLeave={e=>e.currentTarget.style.color=T.mute}>{l.label}</button>
            ))}
          </div>
          <div style={{width:"100%",height:1,background:`linear-gradient(90deg,transparent,${T.p3}44,transparent)`,marginBottom:22}}/>
          <div style={{color:T.mute,fontSize:12}}>© {new Date().getFullYear()} {CFG.name} Rover Scout Group · Group No. {CFG.groupNo}</div>
          <div style={{color:T.p3,fontSize:11,marginTop:6,fontStyle:"italic"}}>"{CFG.motto}"</div>
        </div>
      </footer>
    </>
  );
}
