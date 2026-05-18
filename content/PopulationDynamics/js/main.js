// ── theme-aware colors for p5 canvas ───────────────────────────
function TC() {
    const light = document.body.classList.contains('light');
    return light ? {
        bg:        [240, 237, 230],
        panel:     [244, 241, 235],
        border:    [200, 192, 180],
        gridline:  [200, 192, 180],
        axisX:     [ 80, 100,  70],
        axisXlbl:  [100, 120,  90],
        axisY100:  [100, 110, 100],
        cycleslbl: [ 90, 110,  85],
        legendTxt: [ 30,  30,  30],
    } : {
        bg:        [ 17,  28,  23],
        panel:     [ 20,  31,  26],
        border:    [ 36,  48,  40],
        gridline:  [ 36,  50,  42],
        axisX:     [ 60,  80,  65],
        axisXlbl:  [100, 130, 110],
        axisY100:  [100, 110, 100],
        cycleslbl: [ 90, 120, 100],
        legendTxt: [ 60,  60,  60],
    };
}

// ── configuration ──────────────────────────────────────────────
const GRID_PX   = 540;   // fixed grid canvas size in pixels
const PLOT_W    = 400;
const TRACES    = 80;
const TICK_MS   = 80;

let N_BOXES = 30;

// ── state ───────────────────────────────────────────────────────
let grid;
let trace_fox    = new Array(TRACES).fill(0);
let trace_rabbit = new Array(TRACES).fill(0);
let trace_grass  = new Array(TRACES).fill(0);
let trace_desert = new Array(TRACES).fill(0);

let imgs   = {};
let running  = false;
let lastTick = 0;
let speed    = 0.5;

const TYPE_COLOR = [
    [182, 22,  63],   // FOX
    [4,   54,  84],   // RABBIT
    [77,  137, 99],   // GRASS
    [244, 148,  0],   // DESERT
    [100, 100, 100],  // ROAD
];

// ── p5 sketch ───────────────────────────────────────────────────
const sketch = (p) => {

    p.preload = () => {
        imgs[FOX]    = p.loadImage('pictures/fox.jpg');
        imgs[RABBIT] = p.loadImage('pictures/rabbit.jpg');
        imgs[GRASS]  = p.loadImage('pictures/grass.jpeg');
        imgs[DESERT] = p.loadImage('pictures/soil.jpg');
        imgs[ROAD]   = p.loadImage('pictures/road.jpeg');
    };

    p.setup = () => {
        const cnv = p.createCanvas(GRID_PX + PLOT_W, GRID_PX);
        cnv.parent('sketch_box');
        p.imageMode(p.CORNER);
        p.textFont('monospace');
        reset_simulation();
    };

    p.draw = () => {
        const now = p.millis();
        const interval = TICK_MS / Math.max(0.05, speed);
        if (running && now - lastTick > interval) {
            lastTick = now;
            const r_fox    = Number(document.getElementById('r_fox_rate').value)    / 100;
            const r_rabbit = Number(document.getElementById('r_rabbit_rate').value) / 100;
            const r_grass  = Number(document.getElementById('r_grass').value)       / 100;
            grid = update_grid(grid, N_BOXES, r_fox, r_rabbit, r_grass);
            push_trace();
        }

        p.background(...TC().bg);

        // draw grid
        const cell = Math.floor(GRID_PX / N_BOXES);
        const offset_x = Math.floor((GRID_PX - cell * N_BOXES) / 2);
        const offset_y = Math.floor((GRID_PX - cell * N_BOXES) / 2);

        for (let k = 0; k < N_BOXES * N_BOXES; k++) {
            const cx = (k % N_BOXES) * cell + offset_x;
            const cy = Math.floor(k / N_BOXES) * cell + offset_y;
            const [r, g, b] = TYPE_COLOR[grid[k]];
            p.fill(r, g, b); p.noStroke();
            p.rect(cx, cy, cell, cell);
        }

        // grid lines
        if (cell >= 10) {
            p.stroke(0, 0, 0, 60); p.strokeWeight(0.5);
            for (let i = 0; i <= N_BOXES; i++) {
                p.line(offset_x + i * cell, offset_y, offset_x + i * cell, offset_y + N_BOXES * cell);
                p.line(offset_x, offset_y + i * cell, offset_x + N_BOXES * cell, offset_y + i * cell);
            }
        }

        draw_plots(p, GRID_PX, PLOT_W, GRID_PX);
    };

    p.mousePressed  = () => paint_road(p);
    p.mouseDragged  = () => paint_road(p);
};

function paint_road(p) {
    const cell = Math.floor(GRID_PX / N_BOXES);
    const ox   = Math.floor((GRID_PX - cell * N_BOXES) / 2);
    const oy   = Math.floor((GRID_PX - cell * N_BOXES) / 2);
    const cx   = Math.floor((p.mouseX - ox) / cell);
    const cy   = Math.floor((p.mouseY - oy) / cell);
    if (cx >= 0 && cx < N_BOXES && cy >= 0 && cy < N_BOXES) {
        grid[cx + cy * N_BOXES] = ROAD;
    }
}

// ── plots ────────────────────────────────────────────────────────
const AXIS_TICKS = 4;

function nice_ceil(v) {
    if (v <= 0) return 1;
    const mag = Math.pow(10, Math.floor(Math.log10(v)));
    return Math.ceil(v / mag) * mag;
}

function draw_axis_y(p, x0, y0, h, ymax, color) {
    p.stroke(...color, 160); p.strokeWeight(1);
    p.line(x0, y0, x0, y0 + h);
    p.textSize(9); p.fill(...color); p.noStroke();
    for (let t = 0; t <= AXIS_TICKS; t++) {
        const ypos = y0 + h - h * t / AXIS_TICKS;
        p.stroke(...color, 160); p.strokeWeight(1);
        p.line(x0 - 3, ypos, x0, ypos);
        p.noStroke(); p.textAlign(p.RIGHT, p.CENTER);
        p.text(Math.round(ymax * t / AXIS_TICKS), x0 - 5, ypos);
    }
}

function draw_axis_x(p, x0, y_bottom, w, n_ticks, label_fn) {
    const tc = TC();
    p.stroke(...tc.axisX); p.strokeWeight(1);
    p.line(x0, y_bottom, x0 + w, y_bottom);
    p.fill(...tc.axisXlbl); p.noStroke(); p.textSize(9); p.textAlign(p.CENTER, p.TOP);
    for (let t = 0; t <= n_ticks; t++) {
        const xpos = x0 + w * t / n_ticks;
        p.stroke(...tc.axisX); p.strokeWeight(1);
        p.line(xpos, y_bottom, xpos, y_bottom + 3);
        p.noStroke();
        p.text(label_fn(t), xpos, y_bottom + 4);
    }
}

function draw_plots(p, ox, pw, ph) {
    const nn     = N_BOXES * N_BOXES;
    const M      = { l: 42, r: 12, t: 20, b: 32, mid: 24 };
    const inner_w = pw - M.l - M.r;

    const tc = TC();
    p.fill(...tc.panel); p.noStroke();
    p.rect(ox, 0, pw, ph);
    p.stroke(...tc.border); p.strokeWeight(1); p.noFill();
    p.rect(ox, 0, pw, ph);

    // ── phase space ──
    const ps_h = Math.round(ph * 0.42);
    const px = ox + M.l, py = M.t;

    const max_r = nice_ceil(Math.max(1, ...trace_rabbit));
    const max_f = nice_ceil(Math.max(1, ...trace_fox));

    // grid lines
    p.stroke(...tc.gridline); p.strokeWeight(0.5);
    for (let t = 1; t < AXIS_TICKS; t++) {
        const yg = py + ps_h - ps_h * t / AXIS_TICKS;
        p.line(px, yg, px + inner_w, yg);
        const xg = px + inner_w * t / AXIS_TICKS;
        p.line(xg, py, xg, py + ps_h);
    }

    draw_axis_y(p, px, py, ps_h, max_f, TYPE_COLOR[FOX]);
    draw_axis_x(p, px, py + ps_h, inner_w, AXIS_TICKS,
        t => Math.round(max_r * t / AXIS_TICKS));

    // titles
    p.noStroke(); p.textSize(10); p.textAlign(p.LEFT, p.BOTTOM);
    p.fill(...TYPE_COLOR[FOX]);   p.text(LANG.legend[0] + ' ↑', px, py - 3);
    p.fill(...TYPE_COLOR[RABBIT]); p.textAlign(p.RIGHT, p.TOP);
    p.text('← ' + LANG.legend[1], px + inner_w, py + ps_h + M.b - 4);

    // frame
    p.stroke(...tc.gridline); p.noFill(); p.strokeWeight(1);
    p.rect(px, py, inner_w, ps_h);

    // trajectory
    for (let i = 0; i < TRACES - 1; i++) {
        const alpha = Math.round(30 + 225 * i / TRACES);
        const t = i / (TRACES - 1);
        p.stroke(Math.round(182 * (1-t) + 4 * t),
                 Math.round(22  * (1-t) + 54 * t),
                 Math.round(63  * (1-t) + 84 * t), alpha);
        p.strokeWeight(1.5);
        const x1 = px + inner_w * trace_rabbit[i]   / max_r;
        const y1 = py + ps_h    - ps_h * trace_fox[i]   / max_f;
        const x2 = px + inner_w * trace_rabbit[i+1] / max_r;
        const y2 = py + ps_h    - ps_h * trace_fox[i+1] / max_f;
        p.line(x1, y1, x2, y2);
    }

    // ── time series ──
    const ts_y  = py + ps_h + M.b + M.mid;
    const ts_h  = ph - ts_y - M.b - 20;
    const tx = px, ty = ts_y;

    const traces_all = [trace_fox, trace_rabbit, trace_grass, trace_desert];
    const ts_max = nice_ceil(Math.max(1, ...traces_all.map(tr => Math.max(...tr))));

    // grid lines
    p.stroke(...tc.gridline); p.strokeWeight(0.5);
    for (let t = 1; t < AXIS_TICKS; t++) {
        const yg = ty + ts_h - ts_h * t / AXIS_TICKS;
        p.line(tx, yg, tx + inner_w, yg);
    }

    draw_axis_y(p, tx, ty, ts_h, ts_max, tc.axisY100);
    draw_axis_x(p, tx, ty + ts_h, inner_w, AXIS_TICKS,
        t => -Math.round(TRACES * (1 - t / AXIS_TICKS)));

    p.noStroke(); p.fill(...tc.cycleslbl); p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text(LANG.cycles, tx + inner_w / 2, ty + ts_h + M.b - 4);

    p.stroke(...tc.gridline); p.noFill(); p.strokeWeight(1);
    p.rect(tx, ty, inner_w, ts_h);

    const bar_w = inner_w / TRACES;
    for (let j = 0; j < 4; j++) {
        const [r, g, b] = TYPE_COLOR[j];
        p.strokeWeight(1.8);
        for (let i = 0; i < TRACES - 1; i++) {
            p.stroke(r, g, b);
            const x1 = tx + i * bar_w;
            const x2 = tx + (i + 1) * bar_w;
            const y1 = ty + ts_h - ts_h * traces_all[j][i]   / ts_max;
            const y2 = ty + ts_h - ts_h * traces_all[j][i+1] / ts_max;
            p.line(x1, y1, x2, y2);
        }
    }

    // legend
    p.textSize(9); p.noStroke(); p.textAlign(p.LEFT, p.CENTER);
    const leg_y = ty + ts_h + M.b + 6;
    LANG.legend.forEach((name, j) => {
        const [r, g, b] = TYPE_COLOR[j];
        const lx = tx + j * (inner_w / 4);
        p.fill(r, g, b, 200); p.noStroke();
        p.rect(lx, leg_y - 4, 8, 8, 2);
        p.fill(...tc.legendTxt); p.text(name, lx + 11, leg_y);
    });

    // running dot
    p.noStroke();
    p.fill(...(running ? [80, 180, 80] : [200, 60, 60]));
    p.circle(ox + pw - 12, 12, 8);
}

// ── helpers ──────────────────────────────────────────────────────
function push_trace() {
    const c = count_types(grid);
    trace_fox.push(c[FOX]);       trace_fox.shift();
    trace_rabbit.push(c[RABBIT]); trace_rabbit.shift();
    trace_grass.push(c[GRASS]);   trace_grass.shift();
    trace_desert.push(c[DESERT]); trace_desert.shift();
}

function reset_simulation() {
    N_BOXES = Number(document.getElementById('gridsize').value) || 30;
    const fox_frac    = Number(document.getElementById('r_fox').value)    / 100 * 0.5;
    const rabbit_frac = Number(document.getElementById('r_rabbit').value) / 100 * 0.5;

    grid = initialize_populations(fox_frac, rabbit_frac, N_BOXES);

    const c = count_types(grid);
    trace_fox    = new Array(TRACES).fill(c[FOX]);
    trace_rabbit = new Array(TRACES).fill(c[RABBIT]);
    trace_grass  = new Array(TRACES).fill(c[GRASS]);
    trace_desert = new Array(TRACES).fill(c[DESERT]);

    running  = true;
    lastTick = 0;
}

// ── i18n ─────────────────────────────────────────────────────────
const PILL_HTML = `
  <div class="legend-pills">
    <span class="pill"><span class="pill-dot" style="background:#b6163f"></span>FOXES_LABEL</span>
    <span class="pill"><span class="pill-dot" style="background:#043654"></span>RABBITS_LABEL</span>
    <span class="pill"><span class="pill-dot" style="background:#4d8963"></span>GRASS_LABEL</span>
    <span class="pill"><span class="pill-dot" style="background:#f49400"></span>DESERT_LABEL</span>
  </div>`;

const INTRO = {
    it: `<h3>Il modello</h3>
<p>Questa simulazione è un <strong>automa cellulare</strong> ispirato alle equazioni di Lotka–Volterra,
che descrivono la coevoluzione di una popolazione di prede e predatori nel tempo:</p>
<div class="eq-block">
$\\dfrac{dR}{dt} = \\alpha R - \\beta R F$
&nbsp;&nbsp;&nbsp;
$\\dfrac{dF}{dt} = \\delta R F - \\gamma F$
</div>
<p>dove $R$ è la densità dei conigli (prede) e $F$ quella delle volpi (predatori).
I parametri $\\alpha, \\beta, \\delta, \\gamma > 0$ regolano la crescita, la predazione e la mortalità.</p>
<p>Nell'automa cellulare ogni cella è occupata da uno dei quattro stati: le volpi muoiono se non hanno
conigli vicini; i conigli muoiono se non hanno erba; l'erba ricresce sul deserto.
I <strong>tassi di riproduzione</strong> controllano la probabilità di ogni transizione.</p>
<p>Clicca sulla griglia per disegnare strade (barriere invalicabili) e osserva come cambiano le dinamiche.</p>
${PILL_HTML.replace('FOXES_LABEL','Volpi').replace('RABBITS_LABEL','Conigli').replace('GRASS_LABEL','Erba').replace('DESERT_LABEL','Deserto')}`,

    en: `<h3>The model</h3>
<p>This simulation is a <strong>cellular automaton</strong> inspired by the Lotka–Volterra equations,
which describe the co-evolution of prey and predator populations over time:</p>
<div class="eq-block">
$\\dfrac{dR}{dt} = \\alpha R - \\beta R F$
&nbsp;&nbsp;&nbsp;
$\\dfrac{dF}{dt} = \\delta R F - \\gamma F$
</div>
<p>where $R$ is the rabbit (prey) density and $F$ the fox (predator) density.
Parameters $\\alpha, \\beta, \\delta, \\gamma > 0$ govern growth, predation and mortality.</p>
<p>In the automaton each cell holds one of four states: foxes die without neighbouring rabbits;
rabbits starve without neighbouring grass; grass regrows on desert.
The <strong>reproduction rates</strong> control the probability of each transition.</p>
<p>Click on the grid to paint roads (impassable barriers) and watch how dynamics change.</p>
${PILL_HTML.replace('FOXES_LABEL','Foxes').replace('RABBITS_LABEL','Rabbits').replace('GRASS_LABEL','Grass').replace('DESERT_LABEL','Desert')}`,

    fr: `<h3>Le modèle</h3>
<p>Cette simulation est un <strong>automate cellulaire</strong> inspiré des équations de Lotka–Volterra,
qui décrivent la coévolution de populations de proies et de prédateurs au fil du temps :</p>
<div class="eq-block">
$\\dfrac{dR}{dt} = \\alpha R - \\beta R F$
&nbsp;&nbsp;&nbsp;
$\\dfrac{dF}{dt} = \\delta R F - \\gamma F$
</div>
<p>où $R$ est la densité des lapins (proies) et $F$ celle des renards (prédateurs).
Les paramètres $\\alpha, \\beta, \\delta, \\gamma > 0$ régissent la croissance, la prédation et la mortalité.</p>
<p>Dans l'automate, chaque cellule est dans l'un des quatre états : les renards meurent sans lapins voisins ;
les lapins meurent sans herbe voisine ; l'herbe repousse sur le désert.
Les <strong>taux de reproduction</strong> contrôlent la probabilité de chaque transition.</p>
<p>Cliquez sur la grille pour dessiner des routes (barrières infranchissables) et observez l'effet sur les dynamiques.</p>
${PILL_HTML.replace('FOXES_LABEL','Renards').replace('RABBITS_LABEL','Lapins').replace('GRASS_LABEL','Herbe').replace('DESERT_LABEL','Désert')}`,
};

const LANGUAGES = {
    it: { legend: ['Volpi','Conigli','Erba','Deserto'], cycles: 'cicli',
          title: 'Dinamiche di Popolazione',
          subtitle: 'Un automa cellulare ispirato al modello preda–predatore di Lotka–Volterra',
          groups: ['Valori iniziali', 'Tasso di riproduzione'],
          labels: ['Volpi iniziali','Conigli iniziali','Velocità','Dim. griglia',
                   'Volpi','Conigli','Erba'],
          restart: 'Ricomincia', sim: 'Simulazione in corso' },
    en: { legend: ['Foxes','Rabbits','Grass','Desert'], cycles: 'cycles',
          title: 'Population Dynamics',
          subtitle: 'A cellular automaton inspired by the Lotka–Volterra predator–prey model',
          groups: ['Initial values', 'Reproduction rate'],
          labels: ['Initial foxes','Initial rabbits','Speed','Grid size',
                   'Foxes','Rabbits','Grass'],
          restart: 'Restart', sim: 'Simulation running' },
    fr: { legend: ['Renards','Lapins','Herbe','Désert'], cycles: 'cycles',
          title: 'Dynamiques de Population',
          subtitle: 'Un automate cellulaire inspiré du modèle proie–prédateur de Lotka–Volterra',
          groups: ['Valeurs initiales', 'Taux de reproduction'],
          labels: ['Renards initiaux','Lapins initiaux','Vitesse','Taille grille',
                   'Renards','Lapins','Herbe'],
          restart: 'Recommencer', sim: 'Simulation en cours' },
};
let LANG = LANGUAGES.it;

function apply_lang(code) {
    LANG = LANGUAGES[code];

    document.getElementById('main_title').textContent    = LANG.title;
    document.getElementById('main_subtitle').textContent = LANG.subtitle;
    document.getElementById('grp1_title').textContent    = LANG.groups[0];
    document.getElementById('grp2_title').textContent    = LANG.groups[1];
    document.getElementById('restart_label').textContent = LANG.restart;
    const sl = document.getElementById('sim_label');
    if (sl) sl.textContent = LANG.sim;

    const ids = ['lbl_r_fox','lbl_r_rabbit','lbl_speed','lbl_gridsize',
                 'lbl2_r_fox','lbl2_r_rabbit','lbl2_r_grass'];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        // replace all text nodes, preserve the <span>
        [...el.childNodes]
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .forEach(n => n.textContent = LANG.labels[i] + ' ');
    });

    // intro text + re-typeset LaTeX
    const box = document.getElementById('intro_text');
    box.innerHTML = INTRO[code];
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([box]);
    }

    document.querySelectorAll('.lang-tab').forEach(t =>
        t.classList.toggle('active', t.dataset.lang === code));
}

// ── live displays ─────────────────────────────────────────────────
function bind_display(sid, did, fmt) {
    const sl = document.getElementById(sid);
    const dp = document.getElementById(did);
    if (!sl || !dp) return;
    const up = () => dp.textContent = fmt(sl.value);
    sl.addEventListener('input', up);
    up();
}

// ── boot ─────────────────────────────────────────────────────────
window.onload = () => {
    // set defaults before p5 setup runs
    document.getElementById('r_fox').value         = 30;
    document.getElementById('r_rabbit').value      = 40;
    document.getElementById('r_fox_rate').value    = 60;
    document.getElementById('r_rabbit_rate').value = 40;
    document.getElementById('r_grass').value       = 30;
    document.getElementById('speed').value         = 50;
    document.getElementById('gridsize').value      = 30;

    new p5(sketch, 'sketch_box');

    document.getElementById('restart_button').addEventListener('click', reset_simulation);
    document.getElementById('speed').addEventListener('input', e => {
        speed = Number(e.target.value) / 100;
    });
    document.querySelectorAll('.lang-tab').forEach(btn =>
        btn.addEventListener('click', () => apply_lang(btn.dataset.lang)));

    bind_display('r_fox',          'val_r_fox',     v => v + '%');
    bind_display('r_rabbit',       'val_r_rabbit',  v => v + '%');
    bind_display('speed',          'val_speed',     v => v + '%');
    bind_display('gridsize',       'val_gridsize',  v => v + '×' + v);
    bind_display('r_fox_rate',     'val2_r_fox',    v => v + '%');
    bind_display('r_rabbit_rate',  'val2_r_rabbit', v => v + '%');
    bind_display('r_grass',        'val2_r_grass',  v => v + '%');

    apply_lang('it');

    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const light = document.body.classList.toggle('light');
        themeBtn.textContent = light ? '☾' : '☀';
    });
};
