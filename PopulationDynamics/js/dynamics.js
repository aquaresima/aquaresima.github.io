// Constants
const FOX    = 0;
const RABBIT = 1;
const GRASS  = 2;
const DESERT = 3;
const ROAD   = 4;

// Initialize grid with weighted random placement
function initialize_populations(fox_frac, rabbit_frac, n) {
    // fox_frac, rabbit_frac in [0,1]; remainder split equally between grass/desert
    const remainder = Math.max(0, 1 - fox_frac - rabbit_frac);
    const grass_frac  = remainder * 0.5;
    const desert_frac = remainder * 0.5;

    const grid = new Int8Array(n * n);
    for (let i = 0; i < n * n; i++) {
        const r = Math.random();
        if (r < fox_frac)                        grid[i] = FOX;
        else if (r < fox_frac + rabbit_frac)     grid[i] = RABBIT;
        else if (r < fox_frac + rabbit_frac + grass_frac) grid[i] = GRASS;
        else                                     grid[i] = DESERT;
    }
    return grid;
}

// 4-connected toroidal neighbours
function get_neighbours(idx, n) {
    const x = idx % n;
    const y = Math.floor(idx / n);
    return [
        ((n + x - 1) % n) + y * n,          // left
        ((x + 1) % n)     + y * n,          // right
        x + ((n + y - 1) % n) * n,          // up
        x + ((y + 1) % n) * n,              // down
    ];
}

// One step of the cellular automaton.
// r_fox, r_rabbit, r_grass are reproduction probabilities in [0,1].
function update_grid(grid, n, r_fox, r_rabbit, r_grass) {
    const next = new Int8Array(grid);

    for (let k = 0; k < n * n; k++) {
        if (grid[k] === ROAD) { next[k] = ROAD; continue; }

        const nb = get_neighbours(k, n);

        if (grid[k] === FOX) {
            let has_rabbit = false;
            for (const ni of nb) if (grid[ni] === RABBIT) { has_rabbit = true; break; }
            if (!has_rabbit) next[k] = DESERT;
        }

        if (grid[k] === RABBIT) {
            // fox eats rabbit with probability r_fox
            let eaten = false;
            let eating_fox_nb = -1;
            for (const ni of nb) {
                if (grid[ni] === FOX && Math.random() < r_fox) { eaten = true; eating_fox_nb = ni; break; }
            }
            if (eaten) {
                next[k] = FOX;  // rabbit cell becomes fox
                // spawn offspring on a random desert neighbour of the eating fox
                const fox_nb = get_neighbours(eating_fox_nb, n);
                const empty = fox_nb.filter(ni => grid[ni] === DESERT);
                if (empty.length > 0) {
                    const spawn = empty[Math.floor(Math.random() * empty.length)];
                    next[spawn] = FOX;
                }
                continue;
            }
            // starve if no grass
            let has_grass = false;
            for (const ni of nb) if (grid[ni] === GRASS) { has_grass = true; break; }
            if (!has_grass) next[k] = DESERT;
        }

        if (grid[k] === GRASS) {
            // rabbit eats grass with probability r_rabbit
            for (const ni of nb) {
                if (grid[ni] === RABBIT && Math.random() < r_rabbit) { next[k] = RABBIT; break; }
            }
        }

        if (grid[k] === DESERT) {
            // grass grows with probability r_grass
            for (const ni of nb) {
                if (grid[ni] === GRASS && Math.random() < r_grass) { next[k] = GRASS; break; }
            }
        }
    }

    return next;
}

// Count agents per type
function count_types(grid) {
    const c = [0, 0, 0, 0, 0];
    for (let i = 0; i < grid.length; i++) c[grid[i]]++;
    return c;
}
