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
import { Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, BoxGeometry, CylinderGeometry, TorusGeometry, Shape, Path, ExtrudeGeometry, TubeGeometry, CatmullRomCurve3, Vector3, Matrix4, Box3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries, mergeVertices, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(data => { this.result = data; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(data => { this.result = `data:${blob.type};base64,${Buffer.from(data).toString('base64')}`; this.onloadend?.(); }); }
};
const material = (name, color, roughness, metalness = 0, extra = {}) => new MeshStandardMaterial({name, color, roughness, metalness, ...extra});
const mats = {
  enamel: material('Ivory enamel', '#e4e0d4', .27, .12),
  base: material('Blue grey casting', '#526678', .34, .28),
  rubber: material('Rubber', '#111318', .72),
  black: material('Anodised aluminium', '#1a1c21', .33, .62),
  chrome: material('Brushed steel', '#b6bbc0', .24, .95),
  darkSteel: material('Dark steel', '#505960', .4, .85),
  edgeSteel: material('Galvanised fittings', '#9da6aa', .43, .85),
  lens: new MeshPhysicalMaterial({name:'Optical glass',color:'#74aaa8',metalness:.15,roughness:.05,clearcoat:1,clearcoatRoughness:.02,transparent:true,opacity:.58,depthWrite:false}),
  slide: new MeshPhysicalMaterial({name:'Slide glass',color:'#b8d0ce',metalness:0,roughness:.09,clearcoat:1,transparent:true,opacity:.38,depthWrite:false}),
  red: material('Objective red ring','#a52c2c',.4,.35),
  yellow: material('Objective yellow ring','#bfa656',.4,.35),
  blue: material('Objective blue ring','#335883',.4,.35),
  paper: material('Label','#e8e1ce',.95),
  plywood: material('Plywood face','#ffffff',.84),
  pine: material('Pine framing','#f3dfb9',.82),
  foam: material('Packing foam','#242931',.98),
  paint: material('Container enamel','#284f68',.48,.38),
  inside: material('Container interior','#9caaa9',.75,.15),
  seal: material('Door seals','#272d2e',.93),
  lamp: material('Rear lamp','#a3141a',.35,.1,{emissive:'#4a0407'}),
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
function knurled(g,name,r,h,pos,rot=[0,0,0]) {
  const k=group(g,name,pos);k.rotation.set(...rot);
  cyl(k,'Knob body',r,r,h,'rubber',[0,0,0]);
  for(let i=0;i<32;i++){
    const a=i/32*Math.PI*2;
    cyl(k,'Knurl',.004,.004,h*.88,'black',[Math.cos(a)*r,0,Math.sin(a)*r],[0,0,0],5);
  }
  return k;
}
function extrude(g,name,shape,depth,mat,pos,bevel=.02) {
  const geometry = new ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:bevel>0,bevelSegments:3,bevelSize:bevel,bevelThickness:bevel,curveSegments:24});
  return part(g,name,toCreasedNormals(geometry,.7),mat,pos);
}

function microscope() {
  const g=group(null,'Binocular microscope');
  box(g,'Weighted cast base',[1.28,.22,1.02],'base',[.02,-1,0],.105);
  box(g,'Enamel cover',[1.12,.07,.88],'enamel',[0,-.855,0],.05);
  for(const x of [-.43,.46]) for(const z of [-.33,.33]) cyl(g,'Rubber foot',.09,.08,.06,'rubber',[x,-1.13,z]);
  const arm=new Shape();
  arm.moveTo(.07,-.82);arm.lineTo(.55,-.82);arm.bezierCurveTo(.6,-.55,.66,-.2,.63,.4);
  arm.bezierCurveTo(.63,.68,.38,.76,.02,.77);arm.lineTo(-.35,.72);arm.lineTo(-.37,.46);
  arm.bezierCurveTo(.07,.46,.29,.35,.27,.09);arm.bezierCurveTo(.26,-.21,.15,-.48,.07,-.82);
  extrude(g,'Curved instrument arm',arm,.34,'enamel',[0,0,-.17],.034);
  box(g,'Focussing rack',[.09,.75,.16],'darkSteel',[.32,-.22,0],.005);
  for(let i=0;i<16;i++) box(g,'Rack tooth',[.025,.015,.14],'chrome',[.26,-.56+i*.04,0],.002);
  box(g,'Stage support',[.63,.06,.18],'black',[.02,-.38,0],.015);
  const plate=new Shape();plate.moveTo(-.73,-.43);plate.lineTo(.35,-.43);plate.lineTo(.35,.43);plate.lineTo(-.73,.43);plate.closePath();
  const hole=new Path();hole.absarc(-.3,0,.085,0,Math.PI*2,true);plate.holes.push(hole);
  const platform=extrude(g,'Mechanical stage with aperture',plate,.065,'black',[0,-.27,0],.007);platform.rotation.x=-Math.PI/2;
  box(g,'Moving stage',[.95,.03,.08],'darkSteel',[-.18,-.183,-.31],.005);
  box(g,'Slide carrier',[.08,.02,.56],'chrome',[.07,-.157,-.04],.005);
  box(g,'Slide',[.47,.008,.16],'slide',[-.3,-.176,0],.002);
  for(const z of [-.15,.15]){
    box(g,'Spring clip',[.31,.012,.025],'chrome',[-.36,-.16,z],.004);
    screw(g,[-.21,-.15,z],[-Math.PI/2,0,0],.014);
  }
  for(const x of [-.67,.29]) for(const z of [-.35,.35]) screw(g,[x,-.188,z],[-Math.PI/2,0,0],.012);
  cyl(g,'Condenser collar',.16,.14,.06,'black',[-.3,-.4,0]);
  knurled(g,'Aperture diaphragm',.12,.07,[-.3,-.48,0]);
  cyl(g,'Condenser lens',.09,.105,.08,'chrome',[-.3,-.55,0]);
  box(g,'Iris lever',[.21,.015,.03],'chrome',[-.14,-.48,.04],.003);
  cyl(g,'Illumination assembly',.18,.2,.1,'enamel',[-.3,-.775,0]);
  knurled(g,'Field diaphragm',.143,.038,[-.3,-.702,0]);
  cyl(g,'Illuminator glass',.12,.12,.008,'lens',[-.3,-.681,0]);
  cyl(g,'Head bearing',.18,.19,.12,'darkSteel',[-.31,.53,0]);
  const head=new Shape();head.moveTo(-.66,.58);head.lineTo(-.02,.58);head.lineTo(-.1,.92);head.lineTo(-.38,1.01);head.closePath();
  extrude(g,'Binocular prism housing',head,.48,'enamel',[0,0,-.24],.024);
  for(const z of [-.20,.20]){
    const eye=group(g,'Eyepiece tube',[-.48,.88,z]);eye.rotation.z=Math.PI*.24;
    cyl(eye,'Black optical tube',.113,.117,.25,'black',[0,.115,0]);
    cyl(eye,'Adjustable eyepiece',.105,.105,.12,'darkSteel',[0,.28,0]);
    knurled(eye,'Diopter ring',.118,.055,[0,.235,0]);
    cyl(eye,'Eyecup',.131,.126,.038,'rubber',[0,.357,0]);
    cyl(eye,'Recessed ocular glass',.091,.091,.009,'lens',[0,.361,0]);
    ring(eye,'Eyecup lip',.113,.014,'rubber',[0,.382,0],[Math.PI/2,0,0]);
  }
  screw(g,[-.04,.66,.279]);screw(g,[-.59,.6,.279]);
  const turret=group(g,'Objective turret',[-.32,.395,0]);
  cyl(turret,'Revolver',.252,.235,.065,'black',[0,0,0]);
  ring(turret,'Turret trim',.237,.011,'chrome',[0,-.028,0],[Math.PI/2,0,0]);
  const colours=['red','yellow','blue','chrome'];
  for(let i=0;i<4;i++){
    const a=i*Math.PI/2+.5;
    const objective=group(turret,'Objective',[Math.cos(a)*.16,-.04,Math.sin(a)*.16]);
    objective.rotation.z=Math.cos(a)*.15;objective.rotation.x=-Math.sin(a)*.15;
    const length=.22+i*.04;
    cyl(objective,'Objective barrel',.068,.057,length,'chrome',[0,-length/2,0]);
    knurled(objective,'Objective grip',.069,.06,[0,-.038,0]);
    cyl(objective,'Objective band',.062,.06,.018,colours[i],[0,-length+.03,0]);
    cyl(objective,'Objective tip',.045,.042,.06,'darkSteel',[0,-length-.028,0]);
    cyl(objective,'Front lens',.031,.031,.006,'lens',[0,-length-.06,0]);
  }
  for(const sign of [-1,1]){
    const focus=knurled(g,'Coarse focus',.175,.12,[.45,-.4,sign*.245],[Math.PI/2,0,0]);
    cyl(focus,'Outer ring',.12,.12,.018,'darkSteel',[0,sign*.07,0]);
    knurled(g,'Fine focus',.082,.06,[.45,-.4,sign*.34],[Math.PI/2,0,0]);
  }
  for(const z of [.2,.3]) knurled(g,'Stage control',.045,.1,[.22,-.48,z]);
  cyl(g,'Intensity adjustment',.062,.062,.025,'black',[.44,-.99,.525],[Math.PI/2,0,0]);
  box(g,'Power switch',[.055,.07,.012],'black',[-.42,-.99,.514],.01);
  box(g,'Specification plate',[.16,.07,.003],'darkSteel',[.07,-.99,.518],.003);
  for(let i=0;i<3;i++) box(g,'Plate rules',[.12-i*.02,.004,.001],'chrome',[.07,-.973-i*.013,.521],0);
  const cable=new CatmullRomCurve3([[.6,-.92,-.1],[.9,-1,-.15],[.95,-1.07,.3],[.7,-1.08,.5],[.75,-1.07,.65]].map(p=>new Vector3(...p)));
  part(g,'Power cable',new TubeGeometry(cable,32,.014,6,false),'rubber');
  box(g,'Plug body',[.1,.055,.07],'rubber',[.76,-1.075,.66],.02);
  for(const x of [.73,.79]) cyl(g,'Plug pin',.009,.009,.08,'chrome',[x,-1.075,.73],[Math.PI/2,0,0],10);
  return g;
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
for(const [name,build,joints] of [['microscope-v2',microscope,[]],['crate-v2',crate,['CrateLid']],['container-v2',container,['DoorLeft','DoorRight']],['container-chassis-v2',chassis,['AxleFront','AxleRear']]]){
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
