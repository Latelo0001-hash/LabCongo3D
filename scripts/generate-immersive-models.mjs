// Original LabCongo geometry. Reference: the project's approved photographic direction.
// Keeps animated lids and doors separate; merges static parts by material for fewer draw calls.
import { mkdir, writeFile, mkdtemp, rm, stat } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { URL, fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { log } from 'node:console';
import { Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, BufferGeometry, Float32BufferAttribute, Color, BoxGeometry, CylinderGeometry, TorusGeometry, Shape, ExtrudeGeometry, TubeGeometry, LatheGeometry, CatmullRomCurve3, Vector2, Vector3, Matrix4, Box3, DoubleSide } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries, mergeVertices, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(data => { this.result = data; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(data => { this.result = `data:${blob.type};base64,${Buffer.from(data).toString('base64')}`; this.onloadend?.(); }); }
};
const material = (name, color, roughness, metalness = 0, extra = {}) => new MeshStandardMaterial({name, color, roughness, metalness, ...extra});
// Solution vue au travers du verre : c'est le verre qui brille ; la solution reste mate et garde sa couleur pleine,
// avec un éclat propre, comme traversée par le jour (le film la soustrait au tone mapping, qui la délaverait).
const liquid = (name, color) => new MeshPhysicalMaterial({name, color: '#ffffff', vertexColors: true, roughness: .35, emissive: new Color(color).multiplyScalar(.32), userData: {tint: color}});
const mats = {
  enamel: material('Ivory enamel', '#e4e0d4', .27, .12),
  rubber: material('Rubber', '#111318', .72),
  black: material('Anodised aluminium', '#1a1c21', .33, .62),
  chrome: material('Brushed steel', '#b6bbc0', .24, .95),
  darkSteel: material('Dark steel', '#505960', .4, .85),
  edgeSteel: material('Galvanised fittings', '#9da6aa', .43, .85),
  paper: material('Label','#e8e1ce',.95),
  plywood: material('Plywood face','#ffffff',.84),
  pine: material('Pine framing','#f3dfb9',.82),
  foam: material('Packing foam','#242931',.98),
  paint: material('Container enamel','#284f68',.48,.38),
  inside: material('Container interior','#9caaa9',.75,.15),
  seal: material('Door seals','#272d2e',.93),
  lamp: material('Rear lamp','#a3141a',.35,.1,{emissive:'#4a0407'}),
  // Matériel de la paillasse (photo du laboratoire) : matériaux physiques. Le verre transmet la lumière : la photo
  // reste visible au travers, avec ses reflets. Les solutions, vives, gardent un léger éclat propre et un dégradé
  // (couleurs de sommets) du fond, plus sombre, vers la surface, comme sur la photo.
  glass: new MeshPhysicalMaterial({name:'Laboratory glass',color:'#ffffff',metalness:0,roughness:.03,transmission:1,thickness:.002,ior:1.5,specularIntensity:1,side:DoubleSide}),
  white: new MeshPhysicalMaterial({name:'White enamel',color:'#ecebe6',roughness:.38,clearcoat:.55,clearcoatRoughness:.22}),
  plastic: new MeshPhysicalMaterial({name:'White plastic',color:'#f1f1ec',roughness:.46,clearcoat:.25,clearcoatRoughness:.35}),
  labBlack: new MeshPhysicalMaterial({name:'Black enamel',color:'#16181c',roughness:.42,clearcoat:.45,clearcoatRoughness:.25}),
  blue: new MeshPhysicalMaterial({name:'Blue plastic',color:'#1736c8',roughness:.32,clearcoat:.5,clearcoatRoughness:.2}),
  visor: new MeshPhysicalMaterial({name:'Clear visor',color:'#efeaff',metalness:0,roughness:.04,transmission:.92,thickness:.0015,ior:1.58,specularIntensity:1,side:DoubleSide}),
  // L'eau est translucide, pas en transmission : un objet en transmission ne se voit pas au travers d'un autre.
  water: new MeshPhysicalMaterial({name:'Clear solution',color:'#d3e6ef',roughness:.04,clearcoat:1,clearcoatRoughness:.05,transparent:true,opacity:.34,depthWrite:false}),
  liquidBlue: liquid('Blue solution','#0a3bd8'),
  liquidAmber: liquid('Amber solution','#f09a08'),
  liquidRed: liquid('Red solution','#dc1018'),
  liquidGreen: liquid('Green solution','#119c46'),
  liquidTeal: liquid('Teal solution','#0aaec4'),
};
const cache = new Map();
function cached(key, fn) { if(!cache.has(key)) cache.set(key,fn()); return cache.get(key); }
function part(parent,name,geo,mat,pos=[0,0,0],rot=[0,0,0]) {
  const mesh=new Mesh(geo,mats[mat]);mesh.name=name;mesh.position.set(...pos);mesh.rotation.set(...rot);parent.add(mesh);return mesh;
}
function group(parent,name,pos=[0,0,0]) { const g=new Group();g.name=name;g.position.set(...pos);parent?.add(g);return g; }
function box(g,name,size,mat,pos,r=.015,rot=[0,0,0]) {
  return part(g,name,cached(`box${size},${r}`,()=>r?new RoundedBoxGeometry(...size,2,Math.min(r,Math.min(...size)/2)):new BoxGeometry(...size)),mat,pos,rot);
}
function cyl(g,name,r1,r2,h,mat,pos,rot=[0,0,0],segments=32) {
  return part(g,name,cached(`cyl${r1},${r2},${h},${segments}`,()=>new CylinderGeometry(r1,r2,h,segments)),mat,pos,rot);
}
function ring(g,name,radius,tube,mat,pos,rot=[0,0,0]) {
  return part(g,name,cached(`ring${radius},${tube}`,()=>new TorusGeometry(radius,tube,6,40)),mat,pos,rot);
}
function screw(g,pos,rot=[0,0,0],radius=.017) {
  const s=group(g,'Fastener',pos);s.rotation.set(...rot);
  cyl(s,'Screw head',radius,radius,.009,'chrome',[0,0,0],[Math.PI/2,0,0],12);
  box(s,'Screw slot',[radius*1.3,.003,.002],'black',[0,0,.0055],0);
}
function extrude(g,name,shape,depth,mat,pos,bevel=.02) {
  const geometry = new ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:bevel>0,bevelSegments:3,bevelSize:bevel,bevelThickness:bevel,curveSegments:24});
  return part(g,name,toCreasedNormals(geometry,.7),mat,pos);
}

function crate() {
  const g=group(null,'Protected transport crate');
  box(g,'Plywood bottom',[1.93,.10,1.63],'plywood',[0,-.9,0],.006);
  for(const side of [-1,1]){
    box(g,'Plywood side',[.08,1.6,1.65],'plywood',[side*.93,-.07,0],.005);
    box(g,'Plywood face',[1.88,1.6,.08],'plywood',[0,-.07,side*.8],.005);
    for(const x of [-.73,.73]){
      box(g,'Timber upright',[.11,1.61,.07],'pine',[x,-.07,side*.875],.008);
      for(const y of [-.74,.59]) screw(g,[x,y,side*.916],side<0?[0,Math.PI,0]:[0,0,0],.023);
    }
    for(const y of [-.77,.62]){
      box(g,'Cross brace',[1.96,.1,.075],'pine',[0,y,side*.875],.008);
      box(g,'Side brace',[.075,.1,1.66],'pine',[side*.99,y,0],.008);
    }
    // Recessed steel carry handle and pivot brackets.
    box(g,'Handle backplate',[.28,.19,.018],'edgeSteel',[0,.10,side*.852],.018);
    box(g,'Handle recess',[.20,.095,.02],'darkSteel',[0,.1,side*.866],.015);
    const handle=group(g,'Carry handle',[0,.10,side*.884]);
    for(const x of [-.09,.09]) cyl(handle,'Handle side',.012,.012,.065,'chrome',[x,-.01,side*.018]);
    cyl(handle,'Handle bar',.012,.012,.18,'chrome',[0,-.045,side*.018],[0,0,Math.PI/2]);
    for(const x of [-.115,.115]) screw(g,[x,.16,side*.869],side<0?[0,Math.PI,0]:[0,0,0],.013);
    // Calage en mousse avec un évidement central pour le microscope.
    box(g,'Foam side',[.32,1.21,1.39],'foam',[side*.70,-.22,0],.025);
    box(g,'Foam end',[1.15,1.21,.20],'foam',[0,-.22,side*.61],.025);
    for(const z of [-.83,.83]){
      box(g,'Corner angle',[.05,1.65,.075],'edgeSteel',[side*.983,-.07,z],.006);
      box(g,'Corner angle face',[.10,1.65,.025],'edgeSteel',[side*.944,-.07,z+Math.sign(z)*.025],.004);
      for(const y of [-.71,.02,.58]) screw(g,[side*.942,y,z+Math.sign(z)*.04],z<0?[0,Math.PI,0]:[0,0,0],.018);
    }
    box(g,'Skid',[.16,.1,1.7],'pine',[side*.65,-1.01,0],.008);
  }
  box(g,'Shipping label',[.24,.18,.004],'paper',[.39,.27,.846],.002);
  for(const x of [.34,.43]){
    box(g,'Up arrow shaft',[.013,.09,.003],'black',[x,.265,.85],0);
    const triangle=new Shape();triangle.moveTo(-.035,0);triangle.lineTo(.035,0);triangle.lineTo(0,.038);triangle.closePath();
    extrude(g,'Up arrow',triangle,.003,'black',[x,.307,.85],0);
  }
  const lid=group(g,'CrateLid');
  box(lid,'Lid plywood',[2.02,.09,1.76],'plywood',[0,0,0],.005);
  for(const x of [-.73,.73]){
    box(lid,'Lid batten',[.12,.07,1.76],'pine',[x,.08,0],.005);
    for(const z of [-.74,.74]) screw(lid,[x,.12,z],[-Math.PI/2,0,0],.023);
  }
  box(lid,'Foam under lid',[1.75,.045,1.45],'foam',[0,-.07,0],.015);
  return g;
}

function corrugation(g,name,span,height,ribs,mat,pos,rotation=0) {
  // Folded sheet profile rather than rectangular strips stuck on a wall.
  const shape=new Shape();shape.moveTo(-span/2,-.025);
  const pitch=span/ribs;
  for(let i=0;i<ribs;i++){
    const x=-span/2+i*pitch;
    shape.lineTo(x+pitch*.15,-.025);shape.lineTo(x+pitch*.31,.024);shape.lineTo(x+pitch*.69,.024);shape.lineTo(x+pitch*.85,-.025);shape.lineTo(x+pitch,-.025);
  }
  shape.lineTo(span/2,-.043);shape.lineTo(-span/2,-.043);shape.closePath();
  const wall=extrude(g,name,shape,height,mat,pos,.002);
  wall.rotation.set(Math.PI/2,0,0);
  const pivot=group(g,name+' orientation',pos);wall.position.set(0,0,0);pivot.add(wall);pivot.rotation.y=rotation;
}
function container() {
  const g=group(null,'Shipping container detailed');
  const w=2.7,h=2.8,d=4.9;
  box(g,'Floor',[w,.1,d],'plywood',[0,.12,0],.01);
  for(const sign of [-1,1]){
    corrugation(g,'Corrugated side',d-.2,h-.24,18,'paint',[sign*(w/2-.035),h-.10,0],sign*Math.PI/2);
    for(const y of [.12,h-.055]) box(g,'Side rail',[.12,.13,d],'paint',[sign*w/2,y,0],.016);
    for(const z of [-d/2,d/2]){
      box(g,'Corner post',[.14,h,.14],'paint',[sign*w/2,h/2,z],.013);
      for(const y of [.09,h-.09]){
        box(g,'Corner casting',[.21,.18,.21],'darkSteel',[sign*w/2,y,z],.02);
        box(g,'Lifting aperture',[.105,.065,.003],'black',[sign*w/2,y,z+Math.sign(z)*.107],.024);
      }
    }
  }
  corrugation(g,'Back sheet',w-.14,h-.2,10,'paint',[0,h-.1,-d/2+.04],Math.PI);
  box(g,'Roof',[w,.055,d],'paint',[0,h+.005,0],.018);
  for(let i=0;i<18;i++) box(g,'Roof rib',[w-.18,.035,.12],'paint',[0,h+.045,-d/2+.15+i*(d-.3)/18],.015);
  for(const y of [.12,h-.055]) for(const z of [-d/2,d/2]) box(g,'End rail',[w,.13,.12],'paint',[0,y,z],.014);
  // Lighter lining gives the open container readable depth.
  box(g,'Interior back',[w-.23,h-.3,.02],'inside',[0,h/2,-d/2+.08],.003);
  for(const sign of [-1,1]) box(g,'Interior side',[.012,h-.3,d-.2],'inside',[sign*(w/2-.11),h/2,0],.002);
  for(const [name,x,sign] of [['DoorLeft',-w/2,1],['DoorRight',w/2,-1]]){
    const door=group(g,name,[x,0,d/2+.015]);
    const center=sign*w/4;
    box(door,'Door rubber perimeter',[w/2,h-.12,.075],'seal',[center,h/2,0],.018);
    corrugation(door,'Folded door',w/2-.13,h-.25,4,'paint',[center,h-.125,.055]);
    for(const xx of [sign*.09,sign*(w/2-.09)]) box(door,'Door edge',[.07,h-.2,.085],'paint',[xx,h/2,.06],.011);
    for(const y of [.14,h-.14]) box(door,'Door cross rail',[w/2-.13,.065,.09],'paint',[center,y,.075],.01);
    for(const dx of [.32,1.02]){
      cyl(door,'Locking rod',.025,.025,h-.32,'edgeSteel',[sign*dx,h/2,.15]);
      for(const y of [.25,.9,1.95,h-.25]){
        box(door,'Rod keeper',[.11,.08,.07],'edgeSteel',[sign*dx,y,.14],.01);
        for(const off of [-.037,.037]) screw(door,[sign*dx+off,y,.18],[0,0,0],.015);
      }
      box(door,'Latch housing',[.08,.14,.1],'darkSteel',[sign*dx,1.15,.18],.014);
      cyl(door,'Door lever',.023,.023,.26,'edgeSteel',[sign*(dx-.1),1.15,.22],[0,0,Math.PI/2]);
      box(door,'Lever grip',[.13,.045,.05],'black',[sign*(dx-.18),1.15,.22],.012);
    }
    for(const y of [.4,1.4,2.4]){
      cyl(door,'Hinge pin',.031,.031,.18,'edgeSteel',[0,y,.1]);
      box(door,'Hinge strap',[.19,.1,.04],'paint',[sign*.075,y,.085],.008);
    }
  }
  return g;
}

function chassis() {
  // Skeletal 20 ft trailer; front toward +X, king pin at the origin to sit on the tractor's fifth wheel.
  const g=group(null,'Container chassis');
  const top=1.25, length=5.9, front=.7, rear=front-length;
  for(const z of [-.48,.48]) box(g,'Main beam',[length,.32,.16],'darkSteel',[front-length/2,top-.2,z],.02);
  for(const z of [-1.18,1.18]) box(g,'Side rail',[length-.3,.12,.1],'darkSteel',[front-length/2,top-.08,z],.012);
  for(let i=0;i<9;i++) box(g,'Cross member',[.12,.16,2.36],'darkSteel',[front-.25-i*(length-.5)/8,top-.12,0],.012);
  box(g,'Upper coupler plate',[1.5,.08,1.1],'darkSteel',[.05,top-.06,0],.02);
  cyl(g,'King pin',.045,.045,.12,'edgeSteel',[0,top-.16,0],[0,0,0],16);
  for(const x of [.25,-4.65]) for(const z of [-1.2,1.2]) box(g,'Twist lock',[.16,.08,.16],'edgeSteel',[x,top+.01,z],.01);
  for(const z of [-.9,.9]){
    box(g,'Landing leg',[.12,.72,.12],'darkSteel',[-1.1,top-.6,z],.01);
    box(g,'Landing foot',[.3,.05,.22],'darkSteel',[-1.1,top-.97,z],.01);
  }
  for(const x of [-3.55,-4.45]) for(const z of [-.48,.48]) box(g,'Spring hanger',[.5,.3,.1],'darkSteel',[x,top-.42,z],.01);
  for(const [name,x] of [['AxleFront',-3.55],['AxleRear',-4.45]]){
    const axle=group(g,name,[x,.5,0]);
    cyl(axle,'Axle beam',.06,.06,2.2,'darkSteel',[0,0,0],[Math.PI/2,0,0],16);
    for(const z of [-1,1]){
      cyl(axle,'Tyre tread',.5,.5,.26,'rubber',[0,0,z],[Math.PI/2,0,0],40);
      for(const side of [-.13,.13]) ring(axle,'Tyre shoulder',.44,.06,'rubber',[0,0,z+side]);
      cyl(axle,'Rim',.29,.29,.28,'edgeSteel',[0,0,z],[Math.PI/2,0,0],24);
      cyl(axle,'Hub',.1,.1,.3,'darkSteel',[0,0,z],[Math.PI/2,0,0],12);
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;cyl(axle,'Wheel nut',.018,.018,.31,'chrome',[Math.cos(a)*.16,Math.sin(a)*.16,z],[Math.PI/2,0,0],6);}
    }
  }
  for(const z of [-1,1]) box(g,'Mudguard',[1.7,.04,.42],'black',[-4,1.07,z],.01);
  box(g,'Rear bumper',[.12,.14,2.3],'darkSteel',[rear+.1,.55,0],.012);
  for(const z of [-.95,.95]) box(g,'Rear lamp',[.06,.12,.32],'lamp',[rear+.04,.75,z],.01);
  return g;
}

// La couture du maillage tourné (début et fin du tour) passe à l'arrière, côté opposé à la caméra : vue au travers
// du verre, elle dessinait un trait au milieu des flacons.
function lathe(g,name,points,mat,segments=48) {
  const mesh=part(g,name,new LatheGeometry(points.map(([x,y])=>new Vector2(x,y)),segments,Math.PI),mat);
  if(mats[mat].vertexColors) shadeLiquid(mesh.geometry,mats[mat].userData.tint,points);
  return mesh;
}
// Solution : plus sombre au fond, plus claire vers la surface.
function shadeLiquid(geometry,tint,points) {
  const ys=points.map(([,y])=>y), low=Math.min(...ys), high=Math.max(...ys);
  const base=new Color(tint), color=new Color(), position=geometry.attributes.position, colors=[];
  for(let i=0;i<position.count;i++){
    const t=(position.getY(i)-low)/((high-low)||1);
    color.copy(base).multiplyScalar(.2+.28*t).lerp(new Color('#ffffff'),t>.97?.1:0);
    colors.push(color.r,color.g,color.b);
  }
  geometry.setAttribute('color',new Float32BufferAttribute(colors,3));
}
function tube(g,name,points,radius,mat,radial=8) {
  return part(g,name,new TubeGeometry(new CatmullRomCurve3(points.map(p=>new Vector3(...p))),32,radius,radial,false),mat);
}

// Bande à section rectangulaire arrondie balayée le long d'un chemin : épaisseur (vers le centre de courbure) et hauteur.
function sweep(g,name,points,thickness,height,mat,steps=56) {
  const w=thickness/2, h=height/2, r=Math.min(w,h)*.8, profile=new Shape();
  profile.moveTo(-w+r,-h);profile.lineTo(w-r,-h);profile.quadraticCurveTo(w,-h,w,-h+r);profile.lineTo(w,h-r);
  profile.quadraticCurveTo(w,h,w-r,h);profile.lineTo(-w+r,h);profile.quadraticCurveTo(-w,h,-w,h-r);profile.lineTo(-w,-h+r);
  profile.quadraticCurveTo(-w,-h,-w+r,-h);
  const geometry=new ExtrudeGeometry(profile,{steps,bevelEnabled:false,curveSegments:4,extrudePath:new CatmullRomCurve3(points.map(p=>new Vector3(...p)))});
  return part(g,name,toCreasedNormals(geometry,.9),mat);
}

// Matériel de la paillasse du premier plan, d'après la photo du laboratoire et les images de référence.
// En mètres, chaque objet a sa base à l'origine de son groupe et son avant tourné vers +Z (la caméra de la photo).
// Récipient de verre : paroi extérieure et intérieure (épaisseur visible au bord), lèvre arrondie au col.
function vessel(g,name,profile,wall=.0012,segments=48) {
  const inner=profile.slice().reverse().map(([x,y])=>[Math.max(0,x-wall),Math.max(wall,y)]);
  const [rx,ry]=profile[profile.length-1];
  return lathe(g,name,[[0,0],...profile,[rx+wall*.6,ry+wall*.5],...inner,[0,wall]],'glass',segments);
}
function erlenmeyer(g,name,scale,liquid,fill) {
  const flask=group(g,name);
  const r=v=>v*scale;
  const profile=[[r(.048),0],[r(.051),r(.004)],[r(.051),r(.013)],[r(.017),r(.108)],[r(.0135),r(.116)],[r(.0135),r(.15)],[r(.0158),r(.153)],[r(.0158),r(.158)]];
  vessel(flask,'Flask glass',profile,r(.0014));
  if(!liquid) return flask;
  // La solution suit la paroi conique jusqu'à sa surface, légèrement relevée contre le verre (ménisque).
  const top=r(.013)+fill*r(.095), radius=r(.051)-r(.034)*(top-r(.013))/r(.095)-r(.0016);
  lathe(flask,'Flask solution',[[0,r(.0016)],[r(.047),r(.0016)],[r(.0494),r(.005)],[r(.0494),r(.013)],[radius,top+r(.0015)],[radius*.85,top],[0,top]],liquid);
  return flask;
}
// Bécher à solution : paroi droite, bec, rempli à `fill` de sa hauteur.
function beaker(g,name,radius,height,liquid,fill) {
  const cup=group(g,name);
  vessel(cup,'Beaker glass',[[radius,0],[radius+.0015,.003],[radius+.0015,height],[radius+.004,height+.004]],.0011);
  const top=height*fill;
  lathe(cup,'Beaker solution',[[0,.0014],[radius,.0014],[radius+.0003,.004],[radius+.0003,top+.0012],[radius*.85,top],[0,top]],liquid);
  return cup;
}
// Flacon à épaule, comme celui de l'eau claire sur la photo : corps droit, épaule conique, col large à lèvre.
function shoulderFlask(g,name,liquid,level) {
  const flask=group(g,name);
  vessel(flask,'Flask glass',[[.039,0],[.0415,.003],[.0415,.066],[.024,.104],[.0205,.11],[.0205,.142],[.0235,.145],[.0235,.15]],.0013);
  lathe(flask,'Flask solution',[[0,.0016],[.038,.0016],[.0398,.004],[.0398,level+.0015],[.034,level],[0,level]],liquid);
  return flask;
}
function tubeRack(g,name,liquids,levels) {
  const rack=group(g,name);
  const count=liquids.length, pitch=.036, width=count*pitch+.016;
  // Plateau supérieur percé d'un trou par tube, plateau inférieur à cuvettes, montants et barre arrière.
  const plate=new Shape();
  plate.moveTo(-width/2,-.029);plate.lineTo(width/2,-.029);plate.lineTo(width/2,.029);plate.lineTo(-width/2,.029);plate.lineTo(-width/2,-.029);
  for(let i=0;i<count;i++){
    const hole=new Shape(), x=(i-(count-1)/2)*pitch;
    hole.absarc(x,0,.0105,0,Math.PI*2,true);plate.holes.push(hole);
  }
  extrude(rack,'Rack top',plate,.006,'plastic',[0,.094,0],.0015).rotation.x=Math.PI/2;
  box(rack,'Rack base',[width,.009,.062],'plastic',[0,.0045,0],.003);
  // Côtés ouverts : deux montants par bout, comme sur la photo.
  for(const side of [-1,1]) for(const z of [-.025,.025]) box(rack,'Rack post',[.009,.1,.01],'plastic',[side*(width/2-.0045),.05,z],.003);
  box(rack,'Rack back bar',[width-.01,.008,.006],'plastic',[0,.05,-.026],.002);
  liquids.forEach((liquid,i)=>{
    const t=group(rack,'Test tube',[(i-(count-1)/2)*pitch,.009,0]);
    vessel(t,'Tube glass',[[.004,0],[.0068,.0025],[.0083,.009],[.0083,.152],[.0091,.155],[.0091,.158]],.0008,28);
    if(liquid){
      const level=levels?.[i]??.09;
      lathe(t,'Tube solution',[[0,.0012],[.0045,.0018],[.0068,.004],[.0074,.009],[.0074,level],[.0062,level-.0012],[0,level-.0012]],liquid,24);
    }
  });
  return rack;
}
function labItems() {
  const g=group(null,'Bench equipment');

  // Microscope binoculaire d'élève, d'après la photo : vu de profil, potence blanche à gauche, bloc noir derrière elle,
  // platine et condenseur noirs, tête blanche, oculaires noirs penchés vers l'utilisateur. Dans le modèle, l'utilisateur
  // est du côté -X ; le film le tourne d'un demi-tour pour le placer à droite, comme sur la photo.
  const m=group(g,'Microscope');
  // Socle peu profond : sur la photo, on en voit surtout la face avant ; un bouton noir à l'avant.
  box(m,'Microscope base',[.225,.048,.12],'white',[.0025,.032,0],.014);
  box(m,'Base plate',[.22,.008,.115],'labBlack',[.0025,.004,0],.003);
  cyl(m,'Base button',.006,.006,.004,'labBlack',[.07,.03,-.06],[Math.PI/2,0,0],16);
  // Bloc noir derrière la potence (côté opposé au spectateur une fois tourné), comme sur la photo.
  box(m,'Rear housing',[.05,.145,.044],'labBlack',[.112,.128,0],.009);
  cyl(m,'Illuminator ring',.022,.022,.004,'chrome',[-.05,.057,0],[0,0,0],32);
  cyl(m,'Illuminator lens',.017,.017,.005,'labBlack',[-.05,.058,0],[0,0,0],32);
  // Potence : colonne droite, qui ne s'incurve qu'en haut pour porter la tête.
  const arm=new Shape();
  arm.moveTo(.03,.056);arm.lineTo(.092,.056);
  arm.lineTo(.092,.21);
  arm.bezierCurveTo(.092,.25,.075,.268,.04,.27);
  arm.lineTo(.0,.27);arm.lineTo(.0,.235);
  arm.bezierCurveTo(.022,.232,.03,.215,.03,.19);
  arm.lineTo(.03,.056);
  extrude(m,'Microscope arm',arm,.044,'white',[0,0,-.022],.007);
  // Mise au point : grosse et fine molettes des deux côtés, crantées.
  for(const side of [-1,1]){
    const z=side*.036;
    cyl(m,'Coarse focus',.027,.027,.014,'labBlack',[.058,.125,z],[Math.PI/2,0,0],28);
    for(let k=0;k<14;k++){const a=k/14*Math.PI*2;box(m,'Knob rib',[.003,.004,.015],'labBlack',[.058+Math.cos(a)*.0275,.125+Math.sin(a)*.0275,z],0,[0,0,a]);}
    cyl(m,'Fine focus',.014,.014,.012,'labBlack',[.058,.125,z+side*.013],[Math.PI/2,0,0],20);
  }
  // Platine noire, valets chromés, chariot et condenseur dessous.
  box(m,'Stage',[.135,.014,.12],'labBlack',[-.04,.17,0],.004);
  box(m,'Stage carrier',[.06,.03,.07],'labBlack',[.01,.155,0],.005);
  box(m,'Mechanical stage',[.04,.01,.09],'labBlack',[-.05,.182,.045],.002);
  cyl(m,'Stage knob',.008,.008,.024,'labBlack',[.0,.15,.05],[0,0,0],16);
  for(const z of [-.032,.032]) box(m,'Stage clip',[.06,.0025,.008],'chrome',[-.08,.178,z],.001);
  cyl(m,'Condenser',.022,.019,.035,'labBlack',[-.045,.144,0],[0,0,0],28);
  cyl(m,'Condenser ring',.0225,.0225,.004,'chrome',[-.045,.16,0],[0,0,0],28);
  // Tête blanche portée par la potence, revolver chromé et objectifs dessous.
  box(m,'Head',[.13,.05,.075],'white',[-.03,.262,0],.016);
  const turret=group(m,'Nosepiece',[-.045,.234,0]);
  cyl(turret,'Revolver',.034,.028,.016,'chrome',[0,0,0],[0,0,0],36);
  ['#c8202a','#e0b21c','#2a5bd8','#f2f2ee'].forEach((band,i)=>{
    const a=i/4*Math.PI*2+.4, o=group(turret,'Objective',[Math.cos(a)*.018,-.008,Math.sin(a)*.018]);
    o.rotation.z=Math.cos(a)*.2;o.rotation.x=-Math.sin(a)*.2;
    const length=.026+i*.005;
    cyl(o,'Objective barrel',.009,.007,length,'chrome',[0,-length/2,0],[0,0,0],20);
    mats['band'+i]??=material('Objective band '+i,band,.35);
    cyl(o,'Objective band',.0092,.0092,.004,'band'+i,[0,-.008,0],[0,0,0],20);
    cyl(o,'Objective tip',.006,.005,.004,'labBlack',[0,-length-.001,0],[0,0,0],16);
  });
  // Tête binoculaire : prisme blanc, puis deux oculaires noirs penchés vers l'utilisateur, avec bonnettes.
  const prism=group(m,'Binocular head',[-.05,.285,0]);prism.rotation.z=.8;
  box(prism,'Prism housing',[.045,.03,.062],'white',[0,.01,0],.01);
  for(const z of [-.032,.032]){
    const e=group(prism,'Eyepiece',[0,.022,z]);
    cyl(e,'Eyepiece tube',.0115,.0125,.062,'labBlack',[0,.031,0],[0,0,0],24);
    cyl(e,'Eyepiece collar',.0135,.0135,.008,'chrome',[0,.01,0],[0,0,0],24);
    cyl(e,'Eyecup',.0138,.0128,.016,'labBlack',[0,.07,0],[0,0,0],24);
  }

  // Portoir blanc aux tubes de couleur, comme sur la paillasse, et portoir aux tubes bleus, coupé par le bord gauche de la photo.
  tubeRack(g,'TubeRack',['liquidAmber','liquidRed','liquidGreen','liquidTeal',null],[.064,.074,.07,.072]);
  tubeRack(g,'BlueRack',['liquidBlue','liquidBlue','liquidBlue','liquidBlue'],[.074,.064,.072,.069]);
  // Erlenmeyer à la solution bleue, flacon à épaule à l'eau claire, et erlenmeyer vide au bord gauche de la photo.
  erlenmeyer(g,'BlueFlask',1,'liquidBlue',.42);
  shoulderFlask(g,'ClearFlask','water',.064);
  erlenmeyer(g,'LeftFlask',1,null);
  // Matériel des autres tables de la photo : variantes des mêmes objets (couleurs et formes relevées sur la photo).
  erlenmeyer(g,'RedFlask',1,'liquidRed',.4);
  erlenmeyer(g,'AmberFlask',.8,'liquidAmber',.3);
  beaker(g,'YellowBeaker',.022,.058,'liquidAmber',.62);
  beaker(g,'BlueBeaker',.026,.05,'liquidBlue',.66);
  tubeRack(g,'EmptyRack',[null,null,null,null,null]);
  tubeRack(g,'AmberRack',['liquidAmber','liquidAmber','liquidAmber','liquidAmber','liquidAmber'],[.07,.066,.072,.068,.07]);
  tubeRack(g,'SmallRack',['liquidBlue','liquidBlue','liquidRed'],[.07,.064,.072]);
  // Flacon pulvérisateur de la paillasse du milieu : plastique transparent, solution bleue, tête et bec bleus.
  const spray=group(g,'SprayBottle');
  vessel(spray,'Bottle glass',[[.022,0],[.025,.004],[.025,.078],[.021,.09],[.012,.098],[.012,.104]],.0012,40);
  lathe(spray,'Spray solution',[[0,.0015],[.0235,.0015],[.0238,.004],[.0238,.044],[.02,.0432],[0,.0432]],'liquidBlue',40);
  cyl(spray,'Spray cap',.0135,.0135,.014,'blue',[0,.111,0],[0,0,0],24);
  box(spray,'Spray head',[.016,.02,.022],'blue',[0,.127,0],.004);
  tube(spray,'Spray nozzle',[[0,.132,0],[-.012,.134,0],[-.024,.132,0]],.003,'blue',8);
  // Bécher et ses agitateurs blancs, en éventail.
  const cup=group(g,'SwabCup');
  vessel(cup,'Beaker glass',[[.027,0],[.0285,.003],[.0285,.062],[.031,.066]],.001);
  [.28,.15,.03,-.09,-.21].forEach((lean,i)=>{
    const s=group(cup,'Stirring rod',[-.01+.005*i,.003,[.005,-.006,.004,-.004,.006][i]]);
    s.rotation.set([.06,-.08,.07,-.06,.05][i],0,lean);
    cyl(s,'Rod',.0019,.0019,.1,'plastic',[0,.05,0],[0,0,0],8);
  });
  // Pissette : corps en plastique blanc laiteux, bouchon cranté et bec bleus.
  const bottle=group(g,'WashBottle');
  lathe(bottle,'Bottle body',[[0,0],[.021,0],[.025,.003],[.026,.008],[.026,.074],[.023,.084],[.0125,.094],[.0115,.098],[.0115,.104],[0,.104]],'plastic');
  cyl(bottle,'Bottle cap',.0138,.0138,.017,'blue',[0,.112,0],[0,0,0],28);
  for(let k=0;k<18;k++){const a=k/18*Math.PI*2;box(bottle,'Cap rib',[.0016,.014,.0016],'blue',[Math.cos(a)*.0139,.112,Math.sin(a)*.0139],0);}
  cyl(bottle,'Cap top',.009,.011,.006,'blue',[0,.123,0],[0,0,0],20);
  tube(bottle,'Bottle nozzle',[[0,.124,0],[0,.146,0],[-.005,.157,0],[-.02,.161,0],[-.034,.156,0],[-.041,.146,0]],.0028,'blue');

  // Lunettes de protection, d'après la photo : écran incolore enveloppant à deux bombements et échancrure du nez,
  // bandeau bleu épais en haut, montants bleus sur les côtés, attaches et sangle noires.
  const goggles=group(g,'Goggles');
  const span=1.2, radius=.075, height=.05;
  // Bas de l'écran : deux coques autour des yeux, échancrure du nez au milieu, côtés plus courts.
  const bottom=t=>.003+.026*Math.exp(-Math.pow(t/.2,2))+.016*Math.pow(Math.max(0,(Math.abs(t)-.8)/(span-.8)),2);
  const eye=t=>Math.exp(-Math.pow((Math.abs(t)-.55)/.32,2));
  const lens=new BufferGeometry(), positions=[], uvs=[], index=[];
  const columns=48, rows=8;
  for(let i=0;i<=columns;i++){
    const t=-span+2*span*i/columns, low=bottom(t);
    for(let j=0;j<=rows;j++){
      const y=low+(height-low)*j/rows, bulge=1+.07*eye(t)*Math.sin(Math.PI*j/rows);
      positions.push(Math.sin(t)*radius*bulge,y,Math.cos(t)*radius*bulge);
      uvs.push(i/columns,j/rows);
    }
  }
  for(let i=0;i<columns;i++) for(let j=0;j<rows;j++){
    const a=i*(rows+1)+j, b=a+rows+1;
    index.push(a,b,a+1,b,b+1,a+1);
  }
  lens.setAttribute('position',new Float32BufferAttribute(positions,3));lens.setAttribute('uv',new Float32BufferAttribute(uvs,2));
  lens.setIndex(index);lens.computeVertexNormals();
  part(goggles,'Lens',lens,'visor');
  const arc=(r,y,from,to,n=32)=>Array.from({length:n+1},(_,i)=>{const t=from+(to-from)*i/n;return [Math.sin(t)*r,typeof y==='function'?y(t):y,Math.cos(t)*r];});
  // Bord inférieur de l'écran, qui en dessine le contour.
  tube(goggles,'Lens rim',arc(radius*1.003,t=>bottom(t)+.001,-span,span,48),.0016,'visor',6);
  // Bandeau d'une pièce, épais, qui coiffe le haut de l'écran ; montants plats aux deux bouts.
  sweep(goggles,'Frame top',arc(radius*1.012,height-.004,-span-.04,span+.04,48),.009,.016,'blue');
  for(const side of [-1,1]){
    const t=side*span, low=bottom(t), x=Math.sin(t)*radius, z=Math.cos(t)*radius;
    box(goggles,'Frame side',[.008,height-low+.004,.011],'blue',[Math.sin(t)*radius*1.012,(height+low)/2-.002,Math.cos(t)*radius*1.012],.003,[0,t,0]);
    // Attache et départ de la sangle : dans le prolongement de la monture, vers l'arrière (tangente au bout de l'écran).
    const along=[side*Math.cos(t),0,-side*Math.sin(t)], turn=t+side*Math.PI/2;
    const from=(d,out)=>[x*1.012+along[0]*d+Math.sin(t)*out,height*.52,z*1.012+along[2]*d+Math.cos(t)*out];
    box(goggles,'Strap clip',[.007,.019,.016],'rubber',from(.006,.002),.0025,[0,turn,0]);
    box(goggles,'Strap',[.003,.013,.05],'rubber',from(.035,.001),.0012,[0,turn,0]);
  }
  return g;
}


function batch(root, articulated=[]) {
  root.updateMatrixWorld(true);
  const inverse=new Matrix4().copy(root.matrixWorld).invert();
  const bins=new Map();const remove=[];const joints=[];
  function visit(object) {
    if(object!==root && articulated.includes(object.name)){joints.push(object);return;}
    if(object.isMesh){
      let geometry=object.geometry.clone();
      geometry.applyMatrix4(new Matrix4().multiplyMatrices(inverse,object.matrixWorld));
      if(geometry.index) geometry=geometry.toNonIndexed();
      if(!bins.has(object.material))bins.set(object.material,[]);
      bins.get(object.material).push(geometry);remove.push(object);
    }
    for(const child of object.children)visit(child);
  }
  visit(root);for(const mesh of remove)mesh.removeFromParent();
  for(const [mat,geometries] of bins){
    const merged=mergeVertices(mergeGeometries(geometries),.00001);
    const mesh=new Mesh(merged,mat);mesh.name=mat.name;root.add(mesh);
    for(const geometry of geometries)geometry.dispose();
  }
  for(const joint of joints)batch(joint,[]);
  // Keep only useful groups, including articulated nodes.
  root.traverse(object=>{for(const child of [...object.children])if(child.isGroup&&!child.children.length)child.removeFromParent();});
}
const out=new URL('../public/models/immersive/',import.meta.url);await mkdir(out,{recursive:true});
// Optional model names on the command line regenerate only those files.
const only=process.argv.slice(2);
for(const [name,build,joints] of [['crate-v2',crate,['CrateLid']],['container-v2',container,['DoorLeft','DoorRight']],['container-chassis-v2',chassis,['AxleFront','AxleRear']],['bench-equipment-v1',labItems,['Microscope','TubeRack','BlueRack','BlueFlask','ClearFlask','LeftFlask','SwabCup','WashBottle','Goggles','RedFlask','AmberFlask','YellowBeaker','BlueBeaker','EmptyRack','AmberRack','SmallRack','SprayBottle']]]){
  if(only.length&&!only.includes(name))continue;
  const scene=build();
  batch(scene,joints);scene.updateMatrixWorld(true);
  let meshes=0,triangles=0;scene.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;}});
  const bounds=new Box3().setFromObject(scene).getSize(new Vector3());
  const data=await new GLTFExporter().parseAsync(scene,{binary:true,onlyVisible:true});
  const temporary=await mkdtemp(join(tmpdir(),'labcongo-model-'));
  const input=join(temporary,name+'.glb');
  const output=fileURLToPath(new URL(name+'.glb',out));
  try {
    await writeFile(input,Buffer.from(data));
    // Keep UVs for runtime materials and named articulated parts for the scroll animation.
    execFileSync(process.execPath,[fileURLToPath(new URL('../node_modules/gltfpack/cli.js',import.meta.url)),'-i',input,'-o',output,'-cc','-kn','-km','-kv','-vpf','-vtf']);
    const bytes=(await stat(output)).size;
    log(name,`${Math.round(bytes/1024)} KiB`,`${meshes} meshes`,`${triangles} triangles`,bounds.toArray().map(n=>n.toFixed(2)));
  } finally { await rm(temporary,{recursive:true,force:true}); }
}
