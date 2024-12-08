function tsp_hk(dist) {
  let cities = [];
  for (let i = 0; i < dist.length; i++) {
    cities.push(i);
  }
  let best = Infinity;

  let cache = [];
  for (let i = 0; i < cities.length; i++) {
    let temp = heldKarp([...cities], i);
    if (temp < best) {
      best = temp;
    }
  }
  return best;

  function heldKarp(cities, start) {
    let key = JSON.stringify([cities, start]);
    if (cache[key] != undefined) {
      return cache[key];
    }
    if (cities.length == 2) {
      cache[key] = dist[cities[0]][cities[1]];
      return dist[cities[0]][cities[1]];
    } else if (cities.length < 2) {
      return 0;
    } else {
      let min = Infinity;

      cities.splice(cities.indexOf(start), 1);

      for (let i = 0; i < cities.length; i++) {
        let d = heldKarp([...cities], cities[i]) + dist[start][cities[i]];
        if (d < min) {
          min = d;
        }
      }
      cache[key] = min;
      return min;
    }
  }
}

function tsp_ls(matrix) {
  let len = matrix.length;

  route = Array.from(Array(len).keys());
  for (let i = route.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [route[i], route[j]] = [route[j], route[i]];
  }

  var improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < len - 1; i++) {
      for (let k = i + 1; k < len; k++) {
        let newRoute = twoOptSwap(route, i, k);
        if (dist(newRoute) < dist(route)) {
          route = newRoute;
          improved = true;
        }
      }
    }
  }
  return dist(route);

  function twoOptSwap(route, i, k) {
    let swap = route.slice(i, k + 1);
    swap.reverse();
    return route
      .slice(0, i)
      .concat(swap)
      .concat(route.slice(k + 1));
  }

  function dist(route) {
    let d = 0;
    for (let i = 0; i < route.length - 1; i++) {
      d += matrix[route[i]][route[i + 1]];
    }
    return d;
  }
}

function generateDistanceMatrix(size) {
  // Create an empty matrix
  let matrix = Array(size)
    .fill()
    .map(() => Array(size).fill(0));

  // Fill the matrix with random distances
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      // Generate random distance between 1 and 100
      let distance = Math.floor(Math.random() * 100) + 1;
      // Make matrix symmetric
      matrix[i][j] = distance;
      matrix[j][i] = distance;
    }
    // Set diagonal to 0 (distance to self)
    matrix[i][i] = 0;
  }

  return matrix;
}

for (i = 1; i <= 25; i++) {
  matrix = generateDistanceMatrix(i);

  console.log(`Current map size: ${i}`);

  const hkstart = performance.now();
  hk = tsp_hk(matrix);

  console.log(`Held-Karp: ${hk}`);
  const hkend = performance.now();

  const lsstart = performance.now();
  ls = tsp_ls(matrix);

  console.log(`Local Search: ${ls}`);
  const lsend = performance.now();

  const hkTime = ((hkend - hkstart) / 1000).toFixed(4);
  const lsTime = ((lsend - lsstart) / 1000).toFixed(6);

  console.log(`-------------- Held-Karp time: ${hkTime} s`);
  console.log(`-------------- Local Search time: ${lsTime} s`);
}
