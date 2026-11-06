import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

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
scene.fog = new THREE.Fog(P.bg, LITE ? 10 : 12, 30);
/* reflets doux sur toutes les matières */
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
scene.environmentIntensity = .18;
const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);

/* effets « cinéma » : le fond se floute, les lumières font un halo */
let composer = null, bokeh = null;
if (!LITE) {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bokeh = new BokehPass(scene, camera, { focus: 7, aperture: .0016, maxblur: .008 });
  composer.addPass(bokeh);
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), .3, .5, 1.4));
  composer.addPass(new OutputPass());
}

/* lumière de petit matin : soleil rasant venant de la fenêtre à droite */
scene.add(new THREE.HemisphereLight(P.hemi[0], P.hemi[1], P.hemi[2]));
const sunLight = new THREE.DirectionalLight(P.sun[0], P.sun[1]);
sunLight.position.set(5, 7, 5); sunLight.target.position.set(1.2, 0, 0);
sunLight.castShadow = true; sunLight.shadow.mapSize.set(2048, 2048); sunLight.shadow.bias = -.0005; sunLight.shadow.radius = 4;
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
mesh(new THREE.BoxGeometry(16, .14, 2.8), std(P.counter[0], { roughness: .55 }), 1.2, -.07, .2);
mesh(new THREE.BoxGeometry(16, 1.8, .12), std(P.counter[1]), 1.2, -.98, 1.56);
mesh(new THREE.BoxGeometry(16, .04, .04), std(P.counter[2]), 1.2, -.02, 1.6);
const SHELF_Z = -.95, BOARDS = [.62, 1.42], SLOT_X = [.45, 1.25, 2.05, 2.85];
const wood = std(P.wood[0], { roughness: .6 }), woodDark = std(P.wood[1]);
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
const WALL_Z = -3.2;
const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), std(P.wall, { roughness: .95 }));
wall.position.set(1, 3, WALL_Z); wall.receiveShadow = true; scene.add(wall);
mesh(new THREE.BoxGeometry(30, .3, .06), std(P.base), 1, -.05, WALL_Z + .03);

const FILL = P.items;
const fillMat = FILL.map(c => std(c));
const potMat = std(P.pot), leafMat = std(P.leaf, { roughness: .8 }), glassMat = std(P.jar, { roughness: .15, transparent: true, opacity: .7 });
function backShelf(x0, width) {
  const z = WALL_Z + .3, boards = [.2, .78, 1.36, 1.94];
  for (const x of [x0, x0 + width]) mesh(new THREE.BoxGeometry(.06, 2.3, .45), woodDark, x, 1.15, z);
  for (const y of boards) {
    mesh(new THREE.BoxGeometry(width, .05, .45), wood, x0 + width / 2, y, z);
    let x = x0 + .08;
    while (x < x0 + width - .14) {
      const r = rnd(), base = y + .025;
      if (r < .4) { /* boîtes de rangement */
        const w = .16 + rnd() * .22, h = .18 + rnd() * .3;
        if (x + w > x0 + width - .06) break;
        mesh(new THREE.BoxGeometry(w, h, .3), pick(fillMat), x + w / 2, base + h / 2, z); x += w + .03;
      } else if (r < .7) { /* une rangée de classeurs */
        const n = 3 + Math.floor(rnd() * 4), m = pick(fillMat);
        for (let k = 0; k < n && x < x0 + width - .1; k++) { const h = .38 + rnd() * .12; mesh(new THREE.BoxGeometry(.055, h, .3), m, x + .03, base + h / 2, z); x += .062; }
        x += .04;
      } else if (r < .88) { /* une plante */
        mesh(new THREE.CylinderGeometry(.08, .065, .14, 16), potMat, x + .09, base + .07, z);
        for (let k = 0; k < 4; k++) mesh(new THREE.SphereGeometry(.06 + rnd() * .05, 12, 10), leafMat, x + .03 + rnd() * .12, base + .2 + rnd() * .12, z + (rnd() - .5) * .12);
        x += .22;
      } else { /* un bocal */
        mesh(new THREE.CylinderGeometry(.07, .07, .22, 16), glassMat, x + .08, base + .11, z); x += .2;
      }
    }
  }
}
backShelf(-.15, 1.8); backShelf(1.8, 1.8);

/* la fenêtre : verre lumineux (il fera un halo), croisillons, rayons de soleil */
const WIN = { x: 4.55, y: 1.9, w: 1.6, h: 2.3 };
const glass = new THREE.Mesh(new THREE.PlaneGeometry(WIN.w, WIN.h), new THREE.MeshStandardMaterial({ color: P.win[0], emissive: P.win[1], emissiveIntensity: P.win[2] }));
glass.position.set(WIN.x, WIN.y, WALL_Z + .01); scene.add(glass);
for (const [w, h, x, y] of [[WIN.w + .16, .1, 0, WIN.h / 2], [WIN.w + .16, .1, 0, -WIN.h / 2], [.1, WIN.h, -WIN.w / 2, 0], [.1, WIN.h, WIN.w / 2, 0], [.06, WIN.h, 0, 0], [WIN.w, .06, 0, .2]])
  mesh(new THREE.BoxGeometry(w, h, .08), std(P.frame), WIN.x + x, WIN.y + y, WALL_Z + .05);
const rayTex = canvasTex(64, 256, (ctx, W, H) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(" + P.ray + ",.9)"); g.addColorStop(1, "rgba(" + P.ray + ",0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); });
rayTex.redraw();
const rays = [];
for (let k = 0; k < 4; k++) {
  const ray = new THREE.Mesh(new THREE.PlaneGeometry(.5 + k * .12, 6), new THREE.MeshBasicMaterial({ map: rayTex, transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
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
  const g = new THREE.Group(); g.position.set(x, 4.85, -1.9); scene.add(g);
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

/* ---------- le robot, couleur terre cuite ---------- */
const TERRA = P.robot[0];
const HOME = { x: -.25, z: .95, rot: .55 }, WAIT = { x: PAD.x - .72, z: PAD.z };
const robot = new THREE.Group(); robot.position.set(HOME.x, 0, HOME.z); robot.rotation.y = HOME.rot; scene.add(robot);
const body = new THREE.Group(); robot.add(body);
const terra = std(TERRA, { roughness: .62 }), terraDark = std(P.robot[1]), ink = std(P.eye, { roughness: .35 });
const legs = [-.13, .13].map(x => {
  const g = new THREE.Group(); g.position.set(x, .44, 0); robot.add(g);
  mesh(new RoundedBoxGeometry(.2, .4, .22, 2, .04), terra, 0, -.2, 0, g);
  mesh(new RoundedBoxGeometry(.24, .1, .3, 2, .03), terraDark, 0, -.39, .04, g);
  return g;
});
mesh(new RoundedBoxGeometry(.56, .5, .36, 3, .05), terra, 0, .68, 0, body);
mesh(new THREE.BoxGeometry(.18, .07, .02), terraDark, 0, .72, .185, body);
const arms = [-1, 1].map(s => {
  const g = new THREE.Group(); g.position.set(s * .36, .88, 0); body.add(g);
  mesh(new RoundedBoxGeometry(.16, .4, .18, 2, .04), terra, 0, -.19, 0, g);
  mesh(new RoundedBoxGeometry(.18, .13, .2, 2, .04), terraDark, 0, -.44, .01, g);
  return g;
});
mesh(new THREE.BoxGeometry(.15, .08, .15), terraDark, 0, .96, 0, body);
const head = new THREE.Group(); head.position.set(0, 1.0, 0); body.add(head);
mesh(new RoundedBoxGeometry(.94, .8, .82, 4, .06), terra, 0, .42, 0, head);
const eyes = [-.17, .17].map(x => mesh(new THREE.BoxGeometry(.085, .16, .02), ink, x, .46, .412, head));
robot.scale.setScalar(.82);

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
  const robotLeft = new THREE.Vector3(HOME.x - .5, 1.4, HOME.z), robotFoot = new THREE.Vector3(HOME.x - .5, 0, HOME.z), sceneRight = new THREE.Vector3(3.6, 1.6, SHELF_Z);
  for (let k = 0; k < 40; k++) {
    camera.position.set(LOOK.x, narrow ? 2.4 : 2.0, LOOK.z + dist);
    camera.lookAt(LOOK);
    if (narrow) camera.clearViewOffset(); else camera.setViewOffset(w, h, -off, 0, w, h);
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    if (narrow) break;
    const left = Math.min(screenX(robotLeft, w), screenX(robotFoot, w)), right = screenX(sceneRight, w);
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
    .add(() => { burst(PAD, P.dust, { n: 12, spread: .7, rise: .18 }); pulse(); })
    .to(b.scale, { x: 1.14, y: .78, z: 1.14, duration: .07, ease: "power2.out" })
    .to(b.position, { y: rest - BOX.h * .11, duration: .07 }, "<")
    .to(b.scale, { x: 1, y: 1, z: 1, duration: .55, ease: "elastic.out(1, .4)" })
    .to(b.position, { y: rest, duration: .55, ease: "elastic.out(1, .4)" }, "<")
    .then();
}

async function shelve(b) {
  state = "shelving"; waiting = null; clearTimeout(waitTimer);
  lookTarget = b.position;
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
    await walkTo(HOME.x, HOME.z); await turnTo(HOME.rot);
    await cheer();
  }
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
    .to(eyes.map(e => e.scale), { y: .3, duration: .1, repeat: 1, yoyo: true, repeatDelay: .4 }, 0)
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
  renderer.domElement.style.cursor = h ? "pointer" : "";
});
renderer.domElement.addEventListener("click", e => {
  setPtr(e); const h = hit(); if (!h) return;
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
let nextBlink = 2;
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
  }
  if (composer) {
    /* la mise au point suit le robot ; le fond reste flou */
    bokeh.uniforms.focus.value = camera.position.distanceTo(robot.position) - .2;
    composer.render();
  } else renderer.render(scene, camera);
}

/* les étiquettes attendent les polices pour être nettes */
await Promise.all(['800 40px "Bricolage Grotesque"', '600 20px "JetBrains Mono"'].map(f => document.fonts.load(f)));
boxes.forEach(b => b.userData.tex.redraw());
signTex.redraw();
/* changement de langue : les étiquettes des boîtes se redessinent */
new MutationObserver(() => { WORDS = words(); boxes.forEach(b => b.userData.tex.redraw()); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
resize();
frame();
setTimeout(start, RM ? 0 : 700);
