exports.default = [
  {
    id: 1,
    name: 'Structure',
    children: [
      {name: 'Square room',code: 'square_room',image: '/structure/square_room.png',polygons: [[0,0],[0,300],[300,300],[300,0]],rotateEnabled: false},
      {name: 'L-shape room',code: 'l_shape_room',image: '/structure/l_shape_room.png',polygons: [[0,0],[0,300],[300,300],[300,150],[150,150],[150,0]],rotateEnabled: false},
      {name: 'U-shape room',code: 'u_shape_room',image: '/structure/u_shape_room.png',polygons: [[0,0],[0,300],[300,300],[300,0],[200,0],[200,150],[100,150],[100,0]],rotateEnabled: false},
      {name: 'T-shape room',code: 't_shape_room',image: '/structure/t_shape_room.png',polygons: [[0,0],[0,150],[100,150],[100,300],[200,300],[200,150],[300,150],[300,0]],rotateEnabled: false},
      // {name: 'Tường', code: 'wall', image: '/structure/wall.png',showRuler: false},
      // {name: 'Phân cung',code: 'lap-cuc',image: '/la-ban/phan-cung.png',hideOnSidebar: true,width: 700,height: 700,showRuler: false,keepRatio: true},
    ]
  },
  {
    id: 2,
    name: 'Doors and windows',
    children: [
      {name: 'Door', code: 'door',image: '/structure/door.png'},
      {name: 'Window', code: 'window',image: '/structure/window.png'},
      {name: 'Opening', code: 'door-opening',image: '/structure/door-opening.png'},
      {name: 'Double', code: 'door-double',image: '/structure/door-double.png'},
      {name: 'Garage', code: 'garage',image: '/structure/garage.png'},
      {name: 'Roller', code: 'door-roller',image: '/structure/door-roller.png'},
      {name: 'Sliding', code: 'door-sliding',image: '/structure/door-sliding.png'},
      {name: 'Sliding', code: 'door-sliding-2',image: '/structure/door-sliding-2.png'},
      {name: 'Folding', code: 'door-folding',image: '/structure/door-folding.png'},
      {name: 'Double Folding', code: 'door-double-folding',image: '/structure/door-double-folding.png'},
      {name: 'Pocket', code: 'door-pocket',image: '/structure/door-pocket.png'},
      {name: 'Double Pocket', code: 'door-double-pocket',image: '/structure/door-double-pocket.png'},
    ]
  },
  {
    id: 3,
    name: 'General',
    children: [
      {name: 'Closet',code: 'closet',image: '/image/others/add-image.png',width: 100,height: 50,showRuler: false},
      {name: 'Bookcase',code: 'bookcase',image: '/image/others/add-image.png',width: 100,height: 50,showRuler: false},
      {name: 'Drawers',code: 'drawers',image: '/image/others/add-image.png',width: 100,height: 50,showRuler: false},
      {name: 'Shelf',code: 'shelf',image: '/image/others/add-image.png',width: 150,height: 30,showRuler: false},
      {name: 'Storage rack',code: 'storage-rack',image: '/image/others/add-image.png',width: 152,height: 41,showRuler: false},
      {name: 'Coat rack',code: 'coat-rack',image: '/image/others/add-image.png',width: 63,height: 72,showRuler: false},
      {name: 'Table',code: 'table',image: '/image/others/add-image.png',width: 100,height: 70,showRuler: false},
      {name: 'Table round',code: 'table-round',image: '/image/others/add-image.png',width: 100,height: 70,showRuler: false},
      {name: 'Corner table',code: 'corner-table',image: '/image/others/add-image.png',width: 100,height: 100,showRuler: false},
      {name: 'Chair',code: 'chair-4',image: '/image/others/add-image.png',width: 44,height: 40,showRuler: false},
      {name: 'Pillow',code: 'pillow',image: '/image/others/add-image.png',width: 40,height: 40,showRuler: false},
      {name: 'Plant',code: 'plant',image: '/image/others/add-image.png',width: 30,height: 29,showRuler: false},
      {name: 'Flower pot',code: 'flower-pot',image: '/image/others/add-image.png',width: 47,height: 51,showRuler: false},
      {name: 'Clock',code: 'clock',image: '/image/others/add-image.png',width: 60,height: 2,showRuler: false},
      {name: 'Ventilation shafts',code: 'ventilation-shafts',image: '/image/others/add-image.png',width: 60,height: 12,showRuler: false},
      {name: 'Railing',code: 'railing',image: '/image/others/add-image.png',width: 200,height: 5,showRuler: false},
      {name: 'Lamp',code: 'lamp',image: '/image/others/add-image.png',width: 35,height: 35,showRuler: false,keepRatio: true},
      {name: 'Ceiling fan',code: 'ceiling-fan',image: '/image/others/add-image.png',width: 100,height: 100,showRuler: false,keepRatio: true},
      {name: 'Air conditioner',code: 'air-conditioner',image: '/image/others/add-image.png',width: 100,height: 21,showRuler: false},
      {name: 'Radiator',code: 'radiator',image: '/image/others/add-image.png',width: 150,height: 10,showRuler: false},
      {name: 'Rug',code: 'rug',image: '/image/others/add-image.png',width: 274,height: 366,showRuler: false},
      {name: 'Rug',code: 'rug-2',image: '/image/others/add-image.png',width: 274,height: 366,showRuler: false},
      {name: 'Curtains',code: 'curtains',image: '/image/others/add-image.png',width: 200,height: 10,showRuler: false},
      {name: 'Man',code: 'man',image: '/image/others/add-image.png',width: 60,height: 30,showRuler: false},
      {name: 'Woman',code: 'woman',image: '/image/others/add-image.png',width: 49,height: 30,showRuler: false},
      {name: 'Stool',code: 'stool',image: '/image/others/add-image.png',width: 40,height: 40,showRuler: false,resizeEnabled: false},
      {name: 'Box',code: 'box',image: '/image/others/add-image.png',width: 100,height: 100,showRuler: false},
      {name: 'Triangle',code: 'triangle',image: '/image/others/add-image.png',width: 100,height: 87,showRuler: false},
      {name: 'Cylinder',code: 'cylinder',image: '/image/others/add-image.png',width: 50,height: 50,showRuler: false},
      {name: 'Horizontal cylinder',code: 'horizontal-cylinder',image: '/image/others/add-image.png',width: 100,height: 20,showRuler: false},
      {name: 'Sphere',code: 'sphere',image: '/image/others/add-image.png',width: 50,height: 50,showRuler: false}
    ]
  },
  {
    id: 4,
    name: 'Living',
    children: [
      {name: 'Sofa',code: 'sofa',image: '/image/others/add-image.png',width: 190,height: 90,showRuler: false},
      {name: 'Sofa',code: 'sofa-2',image: '/image/others/add-image.png',width: 250,height: 140,showRuler: false},
      {name: 'Sofa',code: 'sofa-3',image: '/image/others/add-image.png',width: 250,height: 250,showRuler: false},
      {name: 'Armchair',code: 'armchair',image: '/image/others/add-image.png',width: 82,height: 99,showRuler: false},
      {name: 'Chair',code: 'chair',image: '/image/others/add-image.png',width: 44,height: 57,showRuler: false},
      {name: 'Chair',code: 'chair-2',image: '/image/others/add-image.png',width: 47,height: 52,showRuler: false},
      {name: 'Fireplace',code: 'fireplace',image: '/image/others/add-image.png',width: 100,height: 60,showRuler: false},
      {name: 'Tv',code: 'tv',image: '/image/others/add-image.png',width: 100,height: 8,showRuler: false},
      {name: 'Stereo',code: 'stereo',image: '/image/others/add-image.png',width: 44,height: 40,showRuler: false},
      {name: 'Speaker',code: 'speaker',image: '/image/others/add-image.png',width: 20,height: 28,showRuler: false},
      {name: 'Billiard table',code: 'billiard-table',image: '/image/others/add-image.png',width: 262,height: 150,showRuler: false},
    ]
  },
  {
    id: 5,
    name: 'Bedroom',
    children: [
      {name: 'Bed',code: 'bed',image: '/svg/bed.svg',width: 160,height: 200,showRuler: false},
      {name: 'Bunk bed',code: 'bunk_bed',image: '/svg/bunk_bed.svg',width: 95,height: 208,showRuler: false},
      {name: 'Crib',code: 'crib',image: '/svg/crib.svg',width: 65,height: 124,showRuler: false},
    ]
  },
  {
    id: 6,
    name: 'Kitchen',
    children: [
      {name: 'Corner cabinet',code: 'corner-cabinet',image: '/image/others/add-image.png',width: 90,height: 31,showRuler: false},
      {name: 'Corner cabinet',code: 'corner-cabinet-2',image: '/image/others/add-image.png',width: 63,height: 63,showRuler: false},
      {name: 'Lower corner cabinet',code: 'lower-corner-cabinet',image: '/image/others/add-image.png',width: 90,height: 60,showRuler: false},
      {name: 'Lower corner cabinet',code: 'lower-corner-cabinet-2',image: '/image/others/add-image.png',width: 90,height: 90,showRuler: false},
      {name: 'Stove',code: 'stove',image: '/image/others/add-image.png',width: 60,height: 60,showRuler: false},
      {name: 'Oven',code: 'oven',image: '/image/others/add-image.png',width: 60,height: 58,showRuler: false},
      {name: 'Dishwasher',code: 'dishwasher',image: '/image/others/add-image.png',width: 60,height: 59,showRuler: false},
      {name: 'Microwave',code: 'microwave',image: '/image/others/add-image.png',width: 46,height: 34,showRuler: false},
      {name: 'Coffee machine',code: 'coffee-machine',image: '/image/others/add-image.png',width: 20,height: 30,showRuler: false},
      {name: 'Kettle',code: 'kettle',image: '/image/others/add-image.png',width: 15,height: 22,showRuler: false},
      {name: 'Hood',code: 'hood',image: '/image/others/add-image.png',width: 60,height: 50,showRuler: false},
      {name: 'Fridge',code: 'fridge',image: '/image/others/add-image.png',width: 60,height: 60,showRuler: false},
      {name: 'Kitchen sink',code: 'kitchen-sink',image: '/image/others/add-image.png',width: 85,height: 45,showRuler: false},
      {name: 'Double sink',code: 'double-sink',image: '/image/others/add-image.png',width: 85,height: 45,showRuler: false},
    ]
  },
  {
    id: 7,
    name: 'Bathroom',
    children: [
      {name: 'Bathtub',code: 'bathtub',image: '/image/others/add-image.png',width: 150,height: 70,showRuler: false},
      {name: 'Corner bathtub',code: 'corner-bathtub',image: '/image/others/add-image.png',width: 180,height: 90,showRuler: false},
      {name: 'Bathtub asymmetric',code: 'bathtub-asymmetric',image: '/image/others/add-image.png',width: 160,height: 90,showRuler: false},
      {name: 'Jacuzzi',code: 'jacuzzi',image: '/image/others/add-image.png',width: 152,height: 152,showRuler: false,keepRatio: true},
      {name: 'Shower',code: 'shower',image: '/image/others/add-image.png',width: 80,height: 80,showRuler: false},
      {name: 'Shower round',code: 'shower-round',image: '/image/others/add-image.png',width: 80,height: 80,showRuler: false,keepRatio: true},
      {name: 'Shower corner',code: 'shower-corner',image: '/image/others/add-image.png',width: 80,height: 80,showRuler: false},
      {name: 'Shower corner',code: 'shower-corner-2',image: '/image/others/add-image.png',width: 80,height: 80,showRuler: false,resizeEnabled: false},
      {name: 'Toilet',code: 'toilet',image: '/image/others/add-image.png',width: 36,height: 55,showRuler: false},
      {name: 'Hung toilet',code: 'hung-toilet',image: '/image/others/add-image.png',width: 37,height: 57,showRuler: false},
      {name: 'Toilet button',code: 'toilet-button',image: '/image/others/add-image.png',width: 25,height: 1,showRuler: false},
      {name: 'Brush',code: 'brush',image: '/image/others/add-image.png',width: 9,height: 9,showRuler: false,keepRatio: true},
      {name: 'Urinal',code: 'urinal',image: '/image/others/add-image.png',width: 40,height: 33,showRuler: false},
      {name: 'Bidet',code: 'bidet',image: '/image/others/add-image.png',width: 36,height: 57,showRuler: false},
      {name: 'Bidet shower',code: 'bidet-shower',image: '/image/others/add-image.png',width: 13,height: 7,showRuler: false},
      {name: 'Handbasin',code: 'handbasin',image: '/image/others/add-image.png',width: 60,height: 40,showRuler: false},
      {name: 'Rectangular handbasin',code: 'rectangular-handbasin',image: '/image/others/add-image.png',width: 60,height: 40,showRuler: false},
      {name: 'Corner handbasin',code: 'corner-handbasin',image: '/image/others/add-image.png',width: 45,height: 45,showRuler: false,keepRatio: true},
      {name: 'Radiator',code: 'radiator',image: '/image/others/add-image.png',width: 60,height: 8,showRuler: false},
      {name: 'Mirror',code: 'mirror',image: '/image/others/add-image.png',width: 94,height: 1,showRuler: false},
      {name: 'Toilet paper',code: 'toilet-paper',image: '/image/others/add-image.png',width: 3,height: 3,showRuler: false,resizeEnabled: false},
      {name: 'Washing machine',code: 'washing-machine',image: '/image/others/add-image.png',width: 60,height: 60,showRuler: false},
      {name: 'Dryer',code: 'dryer',image: '/image/others/add-image.png',width: 60,height: 64,showRuler: false},
      {name: 'Water heater',code: 'water-heater',image: '/image/others/add-image.png',width: 40,height: 40,showRuler: false,keepRatio: true},
      {name: 'Floor drain',code: 'floor-drain',image: '/image/others/add-image.png',width: 20,height: 20,showRuler: false,keepRatio: true},
    ]
  },
  {
    id: 8,
    name: 'Office',
    children: [
      {name: 'Desk',code: 'desk',image: '/image/others/add-image.png',width: 160,height: 80,showRuler: false},
      {name: 'Desk lamp',code: 'desk-lamp',image: '/image/others/add-image.png',width: 19,height: 38,showRuler: false},
      {name: 'Under desk cabinet',code: 'under-desk-cabinet',image: '/image/others/add-image.png',width: 45,height: 60,showRuler: false},
      {name: 'Chair',code: 'chair-3',image: '/image/others/add-image.png',width: 60,height: 60,showRuler: false,keepRatio: true},
      {name: 'Monitor',code: 'monitor',image: '/image/others/add-image.png',width: 54,height: 16,showRuler: false},
      {name: 'Laptop',code: 'laptop',image: '/image/others/add-image.png',width: 31,height: 24,showRuler: false},
      {name: 'Computer',code: 'computer',image: '/image/others/add-image.png',width: 17,height: 48,showRuler: false},
      {name: 'Keyboard',code: 'keyboard',image: '/image/others/add-image.png',width: 29,height: 11,showRuler: false},
      {name: 'Mouse',code: 'mouse',image: '/image/others/add-image.png',width: 7,height: 13,showRuler: false},
      {name: 'Printer',code: 'printer',image: '/image/others/add-image.png',width: 41,height: 46,showRuler: false},
      {name: 'Water dispenser',code: 'water-dispenser',image: '/image/others/add-image.png',width: 32,height: 32,showRuler: false},
      {name: 'Trash can',code: 'trash-can',image: '/image/others/add-image.png',width: 30,height: 30,showRuler: false},

    ]
  },
  {
    id: 9,
    name: 'Outdoor',
    children: [
      {name: 'Sedan',code: 'sedan',image: '/image/others/add-image.png',width: 219,height: 490,showRuler: false},
      {name: 'SUV',code: 'SUV',image: '/image/others/add-image.png',width: 223,height: 495,showRuler: false},
      {name: 'Pickup',code: 'pickup',image: '/image/others/add-image.png',width: 232,height: 535,showRuler: false},
      {name: 'Motorbike',code: 'motorbike',image: '/image/others/add-image.png',width: 91,height: 219,showRuler: false},
      {name: 'Tricycle',code: 'tricycle',image: '/image/others/add-image.png',width: 51,height: 103,showRuler: false},
      {name: 'Tree big',code: 'tree-big',image: '/image/others/add-image.png',width: 450,height: 450,showRuler: false,keepRatio: true},
      {name: 'Tree medium',code: 'tree-medium',image: '/image/others/add-image.png',width: 300,height: 300,showRuler: false,keepRatio: true},
      {name: 'Tree small',code: 'tree-small',image: '/image/others/add-image.png',width: 100,height: 100,showRuler: false,keepRatio: true},
      {name: 'Palm tree',code: 'palm-tree',image: '/image/others/add-image.png',width: 515,height: 580,showRuler: false},
      {name: 'Thuja',code: 'thuja',image: '/image/others/add-image.png',width: 50,height: 50,showRuler: false,keepRatio: true},
      {name: 'Grass',code: 'grass',image: '/image/others/add-image.png',width: 50,height: 50,showRuler: false},
      {name: 'Pergola',code: 'pergola',image: '/image/others/add-image.png',width: 150,height: 60,showRuler: false},
      {name: 'Jacuzzi',code: 'jacuzzi',image: '/image/others/add-image.png',width: 226,height: 226,showRuler: false},
      {name: 'Swing chair',code: 'swing-chair',image: '/image/others/add-image.png',width: 230,height: 135,showRuler: false},
    ]
  },
  // {
  //   id: 10,
  //   name: 'Electrical',
  //   children: [
      
  //   ]
  // },
  // {
  //   id: 11,
  //   name: 'Fire survey',
  //   children: [

  //   ]
  // },
]
