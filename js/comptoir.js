import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

/* Accueil : le comptoir des mots en 3D (Three.js + GSAP).
   Le robot range sur l'étagère les mots-clés de hero.words (js/content.js, FR/EN) ; ils arrivent un par un sur le comptoir.
   Sur ordi : flou de profondeur et halo ; sur téléphone : version allégée. Animations coupées si l'option « réduire les animations » est active. */
const section = document.getElementById("top"), stage = document.getElementById("comptoir-stage"), copy = document.getElementById("comptoir-copy");
const words = () => window.CONTENT[document.documentElement.lang === "en" ? "en" : "fr"].hero.words;
let WORDS = words();
/* palette « Abricot » de la scène */
const P = {
  bg: "#EBC9AE", hemi: ["#FFE7D2", "#B08A6C", .85], sun: ["#FFE2C4", 2.4], fill: "#F6C9AE", exposure: .95,
  counter: ["#E2C7AE", "#D3B396", "#B98A62"], wood: ["#B98A62", "#9C7350"], pad: "#EAD3BE", accent: "#C2381F",
  wall: "#EFCFB6", base: "#D9B394", items: ["#D9A07E", "#C77B5A", "#8FA6A0", "#E6C690", "#B9897A", "#A7B48C", "#F1E4D3", "#7F9BB0", "#D4B5A0"],
  pot: "#B8653F", leaf: "#6F8F5E", jar: "#F4E9DC", win: ["#FFF4E4", "#FFE9CC", 2.2], frame: "#F6EBDD", ray: "255,240,215",
  sign: ["#F7EBDD", "#E2D2C0"], cord: "#2A211C", shade: "#C2381F", robot: ["#C8663F", "#A24E2E"], eye: "#2A211C", dust: "#E9D2BC", mote: "#FFF6EA"
};
const COLORS = ["#3F6E8C", "#6E8B4E", "#E0A23B", "#7B5A8C", "#B5523B", "#4F7C74", "#C77B5A", "#8C6A4A"];
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- rendu ---------- */

/* téléphone ou tablette : pas de flou ni de halo, trop coûteux */
const LITE = innerWidth < 760 || matchMedia("(pointer: coarse)").matches;
/* ordi : haute qualité (ombres de contact, lissage, lumière de fenêtre, matières) ; ?lq pour la couper */
const HQ = !LITE && !new URLSearchParams(location.search).has("lq");
let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
catch (e) { section.classList.add("no-webgl"); throw e; } /* sans WebGL : le texte reste seul sur le fond */
renderer.setPixelRatio(Math.min(devicePixelRatio, LITE ? 1.5 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = P.exposure;
stage.appendChild(renderer.domElement);
const ANISO = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
scene.background = new THREE.Color(P.bg);
/* brume légère, seulement au loin : on garde le contraste */
/* reflets doux sur toutes les matières */
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
scene.environmentIntensity = .18;
const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);

/* effets « cinéma » : le fond se floute, les lumières font un halo */
let composer = null, bokeh = null;
if (!LITE) {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  if (HQ) { const ao = new GTAOPass(scene, camera, 1024, 640); ao.updateGtaoMaterial({ radius: .5, distanceExponent: 1, thickness: 2, scale: 2 }); ao.blendIntensity = 1; composer.addPass(ao); }
  bokeh = new BokehPass(scene, camera, { focus: 7, aperture: .0016, maxblur: .008 });
  composer.addPass(bokeh);
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), .18, .45, 1.6));
  if (HQ) composer.addPass(new SMAAPass(1024, 640));
  composer.addPass(new OutputPass());
}

/* lumière de petit matin : soleil rasant venant de la fenêtre à droite */
scene.add(new THREE.HemisphereLight(P.hemi[0], P.hemi[1], HQ ? .62 : P.hemi[2]));
const sunLight = new THREE.DirectionalLight(P.sun[0], HQ ? 2.1 : P.sun[1]);
sunLight.position.set(5, 7, 5); sunLight.target.position.set(1.2, 0, 0);
sunLight.castShadow = true; sunLight.shadow.mapSize.set(HQ ? 4096 : 2048, HQ ? 4096 : 2048); sunLight.shadow.bias = -.0005; sunLight.shadow.radius = 4;
Object.assign(sunLight.shadow.camera, { left: -4, right: 6, top: 5, bottom: -3, near: 1, far: 20 });
scene.add(sunLight, sunLight.target);
const fill = new THREE.DirectionalLight(P.fill, .6); fill.position.set(-5, 3, 4); scene.add(fill);

/* ---------- aides ---------- */
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .7, metalness: 0, ...o });
function mesh(geo, mat, x, y, z, parent = scene) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m;
}
function canvasTex(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ANISO;
  t.redraw = () => { draw(c.getContext("2d"), w, h); t.needsUpdate = true; };
  return t;
}
function wrap(ctx, text, maxW) {
  const words = text.split(" "), lines = []; let line = "";
  for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  return [...lines, line];
}
const shade = (hex, k) => "#" + new THREE.Color(hex).multiplyScalar(k).getHexString();

/* un pictogramme par mot, dessiné au trait blanc (même ordre que WORDS) */
function drawIcon(ctx, i, cx, cy, s) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 100, s / 100);
  ctx.strokeStyle = ctx.fillStyle = "#fff"; ctx.lineWidth = 9; ctx.lineCap = ctx.lineJoin = "round";
  const P = () => ctx.beginPath(), dot = (x, y, r) => { P(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
  if (i === 0) { /* curiosité : une loupe */
    P(); ctx.arc(-10, -10, 28, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 15; P(); ctx.moveTo(11, 11); ctx.lineTo(38, 38); ctx.stroke();
  } else if (i === 1) { /* cadrage : les coins du cadre et le point visé */
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { P(); ctx.moveTo(sx * 42, sy * 16); ctx.lineTo(sx * 42, sy * 42); ctx.lineTo(sx * 16, sy * 42); ctx.stroke(); }
    dot(0, 0, 10);
  } else if (i === 2) { /* conception : un crayon */
    ctx.rotate(Math.PI / 4);
    P(); ctx.rect(-13, -44, 26, 62); ctx.stroke();
    P(); ctx.moveTo(-13, 18); ctx.lineTo(0, 44); ctx.lineTo(13, 18); ctx.stroke();
    P(); ctx.moveTo(-13, -28); ctx.lineTo(13, -28); ctx.stroke();
  } else if (i === 3) { /* intégration : trois systèmes reliés */
    const n = [[-36, -22], [36, -22], [0, 34]];
    P(); n.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke();
    n.forEach(([x, y]) => dot(x, y, 14));
  } else if (i === 4) { /* recette : une liste cochée */
    for (let k = 0; k < 3; k++) { const y = -30 + k * 30; P(); ctx.moveTo(-42, y); ctx.lineTo(-32, y + 9); ctx.lineTo(-16, y - 9); ctx.stroke(); P(); ctx.moveTo(2, y); ctx.lineTo(42, y); ctx.stroke(); }
  } else if (i === 5) { /* automatisation et IA : un engrenage et une étincelle */
    P(); for (let k = 0; k < 32; k++) { const a = (k + .5) * Math.PI / 16, r = [36, 36, 26, 26][k % 4]; const x = -8 + Math.cos(a) * r, y = 8 + Math.sin(a) * r; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.stroke();
    P(); ctx.arc(-8, 8, 10, 0, Math.PI * 2); ctx.stroke();
    P(); ctx.moveTo(36, -52); ctx.quadraticCurveTo(36, -36, 52, -36); ctx.quadraticCurveTo(36, -36, 36, -20); ctx.quadraticCurveTo(36, -36, 20, -36); ctx.quadraticCurveTo(36, -36, 36, -52); ctx.fill();
  } else if (i === 6) { /* accompagnement : deux personnes côte à côte */
    for (const [x, r, w] of [[-20, 15, 27], [22, 12, 22]]) { P(); ctx.arc(x, -16, r, 0, Math.PI * 2); ctx.stroke(); P(); ctx.arc(x, 38, w, Math.PI, 0); ctx.stroke(); }
  } else { /* métier et technique : une mallette et des accolades */
    P(); ctx.rect(-50, -8, 46, 36); ctx.stroke();
    P(); ctx.moveTo(-37, -8); ctx.lineTo(-37, -20); ctx.lineTo(-17, -20); ctx.lineTo(-17, -8); ctx.stroke();
    ctx.font = '600 66px "JetBrains Mono"'; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("{}", 28, 10);
  }
  ctx.restore();
}

/* ---------- décor : comptoir et étagère en bois clair ---------- */
/* le dessus du comptoir en parquet clair */
const parquet = canvasTex(512, 512, (ctx, W, H) => {
  ctx.fillStyle = P.counter[0]; ctx.fillRect(0, 0, W, H);
  for (let y = 0; y < H; y += 64) for (let x = (y / 64) % 2 * -96; x < W; x += 192) {
    ctx.fillStyle = "rgba(140,95,60," + (.04 + ((x * 7 + y * 3) % 5) * .012) + ")"; ctx.fillRect(x + 1, y + 1, 190, 62);
    ctx.fillStyle = "rgba(120,80,50,.18)"; ctx.fillRect(x, y, 192, 1.5); ctx.fillRect(x, y, 1.5, 64);
  }
});
parquet.redraw(); parquet.wrapS = parquet.wrapT = THREE.RepeatWrapping; parquet.repeat.set(8, 1.4);
mesh(new THREE.BoxGeometry(16, .14, 2.8), std("#fff", { roughness: .5, map: parquet }), 1.2, -.07, .2);
mesh(new THREE.BoxGeometry(16, 1.8, .12), std(P.counter[1]), 1.2, -.98, 1.56);
mesh(new THREE.BoxGeometry(16, .04, .04), std(P.counter[2]), 1.2, -.02, 1.6);
const SHELF_Z = -.95, BOARDS = [.62, 1.42], SLOT_X = [.45, 1.25, 2.05, 2.85];
/* en haute qualité, le bois a une veinure */
const grain = HQ ? canvasTex(256, 256, (ctx, W, H) => { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 2) { ctx.fillStyle = "rgba(90,55,30," + (.04 + .08 * Math.abs(Math.sin(y * .09 + Math.sin(y * .013) * 4))) + ")"; ctx.fillRect(0, y, W, 2); } }) : null;
if (grain) { grain.redraw(); grain.wrapS = grain.wrapT = THREE.RepeatWrapping; grain.repeat.set(2, 1); }
const wood = std(P.wood[0], { roughness: .6, map: grain }), woodDark = std(P.wood[1], { map: grain });
for (const y of BOARDS) mesh(new THREE.BoxGeometry(3.5, .07, .5), wood, 1.65, y - .035, SHELF_Z);
for (const x of [-.12, 3.42]) mesh(new THREE.BoxGeometry(.08, 2.1, .5), woodDark, x, 1.05, SHELF_Z);
const PAD = new THREE.Vector3(1.75, .015, .9);
mesh(new THREE.CylinderGeometry(.48, .5, .03, 48), std(P.pad), PAD.x, .015, PAD.z);
const ring = new THREE.Mesh(new THREE.TorusGeometry(.49, .012, 8, 64), new THREE.MeshBasicMaterial({ color: P.accent }));
ring.rotation.x = Math.PI / 2; ring.position.set(PAD.x, .032, PAD.z); scene.add(ring);

/* ---------- l'atelier derrière : mur, étagères pleines, fenêtre, lampes ---------- */
/* hasard reproductible : le décor est le même à chaque visite */
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = a => a[Math.floor(rnd() * a.length)];
/* le mur est juste derrière l'étagère des mots : plus de vide entre le comptoir et le fond */
const WALL_Z = SHELF_Z - .32;
/* mur en enduit, légèrement irrégulier */
const plaster = canvasTex(512, 512, (ctx, W, H) => {
  ctx.fillStyle = P.wall; ctx.fillRect(0, 0, W, H);
  for (let k = 0; k < 2600; k++) { const r = 2 + Math.random() * 10; ctx.fillStyle = Math.random() < .5 ? "rgba(255,245,235,.05)" : "rgba(150,100,70,.04)"; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, r, 0, Math.PI * 2); ctx.fill(); }
});
plaster.redraw(); plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping; plaster.repeat.set(6, 3);
const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), std("#fff", { roughness: .95, map: plaster }));
wall.position.set(1, 3, WALL_Z); wall.receiveShadow = true; scene.add(wall);
mesh(new THREE.BoxGeometry(30, .3, .06), std(P.base), 1, -.05, WALL_Z + .03);

const potMat = std(P.pot), leafMat = std(P.leaf, { roughness: .8 }), glassMat = std(P.jar, { roughness: .15, transparent: true, opacity: .7 });
/* plateau en haut de l'étagère des mots, contre le mur : plantes et bocal (la F1 s'y cache aussi) */
const TOP_Y = 2.1;
mesh(new THREE.BoxGeometry(3.6, .06, .52), wood, 1.65, TOP_Y + .03, SHELF_Z);
function plant(x, s = 1) {
  mesh(new THREE.CylinderGeometry(.08 * s, .065 * s, .14 * s, 16), potMat, x, TOP_Y + .06 + .07 * s, SHELF_Z);
  for (let k = 0; k < 5; k++) mesh(new THREE.SphereGeometry((.06 + rnd() * .05) * s, 12, 10), leafMat, x - .05 * s + rnd() * .1 * s, TOP_Y + .06 + (.2 + rnd() * .12) * s, SHELF_Z + (rnd() - .5) * .12);
}
plant(.02); plant(3.25, 1.15);
mesh(new THREE.CylinderGeometry(.07, .07, .2, 16), glassMat, 2.95, TOP_Y + .16, SHELF_Z);

/* la fenêtre : verre lumineux (il fera un halo), croisillons, rayons de soleil */
const WIN = { x: 4.1, y: 1.55, w: 1.5, h: 2.2 };
const glass = new THREE.Mesh(new THREE.PlaneGeometry(WIN.w, WIN.h), new THREE.MeshStandardMaterial({ color: P.win[0], emissive: P.win[1], emissiveIntensity: P.win[2] }));
glass.position.set(WIN.x, WIN.y, WALL_Z + .01); scene.add(glass);
/* la lumière de la fenêtre : une source large et douce, tournée vers l'étagère et le robot */
if (HQ) {
  RectAreaLightUniformsLib.init();
  const winLight = new THREE.RectAreaLight("#FFE4C4", 4.5, WIN.w, WIN.h);
  winLight.position.set(WIN.x, WIN.y, WALL_Z + .15); winLight.lookAt(WIN.x - 2.2, .6, 1.4); scene.add(winLight);
}
for (const [w, h, x, y] of [[WIN.w + .16, .1, 0, WIN.h / 2], [WIN.w + .16, .1, 0, -WIN.h / 2], [.1, WIN.h, -WIN.w / 2, 0], [.1, WIN.h, WIN.w / 2, 0], [.06, WIN.h, 0, 0], [WIN.w, .06, 0, .2]])
  mesh(new THREE.BoxGeometry(w, h, .08), std(P.frame), WIN.x + x, WIN.y + y, WALL_Z + .05);
const rayTex = canvasTex(64, 256, (ctx, W, H) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(" + P.ray + ",.9)"); g.addColorStop(1, "rgba(" + P.ray + ",0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); });
rayTex.redraw();
const rays = [];
for (let k = 0; k < 4; k++) {
  const ray = new THREE.Mesh(new THREE.PlaneGeometry(.5 + k * .12, 6), new THREE.MeshBasicMaterial({ map: rayTex, transparent: true, opacity: .1, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  ray.position.set(WIN.x - 1.4 - k * .35, WIN.y - 1.6, WALL_Z + 1.2 + k * .2); ray.rotation.set(-.25, .2, -.75); scene.add(ray); rays.push(ray);
}

/* l'enseigne peinte au-dessus des étagères */
const signTex = canvasTex(1024, 256, (ctx, W, H) => {
  ctx.fillStyle = P.sign[0]; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = P.accent; ctx.lineWidth = 10; ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.fillStyle = P.accent; ctx.font = '800 120px "Bricolage Grotesque"'; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("ATELIER", W / 2, H / 2 + 6);
});
/* centrée au-dessus des deux étagères, sous le haut du cadre */
const sign = mesh(new THREE.BoxGeometry(2, .5, .06), [std(P.sign[1]), std(P.sign[1]), std(P.sign[1]), std(P.sign[1]), std("#fff", { map: signTex }), std(P.sign[1])], 1.75, 2.7, WALL_Z + .08);

/* deux lampes suspendues, ampoules lumineuses */
const lamps = [.2, 3.3].map(x => {
  const g = new THREE.Group(); g.position.set(x, 4.85, -.55); scene.add(g);
  mesh(new THREE.CylinderGeometry(.008, .008, 2.1, 6), std(P.cord), 0, -1.05, 0, g);
  const shade = mesh(new THREE.ConeGeometry(.28, .26, 32, 1, true), std(P.shade, { side: THREE.DoubleSide, roughness: .5 }), 0, -2.2, 0, g);
  shade.castShadow = false;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 12), new THREE.MeshStandardMaterial({ color: "#FFF1D6", emissive: "#FFD9A0", emissiveIntensity: 4 }));
  bulb.position.y = -2.32; g.add(bulb);
  const l = new THREE.PointLight("#FFD3A0", 3, 4.5, 1.6); l.position.y = -2.4; g.add(l);
  return g;
});

/* ---------- les boîtes-mots ---------- */
const BOX = { w: .62, h: .66, d: .38 };
const boxes = WORDS.map((word, i) => {
  const color = COLORS[i];
  const tex = canvasTex(512, 545, (ctx, W, H) => {
    ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,.07)"; for (let s = -H; s < W; s += 46) { ctx.beginPath(); ctx.moveTo(s, H); ctx.lineTo(s + H, 0); ctx.lineTo(s + H + 18, 0); ctx.lineTo(s + 18, H); ctx.fill(); }
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(0, 0, W, 58);
    ctx.fillStyle = "#fff"; ctx.font = '600 26px "JetBrains Mono"'; ctx.textBaseline = "middle";
    ctx.textAlign = "left"; ctx.fillText("N°0" + (i + 1), 24, 30); ctx.textAlign = "right"; ctx.fillText("A-M.S", W - 24, 30);
    ctx.beginPath(); ctx.arc(W / 2, H * .39, 150, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.fill();
    drawIcon(ctx, i, W / 2, H * .39, 205);
    let size = 76, lines;
    do { ctx.font = `800 ${size}px "Bricolage Grotesque"`; lines = wrap(ctx, WORDS[i], W - 56); size -= 3; }
    while ((lines.length > 2 || lines.some(l => ctx.measureText(l).width > W - 56)) && size > 34);
    const lh = size * 1.04, top = H * .8 - (lines.length - 1) * lh / 2;
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; lines.forEach((l, k) => ctx.fillText(l, W / 2, top + k * lh));
    for (let b = 0; b < 20; b++) ctx.fillRect(W - 140 + b * 5, H - 44, b % 3 ? 3 : 2, 24);
  });
  const side = std(shade(color, .8)), top = std(shade(color, 1.12));
  const m = mesh(new THREE.BoxGeometry(BOX.w, BOX.h, BOX.d), [side, side, top, side, std("#fff", { map: tex, roughness: .55 }), side], 0, -10, 0);
  m.visible = false;
  m.userData = { i, tex };
  return m;
});
const slotPos = n => new THREE.Vector3(SLOT_X[n % 4], BOARDS[n < 4 ? 0 : 1] + BOX.h / 2, SHELF_Z);

/* ---------- le robot artisan : terre cuite, visière à yeux lumineux, articulations, antenne ---------- */
const TERRA = P.robot[0];
const HOME = { x: -.25, z: .95, rot: .55 }, WAIT = { x: PAD.x - .72, z: PAD.z };
const robot = new THREE.Group(); robot.position.set(HOME.x, 0, HOME.z); robot.rotation.y = HOME.rot; scene.add(robot);
const body = new THREE.Group(); robot.add(body);
/* peinture laquée : un vernis léger qui accroche la lumière */
const terra = new THREE.MeshPhysicalMaterial({ color: TERRA, roughness: .42, metalness: .05, clearcoat: .7, clearcoatRoughness: .22 });
const terraDark = new THREE.MeshPhysicalMaterial({ color: P.robot[1], roughness: .5, clearcoat: .4, clearcoatRoughness: .3 });
const joint = std("#3A2A22", { roughness: .45, metalness: .2 }), steel = std("#A9A49C", { roughness: .3, metalness: .75 });
const glow = color => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.4 });
const cyl = (r, h, n = 32) => new THREE.CylinderGeometry(r, r, h, n);

const legs = [-.13, .13].map(x => {
  const g = new THREE.Group(); g.position.set(x, .44, 0); robot.add(g);
  mesh(new THREE.SphereGeometry(.075, 28, 20), joint, 0, 0, 0, g);                       // hanche
  mesh(new RoundedBoxGeometry(.19, .36, .21, 4, .05), terra, 0, -.2, 0, g);
  mesh(cyl(.085, .04), joint, 0, -.19, 0, g);                                            // genou
  mesh(new RoundedBoxGeometry(.25, .1, .32, 4, .04), terraDark, 0, -.39, .045, g);       // pied
  return g;
});

/* buste, ceinture, voyant qui « respire » */
mesh(new RoundedBoxGeometry(.56, .5, .36, 3, .07), terra, 0, .68, 0, body);
mesh(new THREE.BoxGeometry(.5, .025, .37), terraDark, 0, .52, 0, body);                 // ceinture
const heart = mesh(new THREE.SphereGeometry(.035, 16, 12), glow("#F0B429"), 0, .76, .18, body); // voyant

const arms = [-1, 1].map(s => {
  const g = new THREE.Group(); g.position.set(s * .36, .88, 0); body.add(g);
  mesh(new THREE.SphereGeometry(.09, 28, 20), joint, 0, 0, 0, g);                        // épaule
  mesh(new RoundedBoxGeometry(.15, .2, .17, 4, .05), terra, 0, -.12, 0, g);
  mesh(cyl(.07, .05), joint, 0, -.24, 0, g);                                             // coude
  mesh(new RoundedBoxGeometry(.14, .17, .16, 4, .05), terra, 0, -.34, 0, g);
  mesh(new RoundedBoxGeometry(.17, .1, .19, 4, .04), terraDark, 0, -.46, .01, g);        // main
  mesh(new RoundedBoxGeometry(.05, .09, .07, 1, .02), terraDark, s * -.075, -.52, .06, g); // pouce
  return g;
});
mesh(cyl(.07, .1), joint, 0, .96, 0, body);                                              // cou

/* tête : écran-visière, oreilles rondes, vis, antenne lumineuse */
const head = new THREE.Group(); head.position.set(0, 1.0, 0); body.add(head);
mesh(new RoundedBoxGeometry(.94, .8, .82, 4, .08), terra, 0, .42, 0, head);
mesh(new RoundedBoxGeometry(.76, .44, .05, 3, .05), std("#1E1612", { roughness: .18, metalness: .4 }), 0, .44, .405, head);
for (const s of [-1, 1]) {
  const ear = mesh(cyl(.085, .05, 24), terraDark, s * .48, .44, 0, head); ear.rotation.z = Math.PI / 2;
  const cap = mesh(cyl(.035, .06, 16), steel, s * .5, .44, 0, head); cap.rotation.z = Math.PI / 2;
  for (const y of [.16, .72]) mesh(new THREE.SphereGeometry(.018, 10, 8), steel, s * .38, y, .41, head); // vis
}
mesh(cyl(.012, .22, 8), steel, .22, .93, 0, head);
const antenna = mesh(new THREE.SphereGeometry(.045, 16, 12), glow("#E8553A"), .22, 1.06, 0, head);

/* les yeux : un écran dessiné, qui change d'expression (neutre, concentré, content, surpris, cligne) */
const eyeTex = canvasTex(256, 128, (ctx, W, H) => {
  ctx.clearRect(0, 0, W, H); ctx.fillStyle = ctx.strokeStyle = "#FFC46B"; ctx.lineWidth = 12; ctx.lineCap = "round";
  for (const cx of [W * .3, W * .7]) {
    ctx.beginPath();
    if (mood === "happy") { ctx.arc(cx, H * .62, 26, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
    else if (mood === "focus") { ctx.moveTo(cx - 26, H * .55); ctx.lineTo(cx + 26, H * .55); ctx.stroke(); ctx.beginPath(); ctx.roundRect(cx - 22, H * .55, 44, 18, 9); ctx.fill(); }
    else if (mood === "surprise") { ctx.arc(cx, H * .5, 30, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.roundRect(cx - 20, H * .22, 40, 66, 20); ctx.fill(); }
  }
});
let mood = "neutral", moodToken = 0;
const eyePlane = new THREE.Mesh(new THREE.PlaneGeometry(.66, .33), new THREE.MeshBasicMaterial({ map: eyeTex, transparent: true, toneMapped: false }));
eyePlane.position.set(0, .44, .432); head.add(eyePlane);
const eyes = [eyePlane];
function setMood(m, hold) {
  mood = m; eyeTex.redraw(); const t = ++moodToken;
  if (hold) gsap.delayedCall(hold, () => { if (t === moodToken) { mood = "neutral"; eyeTex.redraw(); } });
}
robot.scale.setScalar(.82);

/* ---------- l'atelier vivant : liège, schéma, portable, tasse, horloge, et une F1 bien cachée ---------- */
/* tableau de liège à gauche des étagères : post-it des ateliers et schéma de flux punaisé */
const CORK = { x: -.85, y: 1.85, z: WALL_Z + .06 };
const corkTex = canvasTex(256, 176, (ctx, W, H) => {
  ctx.fillStyle = "#C79A68"; ctx.fillRect(0, 0, W, H);
  for (let k = 0; k < 900; k++) { ctx.fillStyle = rnd() < .5 ? "rgba(120,80,40,.18)" : "rgba(255,235,200,.16)"; ctx.fillRect(rnd() * W, rnd() * H, 2, 2); }
});
mesh(new THREE.BoxGeometry(1.14, .78, .03), [wood, wood, wood, wood, std("#fff", { map: corkTex, roughness: .95 }), wood], CORK.x, CORK.y, CORK.z);
const schemaTex = canvasTex(256, 176, (ctx, W, H) => {
  ctx.fillStyle = "#FBF7EF"; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = ctx.fillStyle = "#2A211C"; ctx.lineWidth = 3; ctx.font = '700 17px "JetBrains Mono"'; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const node = (x, y, t) => { ctx.strokeRect(x - 38, y - 16, 76, 32); ctx.fillText(t, x, y + 1); };
  const arrow = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); const a = Math.atan2(y2 - y1, x2 - x1); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 9 * Math.cos(a - .5), y2 - 9 * Math.sin(a - .5)); ctx.lineTo(x2 - 9 * Math.cos(a + .5), y2 - 9 * Math.sin(a + .5)); ctx.fill(); };
  node(52, 40, "ERP"); node(W / 2, 110, "OMS"); node(W - 52, 40, "WEB"); arrow(70, 58, 108, 94); arrow(W - 70, 58, W - 108, 94);
  ctx.strokeStyle = "#C2381F"; arrow(W / 2, 128, W / 2, 162); ctx.fillStyle = "#C2381F"; ctx.textAlign = "left"; ctx.fillText("transporteur", W / 2 + 10, 150);
});
const schema = new THREE.Mesh(new THREE.PlaneGeometry(.44, .3), std("#fff", { map: schemaTex, roughness: .9 }));
schema.position.set(CORK.x + .22, CORK.y + .1, CORK.z + .02); schema.rotation.z = -.03; scene.add(schema);
const postits = [["#F6E27A", -.42, .2], ["#F7B2A1", -.22, .22], ["#A8D8C8", -.36, -.05], ["#F6E27A", -.12, -.18], ["#DCC6FF", .2, -.22]].map(([c, dx, dy], k) => {
  const g = new THREE.Group(); g.position.set(CORK.x + dx, CORK.y + dy, CORK.z + .025); scene.add(g);
  const p = new THREE.Mesh(new THREE.PlaneGeometry(.15, .15), std(c, { roughness: .9 })); p.position.y = -.07; g.add(p);
  for (let l = 0; l < 3; l++) { const line = new THREE.Mesh(new THREE.PlaneGeometry(.1 - l * .02, .008), new THREE.MeshBasicMaterial({ color: "#6B5048" })); line.position.set(-.01, -.04 - l * .025, .001); g.add(line); }
  const pin = new THREE.Mesh(new THREE.SphereGeometry(.014, 8, 6), new THREE.MeshStandardMaterial({ color: "#C2381F" })); pin.position.z = .01; g.add(pin);
  g.userData.base = (k % 2 ? 1 : -1) * .06; g.rotation.z = g.userData.base;
  return g;
});

/* horloge au mur : elle donne l'heure du visiteur */
const CLOCK = { x: -.85, y: 2.72, z: WALL_Z + .05 };
const clockTex = canvasTex(128, 128, (ctx, W, H) => {
  ctx.fillStyle = "#FBF7EF"; ctx.beginPath(); ctx.arc(W / 2, H / 2, 62, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#2A211C"; for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ctx.fillRect(W / 2 + Math.cos(a) * 50 - 2, H / 2 + Math.sin(a) * 50 - 2, k % 3 ? 3 : 6, k % 3 ? 3 : 6); }
});
const wallClock = new THREE.Group(); wallClock.position.set(CLOCK.x, CLOCK.y, CLOCK.z); scene.add(wallClock);
const rim = new THREE.Mesh(new THREE.CylinderGeometry(.21, .21, .04, 40), std("#C2381F", { roughness: .45 })); rim.rotation.x = Math.PI / 2; wallClock.add(rim);
const face = new THREE.Mesh(new THREE.CircleGeometry(.19, 40), new THREE.MeshStandardMaterial({ map: clockTex, roughness: .8 })); face.position.z = .021; wallClock.add(face);
const hand = (len, w) => { const g = new THREE.Group(); g.position.z = .025; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), new THREE.MeshBasicMaterial({ color: "#2A211C" })); m.position.y = len / 2 - .01; g.add(m); wallClock.add(g); return g; };
const hourHand = hand(.1, .014), minuteHand = hand(.15, .009);

/* ordinateur portable sur le comptoir : les logs défilent */
/* un petit bureau sur le côté, avec l'ordinateur posé dessus */
const DESK = { x: 3.85, z: .5, h: .58, w: 1.05, d: .62 };
/* plateau, pieds, caisson à tiroirs à droite, traverse */
mesh(new RoundedBoxGeometry(DESK.w, .05, DESK.d, 4, .015), wood, DESK.x, DESK.h - .025, DESK.z);
for (const [dx, dz] of [[-.48, -.26], [-.48, .26]]) mesh(new THREE.BoxGeometry(.05, DESK.h - .05, .05), woodDark, DESK.x + dx, (DESK.h - .05) / 2, DESK.z + dz);
mesh(new THREE.BoxGeometry(.34, DESK.h - .05, DESK.d - .04), wood, DESK.x + .33, (DESK.h - .05) / 2, DESK.z);
for (const y of [.12, .3]) {
  mesh(new THREE.BoxGeometry(.3, .15, .01), woodDark, DESK.x + .33, y + .06, DESK.z + DESK.d / 2 - .015);
  mesh(new THREE.BoxGeometry(.08, .015, .02), steel, DESK.x + .33, y + .1, DESK.z + DESK.d / 2);
}
mesh(new THREE.BoxGeometry(.6, .03, .03), woodDark, DESK.x - .15, .15, DESK.z - .26);
/* cahier ouvert et crayon, à gauche de l'ordinateur */
const notebook = new THREE.Group(); notebook.position.set(DESK.x - .24, DESK.h, DESK.z + .18); notebook.rotation.y = .2; scene.add(notebook);
mesh(new THREE.BoxGeometry(.34, .012, .24), std("#8C5A43", { roughness: .7 }), 0, .006, 0, notebook);
const pageTex = canvasTex(128, 96, (ctx, W, H) => {
  ctx.fillStyle = "#FBF7EF"; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = "rgba(90,64,56,.35)"; ctx.lineWidth = 1;
  for (let y = 14; y < H; y += 10) { ctx.beginPath(); ctx.moveTo(6, y); ctx.lineTo(W - 6, y); ctx.stroke(); }
  ctx.strokeStyle = "#5A4038"; ctx.lineWidth = 2; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(10, 12 + k * 10); ctx.lineTo(10 + 30 + ((k * 37) % 60), 12 + k * 10); ctx.stroke(); }
});
for (const s of [-1, 1]) { const page = new THREE.Mesh(new THREE.PlaneGeometry(.155, .22), std("#fff", { map: pageTex, roughness: .9 })); page.rotation.x = -Math.PI / 2; page.rotation.y = s * .05; page.position.set(s * .081, .014, 0); notebook.add(page); }
mesh(new THREE.CylinderGeometry(.006, .006, .16, 8), std("#E0A23B", { roughness: .5 }), .1, .02, .03, notebook).rotation.set(0, 0, Math.PI / 2);
const LAPTOP = { x: DESK.x + .12, z: DESK.z - .05 };
const logLines = ["order.created FR-48213", "stock.reserved WH-LYON", "carrier.selected EXPRESSO", "shipment.create 201", "webhook.sent OK", "routing.rule 20xxx", "alert.armed shipping", "order.shipped FR-48213"];
let logOffset = 0;
const screenTex = canvasTex(256, 160, (ctx, W, H) => {
  ctx.fillStyle = "#1E1612"; ctx.fillRect(0, 0, W, H); ctx.font = '600 14px "JetBrains Mono"'; ctx.textBaseline = "top";
  for (let k = 0; k < 8; k++) {
    const l = logLines[(k + logOffset) % logLines.length];
    ctx.fillStyle = l.includes("201") || l.includes("OK") || l.includes("shipped") ? "#7FAF8A" : "#F3E6D8"; ctx.globalAlpha = .55 + k * .06;
    ctx.fillText("> " + l, 12, 10 + k * 18);
  }
  ctx.globalAlpha = 1;
});
const laptop = new THREE.Group(); laptop.position.set(LAPTOP.x, DESK.h, LAPTOP.z); laptop.rotation.y = -.45; scene.add(laptop);
mesh(new THREE.BoxGeometry(.52, .025, .36), std("#5A4A42", { roughness: .4, metalness: .3 }), 0, .0125, 0, laptop);
const lid = new THREE.Group(); lid.position.set(0, .025, -.17); lid.rotation.x = -.28; laptop.add(lid);
mesh(new THREE.BoxGeometry(.52, .34, .018), std("#5A4A42", { roughness: .4, metalness: .3 }), 0, .17, 0, lid);
const lcd = new THREE.Mesh(new THREE.PlaneGeometry(.47, .29), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false })); lcd.position.set(0, .17, .011); lid.add(lcd);

/* tasse de café fumante, que le robot boira à la fin */
/* la tasse est sur le bureau, à droite de l'ordinateur */
const MUG = { x: DESK.x - .4, z: DESK.z - .16 };
const mug = new THREE.Group(); mug.position.set(MUG.x, DESK.h, MUG.z); scene.add(mug);
mesh(new THREE.CylinderGeometry(.065, .058, .13, 24), std("#FBF7EF", { roughness: .35 }), 0, .065, 0, mug);
mesh(new THREE.CylinderGeometry(.056, .056, .005, 24), std("#4A2E1E", { roughness: .2 }), 0, .122, 0, mug);
mesh(new THREE.TorusGeometry(.035, .011, 8, 16), std("#FBF7EF", { roughness: .35 }), .07, .07, 0, mug).rotation.y = Math.PI / 2;
const steam = [0, 1, 2].map(k => {
  const s = new THREE.Mesh(new THREE.SphereGeometry(.025, 10, 8), new THREE.MeshBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0, depthWrite: false }));
  s.userData.phase = k / 3; mug.add(s); return s;
});

/* la F1 cachée au bout de l'étagère : un clic, et elle fait un tour de piste */
const f1 = new THREE.Group(); f1.position.set(.42, TOP_Y + .06, SHELF_Z + .08); f1.rotation.y = Math.PI / 2 - .3; scene.add(f1);
const f1Red = std("#C2381F", { roughness: .35, metalness: .2 }), f1Dark = std("#2A211C", { roughness: .5 });
mesh(new THREE.BoxGeometry(.05, .022, .2), f1Red, 0, .02, 0, f1);
mesh(new THREE.BoxGeometry(.1, .006, .03), f1Red, 0, .014, .11, f1);                     // aileron avant
mesh(new THREE.BoxGeometry(.09, .03, .012), f1Red, 0, .045, -.1, f1);                    // aileron arrière
mesh(new THREE.SphereGeometry(.014, 10, 8), std("#F0B429"), 0, .04, .01, f1);            // casque
for (const [x, z] of [[-.04, .07], [.04, .07], [-.045, -.07], [.045, -.07]]) mesh(cyl(.02, .022, 12), f1Dark, x, .02, z, f1).rotation.z = Math.PI / 2;
f1.userData.home = f1.position.clone();

/* ---------- cadrage : le robot ne passe jamais devant le texte ---------- */
const LOOK = new THREE.Vector3(1.3, .62, -.1);
const v = new THREE.Vector3();
function screenX(p, w) { v.copy(p).project(camera); return (v.x + 1) / 2 * w; }
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight, narrow = w < 760;
  renderer.setSize(w, h, false);
  if (composer) composer.setSize(w, h);
  camera.aspect = w / h;
  camera.fov = narrow ? 44 : 34;
  let dist = narrow ? 7.2 : 7.0, off = 0;
  /* sur ordi : on décale la scène à droite du texte, et on recule la caméra si elle ne tient plus */
  const textRight = narrow ? -1 : copy.getBoundingClientRect().right - stage.getBoundingClientRect().left + 56;
  const robotLeft = new THREE.Vector3(HOME.x - .5, 1.4, HOME.z), robotFoot = new THREE.Vector3(HOME.x - .5, 0, HOME.z), sceneRight = new THREE.Vector3(3.6, 1.6, SHELF_Z), deskRight = new THREE.Vector3(DESK.x + DESK.w / 2, DESK.h, DESK.z + DESK.d / 2);
  for (let k = 0; k < 40; k++) {
    camera.position.set(LOOK.x, narrow ? 2.4 : 2.0, LOOK.z + dist);
    camera.lookAt(LOOK);
    if (narrow) camera.clearViewOffset(); else camera.setViewOffset(w, h, -off, 0, w, h);
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    if (narrow) break;
    const left = Math.min(screenX(robotLeft, w), screenX(robotFoot, w)), right = Math.max(screenX(sceneRight, w), screenX(deskRight, w));
    if (left < textRight) off += w * .015;
    else if (right > w - 12) { dist += .35; off = Math.max(0, off - w * .05); }
    else break;
  }
  camera.userData.base = camera.position.clone();
}
addEventListener("resize", resize);

/* ---------- la chorégraphie ---------- */
const tw = (t, o) => gsap.to(t, o).then();
let carried = null, lookTarget = null, n = 0, state = "idle", waitTimer = null, waiting = null;
const live = document.getElementById("comptoir-live");

async function turnTo(ang) {
  let dlt = ang - robot.rotation.y; dlt = Math.atan2(Math.sin(dlt), Math.cos(dlt));
  if (Math.abs(dlt) > .02) await tw(robot.rotation, { y: robot.rotation.y + dlt, duration: .15 + Math.abs(dlt) * .22, ease: "power1.inOut" });
}
async function walkTo(x, z) {
  const dx = x - robot.position.x, dz = z - robot.position.z, dist = Math.hypot(dx, dz);
  if (dist < .02) return;
  await turnTo(Math.atan2(dx, dz));
  /* jambes et bras en opposition, buste penché, petit rebond à chaque pas */
  const swing = (o, from) => gsap.fromTo(o, { x: from }, { x: -from, duration: .24, repeat: -1, yoyo: true, ease: "sine.inOut" });
  const step = [swing(legs[0].rotation, .45), swing(legs[1].rotation, -.45), gsap.fromTo(body.position, { y: 0 }, { y: .03, duration: .12, repeat: -1, yoyo: true })];
  if (!carried) step.push(swing(arms[0].rotation, -.45), swing(arms[1].rotation, .45));
  gsap.to(body.rotation, { x: carried ? .04 : .12, duration: .15 });
  await tw(robot.position, { x, z, duration: dist / 1.7, ease: "power1.inOut" });
  step.forEach(s => s.kill());
  gsap.to([legs[0].rotation, legs[1].rotation], { x: 0, duration: .1 });
  if (!carried) gsap.to(arms.map(a => a.rotation), { x: 0, duration: .12 });
  gsap.to(body.position, { y: 0, duration: .1 });
  gsap.to(body.rotation, { x: 0, duration: .15 });
}

/* petites particules : poussière à l'atterrissage, éclats quand une boîte est rangée */
const bitGeo = new THREE.SphereGeometry(.05, 8, 8);
function burst(at, color, { n = 10, spread = .6, rise = .25, size = 1, y = .05 } = {}) {
  for (let k = 0; k < n; k++) {
    const m = new THREE.Mesh(bitGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .9 }));
    const a = k / n * Math.PI * 2 + Math.random() * .4, r = spread * (.6 + Math.random() * .5);
    m.position.set(at.x, at.y + y, at.z); m.scale.setScalar(size * (.6 + Math.random() * .6)); scene.add(m);
    gsap.to(m.position, { x: at.x + Math.cos(a) * r, z: at.z + Math.sin(a) * r * .6, y: at.y + y + rise * (.5 + Math.random()), duration: .6, ease: "power2.out" });
    gsap.to(m.scale, { x: .01, y: .01, z: .01, duration: .6, ease: "power1.in" });
    gsap.to(m.material, { opacity: 0, duration: .6, onComplete: () => { scene.remove(m); m.material.dispose(); } });
  }
}
function pulse() {
  const r = ring.clone(); r.material = ring.material.clone(); r.material.transparent = true; scene.add(r);
  gsap.to(r.scale, { x: 1.7, y: 1.7, z: 1.7, duration: .6, ease: "power2.out" });
  gsap.to(r.material, { opacity: 0, duration: .6, onComplete: () => { scene.remove(r); r.material.dispose(); } });
}

function drop(b) {
  b.visible = true; b.scale.set(1, 1, 1);
  b.position.set(PAD.x, 4.4, PAD.z); b.rotation.set(.5, -.9, .25);
  live.textContent = WORDS[b.userData.i];
  const rest = PAD.y + BOX.h / 2;
  /* chute, écrasement au contact, rebond élastique */
  return gsap.timeline()
    .to(b.rotation, { x: 0, y: -.18, z: 0, duration: .5, ease: "power2.out" }, 0)
    .to(b.position, { y: rest, duration: .48, ease: "power2.in" }, 0)
    .add(() => { burst(PAD, P.dust, { n: 12, spread: .7, rise: .18 }); pulse(); if (!carried) setMood("surprise", .6); })
    .to(b.scale, { x: 1.14, y: .78, z: 1.14, duration: .07, ease: "power2.out" })
    .to(b.position, { y: rest - BOX.h * .11, duration: .07 }, "<")
    .to(b.scale, { x: 1, y: 1, z: 1, duration: .55, ease: "elastic.out(1, .4)" })
    .to(b.position, { y: rest, duration: .55, ease: "elastic.out(1, .4)" }, "<")
    .then();
}

async function shelve(b) {
  state = "shelving"; waiting = null; clearTimeout(waitTimer);
  lookTarget = b.position; setMood("focus");
  await walkTo(WAIT.x, WAIT.z);
  await turnTo(Math.atan2(PAD.x - robot.position.x, PAD.z - robot.position.z));
  /* il plie les genoux, attrape la boîte, se redresse */
  gsap.to(arms.map(a => a.rotation), { x: -1.45, duration: .18, overwrite: "auto" });
  await tw(body.position, { y: -.08, duration: .12, ease: "power2.out" });
  gsap.to(body.position, { y: 0, duration: .25, ease: "back.out(3)" });
  robot.updateMatrixWorld();
  const hold = robot.localToWorld(new THREE.Vector3(0, .95, .62));
  await tw(b.position, { x: hold.x, y: hold.y, z: hold.z, duration: .22, ease: "power2.out" });
  carried = b; lookTarget = null;
  /* il la porte jusqu'à l'étagère */
  const slot = slotPos(n), upper = n >= 4;
  await walkTo(slot.x, SHELF_Z + .95);
  await turnTo(Math.PI);
  carried = null;
  gsap.to(arms.map(a => a.rotation), { x: upper ? -2.6 : -1.9, duration: .2 });
  gsap.to(b.rotation, { x: 0, y: 0, z: 0, duration: .3 });
  await tw(b.position, { x: slot.x, y: slot.y + .04, z: slot.z, duration: .38, ease: "power2.inOut" });
  gsap.to(b.position, { y: slot.y, duration: .12, ease: "power2.in" });
  gsap.fromTo(b.scale, { x: 1.12, y: 1.12, z: 1.12 }, { x: 1, y: 1, z: 1, duration: .45, ease: "elastic.out(1, .5)", delay: .1 });
  gsap.delayedCall(.1, () => burst(slot, COLORS[b.userData.i], { n: 14, spread: .5, rise: .55, size: .6, y: .25 }));
  gsap.to(arms.map(a => a.rotation), { x: 0, duration: .25, delay: .05, overwrite: "auto" });
  gsap.timeline({ delay: .1 }).to(head.rotation, { z: .18, duration: .1 }).to(head.rotation, { z: -.12, duration: .12 }).to(head.rotation, { z: 0, duration: .15 });
  setMood("happy", 1.2);
  n++;
  if (n < boxes.length) {
    /* la boîte suivante tombe pendant qu'il revient */
    drop(boxes[n]).then(() => { if (state !== "done") waitFor(boxes[n]); });
    await walkTo(WAIT.x, WAIT.z);
    await turnTo(Math.atan2(PAD.x - robot.position.x, PAD.z - robot.position.z));
    state = "idle";
    if (waiting) startWait();
  } else {
    state = "done";
    /* le travail est fini : pause café, puis il retourne à sa place et fait signe */
    await coffee();
    await walkTo(HOME.x, HOME.z); await turnTo(HOME.rot);
    await cheer();
  }
}

async function coffee() {
  await walkTo(DESK.x - DESK.w / 2 - .38, MUG.z); await turnTo(Math.PI / 2);
  lookTarget = mug.position;
  gsap.to(arms[1].rotation, { x: -1.3, duration: .25, overwrite: "auto" });
  robot.updateMatrixWorld();
  const near = robot.localToWorld(new THREE.Vector3(.3, .8, .55));
  await tw(mug.position, { x: near.x, y: near.y, z: near.z, duration: .3, ease: "power2.out" });
  lookTarget = null;
  const mouth = robot.localToWorld(new THREE.Vector3(.14, 1.18, .52));
  gsap.to(arms[1].rotation, { x: -2.2, z: .25, duration: .35 });
  await tw(mug.position, { x: mouth.x, y: mouth.y, z: mouth.z, duration: .35, ease: "power2.inOut" });
  gsap.to(mug.rotation, { x: -.6, duration: .3 }); setMood("happy");
  await new Promise(r => setTimeout(r, 1100));
  gsap.to(mug.rotation, { x: 0, duration: .25 });
  gsap.to(arms[1].rotation, { x: -1.3, z: 0, duration: .3 });
  await tw(mug.position, { x: MUG.x, y: DESK.h, z: MUG.z, duration: .45, ease: "power2.inOut" });
  gsap.to(arms[1].rotation, { x: 0, duration: .25 });
}

/* la F1 cachée : un tour sur elle-même, petit saut, fumée d'échappement */
function f1Lap() {
  if (gsap.isTweening(f1.rotation)) return;
  const y = f1.position.y;
  gsap.timeline()
    .to(f1.rotation, { y: f1.rotation.y + Math.PI * 2, duration: .9, ease: "power3.inOut" })
    .to(f1.position, { y: y + .08, duration: .2, ease: "power2.out", repeat: 1, yoyo: true }, .35);
  burst(f1.position, "#BFB4A8", { n: 8, spread: .18, rise: .12, size: .45, y: .02 });
  live.textContent = "F1";
}
function waitFor(b) { waiting = b; if (state === "idle") startWait(); }
function startWait() { clearTimeout(waitTimer); const b = waiting; waitTimer = setTimeout(() => shelve(b), 650); }

async function cheer() {
  await gsap.timeline()
    .to(robot.position, { y: .25, duration: .18, ease: "power2.out" })
    .to(robot.position, { y: 0, duration: .32, ease: "bounce.out" })
    .to(arms[1].rotation, { x: -2.8, z: .3, duration: .2 }, 0)
    .to(arms[1].rotation, { x: -2.3, duration: .14, repeat: 3, yoyo: true })
    .to(arms[1].rotation, { x: 0, z: 0, duration: .3 })
    .add(() => setMood("happy", 2.5), 0)
    .then();
}

async function start() {
  n = 0;
  boxes.forEach(b => { b.visible = false; b.position.set(0, -10, 0); });
  if (RM) {
    boxes.forEach((b, k) => { b.visible = true; b.position.copy(slotPos(k)); b.rotation.set(0, 0, 0); });
    n = boxes.length; live.textContent = WORDS.join(", ");
    return;
  }
  /* ?demo=3 : fige la scène avec 3 mots rangés et le 4e sur le comptoir (pour les captures) */
  const demo = +new URLSearchParams(location.search).get("demo");
  if (demo) {
    for (let k = 0; k < demo; k++) { const b = boxes[k]; b.visible = true; b.position.copy(slotPos(k)); }
    const b = boxes[demo]; b.visible = true; b.position.set(PAD.x, PAD.y + BOX.h / 2, PAD.z); b.rotation.y = -.18;
    n = demo;
    robot.position.set(WAIT.x, 0, WAIT.z); robot.rotation.y = Math.atan2(PAD.x - WAIT.x, 0); lookTarget = b.position;
    return;
  }
  state = "shelving";
  await walkTo(WAIT.x, WAIT.z);
  await turnTo(Math.atan2(PAD.x - robot.position.x, PAD.z - robot.position.z));
  state = "idle";
  await drop(boxes[0]);
  waitFor(boxes[0]);
}

/* ---------- souris, clics ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), look = new THREE.Vector2();
function setPtr(e) { const r = renderer.domElement.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); }
function hit() { ray.setFromCamera(ptr, camera); const h = ray.intersectObjects(boxes.filter(b => b.visible), false)[0]; return h ? h.object : null; }
addEventListener("pointermove", e => {
  look.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  if (e.target !== renderer.domElement) return;
  setPtr(e); const h = hit();
  renderer.domElement.style.cursor = h || ray.intersectObject(f1, true).length ? "pointer" : "";
});
renderer.domElement.addEventListener("click", e => {
  setPtr(e); const h = hit();
  if (!h) { if (!RM && ray.intersectObject(f1, true).length) f1Lap(); return; }
  /* la boîte du comptoir : il la range tout de suite ; une boîte déjà rangée : elle sautille */
  if (h === waiting && state === "idle") { clearTimeout(waitTimer); shelve(h); return; }
  if (!gsap.isTweening(h.position) && h !== carried) {
    const y = h.position.y; gsap.timeline().to(h.position, { y: y + .12, duration: .12, ease: "power2.out" }).to(h.position, { y, duration: .3, ease: "bounce.out" });
    live.textContent = WORDS[h.userData.i];
  }
});

/* ---------- poussières dans la lumière ---------- */
const MOTES = 80, moteGeo = new THREE.BufferGeometry(), mp = new Float32Array(MOTES * 3);
for (let k = 0; k < MOTES; k++) mp.set([-1 + Math.random() * 6, Math.random() * 3.2, -1.4 + Math.random() * 3], k * 3);
moteGeo.setAttribute("position", new THREE.BufferAttribute(mp, 3));
scene.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: P.mote, size: .035, transparent: true, opacity: .8, depthWrite: false })));

/* ---------- boucle ---------- */
const clock = new THREE.Clock(), tmp = new THREE.Vector3();
let nextBlink = 2, nextLog = 0;
/* hors de l'écran, la scène ne se redessine pas */
let onScreen = true;
new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }).observe(section);
function frame() {
  requestAnimationFrame(frame);
  if (!onScreen) return;
  const t = clock.getElapsedTime();
  if (carried) {
    robot.updateMatrixWorld();
    carried.position.copy(robot.localToWorld(tmp.set(0, .95 + Math.sin(t * 12) * .01, .62)));
    carried.rotation.set(0, robot.rotation.y, 0);
  }
  if (!RM) {
    if (!gsap.isTweening(head.rotation)) head.rotation.z = Math.sin(t * 1.1) * .03;
    /* la caméra respire lentement et suit un peu le robot */
    const b = camera.userData.base;
    if (b) {
      const tx = b.x + look.x * .15 + Math.sin(t * .23) * .1 + (robot.position.x - HOME.x) * .05, ty2 = b.y + look.y * .08 + Math.sin(t * .31) * .05;
      camera.position.x += (tx - camera.position.x) * .04; camera.position.y += (ty2 - camera.position.y) * .04;
    }
    for (let k = 0; k < MOTES; k++) {
      mp[k * 3] += Math.sin(t * .4 + k) * .0012; mp[k * 3 + 1] += .0018 + (k % 5) * .0003;
      if (mp[k * 3 + 1] > 3.2) mp[k * 3 + 1] = 0;
    }
    moteGeo.attributes.position.needsUpdate = true;
    if (t > nextBlink) { gsap.to(eyes.map(e => e.scale), { y: .1, duration: .07, repeat: 1, yoyo: true }); nextBlink = t + 2 + Math.random() * 3.5; }
  }
  /* la tête suit la souris, ou regarde la boîte qu'il va prendre */
  let ty, tx;
  if (lookTarget) { robot.worldToLocal(tmp.copy(lookTarget)); ty = Math.atan2(tmp.x, tmp.z); tx = .3; }
  else if (carried) { ty = 0; tx = .15; }
  else { robot.worldToLocal(tmp.set(LOOK.x + look.x * 4, 1.2 + look.y * 2, 6)); ty = Math.atan2(tmp.x, tmp.z); tx = -look.y * .2; }
  head.rotation.y += (THREE.MathUtils.clamp(ty, -.9, .9) - head.rotation.y) * .1;
  head.rotation.x += (tx - head.rotation.x) * .1;
  if (!RM) {
    lamps.forEach((g, k) => { g.rotation.z = Math.sin(t * .7 + k * 2) * .025; });
    rays.forEach((r, k) => { r.material.opacity = .13 + Math.sin(t * .5 + k * 1.3) * .04; });
    /* l'atelier vit : post-it qui frémissent, logs qui défilent, voyant et antenne, vapeur du café */
    postits.forEach((g, k) => { g.rotation.z = g.userData.base + Math.sin(t * 1.6 + k * 1.7) * .035; });
    if (t > nextLog) { logOffset++; screenTex.redraw(); nextLog = t + (LITE ? 1.2 : .45); }
    heart.material.emissiveIntensity = 1.4 + Math.sin(t * 2.2);
    antenna.material.emissiveIntensity = Math.sin(t * 3) > .5 ? 3 : .6;
    if (!LITE) steam.forEach(s => {
      const p = (t * .45 + s.userData.phase) % 1;
      s.position.set(Math.sin(p * 6 + s.userData.phase * 9) * .02, .14 + p * .32, 0);
      s.scale.setScalar(.6 + p * 1.6); s.material.opacity = (1 - p) * .35 * Math.min(1, p * 5);
    });
  }
  /* l'horloge donne l'heure du visiteur */
  const now = new Date();
  minuteHand.rotation.z = -(now.getMinutes() + now.getSeconds() / 60) / 60 * Math.PI * 2;
  hourHand.rotation.z = -((now.getHours() % 12) + now.getMinutes() / 60) / 12 * Math.PI * 2;
  if (composer) {
    /* la mise au point suit le robot ; le fond reste flou */
    bokeh.uniforms.focus.value = camera.position.distanceTo(robot.position) - .2;
    composer.render();
  } else renderer.render(scene, camera);
}

/* les étiquettes attendent les polices pour être nettes */
await Promise.all(['800 40px "Bricolage Grotesque"', '600 20px "JetBrains Mono"'].map(f => document.fonts.load(f)));
boxes.forEach(b => b.userData.tex.redraw());
[signTex, eyeTex, corkTex, schemaTex, clockTex, screenTex].forEach(tex => tex.redraw());
/* changement de langue : les étiquettes des boîtes se redessinent */
new MutationObserver(() => { WORDS = words(); boxes.forEach(b => b.userData.tex.redraw()); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
resize();
frame();
setTimeout(start, RM ? 0 : 700);
