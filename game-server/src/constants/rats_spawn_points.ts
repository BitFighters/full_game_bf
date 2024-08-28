export const random_spawn_points2 = [
  {
    x: 650,
    y: 480
  },
  {
    x: 740,
    y: 480
  },
  {
    x: 840,
    y: 480
  },
  {
    x: 750,
    y: 480
  },
  {
    x: 888,
    y: 500
  },
  {
    x: 600,
    y: 480
  },
  {
    x: 700,
    y: 480
  },
  {
    x: 800,
    y: 480
  },
  {
    x: 850,
    y: 480
  },
  {
    x: 900,
    y: 500
  },
  {
    x: 1200,
    y: 700
  },
  {
    x: 1000,
    y: 750
  },
  {
    x: 800,
    y: 700
  },

  {
    x: 700,
    y: 740
  },
  {
    x: 730,
    y: 740
  },
  {
    x: 760,
    y: 740
  },
  {
    x: 600,
    y: 700
  },
  {
    x: 500,
    y: 700
  },
  {
    x: 620,
    y: 700
  },
  {
    x: 520,
    y: 700
  },
]

let data = []
for (let i = 0; i < 200; i++) {
  let up = Math.random() > 0.6;
  let x, y = 0
  x = 520 + Math.floor(Math.random() * 700)
  y = 700 + Math.floor(Math.random() * 50)
  if (up) {
    x = 650 + Math.floor(Math.random() * 250)
    y = 480 + Math.floor(Math.random() * 20)
  }

  data.push({ x: x, y: y })
}

export const random_spawn_points = data;
// return data;

// export const random_spawn_points2 = () => {
//   let data = []
//   for (let i = 0; i < 200; i++) {
//     let up = Math.random() > 0.5;
//     let x, y = 0
//     if (up) {
//       x = 650 + Math.floor(Math.random() * 250)
//       y = 480 + Math.floor(Math.random() * 20)
//     }
//     x = 520 + Math.floor(Math.random() * 700)
//     y = 700 + Math.floor(Math.random() * 50)
//     data.push({ x: x, y: y })
//   }
//   return data;
// }

// console.log("------debug_spawn ", random_spawn_points)