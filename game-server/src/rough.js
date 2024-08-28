class Boundary {
  constructor(position, width, height) {
    this.position = position;
    this.width = width;
    this.height = height;
  }
}

function rectangularCollisionWithRectange(rectangle1, rectangle2) {
  // console.log("in rectangularCollision ", rectangle1, rectangle2 )
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

// checkPlayerNearItem item Manger  Boundary {
//   position: { x: 966.5227349215832, y: 520.6463293813542 },
//   width: 30,
//     height: 30
// } Boundary { position: { x: 945.24, y: 564.73 }, width: 30, height: 50 }

// let b1 = new Boundary({ x: 966, y: 520 }, 30, 30);
// let b2 = new Boundary({ x: 945, y: 564 }, 30, 50);

let b1 = new Boundary({ x: 966, y: 520 }, 30, 30);
let b2 = new Boundary({ x: 945, y: 564 }, 30, 50);

console.log(rectangularCollisionWithRectange(b1, b2));
