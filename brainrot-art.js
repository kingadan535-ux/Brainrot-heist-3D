/* Detailed collectible sculptures. Item identities/economy stay in the original catalog. */
(function(root){
'use strict';
const G=root.THREE,geometries=new Map(),materials=new Map(),merged=new Map();
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const geo=(key,fn)=>{if(!geometries.has(key))geometries.set(key,fn());return geometries.get(key)};
function material(c,kind='skin'){const key=c+':'+kind;if(!materials.has(key))materials.set(key,new G.MeshPhongMaterial({color:c,shininess:kind==='metal'?95:kind==='glass'?110:kind==='food'?15:22,specular:kind==='metal'?0xa5bdc9:0x333333,emissive:kind==='glow'?c:0x000000,emissiveIntensity:kind==='glow'?.65:0,flatShading:kind==='crystal'}));return materials.get(key)}
const THEMES={fire:[0x392942,0xe35b22,0xffcf62,0xff8152],ice:[0x254e83,0x98d8ec,0xf0fcff,0x52dfff],cosmic:[0x222f67,0x6558cb,0xe8c477,0x67f1f5],void:[0x201b38,0x593b83,0xdab5ec,0xa78bff],storm:[0x283b59,0x477fbd,0xf8cb55,0x76e6ff],royal:[0x342244,0x923f76,0xf1c970,0xff99dd],nature:[0x244c42,0x66a984,0xffdc8b,0x9df5ad],candy:[0x6a346c,0xef83ad,0xffe5b4,0x7bf1e4]};
const PROFILES={
 "mozzarello blobbo": {
  "form": "blob",
  "signature": "cheese"
 },
 "sir spaghettini": {
  "form": "serpent",
  "signature": "fork"
 },
 "banana bimbo": {
  "form": "banana",
  "signature": "peel"
 },
 "toasto pistachio": {
  "form": "toast",
  "signature": "pistachio"
 },
 "meatbally boi": {
  "form": "meatball",
  "signature": "fork"
 },
 "cheesy wedgeo": {
  "form": "wedge",
  "signature": "holes"
 },
 "capybara chad": {
  "form": "beast",
  "signature": "sunglasses"
 },
 "pickle pantalone": {
  "form": "pickle",
  "signature": "pants"
 },
 "donutto dancer": {
  "form": "donut",
  "signature": "dancer"
 },
 "waffle wizzo": {
  "form": "toast",
  "signature": "wizard"
 },
 "sushi samuro": {
  "form": "sushi",
  "signature": "samurai"
 },
 "cloud cumulo": {
  "form": "cloud",
  "signature": "rain"
 },
 "moai mogger": {
  "form": "idol",
  "signature": "stone"
 },
 "cactus cappuccino": {
  "form": "cactus",
  "signature": "cup"
 },
 "pengu penguini": {
  "form": "penguin",
  "signature": "scarf"
 },
 "robo ravioli": {
  "form": "mech",
  "signature": "pasta"
 },
 "jelly jellino": {
  "form": "jelly",
  "signature": "jelly"
 },
 "pumpkin pharaoh": {
  "form": "pumpkin",
  "signature": "pharaoh"
 },
 "tralala toaster": {
  "form": "toaster",
  "signature": "toast"
 },
 "volcano vinnie": {
  "form": "volcano",
  "signature": "eruption"
 },
 "ghosto gelato": {
  "form": "ghost",
  "signature": "icecream"
 },
 "dino dolcezza": {
  "form": "kaiju",
  "signature": "candy"
 },
 "samba squidlo": {
  "form": "kraken",
  "signature": "dancer"
 },
 "hotdoggo hustler": {
  "form": "hotdog",
  "signature": "sneakers"
 },
 "cosmic frogzilla": {
  "form": "frog",
  "signature": "planet"
 },
 "crystal croco": {
  "form": "crocodile",
  "signature": "crystal"
 },
 "thunder tigrotto": {
  "form": "beast",
  "signature": "lightning"
 },
 "mecha meatloaf": {
  "form": "mech",
  "signature": "cleaver"
 },
 "disco shark": {
  "form": "shark",
  "signature": "dj"
 },
 "galaxy giraffo": {
  "form": "giraffe",
  "signature": "constellation"
 },
 "phoenix pastaro": {
  "form": "phoenix",
  "signature": "fire"
 },
 "kraken kebab": {
  "form": "kraken",
  "signature": "skewer"
 },
 "lord rizzbert": {
  "form": "monarch",
  "signature": "royal"
 },
 "void vendetti": {
  "form": "wraith",
  "signature": "scythe"
 },
 "rainbow rizzotto": {
  "form": "wyrm",
  "signature": "rainbow"
 },
 "omega brainrotto": {
  "form": "titan",
  "signature": "reactor"
 },
 "bombo bagelino": {
  "form": "donut",
  "signature": "bagel"
 },
 "noodlo nuggetti": {
  "form": "serpent",
  "signature": "nuggets"
 },
 "tacotta tappo": {
  "form": "taco",
  "signature": "sombrero"
 },
 "lasagnu larry": {
  "form": "lasagna",
  "signature": "layers"
 },
 "crouton cuccio": {
  "form": "toast",
  "signature": "crouton"
 },
 "muffino mumbo": {
  "form": "muffin",
  "signature": "berries"
 },
 "fritto frittata": {
  "form": "egg",
  "signature": "pan"
 },
 "grapo gonzo": {
  "form": "grape",
  "signature": "vine"
 },
 "biscotto bob": {
  "form": "biscuit",
  "signature": "chips"
 },
 "ravi raviolo": {
  "form": "ravioli",
  "signature": "pasta"
 },
 "pretzo pip": {
  "form": "pretzel",
  "signature": "salt"
 },
 "churro chompi": {
  "form": "churro",
  "signature": "chocolate"
 },
 "olivo oopsie": {
  "form": "olive",
  "signature": "pimento"
 },
 "gnocchi gnomo": {
  "form": "gnome",
  "signature": "mushroom"
 },
 "llama lemonato": {
  "form": "giraffe",
  "signature": "lemon"
 },
 "burrito bandito": {
  "form": "burrito",
  "signature": "bandit"
 },
 "otter orzo": {
  "form": "beast",
  "signature": "shell"
 },
 "yogurto yeti": {
  "form": "gorilla",
  "signature": "yogurt"
 },
 "peachy pangolino": {
  "form": "armadillo",
  "signature": "peach"
 },
 "kiwi kapitano": {
  "form": "bird",
  "signature": "captain"
 },
 "walrus waffelo": {
  "form": "walrus",
  "signature": "waffle"
 },
 "hamster hummusi": {
  "form": "hamster",
  "signature": "seeds"
 },
 "sloth salsiccia": {
  "form": "sloth",
  "signature": "branch"
 },
 "marshmallo mummy": {
  "form": "mummy",
  "signature": "wrap"
 },
 "turtle tiramisu": {
  "form": "turtle",
  "signature": "cake"
 },
 "pancake panda": {
  "form": "bear",
  "signature": "pancakes"
 },
 "gelato gator": {
  "form": "crocodile",
  "signature": "icecream"
 },
 "moth mochi": {
  "form": "moth",
  "signature": "mochi"
 },
 "flamingo fettuccini": {
  "form": "flamingo",
  "signature": "noodles"
 },
 "bubble bobaloo": {
  "form": "boba",
  "signature": "pearls"
 },
 "rocket radicchio": {
  "form": "rocket",
  "signature": "radish"
 },
 "yeti yakisoba": {
  "form": "gorilla",
  "signature": "noodles"
 },
 "karate kiwano": {
  "form": "pickle",
  "signature": "karate"
 },
 "gorilla gelatino": {
  "form": "gorilla",
  "signature": "icecream"
 },
 "pirate paneer": {
  "form": "wedge",
  "signature": "pirate"
 },
 "cyber cannoli": {
  "form": "cannon",
  "signature": "cyber"
 },
 "ninja nachito": {
  "form": "taco",
  "signature": "ninja"
 },
 "tiger tortellino": {
  "form": "beast",
  "signature": "pasta"
 },
 "moose mortadella": {
  "form": "moose",
  "signature": "antlers"
 },
 "aztec avocadino": {
  "form": "avocado",
  "signature": "aztec"
 },
 "hippo hotcakes": {
  "form": "hippo",
  "signature": "pancakes"
 },
 "zebra zucchini": {
  "form": "horse",
  "signature": "stripes"
 },
 "sultan sombrero": {
  "form": "monarch",
  "signature": "sombrero"
 },
 "magma mamba": {
  "form": "serpent",
  "signature": "magma"
 },
 "frostbite fonduta": {
  "form": "mammoth",
  "signature": "ice"
 },
 "turbo tortelloni": {
  "form": "wheel",
  "signature": "racer"
 },
 "neon narwhalo": {
  "form": "narwhal",
  "signature": "neon"
 },
 "samurai sardino": {
  "form": "fish",
  "signature": "samurai"
 },
 "orbit octopasta": {
  "form": "kraken",
  "signature": "planet"
 },
 "lightning llamino": {
  "form": "giraffe",
  "signature": "lightning"
 },
 "wizard wafflone": {
  "form": "spellbook",
  "signature": "wizard"
 },
 "dragon dumplo": {
  "form": "dragon",
  "signature": "dumpling"
 },
 "aurora alpacca": {
  "form": "giraffe",
  "signature": "aurora"
 },
 "pharaoh pizzetta": {
  "form": "pizza",
  "signature": "pharaoh"
 },
 "thunder tacozilla": {
  "form": "kaiju",
  "signature": "taco"
 },
 "mirage macaroni": {
  "form": "serpent",
  "signature": "mirage"
 },
 "cactus cometto": {
  "form": "cactus",
  "signature": "comet"
 },
 "vortex vulpe": {
  "form": "fox",
  "signature": "vortex"
 },
 "jungle jaguaro": {
  "form": "beast",
  "signature": "vines"
 },
 "blizzard bagnacauda": {
  "form": "bear",
  "signature": "blizzard"
 },
 "cyclone cupcakko": {
  "form": "muffin",
  "signature": "cyclone"
 },
 "ember eclairo": {
  "form": "centipede",
  "signature": "ember"
 },
 "titan tiramisuro": {
  "form": "gorilla",
  "signature": "cake"
 },
 "glitchy gelatina": {
  "form": "jelly",
  "signature": "glitch"
 },
 "astro anchovio": {
  "form": "ray",
  "signature": "stars"
 },
 "nebula nutellino": {
  "form": "mushroom",
  "signature": "nebula"
 },
 "hydra hamburgo": {
  "form": "hydra",
  "signature": "burger"
 },
 "supernova sushiro": {
  "form": "sushi",
  "signature": "supernova"
 },
 "warlock walrusso": {
  "form": "walrus",
  "signature": "wizard"
 },
 "quantum quokka": {
  "form": "hamster",
  "signature": "portal"
 },
 "eclipse espressino": {
  "form": "cup",
  "signature": "eclipse"
 },
 "rizzler rhinoceronte": {
  "form": "rhino",
  "signature": "armor"
 },
 "plasma pandoro": {
  "form": "lion",
  "signature": "plasma"
 },
 "banshee bruschetta": {
  "form": "banshee",
  "signature": "toast"
 },
 "cerberus cannolo": {
  "form": "hound",
  "signature": "cannoli"
 },
 "valkyrie vongole": {
  "form": "valkyrie",
  "signature": "shell"
 },
 "kraken kiwino": {
  "form": "kraken",
  "signature": "kiwi"
 },
 "solar salamino": {
  "form": "salamander",
  "signature": "sun"
 },
 "lunar lasagnoro": {
  "form": "manta",
  "signature": "moon"
 },
 "inferno impastato": {
  "form": "volcano",
  "signature": "inferno"
 },
 "chrono chihuahuo": {
  "form": "hound",
  "signature": "clock"
 },
 "basilisk biscottone": {
  "form": "basilisk",
  "signature": "biscuit"
 },
 "tsunami tartufo": {
  "form": "crab",
  "signature": "waves"
 },
 "gravity gorgonzolo": {
  "form": "golem",
  "signature": "cheese"
 },
 "celestial cappuccinator": {
  "form": "cup",
  "signature": "cathedral"
 },
 "ragnarok ravioloni": {
  "form": "wyrm",
  "signature": "ragnarok"
 },
 "leviathan linguinone": {
  "form": "leviathan",
  "signature": "ocean"
 },
 "zenith zabaglionix": {
  "form": "moth",
  "signature": "sunburst"
 },
 "ultra unicornetto": {
  "form": "horse",
  "signature": "unicorn"
 },
 "galactus gnocchino": {
  "form": "mushroom",
  "signature": "galaxy"
 },
 "sphinx spaghettona": {
  "form": "sphinx",
  "signature": "pharaoh"
 },
 "oblivion olivetto": {
  "form": "spider",
  "signature": "void"
 },
 "apex arancinio": {
  "form": "raptor",
  "signature": "armor"
 },
 "cosmos calamarone": {
  "form": "squid",
  "signature": "cosmos"
 },
 "titanic tortellonio": {
  "form": "titan",
  "signature": "anchor"
 },
 "sovereign sambuco": {
  "form": "elk",
  "signature": "forest"
 },
 "mythos mozzarellix": {
  "form": "dragon",
  "signature": "ivory"
 },
 "hyperion hotdoggero": {
  "form": "hotdog",
  "signature": "jet"
 },
 "brainrot primordius": {
  "form": "hydra",
  "signature": "ancient"
 },
 "eternal espresso rex": {
  "form": "rex",
  "signature": "espresso"
 },
 "infinity italianissimo": {
  "form": "ouroboros",
  "signature": "infinity"
 },
 "cosmic rizzlord": {
  "form": "lion",
  "signature": "galaxy"
 },
 "omnipotent ohiozilla": {
  "form": "kaiju",
  "signature": "void"
 },
 "final boss bellissimo": {
  "form": "centaur",
  "signature": "royal"
 },
 "mogger of worlds": {
  "form": "gorilla",
  "signature": "planet"
 },
 "skibidi singularity": {
  "form": "ufo",
  "signature": "singularity"
 },
 "sigma supremo": {
  "form": "sphinx",
  "signature": "gold"
 },
 "gyatt genesis": {
  "form": "phoenix",
  "signature": "aurora"
 },
 "fanum fatalis": {
  "form": "reaper",
  "signature": "scythe"
 },
 "absolute zero rizz": {
  "form": "mammoth",
  "signature": "glacier"
 }
};
function design(e,index){const n=(e.mu?e.n.replace(/^(Golden|Bloodmoon|Disco|Hyper|Moneybags|Molten|Frozen|Electric|Cosmic|Radioactive|Candy|Rainbow) /,''):e.n).toLowerCase(),seed=hash(n),t=e.t;
let form=/kraken|octo|squid|calamar/.test(n)?'kraken':/shark/.test(n)?'shark':/dragon|dino|hydra|croco|basilisk|leviathan/.test(n)?'dragon':/phoenix|flamingo|moth|pengu/.test(n)?'phoenix':/mamba|noodl|spaghett|linguin|raviol/.test(n)?'serpent':/mecha|robo|cyber|rocket|turbo|quantum/.test(n)?'mech':/void|oblivion|singularity|primordius|eternal|eclipse/.test(n)?'wraith':/lord|rizzbert|sultan|pharaoh|sovereign|supremo|final boss|omega|omnipotent/.test(n)?'monarch':/walrus|capybara|giraff|frog|llama|otter|panda|pangolin|yeti|hamster|sloth|turtle|gator|kiwi|gorilla|tiger|moose|hippo|zebra|alpacca|vulpe|jaguar|rhino|quokka|salam|chihuahua|cerberus|sphinx|unicorn|rizzlord/.test(n)?'beast':/cosmi|galax|nebula|orbit|astro|zenith|infinity|hyperion|gravity|supernova|celestial|chron|aurora/.test(n)?'celestial':/cappucc|espresso|yogurt|gelato|jelly|jell|cloud/.test(n)?'cup':/donut|bagel|pretzo/.test(n)?'donut':/toast|waffle|pancake|biscott|crouton/.test(n)?'toast':/banana|grapo|olive|olivo|pickle|cactus|pumpkin|kiwano|avocado/.test(n)?'plant':'feast';
if(/robo|mecha|cyber/.test(n))form='mech';if(/tigrot|tiger/.test(n))form='beast';if(/cactus/.test(n))form='plant';if(/moai/.test(n))form='idol';
if(/volcano|magma|inferno impastato/.test(n))form='volcano';if(/omega brainrot|mogger of worlds|titanic|absolute zero/.test(n))form='titan';if(/rainbow rizzotto|infinity italian/.test(n))form='celestial';if(/brainrot primordius/.test(n))form='dragon';
const profile=PROFILES[n]||{form,signature:'crest'};form=profile.form;
let theme=/frost|snow|ice|crystal|blizzard|absolute zero|lunar/.test(n)?'ice':/magma|volcano|phoenix|inferno|ember|solar|fire|hotdog/.test(n)?'fire':/thunder|lightning|storm|plasma|cyclone|vortex/.test(n)?'storm':/void|oblivion|eclipse|singularity|primordius|zero/.test(n)?'void':/galax|cosm|celestial|astro|orbit|nebula|quantum|chron|infinity/.test(n)?'cosmic':/lord|pharaoh|sultan|sovereign|royal|supremo|omega/.test(n)?'royal':/candy|rainbow|disco|gelat|jell/.test(n)?'candy':/jungle|cactus|turtle|croco|frog|kiwi/.test(n)?'nature':Object.keys(THEMES)[seed%8];
if(/kraken/.test(n))theme='void';const palette=THEMES[theme].slice(),mut=e.mu||0;const custom={reactor:[0x222939,0x586879,0xc2d0d9,0xff5277],espresso:[0x35202b,0x765041,0xf5d9a9,0xffb86b],void:[0x202033,0x4d4e6e,0xa79acd,0x8beaee],gold:[0x5d452e,0xdcb958,0xffe9a1,0x88f3f1],ocean:[0x173c53,0x347f94,0x91d4cf,0x7cf5eb],dumpling:[0x36594b,0x7ca771,0xe8d7a0,0xffcc79],burger:[0x57362f,0xa45a3d,0xe9bb6a,0xffa669],ivory:[0x45536b,0xe1e4cf,0xf7d88f,0x78f3d9],rainbow:[0x444782,0x73cad0,0xfc94c7,0xffe795],glacier:[0x233e62,0x80b3c4,0xe4f5ed,0x86edff],ancient:[0x243931,0x547962,0xd2b68a,0xfb9965],ragnarok:[0x312735,0x7d3b43,0xe9a570,0xff794a],cannoli:[0x3d2737,0x785960,0xf5c888,0xff7e5d],kiwi:[0x254c43,0x79ba5b,0xc7e887,0xeef8c4],forest:[0x273e39,0x769d71,0xc8ae75,0xc3f3c4],plasma:[0x452345,0xb56a62,0xffd776,0xfff1be]};if(custom[profile.signature])palette.splice(0,4,...custom[profile.signature]);if(/pengu/.test(n))palette.splice(0,4,0x16223a,0x28465c,0xfff0d6,0xffba50);if(/moai/.test(n))palette.splice(0,4,0x3d5361,0x708994,0xc5b787,0x63efdf);if(!mut){const tint=new G.Color(palette[1]);tint.offsetHSL(((seed>>>8)%17-8)/300,0,((seed>>>16)%9-4)/100);palette[1]=tint.getHex()}if(mut){const colors=[0xffd357,0xf25077,0xf082ef,0xff9ca8,0x79e69c,0xff915e,0xbcefff,0xffeb70,0xb29bff,0xc3ff55,0xffabe0,0x8de9ee];palette[2]=colors[mut-1];palette[3]=colors[mut-1];palette[1]=new G.Color(palette[1]).lerp(new G.Color(colors[mut-1]),.55).getHex()}
return {name:e.n,form,theme,seed,t,mut,palette,variant:seed%7,serial:index,signature:profile.signature,identity:n};
}
function build(e,index,{mobile=false}={}){const d=design(e,index),[dark,main,gold,light]=d.palette,seed=d.seed,hi=e.t>=3,epic=e.t>=5,root=new G.Group(),body=new G.Group();root.add(body);const rig=[],eyes=[],feet=[],wings=[],tentacles=[],orbits=[],rotors=[],flames=[],cloth=[],motions=[];let groupCount=0;
function group(p,x=0,y=0,z=0){const g=new G.Group();g.position.set(x,y,z);g.name='art-'+groupCount++;p.add(g);return g}
function mesh(p,type,c,x,y,z,sx,sy=sx,sz=sx,kind='skin'){let geometry;if(type==='orb'){const radius=Math.max(sx,sy,sz),detail=radius<.25?(mobile?6:8):radius<.5?(mobile?10:14):(mobile?14:20);geometry=geo('orb'+detail,()=>new G.SphereGeometry(1,detail,Math.max(5,Math.round(detail*.65))))}else if(type==='gem')geometry=geo('gem',()=>new G.OctahedronGeometry(1));else if(type==='cone')geometry=geo('cone',()=>new G.ConeGeometry(1,1,10));else if(type==='cyl')geometry=geo('cyl',()=>new G.CylinderGeometry(1,1,1,16));else geometry=geo('box',()=>{const g=new G.BoxGeometry(1,1,1,3,3,3),a=g.attributes.position;for(let i=0;i<a.count;i++){const v=new G.Vector3().fromBufferAttribute(a,i),q=v.clone().clampScalar(-.39,.39),n=v.sub(q).normalize().multiplyScalar(.11).add(q);a.setXYZ(i,n.x,n.y,n.z)}g.computeVertexNormals();return g});const m=new G.Mesh(geometry,material(c,kind));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;p.add(m);return m}
const orb=(p,c,x,y,z,a,b=a,k=a,mat)=>mesh(p,'orb',c,x,y,z,a,b,k,mat),box=(p,c,x,y,z,a,b,k,mat)=>mesh(p,'box',c,x,y,z,a,b,k,mat),cone=(p,c,x,y,z,r,h,mat)=>mesh(p,'cone',c,x,y,z,r,h,r,mat),gem=(p,c,x,y,z,r,h=r)=>mesh(p,'gem',c,x,y,z,r,h,r,'crystal');
function ring(p,c,x,y,z,r,t=.035,rx=0,ry=0,rz=0){const m=new G.Mesh(geo('ring'+r+':'+t,()=>new G.TorusGeometry(r,t,6,mobile?24:40)),material(c,'metal'));m.position.set(x,y,z);m.rotation.set(rx,ry,rz);p.add(m);return m}
function curve(p,c,points,r=.05){const key=JSON.stringify(points)+':'+r;const geometry=geo(key,()=>new G.TubeGeometry(new G.CatmullRomCurve3(points.map(v=>new G.Vector3(...v))),mobile?12:20,r,5,false));const m=new G.Mesh(geometry,material(c,'metal'));p.add(m);return m}
function face(p,y,z,width=.28,angry=false){width*=.92+(seed%9)*.02;const lid=group(p,0,y,z);for(const s of[-1,1]){orb(lid,0xfff7e8,s*width,0,0,.17,.22,.1);orb(lid,light,s*width,.005,.085,.105,.14,.045,'glow');orb(lid,0x141526,s*width,.012,.12,.052,.1,.022);orb(lid,0xffffff,s*width-.035,.07,.135,.035,.035,.02);box(p,dark,s*width,y+.24,z,.28,.065,.08).rotation.z=s*(angry?-.28:.12)}eyes.push(lid);curve(p,dark,[[-.16,y-.24,z],[0,y-.29,z+.04],[.16,y-.24,z]],.022);orb(p,main,0,y-.14,z+.06,.1,.065,.06)}
function studs(p,c,r,y,count=8,z=0){for(let j=0;j<count;j++){const a=j*2*Math.PI/count;gem(p,c,Math.cos(a)*r,y,z+Math.sin(a)*r,.035,.045)}}
function boot(x,z,size=1){const g=group(body,x,.48,z);mesh(g,'cyl',main,0,-.14,0,.13*size,.42,.13*size,'metal');orb(g,dark,0,-.39,.09,.22*size,.12,.33*size);box(g,gold,0,-.45,.1,.42*size,.055,.56*size,'metal');for(let j=0;j<3;j++)box(g,0xf7ebce,0,-.31,.02+j*.065,.2*size,.022,.022);feet.push(g);return g}
function armor(p,x,y,z,size=.5){orb(p,dark,x,y,z,size,size*.8,size*.36,'metal');orb(p,main,x,y+.03,z+.07,size*.88,size*.65,size*.28,'metal');ring(p,gold,x,y,z+.16,size*.67,.025);gem(p,light,x,y,z+.27,size*.27,size*.35)}
function crown(p,y,r=.5){ring(p,gold,0,y,0,r,.09,Math.PI/2);const peaks=5+seed%4;for(let j=0;j<peaks;j++){const a=j*2*Math.PI/peaks;const c=cone(p,gold,Math.cos(a)*r,y+.23,Math.sin(a)*r,.09,.45,'metal');c.rotation.z=-Math.cos(a)*.17;gem(p,light,Math.cos(a)*r,y+.49,Math.sin(a)*r,.075,.11)}}
function horn(p,x,y,z,s){curve(p,gold,[[x,y,z],[x+s*.2,y+.25,z-.1],[x+s*.28,y+.58,z-.28],[x+s*.17,y+.82,z-.36]],.07);gem(p,light,x+s*.17,y+.82,z-.36,.07,.11)}
function featherWing(p,s,y=1.9,z=-.2){const w=group(p,s*.5,y,z);for(let j=0;j<6;j++){const a=box(w,j%2?main:gold,s*(.28+j*.24),.08-j*.08,-j*.12,.23,1.2-j*.08,.085,'metal');a.rotation.z=-s*(.5+j*.12);const tip=gem(w,light,s*(.5+j*.25),-.3-j*.13,-j*.12,.1,.28);tip.rotation.z=-s*.6}curve(w,gold,[[0,0,0],[s*.7,.5,-.1],[s*1.7,.15,-.5]],.07);wings.push({g:w,s});return w}
const faceY=2;
const feature=d.signature,animalHeads=[];
function pose(g,fn){motions.push(fn);return g}
function limb(p,x,y,z,length=.6,width=.2){const leg=group(p,x,y,z);orb(leg,main,0,-length*.4,0,width,length*.65,width);orb(leg,dark,0,-length,.13,width*1.25,.14,width*1.65);for(let k=-1;k<=1;k++)cone(leg,gold,k*width*.58,-length,.13+width*1.3,.045,.15).rotation.x=Math.PI/2;feet.push(leg);return leg}
function animalHead(p,x,y,z,size=1,kind='cat'){const h=group(p,x,y,z);h.scale.setScalar(size);orb(h,main,0,0,0,.5,.48,.5);orb(h,gold,0,-.18,.42,.38,.23,.28);face(h,.1,.45,.23,hi);orb(h,dark,0,-.07,.68,.11,.065,.06);for(const side of[-1,1]){cone(h,main,side*.4,.47,-.02,.18,.45).rotation.z=-side*.25;if(kind==='dog'||kind==='hound'||kind==='sloth')orb(h,dark,side*.5,.07,-.04,.15,.45,.22);if(['cat','lion','sphinx','fox'].includes(kind)){for(let j=0;j<2;j++)curve(h,gold,[[side*.25,-.14,.63],[side*.6,-.08+j*.14,.63]],.018)} }if(['horse','elk','moose','giraffe'].includes(kind)){orb(h,main,0,-.15,.52,.3,.31,.47);orb(h,dark,0,-.24,.87,.23,.12,.09)}if(['bear','hamster','hippo','mammoth','rhino'].includes(kind))for(const side of[-1,1])orb(h,main,side*.43,.4,-.02,.18,.16,.14);animalHeads.push(h);return h}
function membraneWing(p,side,y=2,z=-.15,style='dragon'){const w=group(p,side*.6,y,z),points=[[0,0,0],[side*.7,1.1,-.12],[side*2.3,1.25,-.6],[side*1.9,.05,-.68],[side*1.1,-.35,-.38],[side*.25,-.3,0]],shape=new G.BufferGeometry(),verts=[];for(let j=1;j<points.length-1;j++)verts.push(...points[0],...points[j],...points[j+1]);shape.setAttribute('position',new G.Float32BufferAttribute(verts,3));shape.computeVertexNormals();const m=new G.Mesh(shape,material(style==='moth'?gold:main,'skin'));m.material=material(style==='moth'?gold:main,'skin').clone();m.material.side=G.DoubleSide;w.add(m);for(let j=1;j<points.length;j++)curve(w,gold,[[0,0,0],points[j]],.035);curve(w,dark,[...points,points[0]],.065);if(style==='moth')for(let j=0;j<3;j++){orb(w,j===1?dark:light,side*(.8+j*.45),.35+j*.2,-.3-j*.1,.2,.3,.05)}wings.push({g:w,s:side,membrane:true});return w}
function tailChain(p,x,y,z,count=7,style='scales'){const tail=group(p,x,y,z);for(let j=0;j<count;j++){const seg=group(tail,0,-j*.055,-j*.32);orb(seg,main,0,0,0,.3-j*.027,.27-j*.023,.28);if(style==='scales')gem(seg,gold,0,.23-j*.02,0,.09,.22-j*.018);pose(seg,(t,mv)=>{seg.position.x=Math.sin(t*2.1-j*.55)*(.12+.1*mv)})}return tail}
function floatPebbles(p,count=5){for(let j=0;j<count;j++){const g=group(p,Math.cos(j*2.4)*1.1,.7+j*.32,Math.sin(j*2.4)*.9);gem(g,main,0,0,0,.18,.24);pose(g,t=>{g.rotation.set(t*.3+j,t*.5,0);g.position.y=.7+j*.32+Math.sin(t+j)*.14})}}

switch(d.form){
case 'spellbook':{for(const side of[-1,1]){const page=group(body,side*.18,1.4,0);box(page,dark,side*.34,0,-.09,.85,1.4,.16);for(let j=0;j<5;j++)box(page,j%2?0xffe3a3:0xe5bf7c,side*.34,0,j*.035,.78,1.29,.035);for(let j=0;j<4;j++)box(page,gold,side*.34,.4-j*.23,.2,.45,.035,.02);page.rotation.y=side*.3;pose(page,t=>page.rotation.y=side*(.3+Math.sin(t*1.3)*.1))}face(body,1.48,.28,.26);const eye=group(body,0,.45,0);gem(eye,light,0,0,0,.18,.24);pose(eye,t=>eye.rotation.y=t*.4);pose(body,t=>body.position.y=.17+Math.sin(t*1.6)*.12);break}

// Distinct food silhouettes.
case 'blob':case 'jelly':case 'cloud':case 'ghost':{
 const jelly=d.form==='jelly',cloud=d.form==='cloud',ghost=d.form==='ghost',col=ghost?0xe6fbff:cloud?0xb9e9ff:jelly?main:0xfff0c5;
 if(cloud){for(let j=0;j<7;j++)orb(body,col,(j-3)*.26,1.3+Math.sin(j*1.6)*.2,Math.cos(j)*.2,.43,.4,.4);for(let j=0;j<5;j++){const drop=group(body,(j-2)*.25,.4,0);gem(drop,light,0,0,0,.06,.18);pose(drop,t=>drop.position.y=.3+((j*.2-t*.5)%1+1)%1*.65)}}
 else {orb(body,col,0,1.2,0,.85,jelly?.9:.7,.67);for(let j=0;j<7;j++){const a=j*6.283/7,p=group(body,Math.sin(a)*.6,.6,Math.cos(a)*.43);orb(p,col,0,0,0,.23,ghost?.45:.21,.23);pose(p,t=>p.position.y=.55+Math.sin(t*3+j)*.12)}if(jelly)ring(body,gold,0,.7,0,.67,.04,Math.PI/2);if(ghost)cone(body,0xd5a567,0,.3,0,.45,.8).rotation.z=Math.PI}
 face(body,1.4,.63,.28);pose(body,(t,m)=>{body.position.y=.08+Math.abs(Math.sin(t*(m?4:1.5)))*(.08+m*.22);body.scale.y=(.98+Math.sin(t*3)*.045)});break}
case 'banana':{curve(body,0xf3d04f,[[.25,.55,0],[-.28,1,0],[-.35,1.7,0],[.04,2.35,0]],.29);for(const side of[-1,1]){const p=group(body,0,1.2,0);curve(p,0xffe66d,[[0,0,0],[side*.55,-.05,0],[side*.78,-.62,.12]],.17);pose(p,t=>p.rotation.z=Math.sin(t*2+side)*.12)}box(body,0x6f4a29,.06,2.42,0,.2,.23,.22);face(body,1.65,.27,.18);boot(-.22,0);boot(.22,0);break}
case 'wedge':case 'pizza':case 'taco':{const taco=d.form==='taco',pizza=d.form==='pizza',shape=new G.Shape();shape.moveTo(-.88,.3);shape.lineTo(.88,.3);shape.lineTo(taco?.45:0,2);if(taco)shape.lineTo(-.45,2);shape.closePath();const geo=new G.ExtrudeGeometry(shape,{depth:.58,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.08,bevelThickness:.08});const m=new G.Mesh(geo,material(pizza?0xefad49:0xffd455,'food'));m.position.z=-.3;body.add(m);for(let j=0;j<7;j++){const x=Math.sin(j*2.4)*(.68-j*.06),y=.55+j*.16;orb(body,taco?0x63ab55:pizza?0xb83c35:0xe7a63f,x,y,.38,.11,.1,.025)}if(pizza)curve(body,0xbf7837,[[-.86,.35,.36],[0,.3,.36],[.86,.35,.36]],.12);if(taco)for(let j=0;j<6;j++)orb(body,j%2?0xb34a35:0x5c9c4e,(j-2.5)*.18,1.94,0,.15,.11,.26);face(body,1.02,.4,.26);boot(-.36,0);boot(.36,0);break}
case 'lasagna':case 'ravioli':case 'biscuit':{const ravioli=d.form==='ravioli',cookie=d.form==='biscuit';if(cookie){mesh(body,'cyl',0xca965d,0,1.2,0,.83,.38,.83,'food').rotation.x=Math.PI/2;for(let j=0;j<12;j++)orb(body,0x553929,Math.cos(j*2.4)*.65,1.2+Math.sin(j*2.4)*.64,.23,.085,.085,.035)}else if(ravioli){box(body,0xf3d28a,0,1.15,0,1.45,1.55,.58);orb(body,0xffe5a4,0,1.15,.19,.55,.57,.22);for(let j=0;j<7;j++)for(const side of[-1,1]){box(body,0xcf9d53,side*.7,.48+j*.22,.28,.1,.12,.08);box(body,0xcf9d53,(j-3)*.22,1.15+side*.72,.28,.1,.12,.08)}}else for(let j=0;j<7;j++)box(body,[0xf1cb7c,0xba4730,0xffe9ae][j%3],0,.55+j*.2,0,1.45,.18,.9);face(body,1.25,.45,.26);boot(-.35,0);boot(.35,0);break}
case 'meatball':case 'olive':case 'avocado':case 'egg':{const av=d.form==='avocado',egg=d.form==='egg',olive=d.form==='olive',c=egg?0xfff7dc:av?0x497746:olive?0x7b923c:0x89533b;orb(body,c,0,1.2,0,av?.65:.77,av?1:.74,.55);if(av){orb(body,0xc2d977,0,1.2,.38,.53,.83,.18);orb(body,0x835238,0,.97,.53,.31,.33,.18)}if(egg){orb(body,0xffc343,0,1.19,.42,.45,.42,.2);ring(body,dark,0,.55,0,.88,.09,Math.PI/2);box(body,dark,1.08,.55,0,.74,.12,.17)}if(olive)orb(body,0xd75b39,0,1.82,.23,.25,.18,.15);if(!egg&&!av&&!olive)for(let j=0;j<13;j++)orb(body,0x653828,Math.sin(j*2.4)*.6,.7+(j%5)*.23,Math.cos(j*2.4)*.48,.085);face(body,av?1.6:1.36,.59,.23);boot(-.29,0);boot(.29,0);break}
case 'muffin':case 'mushroom':case 'gnome':{const mush=d.form==='mushroom',gnome=d.form==='gnome';mesh(body,'cyl',gnome?main:mush?gold:0xb27854,0,.85,0,mush?.38:.53,1.12,mush?.38:.53);if(gnome){cone(body,main,0,2.01,0,.72,1.62);orb(body,gold,0,1.25,.47,.39,.44,.21);orb(body,0xffc8a6,0,1.48,.62,.18,.15,.17)}else {orb(body,mush?main:gold,0,1.85,0,mush?1.15:.82,mush?.48:.58,mush?1.02:.72);for(let j=0;j<10;j++){const a=j*2.4;orb(body,mush?light:0x643c70,Math.cos(a)*.7,2.04+Math.sin(j)*.1,Math.sin(a)*.65,.12,.055,.14)}face(body,1.1,.54,.2)}if(mush){for(let j=0;j<8;j++){const a=j*Math.PI/4;curve(body,gold,[[0,1.65,0],[Math.sin(a)*.9,1.72,Math.cos(a)*.9]],.026)}pose(body,t=>body.rotation.z=Math.sin(t*1.2)*.065)}boot(-.24,0);boot(.24,0);break}
case 'grape':{for(let j=0;j<12;j++){const a=j*2.4,r=.5*(1-j/19);orb(body,j%2?main:0x9446ac,Math.cos(a)*r,.55+j*.12,Math.sin(a)*r,.3)}curve(body,0x579550,[[0,1.85,0],[.1,2.3,0],[.45,2.35,0]],.055);orb(body,0x71ac57,-.25,2.15,0,.4,.07,.22);face(body,1.25,.56,.21);boot(-.24,0);boot(.24,0);break}
case 'pretzel':{curve(body,0xc78e4b,[[-.5,.5,.02],[.65,1.4,0],[.52,2,0],[0,1.9,0],[-.55,2,0],[-.7,1.4,0],[.5,.5,.12]],.2);curve(body,0xc78e4b,[[-.5,.5,.02],[0,.42,.1],[.5,.5,.12]],.2);for(let j=0;j<11;j++)box(body,0xfff4d9,Math.sin(j*2.2)*.59,.55+(j%5)*.28,.18,.05,.05,.05);face(body,1.15,.2,.21);boot(-.28,0);boot(.28,0);break}
case 'churro':case 'pickle':case 'burrito':case 'hotdog':{const hot=d.form==='hotdog',pick=d.form==='pickle',burr=d.form==='burrito',c=pick?0x70ab41:burr?0xe7c88d:hot?0xb95335:0xbe843e;orb(body,c,0,1.35,0,hot?.43:.5,1.07,.45);if(hot){for(const side of[-1,1])orb(body,0xe2ae60,side*.4,1.26,-.1,.24,.98,.49);curve(body,0xffd44c,[[-.1,.55,.46],[.13,.8,.47],[-.1,1.05,.47],[.13,1.3,.47],[-.1,1.55,.47],[.13,1.8,.47]],.035)}if(pick)for(let j=0;j<15;j++){const a=j*2.4;orb(body,0x416d2e,Math.sin(a)*.47,.5+(j%7)*.24,Math.cos(a)*.42,.055)}if(burr){for(let j=0;j<6;j++)orb(body,j%2?0xb94830:0x5f9e55,Math.sin(j)*.3,2.25,Math.cos(j)*.22,.13);curve(body,0xa87d48,[[-.45,.85,.26],[.2,1.27,.44],[.45,1.8,.2]],.03)}if(d.form==='churro')for(let j=0;j<8;j++){const a=j*Math.PI/4;curve(body,0xf1be68,[[Math.sin(a)*.46,.48,Math.cos(a)*.42],[Math.sin(a)*.5,1.4,Math.cos(a)*.45],[Math.sin(a)*.35,2.2,Math.cos(a)*.3]],.034)}face(body,1.8,.43,.21);boot(-.26,0);boot(.26,0);break}
case 'sushi':{mesh(body,'cyl',0x223e38,0,1.07,0,.75,1.35,.75);mesh(body,'cyl',0xfff4d8,0,1.77,0,.69,.08,.69);box(body,0xf78b71,0,1.85,0,.69,.15,.62);for(let j=0;j<20;j++){const a=j*2.4;orb(body,0xffedc8,Math.sin(a)*.6,1.78,Math.cos(a)*.6,.055,.035,.09)}face(body,1.13,.71,.27);boot(-.3,0);boot(.3,0);break}
case 'boba':case 'toaster':case 'cactus':case 'pumpkin':case 'mummy':{
 if(d.form==='toaster'){box(body,0xaebdc3,0,1.1,0,1.55,1.2,.94,'metal');for(const side of[-1,1]){box(body,dark,side*.32,1.72,0,.44,.04,.65);const toast=group(body,side*.32,1.8,0);box(toast,0xd6a15a,0,0,0,.4,.59,.48);box(toast,0xf2d591,0,.02,.25,.3,.45,.04);pose(toast,t=>toast.position.y=1.85+Math.max(0,Math.sin(t*2+side))* .35)}orb(body,main,.86,1.2,0,.1);face(body,1.15,.49,.3)}
 if(d.form==='boba'){mesh(body,'cyl',0xc98c65,0,1.15,0,.62,1.5,.62);mesh(body,'cyl',gold,0,1.95,0,.69,.11,.69);const straw=box(body,main,.26,2.4,0,.13,.94,.13);straw.rotation.z=-.2;for(let j=0;j<12;j++)orb(body,0x433135,Math.sin(j*2.4)*.47,.49+(j%3)*.15,Math.cos(j*2.4)*.54,.09);face(body,1.32,.62,.25)}
 if(d.form==='cactus'){orb(body,0x429667,0,1.28,0,.45,1.04,.43);for(const side of[-1,1]){curve(body,0x429667,[[side*.25,1.05,0],[side*.75,1.3,0],[side*.75,1.85+side*.2,0]],.19);for(let j=0;j<6;j++)cone(body,0xf4ddb5,side*.38,.7+j*.22,.18,.023,.19).rotation.z=-side*1.1}face(body,1.57,.42,.21);if(feature==='cup')mesh(body,'cyl',gold,0,.47,0,.55,.5,.55)}
 if(d.form==='pumpkin'){for(let j=0;j<8;j++){const a=j*Math.PI/4;orb(body,j%2?0xf6ad36:0xe68026,Math.sin(a)*.35,1.2,Math.cos(a)*.35,.43,.81,.43)}curve(body,0x5b833b,[[0,1.95,0],[.08,2.25,0],[.3,2.3,0]],.09);face(body,1.34,.73,.28,true)}
 if(d.form==='mummy'){box(body,0xe5dbc5,0,1.25,0,1.13,1.55,.68);for(let j=0;j<9;j++)box(body,j%2?0xe4cfa7:0xffefd2,0,.61+j*.17,.38,1.16,.12,.055).rotation.z=Math.sin(j)*.12;face(body,1.6,.42,.25);const strip=group(body,.55,1.25,0);curve(strip,0xe4cfa7,[[0,0,0],[.5,-.2,0],[.8,-.5,.1]],.07);pose(strip,t=>strip.rotation.y=Math.sin(t*3)*.4)}boot(-.3,0);boot(.3,0);break}
// Animal species with different anatomies, not recolored generic quadrupeds.
case 'giraffe':case 'moose':case 'horse':case 'elk':case 'fox':case 'bear':case 'hippo':case 'hamster':case 'walrus':case 'rhino':case 'mammoth':case 'lion':case 'hound':case 'sphinx':case 'armadillo':case 'turtle':case 'sloth':{
 const f=d.form,long=f==='giraffe',tusk=f==='mammoth'||f==='walrus',low=['turtle','armadillo','walrus'].includes(f),massive=['mammoth','rhino','hippo','bear'].includes(f),y=low?.7:massive?1.25:1.1,wide=massive?.91:.68;
 orb(body,main,0,y,0,wide,low?.45:massive?.9:.65,1.04);orb(body,gold,0,y-.13,.25,wide*.72,.48,.79);if(long)mesh(body,'cyl',main,0,2,.64,.25,1.8,.25);
 const heads=f==='hound'&&feature==='cannoli'?3:1;
 for(let h=0;h<heads;h++){const x=(h-(heads-1)/2)*.8,head=animalHead(body,x,long?2.94:low?1.06:massive?1.83:1.62,low?1.07:.86,heads>1?.8:massive?1.2:1,f);
 if(tusk)for(const side of[-1,1])curve(head,0xffeac7,[[side*.32,-.22,.54],[side*.44,-.65,.85],[side*.56,-.52,1.05]],.09);
 if(f==='mammoth'){const trunk=group(head,0,-.16,.64);curve(trunk,main,[[0,0,0],[0,-.55,.28],[.14,-.88,.55],[.32,-.75,.71]],.17);pose(trunk,t=>trunk.rotation.x=Math.sin(t*1.3)*.18);for(const side of[-1,1])orb(head,main,side*.62,-.07,-.05,.34,.53,.12)}
 if(f==='rhino')cone(head,gold,0,.13,.78,.18,.86).rotation.x=.4;
 if(f==='hippo'){orb(head,main,0,-.12,.45,.65,.3,.5);for(const side of[-1,1])orb(head,dark,side*.24,.04,.83,.075,.04,.045)}
 if(['moose','elk'].includes(f))for(const side of[-1,1]){curve(head,gold,[[side*.35,.37,0],[side*.65,1,0],[side*1.16,1.31,-.1]],.07);for(let j=0;j<4;j++)curve(head,gold,[[side*(.58+j*.15),.8+j*.13,0],[side*(.51+j*.25),1.2+j*.19,-.05]],.04)}
 if(f==='horse'&&feature==='unicorn'){cone(head,light,0,.72,.16,.1,.92);for(let j=0;j<7;j++)orb(head,[0xff80ac,0x9e7ce5,0x73dada][j%3],0,.38-j*.14,-.45,.24,.19,.12)}
 if(['lion','sphinx'].includes(f)){for(let j=0;j<13;j++){const a=j*6.283/13,p=group(head,Math.sin(a)*.56,Math.cos(a)*.55,-.16);gem(p,j%2?gold:dark,0,0,0,.21,.42);p.rotation.z=-a}if(f==='sphinx'){crown(head,.67,.4);for(const side of[-1,1])featherWing(body,side,1.48,-.2)}}
 if(f==='bear'){for(const side of[-1,1]){orb(head,dark,side*.27,.13,.43,.2,.24,.06);orb(head,light,side*.27,.13,.51,.05,.06,.025)}}
 if(f==='hamster'){for(const side of[-1,1])orb(head,gold,side*.43,-.13,.3,.27,.29,.25);box(head,0xfff2d5,0,-.25,.7,.18,.15,.04)}
 pose(head,(t,m)=>{head.rotation.y=Math.sin(t*(1.2+(h*.2)) +h)*(.06+(1-m)*.1);head.rotation.x=Math.sin(t*1.8+h)*.045});}
 if(['turtle','armadillo'].includes(f)){orb(body,dark,0,y+.36,-.2,.82,.62,1);for(let j=0;j<5;j++)for(let k=0;k<3;k++){const z=-.82+j*.34,x=(k-1)*.43;gem(body,j%2?gold:main,x,y+.66+(k===1?.2:0),z,.27,.13)}}
 if(f==='sloth')for(const side of[-1,1]){const a=group(body,side*.65,1.52,.6);orb(a,main,0,-.52,0,.17,.69,.18);for(let j=0;j<3;j++)curve(a,gold,[[(j-1)*.08,-1.06,.04],[(j-1)*.08,-1.19,.22]],.025);rig.push({g:a,axis:'x',amp:.17,speed:1,phase:side})}
 if(f==='walrus'){for(const side of[-1,1]){const a=group(body,side*.75,.45,.15);orb(a,dark,side*.13,0,0,.44,.09,.36);rig.push({g:a,axis:'z',amp:.2,speed:2,phase:side})}}
 else for(const side of[-1,1])for(const z of[-.6,.66])limb(body,side*(wide*.76),low?.5:.8,z,low?.22:.57,massive?.26:.18);
 if(f==='fox'){const tail=group(body,0,1,-.9);orb(tail,main,0,.3,-.5,.46,.48,.74);orb(tail,gold,0,.55,-1,.28,.3,.33);pose(tail,t=>tail.rotation.y=Math.sin(t*2.6)*.45)}else if(!['mammoth','walrus','turtle','armadillo'].includes(f))tailChain(body,0,y,-.93,4,'smooth');
 if(long)for(let j=0;j<12;j++)orb(body,gold,Math.sin(j*2.4)*.63,1.05+(j%3)*.22,Math.cos(j*2.4)*.84,.12,.11,.025);
 break}
case 'gorilla':{orb(body,main,0,1.65,0,1.03,1.06,.67);orb(body,gold,0,1.54,.47,.67,.73,.26);const h=animalHead(body,0,2.65,.21,.94,'dog');box(h,dark,0,.31,.35,.85,.14,.18);for(const side of[-1,1]){const arm=group(body,side*.95,2.14,0);orb(arm,main,side*.2,-.48,.06,.42,.77,.42);orb(arm,dark,side*.27,-1.14,.18,.48,.38,.44);for(let j=0;j<4;j++)box(arm,gold,side*.27+(j-1.5)*.16,-1.18,.54,.12,.2,.1);pose(arm,(t,m)=>arm.rotation.x=Math.sin(t*(m?4:1.3)+side)*(.06+m*.36));limb(body,side*.48,.64,-.1,.4,.29)}pose(h,t=>h.rotation.y=Math.sin(t*.9)*.12);break}
case 'frog':{orb(body,main,0,1,0,.87,.67,.83);orb(body,gold,0,.8,.36,.63,.43,.53);const head=group(body,0,1.48,.42);orb(head,main,0,0,0,.84,.42,.56);for(const side of[-1,1]){orb(head,main,side*.53,.4,.07,.28,.35,.26);orb(head,0xffffe9,side*.53,.43,.3,.2,.24,.08);orb(head,dark,side*.53,.45,.38,.07,.18,.03);const leg=group(body,side*.75,.58,-.4);orb(leg,main,0,0,0,.4,.4,.51);orb(leg,gold,side*.07,-.36,.37,.34,.09,.52);feet.push(leg);limb(body,side*.64,.58,.69,.39,.1)}curve(head,dark,[[-.56,-.12,.5],[0,-.24,.62],[.56,-.12,.5]],.035);pose(body,(t,m)=>{body.position.y=Math.max(0,Math.sin(t*(m?4:1.7)))*(.12+.48*m);body.rotation.x=Math.cos(t*4)*.08*m});break}
case 'penguin':case 'bird':case 'flamingo':case 'moth':case 'valkyrie':{const f=d.form,peng=f==='penguin',flam=f==='flamingo',moth=f==='moth';orb(body,peng?0x24354d:main,0,1.3,0,moth?.28:.58,.75,.48);orb(body,peng?0xfff1d5:gold,0,1.2,.3,.43,.57,.22);const h=group(body,0,flam?2.55:2.13,.12);if(flam)curve(body,main,[[0,1.45,0],[.1,2,.1],[0,2.55,.12]],.13);orb(h,main,0,0,0,.36,.37,.33);face(h,.03,.29,.16);cone(h,0xe7a347,0,-.07,.47,.13,f==='bird'?.74:.35).rotation.x=Math.PI/2;
 if(moth){for(const side of[-1,1]){membraneWing(body,side,1.48,0,'moth');curve(h,gold,[[side*.14,.28,0],[side*.32,.69,0],[side*.54,.74,0]],.025)}}else if(f==='valkyrie'){for(const side of[-1,1])featherWing(body,side);crown(h,.36,.35)}else for(const side of[-1,1]){const wing=group(body,side*.54,1.59,0);orb(wing,main,side*.09,-.21,0,.17,.51,.25);wings.push({g:wing,s:side})}
 for(const side of[-1,1]){const leg=group(body,side*.25,flam?.8:.47,0);mesh(leg,'cyl',gold,0,flam?-.35:-.1,0,.055,flam?.86:.3,.055);orb(leg,gold,0,flam?-.78:-.26,.17,.19,.065,.3);feet.push(leg)}break}
// Colossal creatures.
case 'dragon':case 'hydra':case 'basilisk':case 'crocodile':case 'salamander':case 'rex':case 'raptor':case 'kaiju':{const f=d.form,biped=['rex','raptor','kaiju'].includes(f),croc=f==='crocodile',hydra=f==='hydra',low=croc||f==='basilisk'||f==='salamander',y=biped?1.8:low?.77:1.15;
 orb(body,main,0,y,0,biped?.82:.79,biped?1.19:.6,biped?.78:1.14);orb(body,gold,0,y-.08,.52,.58,biped?.91:.43,.4);const count=hydra?3:1;
 for(let j=0;j<count;j++){const x=(j-(count-1)/2)*.87,neck=group(body,x,low?1:hydra?1.6:biped?2.55:f==='dragon'?2.4:1.8,.63);if(hydra)curve(neck,main,[[0,-.5,-.25],[x*.12,.17,.02],[0,.69,.2]],.24);const head=group(neck,0,hydra?.8:0,.28);orb(head,main,0,0,0,.46,.44,.51);orb(head,main,0,-.12,croc?.58:.37,croc?.4:.35,.21,croc?.72:.45);for(const side of[-1,1]){orb(head,light,side*.35,.15,.34,.11,.1,.08,'glow');box(head,dark,side*.35,.16,.411,.025,.12,.015);curve(head,gold,[[side*.36,.28,-.1],[side*.47,.58,-.32],[side*.36,.84,-.43]],.075);for(let k=0;k<4;k++)cone(head,0xfff0cc,side*.29,-.26,.37+k*.12,.038,.18).rotation.x=Math.PI}const jaw=group(head,0,-.31,.18);orb(jaw,gold,0,0,.37,.31,.09,croc?.64:.43);pose(jaw,t=>jaw.rotation.x=.06+Math.pow(Math.max(0,Math.sin(t*.8+j)),8)*.27);pose(neck,(t,m)=>{neck.rotation.y=Math.sin(t*1.3+j*2)*(.13+.05*m);neck.rotation.x=Math.sin(t*1.8+j)*.05});if(feature==='espresso'){mesh(head,'cyl',gold,0,.42,-.05,.28,.14,.28);for(let k=0;k<2;k++){const st=group(head,(k-.5)*.2,.55,0);curve(st,light,[[0,0,0],[.1,.3,0],[0,.6,0]],.025);pose(st,t=>st.scale.y=.8+Math.sin(t*2+k)*.2)}}}
 if(hydra&&feature==='ancient'){for(const side of[-1,1])for(let k=0;k<3;k++){gem(body,dark,side*(.56+k*.12),1.48-k*.1,-.3-k*.2,.23,.35);curve(body,gold,[[side*.4,1.6,-.6],[side*.85,2.05,-.95],[side*1.2,1.83,-1.3]],.055)}for(let j=0;j<5;j++)box(body,gold,0,.84+j*.13,.98,.52-j*.045,.07,.08)}
 const legs= f==='basilisk'?6:biped?2:4;for(let j=0;j<legs;j++){const side=j%2?1:-1,z=biped?-.13:.65-Math.floor(j/2)*.65;limb(body,side*(biped?.64:.68),biped?.95:low?.45:.72,z,biped?.68:low?.26:.5,biped?.28:.19)}if(biped)for(const side of[-1,1]){const arm=group(body,side*.8,2.14,.25);orb(arm,main,0,-.22,.14,.2,.38,.21);for(let k=0;k<3;k++)cone(arm,gold,(k-1)*.08,-.47,.24,.04,.19).rotation.x=.5;rig.push({g:arm,axis:'x',amp:.2,speed:2,phase:side})}
 for(let j=0;j<4;j++){orb(body,gold,0,y-.32+j*.19,.66,.45-j*.035,.075,.16);if(!biped)for(const side of[-1,1])gem(body,main,side*.64,y+.28,-.65+j*.39,.18,.12)}const rearTail=tailChain(body,0,biped?1.2:y,-.88,biped?8:7);if(biped)rearTail.scale.z=.57;if(f==='dragon')rearTail.scale.z=.8;for(let j=0;j<6;j++)gem(body,feature==='candy'?[0xff92bd,0x78e6d8,0xffdf65][j%3]:gold,0,y+(biped?.9:.58)-j*.07,-.1-j*.19,.14,.3+(j%2)*.13);
 if(f==='dragon'){curve(body,main,[[0,1.3,.58],[0,1.87,.64],[0,2.4,.7]],.27);for(const side of[-1,1]){const wing=membraneWing(body,side,1.65,-.13);wing.scale.x=.8;}}if(f==='salamander')for(const side of[-1,1])for(let j=0;j<3;j++)curve(body,light,[[side*.42,1.1,.9],[side*(.82+j*.15),1.4-j*.2,.75]],.05);if(croc&&feature==='crystal')for(const side of[-1,1])for(let j=0;j<5;j++){const shard=gem(body,light,side*.35,1.22,-.7+j*.3,.19,.48+(j%2)*.2);shard.rotation.z=-side*.4}break}
case 'wyrm':case 'leviathan':case 'ouroboros':{const loop=d.form==='ouroboros',sea=d.form==='leviathan';for(let j=0;j<13;j++){const a=j*.42,x=loop?Math.sin(a)*1.05:Math.sin(j*.5)*.3,y=loop?1.6+Math.cos(a)*1.05:.55+j*.105,z=loop?0:1.22-j*.26,p=group(body,x,y,z);orb(p,main,0,0,0,.35,.33,.35);gem(p,gold,0,.31,0,.1,.28);if(j%2===0)for(const side of[-1,1]){const fin=gem(p,feature==='rainbow'?new G.Color().setHSL(j/13,.75,.6).getHex():light,side*.37,0,0,.16,.34);fin.rotation.z=side*.8}pose(p,(t,m)=>{p.position.x=x+Math.sin(t*(sea?2:2.8)-j*.48)*(.08+m*.12);p.rotation.z=Math.sin(t*2-j*.45)*.12});if(j===0){const head=animalHead(p,0,.18,.3,1.05,'cat');for(const side of[-1,1])horn(head,side*.3,.35,0,side);if(!sea&&!loop)for(const side of[-1,1])curve(head,gold,[[side*.25,-.05,.6],[side*.67,-.3,.7],[side*.9,-.15,.48]],.025)}}if(sea)for(const side of[-1,1]){const fin=group(body,side*.27,1,-.3);for(let j=0;j<4;j++){const blade=gem(fin,j%2?main:gold,side*(.34+j*.17),-.05-j*.08,-j*.26,.22,.64);blade.rotation.z=side*1.04;blade.rotation.x=.3}pose(fin,t=>fin.rotation.z=side*Math.sin(t*1.8)*.16)}break}
case 'crab':case 'spider':case 'centipede':{const crab=d.form==='crab',cent=d.form==='centipede',n=cent?5:4;orb(body,main,0,1,0,.78,.53,cent?1.25:.72);if(cent)for(let j=0;j<5;j++)orb(body,j%2?gold:main,0,1,-.9+j*.45,.69,.55,.28);face(body,1.23,cent?1.2:.7,.27,true);for(const side of[-1,1])for(let j=0;j<n;j++){const leg=group(body,side*.6,1,(j-(n-1)/2)*.37);curve(leg,dark,[[0,0,0],[side*.55,.22,0],[side*.85,-.76,.12]],.07);gem(leg,gold,side*.55,.22,0,.12);pose(leg,(t,m)=>{leg.rotation.y=Math.sin(t*(m?6:2)+j+side)*(.06+m*.22);leg.rotation.z=Math.sin(t*5+j+side)*.1*m})}if(crab)for(const side of[-1,1]){const claw=group(body,side*1.1,1.54,.66);curve(claw,main,[[0,-.6,-.3],[0,0,0]],.12);orb(claw,gold,0,.1,0,.35,.4,.26);const p=group(claw,0,.3,0);cone(p,main,side*.13,.28,0,.18,.58).rotation.z=-side*.22;cone(claw,main,-side*.19,.48,0,.14,.5).rotation.z=side*.25;pose(p,t=>p.rotation.z=side*(.2+Math.sin(t*2)*.2))}else for(const side of[-1,1])cone(body,light,side*.16,.8,cent?1.42:.87,.07,.35).rotation.x=.6;break}
case 'ray':case 'manta':case 'fish':case 'narwhal':case 'squid':{const f=d.form,ray=f==='ray'||f==='manta',squid=f==='squid';orb(body,main,0,1.47,0,ray?.67:.57,ray?.28:.58,squid?1.29:1.06);orb(body,gold,0,1.3,.25,.47,.22,.85);face(body,1.57,.89,.23);if(ray)for(const side of[-1,1]){const w=membraneWing(body,side,1.45,0);w.scale.y=.4}else if(!squid)for(const side of[-1,1]){const f=group(body,side*.48,1.4,0);gem(f,gold,side*.32,0,0,.25,.5).rotation.z=side*1.15;rig.push({g:f,axis:'z',amp:.2,speed:3,phase:side})}if(f==='narwhal')cone(body,gold,0,1.6,1.8,.1,1.5).rotation.x=Math.PI/2;const tail=group(body,0,1.46,-1.05);if(squid){for(let j=0;j<8;j++){const p=group(tail,Math.sin(j)*.25,Math.cos(j)*.25,0);curve(p,j%2?gold:main,[[0,0,0],[Math.sin(j)*.25,Math.cos(j)*.2,-.65],[Math.sin(j)*.5,Math.cos(j)*.3,-1.03]],.07);pose(p,t=>p.rotation.x=Math.sin(t*3+j)*.25)}}else {curve(tail,main,[[0,0,0],[0,0,-.55],[.3,.12,-1]],.08);if(!ray)for(const side of[-1,1])gem(tail,gold,side*.26,0,-.68,.28,.6).rotation.z=side*.7}pose(tail,t=>tail.rotation.y=Math.sin(t*3)*.32);pose(body,t=>body.position.y=(squid?.5:.14)+Math.sin(t*1.6)*.12);break}
case 'rocket':case 'cannon':case 'wheel':case 'ufo':case 'golem':case 'centaur':case 'reaper':case 'banshee':{
 const f=d.form;if(f==='rocket'){mesh(body,'cyl',main,0,1.4,0,.46,1.85,.46,'metal');cone(body,gold,0,2.65,0,.47,.8,'metal');for(const side of[-1,1]){box(body,gold,side*.54,.62,0,.3,.69,.47).rotation.z=-side*.35;const flame=group(body,side*.19,.22,0);cone(flame,light,0,-.3,0,.18,.8,'glow').rotation.z=Math.PI;pose(flame,t=>flame.scale.y=.8+Math.sin(t*17)*.2)}face(body,1.6,.45,.2);pose(body,t=>body.position.y=.25+Math.sin(t*2)*.13)}
 if(f==='cannon'){mesh(body,'cyl',0xddb477,0,1.65,0,.62,1.68,.62,'metal').rotation.x=Math.PI/2;ring(body,gold,0,1.65,.85,.56,.09);orb(body,dark,0,1.65,.87,.44,.44,.08);face(body,2,.56,.22);for(const side of[-1,1]){const wheel=group(body,side*.7,.52,0);ring(wheel,dark,0,0,0,.46,.13,0,Math.PI/2);for(let j=0;j<6;j++)box(wheel,gold,0,0,0,.07,.85,.07).rotation.x=j*Math.PI/3;pose(wheel,(t,m)=>wheel.rotation.x=t*4*m)}}
 if(f==='wheel'){const wheel=group(body,0,1.03,0);ring(wheel,main,0,0,0,.75,.27);ring(wheel,gold,0,0,.21,.75,.04);for(let j=0;j<8;j++){const a=j*Math.PI/4;box(wheel,dark,Math.sin(a)*.98,Math.cos(a)*.98,0,.2,.12,.45).rotation.z=-a}pose(wheel,(t,m)=>wheel.rotation.z=-t*(.3+5*m));const h=animalHead(body,0,1.5,.33,.75);for(const side of[-1,1])cone(h,gold,side*.3,.6,0,.14,.55)}
 if(f==='ufo'){orb(body,dark,0,1.35,0,1.35,.24,1.15);orb(body,main,0,1.75,0,.64,.65,.6);face(body,1.83,.56,.24);const r=group(body,0,1.39,0);for(let j=0;j<10;j++){const a=j*6.283/10;orb(r,j%2?light:gold,Math.sin(a)*1.19,0,Math.cos(a)*1.04,.1,.05,.1,'glow')}pose(r,t=>r.rotation.y=t*.6);for(let j=0;j<3;j++){const ray=group(body,0,.8,0);ring(ray,light,0,-j*.24,0,.25+j*.13,.028,Math.PI/2);pose(ray,t=>ray.scale.setScalar(.9+Math.sin(t*3-j)*.1))}pose(body,t=>{body.position.y=.25+Math.sin(t*1.4)*.17;body.rotation.z=Math.sin(t)*.09})}
 if(f==='golem'){for(let j=0;j<5;j++)gem(body,j%2?main:gold,Math.sin(j*2)*.36,1+j*.29,Math.cos(j*2)*.2,.51,.42);const head=animalHead(body,0,2.8,.1,.85);for(const side of[-1,1]){const arm=group(body,side*.95,1.65,0);gem(arm,main,0,0,0,.49,.65);pose(arm,t=>arm.position.y=1.7+Math.sin(t*1.5+side)*.16);gem(body,dark,side*.43,.35,.1,.32,.3)}floatPebbles(body)}
 if(f==='centaur'){orb(body,main,0,.9,-.15,.7,.53,1.05);for(const side of[-1,1])for(const z of[-.75,.55])limb(body,side*.5,.6,z,.43,.17);box(body,dark,0,1.75,.6,1,.97,.58,'metal');armor(body,0,1.85,.92,.44);const h=animalHead(body,0,2.71,.66,.83);crown(h,.5,.47);for(const side of[-1,1]){const arm=group(body,side*.75,2.06,.53);box(arm,main,0,-.35,0,.31,.78,.36);rig.push({g:arm,axis:'x',amp:.2,speed:2,phase:side})}tailChain(body,0,1,-1.1,4)}
 if(f==='reaper'||f==='banshee'){orb(body,dark,0,2.36,0,.46,.6,.4);face(body,2.37,.4,.2,true);for(let j=0;j<9;j++){const a=j*6.283/9,p=group(body,Math.sin(a)*.38,1.88,Math.cos(a)*.28);cone(p,main,Math.sin(a)*.13,-.72,Math.cos(a)*.1,.25,1.73).rotation.z=.15*Math.sin(a);pose(p,t=>p.rotation.x=Math.sin(t*2+j)*.1)}for(const side of[-1,1])curve(body,gold,[[side*.3,1.95,0],[side*.8,1.65,.07],[side*1.02,1.84,.22]],.08);pose(body,t=>{body.position.y=.21+Math.sin(t*1.2)*.15;body.rotation.y=Math.sin(t*.7)*.08})}break}

case 'idol':{box(body,dark,0,1.4,0,1.05,1.9,.86);box(body,main,0,1.45,.08,.93,1.77,.82);box(body,gold,0,1.82,.57,.94,.17,.24);box(body,main,0,1.32,.61,.24,.69,.31);for(const k of[-1,1]){box(body,light,k*.25,1.66,.53,.22,.07,.035,'glow');ring(body,gold,k*.58,1.3,0,.16,.035,0,Math.PI/2);box(body,dark,k*.47,1.13,.45,.05,.59,.05)}box(body,dark,0,.91,.54,.53,.065,.04);for(let j=0;j<4;j++)box(body,gold,(j-1.5)*.16,2.41,0,.11,.13,.63);boot(-.3,0);boot(.3,0);const stone=group(body,0,2.8,0);gem(stone,light,0,0,0,.19,.2);rotors.push(stone);break}
case 'volcano':{const rock=group(body,0,0,0);cone(rock,dark,0,1.2,0,1.1,1.9);ring(rock,main,0,2.14,0,.5,.14,Math.PI/2);mesh(rock,'cyl',light,0,2.13,0,.43,.05,.43,'glow');for(let j=0;j<7;j++){const a=j*6.283/7;curve(rock,0xffa34e,[[Math.cos(a)*.92,.34,Math.sin(a)*.92],[Math.cos(a+.2)*.65,1.02,Math.sin(a+.2)*.65],[Math.cos(a)*.39,1.91,Math.sin(a)*.39]],.045);gem(rock,main,Math.cos(a)*.79,.77,Math.sin(a)*.79,.21,.34)}face(body,1.43,.76,.28,true);for(let j=0;j<4;j++){const f=group(body,Math.sin(j*2)*.23,2.2,Math.cos(j*2)*.22);cone(f,j%2?light:main,0,.32,0,.18,.8,'glow');flames.push(f)}for(const side of[-1,1]){const hand=group(body,side*1.05,1.43,0);gem(hand,dark,0,-.15,0,.36,.45);gem(hand,gold,0,-.16,.23,.19,.27);rig.push({g:hand,axis:'z',amp:.15,speed:2,phase:side});boot(side*.44,0,1.3)}break}
case 'titan':{box(body,dark,0,1.65,0,1.5,1.42,.8,'metal');for(let j=0;j<4;j++)box(body,j%2?main:gold,0,1.17+j*.25,.48,1.14-j*.12,.16,.16,'metal');const core=group(body,0,1.78,.63);gem(core,light,0,0,0,.24,.3);ring(core,gold,0,0,0,.37,.055);rotors.push(core);const head=group(body,0,2.72,0);gem(head,main,0,0,0,.47,.55);for(const side of[-1,1]){box(head,light,side*.17,.06,.38,.2,.045,.04,'glow').rotation.z=-side*.2;horn(head,side*.32,.32,-.14,side);const arm=group(body,side*1.13,2.05,-.05);gem(arm,gold,0,.15,0,.38,.29);box(arm,main,0,-.35,0,.5,.54,.54,'metal');box(arm,dark,0,-.8,.03,.64,.49,.62,'metal');for(let j=0;j<3;j++)box(arm,light,(j-1)*.17,-.8,.36,.09,.22,.035,'glow');rig.push({g:arm,axis:'y',amp:.25,speed:1.8,phase:side});boot(side*.46,0,1.6)}break}

case 'donut':{const bagel=feature==='bagel';ring(body,0xa96637,0,1.35,0,.62,.3);ring(body,bagel?0xd8a359:0xf59fb4,0,1.38,.19,.62,.23);for(let j=0;j<22;j++){const a=j*2.399,r=.52+(j%3)*.085;const m=box(body,bagel?0xffe8b5:[0xffdf74,0x87d5ce,0xffffff][j%3],Math.cos(a)*r,1.38+Math.sin(a)*r,.39,.09,.032,.035);m.rotation.z=a}face(body,1.46,.43,.31);boot(-.35,0);boot(.35,0);if(!bagel){const bow=group(body,.5,2.13,0);for(const side of[-1,1])gem(bow,gold,side*.12,0,0,.12,.1)}break}
case 'toast':{box(body,0x9c582d,0,1.28,0,1.46,1.6,.57,'food');box(body,0xf3d18c,0,1.32,.07,1.28,1.37,.58,'food');orb(body,0xf3d18c,-.3,2,.03,.39,.27,.31);orb(body,0xf3d18c,.3,2,.03,.39,.27,.31);for(let x=-2;x<=2;x++)for(let y=0;y<4;y++)box(body,0xc9904b,x*.23,.8+y*.28,.383,.16,.18,.025);box(body,0xffe895,-.36,1.8,.42,.36,.19,.16).rotation.z=.25;face(body,1.45,.46,.28);boot(-.35,0);boot(.35,0);break}
case 'cup':{mesh(body,'cyl',main,0,1.3,0,.66,1.35,.66,'food');mesh(body,'cyl',0x52352c,0,2,0,.6,.055,.6,'food');ring(body,0xfff1db,0,2.02,0,.66,.08,Math.PI/2);ring(body,gold,.7,1.4,0,.34,.095,0,Math.PI/2);for(let j=0;j<12;j++){const a=j*2.4,r=.13+j*.027;orb(body,0xffe4bc,Math.cos(a)*r,2.04+j*.005,Math.sin(a)*r,.14,.035,.08)}face(body,1.4,.65,.27);for(let j=0;j<3;j++){const steam=group(body,(j-1)*.25,2.18,0);curve(steam,light,[[0,0,0],[.1,.15,0],[-.04,.32,0],[.03,.5,0]],.02);flames.push(steam)}boot(-.35,0);boot(.35,0);break}
case 'plant':{const banana=/banana/.test(d.name.toLowerCase());orb(body,banana?0xf6d657:main,0,1.3,0,banana?.45:.76,1,.5);for(let j=0;j<5;j++){const a=j*1.257;curve(body,gold,[[Math.cos(a)*.3,.45,Math.sin(a)*.3],[Math.cos(a)*.73,1.3,Math.sin(a)*.5],[Math.cos(a)*.25,2.15,Math.sin(a)*.2]],.025)}mesh(body,'cyl',0x604229,0,2.36,0,.11,.38,.11);for(const k of[-1,1])orb(body,0x5eb67a,k*.28,2.38,0,.38,.07,.18).rotation.z=k*.3;face(body,1.47,.48,.26);boot(-.32,0);boot(.32,0);break}
case 'feast':{const variants=seed%4;orb(body,0xc38548,0,1.16,0,.88,.51,.63);orb(body,0xf2c77c,0,1.48,0,.84,.33,.64);for(let j=0;j<18;j++){const a=j*2.399,r=.3+(j%4)*.12;orb(body,0xffedb8,Math.cos(a)*r,1.64+Math.sqrt(Math.max(0,1-r*r))*.1,Math.sin(a)*r,.045,.02,.075).rotation.y=a}box(body,0x6b3b30,0,1.1,0,1.53,.21,1.02);for(let j=0;j<7;j++){const a=j*6.28/7;orb(body,0x69aa58,Math.cos(a)*.66,1.25,Math.sin(a)*.52,.24,.07,.2)}face(body,1.51,.63,.3);if(variants===0){const chef=group(body,0,1.91,0);mesh(chef,'cyl',0xfff4e6,0,.12,0,.36,.35,.36);for(let j=0;j<4;j++)orb(chef,0xfff4e6,Math.cos(j*1.57)*.26,.37,Math.sin(j*1.57)*.22,.28,.26,.28)}else {const fork=group(body,.95,1,0);mesh(fork,'cyl',gold,0,.5,0,.035,1.4,.035,'metal');for(let j=-1;j<2;j++)box(fork,gold,j*.08,1.24,0,.035,.34,.035,'metal')}boot(-.4,0);boot(.4,0);break}
case 'beast':{const n=d.name.toLowerCase(),giraffe=/giraff|llama|alpacca/.test(n),frog=/frog|turtle|hippo/.test(n),cat=/tigrot|tiger|jaguar|sphinx|panda|rizz/.test(n);orb(body,main,0,1.1,0,.73,.65,1.03);orb(body,gold,0,.95,.32,.54,.4,.65);const head=group(body,0,giraffe?2.7:1.65,.76);if(giraffe)mesh(body,'cyl',main,0,1.98,.61,.24,1.5,.24);orb(head,main,0,0,0,.54,.5,.52);orb(head,gold,0,-.17,.42,.4,.23,.27);face(head,.09,.5,.23);for(const k of[-1,1]){orb(head,main,k*.48,.44,-.06,frog?.25:.17,frog?.16:.4,.13).rotation.z=-k*.35;orb(head,gold,k*.48,.45,.03,.08,.22,.045);if(hi)horn(head,k*.3,.4,-.13,k)}for(let j=0;j<12;j++){const a=j*2.4;orb(body,dark,Math.cos(a)*.68,1.2+Math.sin(j*1.7)*.25,Math.sin(a)*.85,.13,.08,.11)}if(cat)for(let j=0;j<5;j++)for(const k of[-1,1])curve(body,dark,[[k*.36,1.63,-.65+j*.29],[k*.65,1.45,-.65+j*.29],[k*.71,1.16,-.65+j*.29]],.028);if(cat)for(const k of[-1,1])for(let j=0;j<3;j++)curve(head,gold,[[k*.3,-.1,.5],[k*.55,-.08+j*.06,.52],[k*.7,-.14+j*.13,.49]],.013);for(const k of[-1,1]){boot(k*.5,.65);boot(k*.5,-.65)}const tail=group(body,0,1.3,-.9);curve(tail,main,[[0,0,0],[.25,.3,-.5],[.3,.6,-.75],[.12,.8,-.78]],.075);rig.push({g:tail,axis:'y',amp:.45,speed:3});break}
case 'shark':{orb(body,main,0,1.45,0,.66,.64,1.25);orb(body,0xe9f5ec,0,1.17,.22,.54,.27,1.03);orb(body,main,0,1.45,1,.56,.48,.55);face(body,1.63,1.43,.25,true);for(const s of[-1,1]){const fin=box(body,gold,s*.8,1.22,.1,.87,.085,.5,'metal');fin.rotation.z=-s*.25;for(let j=0;j<3;j++)box(body,dark,s*.57,1.46,-.28-j*.17,.035,.3,.05)}cone(body,gold,0,2.23,-.18,.33,.95,'metal').scale.z=.45;const tail=group(body,0,1.45,-1.2);for(const s of[-1,1]){const fin=cone(tail,main,0,s*.37,-.22,.32,.75);fin.rotation.x=s*.5;fin.scale.x=.3}rig.push({g:tail,axis:'y',amp:.6,speed:5});break}
case 'serpent':{const count=hi?9:7;for(let j=0;j<count;j++){const g=group(body,0,.7-j*.025,-j*.32+.65);orb(g,j%2?main:gold,0,0,0,.46-j*.023,.38-j*.02,.32);if(hi)gem(g,light,0,.36-j*.012,0,.12,.23);rig.push({g,axis:'y',amp:.1,speed:3,segment:j})}const head=group(body,0,1.05,1);orb(head,main,0,0,0,.55,.46,.46);face(head,.08,.44,.24,hi);for(const s of[-1,1])cone(head,0xffeed4,s*.23,-.28,.48,.065,.28).rotation.x=Math.PI;if(hi){horn(head,-.35,.3,-.15,-1);horn(head,.35,.3,-.15,1)}rig.push({g:head,axis:'y',amp:.13,speed:3,segment:-1});break}
case 'kraken':{orb(body,main,0,2,0,.86,1,.72);for(let j=0;j<7;j++)gem(body,gold,Math.sin(j*.9)*.66,2.25+Math.cos(j*1.3)*.55,-.35,.07,.15);face(body,2.15,.7,.32,true);for(let j=0;j<8;j++){const a=j*Math.PI/4,p=group(body,Math.sin(a)*.5,1.36,Math.cos(a)*.5);p.rotation.y=a;const parts=[];let par=p;for(let k=0;k<3;k++){const seg=group(par,0,k?-.35:0,k?.2:0);orb(seg,k%2?main:gold,0,-.18,.12,.14-k*.025,.28,.18);for(let q=0;q<2;q++)orb(seg,light,0,-.12-q*.14,.29,.058,.048,.025);parts.push(seg);par=seg}tentacles.push({parts,phase:j*.85})}if(hi)crown(body,3,.52);break}
case 'phoenix':{const penguin=/pengu/i.test(d.name);orb(body,main,0,1.5,0,.55,.77,.58);orb(body,gold,0,1.44,.35,.39,.6,.24);const head=group(body,0,2.35,.17);orb(head,main,0,0,0,.41,.44,.4);face(head,.08,.35,.18,true);cone(head,gold,0,-.1,.51,.15,.42,'metal').rotation.x=Math.PI/2;for(let j=-1;j<=1;j++)gem(head,light,j*.13,.55,-.06,.08,.3);for(const s of[-1,1]){const w=featherWing(body,s);if(penguin)w.scale.setScalar(.4);else if(epic)w.scale.x=.75}for(let j=0;j<5;j++){const tail=group(body,(j-2)*.16,1.1,-.48);const f=gem(tail,j%2?light:gold,0,-.1,-.52,.15,.82);f.rotation.x=1.05+j*.06;rig.push({g:tail,axis:'x',amp:.2,speed:3,phase:j})}boot(-.25,.05,.7);boot(.25,.05,.7);break}
case 'legacy-dragon':{orb(body,main,0,1.1,0,.68,.6,1.01);for(let j=0;j<5;j++)orb(body,gold,0,1.08+j*.16,.52+j*.12,.4-j*.035,.12,.35);const head=group(body,0,2.04,1);orb(head,main,0,0,0,.47,.46,.55);orb(head,gold,0,-.17,.47,.32,.2,.38);face(head,.13,.48,.22,true);for(const s of[-1,1]){horn(head,s*.32,.3,-.15,s);for(let j=0;j<3;j++)cone(head,0xfff3d4,s*.28,-.23,.38+j*.13,.035,.14).rotation.x=Math.PI;featherWing(body,s,1.62,-.28)}for(let j=0;j<6;j++){const tail=group(body,0,1-j*.08,-.85-j*.31);orb(tail,main,0,0,0,.28-j*.028,.24-j*.021,.25);gem(tail,light,0,.27-j*.023,0,.12-j*.01,.25-j*.024);rig.push({g:tail,segment:j,axis:'y',amp:.12,speed:3})}for(const k of[-1,1]){boot(k*.48,.54);boot(k*.48,-.55)}break}
case 'mech':{box(body,dark,0,1.35,0,1.27,1.39,.84,'metal');box(body,main,0,1.42,.15,1.1,1.12,.73,'metal');armor(body,0,1.52,.54,.38);for(const s of[-1,1]){const arm=group(body,s*.82,1.96,0);box(arm,gold,0,-.02,0,.52,.43,.63,'metal');box(arm,main,0,-.46,0,.37,.57,.43,'metal');orb(arm,dark,0,-.73,.02,.24,.21,.23,'metal');rig.push({g:arm,axis:'x',amp:.3,speed:4,phase:s});for(let j=0;j<3;j++)box(body,light,s*.41,1.25-j*.13,.57,.13,.036,.025,'glow');mesh(body,'cyl',dark,s*.43,1.72,-.59,.15,.95,.15,'metal');ring(body,gold,s*.43,2.15,-.59,.16,.028,Math.PI/2)}const head=group(body,0,2.46,0);box(head,main,0,0,0,.88,.64,.69,'metal');box(head,dark,0,.04,.38,.74,.27,.11,'metal');for(const k of[-1,1])box(head,light,k*.19,.055,.45,.24,.075,.02,'glow');mesh(head,'cyl',gold,.33,.61,0,.025,.65,.025,'metal');orb(head,light,.33,.96,0,.07,.07,.07,'glow');for(let j=0;j<7;j++)box(body,gold,(j-3)*.135,.7,.45,.075,.08,.03,'metal');boot(-.41,0,1.4);boot(.41,0,1.4);break}
case 'monarch':{cone(body,dark,0,1.04,0,.77,1.7);for(let j=0;j<8;j++){const a=j*Math.PI/4;curve(body,gold,[[Math.cos(a)*.62,.3,Math.sin(a)*.62],[Math.cos(a)*.38,1.08,Math.sin(a)*.38],[Math.cos(a)*.28,1.8,Math.sin(a)*.28]],.025)}armor(body,0,1.6,.41,.41);const head=group(body,0,2.2,0);orb(head,main,0,0,0,.44,.47,.4);face(head,.04,.37,.2,true);crown(head,.48,.44);for(const s of[-1,1]){armor(body,s*.68,1.79,.02,.32);const cape=group(body,s*.22,1.85,-.36);for(let j=0;j<4;j++){const f=group(cape,s*(j*.11),-.23-j*.32,-j*.055);box(f,j%2?main:dark,0,0,0,.7,.39,.055);cloth.push({g:f,phase:j})}mesh(body,'cyl',gold,s*.9,1.3,.2,.035,1.6,.035,'metal');gem(body,light,s*.9,2.2,.2,.17,.26)}boot(-.28,0);boot(.28,0);break}
case 'wraith':{const hood=group(body,0,2,0);orb(hood,dark,0,0,0,.59,.77,.48);orb(hood,0x100f21,0,-.08,.4,.4,.5,.12);for(const s of[-1,1]){box(hood,light,s*.18,.08,.51,.21,.055,.025,'glow').rotation.z=-s*.2;horn(hood,s*.4,.5,-.09,s);gem(body,gold,s*.68,1.74,0,.28,.18)}for(let j=0;j<7;j++){const a=(j-3)*.24,p=group(body,a,1.4,-Math.abs(a)*.2);cone(p,j%2?main:dark,0,-.5,0,.21,1.5).rotation.x=Math.PI;curve(p,gold,[[0,.04,.17],[.05,-.55,.14],[0,-1.06,.08]],.018);cloth.push({g:p,phase:j})}orb(body,light,0,1.38,.43,.19,.24,.11,'glow');break}
case 'celestial':{orb(body,dark,0,1.7,0,.77,.86,.7,'metal');orb(body,main,0,1.74,.2,.64,.7,.6);face(body,1.9,.76,.28,true);for(let j=0;j<3;j++){const p=group(body,0,1.73,0);ring(p,gold,0,0,0,1.02+j*.16,.037,Math.PI/2+j*.52,.2+j*.4);p.rotation.z=j*.62;for(let k=0;k<3;k++){const a=k*2.094;gem(p,light,Math.cos(a)*(1.03+j*.16),0,Math.sin(a)*(1.03+j*.16),.065,.13)}orbits.push({g:p,speed:(j%2?-.3:.3)*(j+1)})}crown(body,2.64,.44);const p=group(body,0,.45,0);gem(p,gold,0,0,0,.35,.4);rotors.push(p);break}
}
// Character-specific proportions; no universal crown, badge, or halo.
body.scale.set(.9+(seed%11)*.021,.94+((seed>>>5)%11)*.016,.9+((seed>>>10)%11)*.024);
const accessory=group(body,0,0,0),foodTop=({walrus:1.67,armadillo:1.59,turtle:1.59,crocodile:1.53,basilisk:1.58,sloth:2.05,hamster:2.2,beast:2.15,bear:2.55,hippo:2.63,gorilla:3.08,giraffe:3.51,hydra:1.95,wyrm:1.68,blob:1.83,ghost:1.89})[d.form]||2.28;
if(feature==='fork'){const fork=group(body,.73,1,0);mesh(fork,'cyl',gold,0,.25,0,.035,1.25,.035,'metal');for(let j=-1;j<=1;j++)box(fork,gold,j*.1,1,0,.035,.35,.04);pose(fork,t=>fork.rotation.z=Math.sin(t*2)*.12)}
if(feature==='pants'){box(body,0x5072a1,0,.62,0,1.02,.57,.81);box(body,0x273c58,0,.9,.42,1.04,.1,.04);box(body,gold,0,.89,.46,.17,.13,.04)}
if(feature==='pistachio'){orb(body,0x8bad59,-.34,1.81,.4,.2,.11,.09)}
if(feature==='salt')for(let j=0;j<6;j++)box(body,0xffffff,Math.sin(j*2)*.55,.6+(j%4)*.28,.23,.07,.06,.04);
if(feature==='holes')for(let j=0;j<6;j++)orb(body,0xc69739,Math.sin(j*2)*.4,.55+(j%4)*.22,.395,.09,.08,.02);
if(['wizard','warlock'].includes(feature)){const hat=group(accessory,0,d.form==='walrus'?1.63:2.37,0);cone(hat,dark,0,.43,0,.59,1.07);ring(hat,gold,0,0,0,.56,.06,Math.PI/2);gem(hat,light,0,.43,.24,.1,.14);const staff=group(body,.88,1.1,.1);curve(staff,gold,[[0,-.6,0],[0,.8,0],[.2,1.03,0]],.045);orb(staff,light,.2,1.1,0,.17,.17,.17,'glow');pose(staff,t=>staff.rotation.z=Math.sin(t*1.7)*.08)}
if(['pharaoh','aztec'].includes(feature)){const headdress=group(accessory,0,2.23,0);for(const side of[-1,1])for(let j=0;j<5;j++){box(headdress,j%2?0x317cae:gold,side*(.42+j*.045),.2-j*.2,-.07,.19,.19,.27);if(feature==='aztec')gem(headdress,j%2?main:light,side*(.16+j*.15),.4+j*.1,-.12,.09,.42)}gem(headdress,light,0,.48,.05,.14,.26)}
if(['samurai','ninja','karate','bandit','pirate','captain'].includes(feature)){const hat=group(accessory,0,d.form==='fish'?1.82:2.06,.06);if(feature==='samurai'){orb(hat,dark,0,0,-.03,.58,.25,.4);for(const side of[-1,1])curve(hat,gold,[[side*.2,.12,.28],[side*.49,.4,.23],[side*.57,.68,.15]],.045)}else if(['pirate','captain'].includes(feature)){box(hat,dark,0,.12,0,1.1,.32,.55);gem(hat,gold,0,.18,.3,.1,.13)}else {box(hat,dark,0,-.17,.46,1,.15,.09);const ribbon=group(hat,.48,-.16,.1);curve(ribbon,main,[[0,0,0],[.45,-.12,-.1],[.6,-.37,-.14]],.06);pose(ribbon,t=>ribbon.rotation.x=Math.sin(t*4)*.23)}if(['samurai','ninja','pirate'].includes(feature)){const sword=group(body,-.85,1.2,-.15);box(sword,gold,0,0,0,.37,.09,.1);box(sword,0xd6eff1,0,.53,0,.13,1.02,.055,'metal');box(sword,dark,0,-.24,0,.13,.43,.12);sword.rotation.z=-.33}}
if(feature==='sombrero'){mesh(accessory,'cyl',0xe2b25e,0,2.21,0,.96,.08,.74);cone(accessory,0xe2b25e,0,2.54,0,.5,.65);for(let j=0;j<12;j++)orb(accessory,main,Math.sin(j*6.283/12)*.89,2.22,Math.cos(j*6.283/12)*.67,.055)}
if(feature==='sunglasses'){box(accessory,dark,0,1.8,1.25,.97,.23,.08);for(const side of[-1,1])box(accessory,0x7bbfee,side*.24,1.83,1.3,.22,.055,.025)}
if(['dj','dancer'].includes(feature)){const headY=d.form==='kraken'?2.64:d.form==='shark'?1.95:1.94;for(const side of[-1,1]){orb(accessory,dark,side*.65,headY,0,.18,.3,.2);ring(accessory,light,side*.76,headY,0,.15,.035,0,Math.PI/2)}curve(accessory,dark,[[-.65,headY,0],[-.42,headY+.51,0],[.42,headY+.51,0],[.65,headY,0]],.07);pose(body,(t,m)=>{body.rotation.z=Math.sin(t*3.8)*(.05+.055*(1-m));body.position.y=Math.abs(Math.sin(t*3.8))*.09})}
if(['scarf','aurora','lemon'].includes(feature)){const scarf=group(body,0,1.87,0);ring(scarf,feature==='scarf'?0xf07765:gold,0,0,0,.35,.095,Math.PI/2);const end=group(scarf,.24,-.1,.37);box(end,main,0,-.28,0,.2,.66,.065);pose(end,(t,m)=>end.rotation.x=Math.sin(t*3)*(.08+m*.2));if(feature==='lemon')orb(scarf,0xffde56,.14,-.22,.25,.15,.2,.13)}
if(['pancakes','cake','yogurt','icecream','waffle','noodles','pasta','dumpling','burger','biscuit','cheese','cannoli','kiwi','peach','seeds','mochi','shell','ivory'].includes(feature)){
 // Food identity stays visible on creature designs.
 const dish=group(body,0,foodTop,-.23);
 if(['pancakes','cake','burger'].includes(feature)){for(let j=0;j<4;j++)mesh(dish,'cyl',feature==='burger'?[0xcc944f,0x5a372b,0x75a74f,0xe8b46b][j]:j%2?0xf8dc9e:0xa56b3f,0,j*.11,0,.44,.1,.4);box(dish,0xffe3a0,0,.43,0,.25,.1,.21)}
 else if(['icecream','yogurt','ivory'].includes(feature)){for(let j=0;j<5;j++)orb(dish,j%2?0xffecd0:gold,Math.sin(j*2)*.1,j*.12,Math.cos(j*2)*.07,.32-j*.045,.16,.29-j*.04)}
 else if(['noodles','pasta','dumpling','cannoli'].includes(feature)){for(let j=0;j<4;j++)curve(dish,0xf4d99b,[[-.35,j*.08,0],[0,j*.08+.14,.1],[.35,j*.08,0]],.055)}
 else if(feature==='cheese'){gem(dish,0xffd24c,0,.09,0,.35,.2);for(let j=0;j<4;j++)orb(dish,0xba7e33,Math.sin(j)*.23,.22,Math.cos(j)*.16,.045)}
 else if(['shell','mochi','peach','seeds','kiwi'].includes(feature)){orb(dish,feature==='kiwi'?0x7cbb65:gold,0,.1,0,.33,.24,.3);for(let j=0;j<5;j++)curve(dish,main,[[0,.32,0],[Math.sin(j*1.3)*.3,.12,Math.cos(j*1.3)*.3]],.018)}
 else {box(dish,0xd8a75e,0,.15,0,.58,.2,.52);for(let j=0;j<4;j++)box(dish,0x855d36,(j-1.5)*.13,.26,0,.035,.025,.43)}
}
if(['lightning','plasma','neon','cyber'].includes(feature)){for(const side of[-1,1]){const bolts=group(body,side*.64,1.66,-.25);curve(bolts,light,[[0,-.4,0],[side*.35,0,0],[side*.12,.12,0],[side*.61,.65,0]],.055);pose(bolts,t=>bolts.scale.y=.9+Math.sin(t*11+side)*.1)}}
if(['planet','constellation','stars','galaxy','nebula','cosmos'].includes(feature)){const planet=group(body,.82,d.form==='gorilla'?2.85:2.35,-.43);orb(planet,main,0,0,0,.22);ring(planet,gold,0,0,0,.4,.034,1.1,.4);pose(planet,t=>{planet.rotation.y=t*.42;planet.position.x=.9+Math.sin(t*.7)*.12});for(let j=0;j<4;j++){const star=group(body,Math.sin(j*2)*.97,1.2+j*.35,Math.cos(j*2)*.65);gem(star,light,0,0,0,.08,.13);pose(star,t=>star.rotation.y=t*.4+j)}}
if(['clock','portal','eclipse','infinity','singularity'].includes(feature)&&!['ouroboros','ufo'].includes(d.form)){const r=group(body,0,1.65,-.67);ring(r,gold,0,0,0,1.15,.06);for(let j=0;j<12;j++){const a=j*Math.PI/6;box(r,light,Math.sin(a)*1.02,Math.cos(a)*1.02,0,.04,.11,.05).rotation.z=-a}const hand=group(r,0,0,0);box(hand,gold,0,.39,0,.05,.8,.05);pose(hand,t=>hand.rotation.z=-t*(feature==='clock'?.45:.2));if(feature==='eclipse'){orb(r,0x1a1831,0,0,.04,.97,.97,.1);ring(r,0xffb061,0,0,.1,1.04,.05)}}
if(['scythe','anchor','cleaver','skewer','trident'].includes(feature)){const tool=group(body,1.03,1.55,.07);mesh(tool,'cyl',gold,0,0,0,.045,2.7,.045,'metal');if(feature==='scythe'){curve(tool,gold,[[0,1.25,0],[-.57,1.39,0],[-1.05,1.1,0]],.075);cone(tool,light,-.75,1.08,0,.22,.77).rotation.z=-.8}else if(feature==='cleaver')box(tool,0xc6e4e4,-.24,.75,0,.68,.78,.085,'metal');else if(feature==='anchor'){ring(tool,gold,0,1.45,0,.18,.05);curve(tool,gold,[[-.56,-.55,0],[0,-.88,0],[.56,-.55,0]],.09)}else for(let j=0;j<4;j++)box(tool,j%2?main:gold,0,-.45+j*.45,0,.3,.29,.3);pose(tool,t=>tool.rotation.z=Math.sin(t*1.4)*.045)}
if(['forest','vines','vine'].includes(feature)){for(const side of[-1,1])curve(body,0x599c63,[[side*.35,.6,-.65],[side*.75,1.3,-.4],[side*.55,1.93,-.15]],.05);for(let j=0;j<5;j++)orb(body,0x84bf76,Math.sin(j*2)*.7,1+j*.23,-.42,.18,.05,.11)}
if(['comet','jet','racer','radish'].includes(feature)){for(const side of[-1,1]){const booster=group(body,side*.61,1.1,-.4);mesh(booster,'cyl',dark,0,0,0,.18,.61,.18,'metal').rotation.x=Math.PI/2;const flame=group(booster,0,0,-.51);cone(flame,light,0,0,0,.14,.62,'glow').rotation.x=-Math.PI/2;pose(flame,(t,m)=>flame.scale.y=.65+.25*m+Math.sin(t*14)*.13)}if(feature==='radish')for(const side of[-1,1])orb(body,0x72ac50,side*.24,2.95,0,.13,.38,.08).rotation.z=side*.5}
if(['ice','glacier','blizzard','crystal'].includes(feature)&&d.form!=='crocodile'){for(const side of[-1,1])for(let j=0;j<3;j++){const shard=gem(body,light,side*(.55+j*.16),1.6+j*.3,-.48,.14,.48+j*.12);shard.rotation.z=-side*.4}}
if(['sun','sunburst','moon','supernova'].includes(feature)){const disc=group(body,0,2.1,-.72);ring(disc,gold,0,0,0,feature==='moon'?.85:1.08,.065);for(let j=0;j<(feature==='moon'?5:10);j++){const a=j*6.283/10;gem(disc,light,Math.sin(a)*1.2,Math.cos(a)*1.2,0,.08,.23).rotation.z=-a}pose(disc,t=>disc.rotation.z=t*.12)}
if(['vortex','cyclone','waves','mirage'].includes(feature)){for(let j=0;j<3;j++){const wind=group(body,0,.3+j*.36,0);const m=new G.Mesh(geo('wind-'+j,()=>new G.TorusGeometry(.7+j*.23,.025,5,28,Math.PI*1.45)),material(light,'glow'));m.rotation.x=Math.PI/2;wind.add(m);pose(wind,t=>wind.rotation.y=t*(1.1-j*.17)+j*1.5)}}
if(feature==='glitch'){for(let j=0;j<6;j++){const pixel=group(body,Math.sin(j*2)*.9,.5+j*.28,.2);box(pixel,j%2?0x5ef9ec:0xfa70d2,0,0,0,.12,.12,.12);pose(pixel,t=>{pixel.position.x=Math.sin(j*2)*.9+Math.sin(Math.floor(t*6)+j)*.13;pixel.visible=(Math.floor(t*4)+j)%5!==0})}}
if(feature==='reactor'){for(const side of[-1,1]){const vane=group(body,side*.77,2.17,-.5);for(let j=0;j<3;j++)box(vane,j%2?light:dark,side*j*.13,j*.18,0,.2,.75,.18,'metal');pose(vane,t=>vane.rotation.y=side*(.2+Math.sin(t*.8)*.18))}}
if(feature==='ragnarok'||feature==='ancient'){for(let j=0;j<5;j++)gem(body,0xff8c4e,Math.sin(j*2.3)*.55,1.25+(j%3)*.38,-.35,.12,.29)}
if(feature==='cathedral'){for(const side of[-1,1]){const tower=group(body,side*.81,1.17,-.22);mesh(tower,'cyl',dark,0,0,0,.2,1.8,.2);cone(tower,gold,0,1.12,0,.25,.45);for(let j=0;j<3;j++)gem(tower,light,0,-.48+j*.47,.19,.08,.14);curve(body,gold,[[side*.55,1.83,-.22],[side*.81,2.2,-.22]],.05)}const halo=group(body,0,2.63,0);ring(halo,gold,0,0,0,.75,.04,Math.PI/2);pose(halo,t=>{halo.rotation.z=Math.sin(t)*.12;halo.rotation.y=t*.3})}
if(d.identity==='galactus gnocchino'){for(const side of[-1,1]){const moon=group(body,side*.93,1.31,.08);orb(moon,main,0,.11,0,.39,.2,.34);mesh(moon,'cyl',gold,0,-.17,0,.1,.49,.1);pose(moon,t=>moon.position.y=1.31+Math.sin(t+side)*.1)}for(let j=0;j<5;j++){const a=j*6.283/5;curve(body,light,[[0,.5,0],[Math.sin(a)*.55,.22,Math.cos(a)*.55],[Math.sin(a)*.91,.12,Math.cos(a)*.91]],.045)}}
if(feature==='gold')for(const side of[-1,1]){const plate=group(body,side*.52,1.31,.43);for(let j=0;j<4;j++)box(plate,gold,0,j*.14,0,.34,.1,.12,'metal')}

if(d.mut){const m=group(root,0,0,0);ring(m,light,0,.2,0,1.1,.045,Math.PI/2);for(let j=0;j<6;j++){const c=d.mut===12?new G.Color().setHSL(j/6,.8,.6).getHex():light,a=j*Math.PI/3;gem(m,c,Math.cos(a)*1.12,.28,Math.sin(a)*1.12,.07,.1)}orbits.push({g:m,speed:-.3});}
// Merge static mesh details per joint/material: many sculpted parts, few draw calls.
function batch(g,path='r'){g.children.filter(c=>c.isGroup).forEach((c,i)=>batch(c,path+'/'+i));const buckets=new Map();for(const m of g.children.filter(c=>c.isMesh)){const key=m.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(m)}for(const [_,list]of buckets){if(list.length<2)continue;const key=index+':'+(e.mu||0)+':'+mobile+':'+path+':'+list[0].material.color.getHex()+':'+list[0].material.shininess+':'+list[0].material.emissive.getHex();let geometry=merged.get(key);if(!geometry){const pos=[],norm=[],uv=[],v=new G.Vector3(),n=new G.Vector3();for(const m of list){m.updateMatrix();const raw=geo('flat:'+m.geometry.uuid,()=>m.geometry.index?m.geometry.toNonIndexed():m.geometry),a=raw.attributes.position,b=raw.attributes.normal,u=raw.attributes.uv,nm=new G.Matrix3().getNormalMatrix(m.matrix);for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i).applyMatrix4(m.matrix);n.fromBufferAttribute(b,i).applyMatrix3(nm).normalize();pos.push(v.x,v.y,v.z);norm.push(n.x,n.y,n.z);if(u)uv.push(u.getX(i),u.getY(i));else uv.push(0,0)}}geometry=new G.BufferGeometry();geometry.setAttribute('position',new G.Float32BufferAttribute(pos,3));geometry.setAttribute('normal',new G.Float32BufferAttribute(norm,3));geometry.setAttribute('uv',new G.Float32BufferAttribute(uv,2));geometry.computeBoundingSphere();merged.set(key,geometry)}for(const m of list)g.remove(m);const mesh=new G.Mesh(geometry,list[0].material);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh)}}
batch(root);
const bounds=new G.Box3().setFromObject(root),size=bounds.getSize(new G.Vector3()),scale=Math.min(([2.15,2.5,2.9,3.6,4.25,4.9,5.45][e.t])/size.y,([2.6,2.8,3.1,3.7,4.45,4.9,5.25][e.t])/Math.max(size.x,size.z));const visual=new G.Group();for(const child of [...root.children])visual.add(child);root.add(visual);visual.scale.setScalar(scale);visual.position.y=-bounds.min.y*scale+.07;
feet.forEach(f=>f.userData.restY=f.position.y);
const phase=(seed%628)/100,baseBody=body.position.y,bodyYScale=body.scale.y;
root.userData={art:d,height:size.y*scale+.07,width:Math.max(size.x,size.z)*scale,update(t,moving){const t0=t+phase,mv=Math.max(0,Math.min(1,moving)),heavy=['titan','mammoth','gorilla','kaiju','rex','rhino','golem','centaur'].includes(d.form),slither=['serpent','wyrm','leviathan','basilisk','ouroboros'].includes(d.form),fly=['phoenix','moth','valkyrie','wraith','celestial','shark','dragon','ray','manta','fish','narwhal','squid','reaper','banshee','ufo'].includes(d.form),stride=(heavy?3.3:slither?3.8:d.form==='sloth'?2.1:7)*( .88+(seed%19)*.015),walk=t0*stride;body.position.y=baseBody+(fly?.18+Math.sin(t0*(d.form==='moth'?3.5:1.6))*.1:Math.abs(Math.sin(walk))*(heavy?.04:.065)*mv);body.scale.y=bodyYScale*(1+Math.sin(t0*(d.form==='kraken'?2.2:1.5))*(d.form==='kraken'?.04:heavy?.012:.006));body.rotation.z=Math.sin(walk)*(heavy?.045:d.form==='penguin'?.12:.025)*mv+Math.sin(t0*1.3)*.016*(1-mv);body.rotation.x=fly?-.04*mv:slither?0:mv*.03;feet.forEach((f,j)=>{const offset=feet.length===4?[0,Math.PI,Math.PI,0][j]:j%2?Math.PI:0;f.rotation.x=Math.sin(walk+offset)*(heavy?.3:.52)*mv;f.position.y=f.userData.restY+Math.max(0,Math.sin(f.rotation.x))*.6});eyes.forEach(eye=>eye.scale.y=(t0%4.7<.11?.14:1));for(const a of rig){a.g.rotation[a.axis]=Math.sin(t0*a.speed+(a.phase||0)-(a.segment||0)*.7)*a.amp;if(a.segment!==undefined)a.g.position.x=Math.sin(t0*3-a.segment*.7)*.16*(.3+.7*mv)}wings.forEach(a=>{a.g.rotation.z=a.s*(.12+Math.sin(t0*(d.form==='moth'?8:d.form==='dragon'?2.2:mv?5.5:2))*(a.membrane?.2:d.form==='sphinx'?.17:mv?.5:.16));a.g.rotation.y=a.s*(.17+Math.cos(t0*2)*.12)});tentacles.forEach(({parts,phase:p})=>parts.forEach((g,j)=>{g.rotation.x=.32+Math.sin(t0*(mv?4:1.7)+p-j*.5)*.32;g.rotation.z=Math.sin(t0*1.9+p+j*.4)*.17}));cloth.forEach((a,j)=>a.g.rotation.x=Math.sin(t0*2.5-a.phase*.6)*(.08+mv*.15));orbits.forEach(a=>{if(a.particle!==undefined){const q=a.particle,angle=t0*.3+q*6.283/a.count;a.g.position.set(Math.cos(angle)*1.45,.4+((t0*.16+q*.24)%2.5),Math.sin(angle)*1.45);a.g.rotation.y=t0*.6}else a.g.rotation[a.axis||'y']=t0*a.speed});rotors.forEach(g=>g.rotation.y=t0*1.3);flames.forEach((g,j)=>{g.position.y=2.18+((t0*.2+j*.15)% .4);g.scale.setScalar(.8+Math.sin(t0*2+j)*.12)});motions.forEach(fn=>fn(t0,mv));},born:0};root.userData.update(0,0);return root;
}
root.BrainrotArt={build,design,version:2};
})(globalThis);
