/**
 * Dummy product data for the shopping mall
 * Each product contains: name, images, date, category, price
 */

import motion1 from '../assets/product/1-motion.mp4';
import img1_1 from '../assets/product/1-1.png';
import img1_2 from '../assets/product/1-2.png';
import motion2 from '../assets/product/2-motion.mp4';
import img2_1 from '../assets/product/2-1.png';
import img2_2 from '../assets/product/2-2.png';
import motion3 from '../assets/product/3-motion.mp4';
import img3_1 from '../assets/product/3-1.png';
import img3_2 from '../assets/product/3-2.png';
import motion4 from '../assets/product/4-motion.mp4';
import img4_1 from '../assets/product/4-1.png';
import img4_2 from '../assets/product/4-2.png';
import motion5 from '../assets/product/5-motion.mp4';
import img5_1 from '../assets/product/5-1.png';
import img5_2 from '../assets/product/5-2.png';
import motion6 from '../assets/product/6-motion.mp4';
import img6_1 from '../assets/product/6-1.png';
import img6_2 from '../assets/product/6-2.png';
import motion7 from '../assets/product/7-motion.mp4';
import img7_1 from '../assets/product/7-1.png';
import img7_2 from '../assets/product/7-2.png';
import motion8 from '../assets/product/8-motion.mp4';
import img8_1 from '../assets/product/8-1.png';
import img8_2 from '../assets/product/8-2.png';

const products = [
  {
    id: 1,
    name: 'White Hoodie',
    images: [
      motion1,
      img1_1,
      img1_2,
    ],
    date: '2024-01-15',
    category: 'female',
    price: 89.99,
    color: 'white',
  },
  {
    id: 2,
    name: 'Black Blazer',
    images: [
      motion2,
      img2_1,
      img2_2,
    ],
    date: '2024-01-18',
    category: 'female',
    price: 149.99,
    color: 'black',
  },
  {
    id: 3,
    name: 'White Pants',
    images: [
      motion3,
      img3_1,
      img3_2,
    ],
    date: '2024-01-20',
    category: 'male',
    price: 79.99,
    color: 'white',
  },
  {
    id: 4,
    name: 'Black Shorts',
    images: [
      motion4,
      img4_1,
      img4_2,
    ],
    date: '2024-01-22',
    category: 'female',
    price: 49.99,
    color: 'black',
  },
  {
    id: 5,
    name: 'White Shirt',
    images: [
      motion5,
      img5_1,
      img5_2,
    ],
    date: '2024-01-25',
    category: 'male',
    price: 59.99,
    color: 'white',
  },
  {
    id: 6,
    name: 'Black Leather Jacket',
    images: [
      motion6,
      img6_1,
      img6_2,
    ],
    date: '2024-02-01',
    category: 'female',
    price: 249.99,
    color: 'black',
  },
  {
    id: 7,
    name: 'Black Blazer',
    images: [
      motion7,
      img7_1,
      img7_2,
    ],
    date: '2024-02-05',
    category: 'male',
    price: 149.99,
    color: 'black',
  },
  {
    id: 8,
    name: 'Black Sneakers',
    images: [
      motion8,
      img8_1,
      img8_2,
    ],
    date: '2024-02-08',
    category: 'male',
    price: 129.99,
    color: 'black',
  },
  {
    id: 9,
    name: 'White Hoodie',
    images: [
      motion1,
      img1_1,
      img1_2,
    ],
    date: '2024-02-12',
    category: 'female',
    price: 89.99,
    color: 'white',
  },
  {
    id: 10,
    name: 'Black Blazer',
    images: [
      motion2,
      img2_1,
      img2_2,
    ],
    date: '2024-02-15',
    category: 'female',
    price: 149.99,
    color: 'black',
  },
  {
    id: 11,
    name: 'White Pants',
    images: [
      motion3,
      img3_1,
      img3_2,
    ],
    date: '2024-02-18',
    category: 'male',
    price: 79.99,
    color: 'white',
  },
  {
    id: 12,
    name: 'Black Shorts',
    images: [
      motion4,
      img4_1,
      img4_2,
    ],
    date: '2024-02-22',
    category: 'female',
    price: 49.99,
    color: 'black',
  },
  {
    id: 13,
    name: 'White Shirt',
    images: [
      motion5,
      img5_1,
      img5_2,
    ],
    date: '2024-02-25',
    category: 'male',
    price: 59.99,
    color: 'white',
  },
  {
    id: 14,
    name: 'Black Leather Jacket',
    images: [
      motion6,
      img6_1,
      img6_2,
    ],
    date: '2024-03-01',
    category: 'female',
    price: 249.99,
    color: 'black',
  },
  {
    id: 15,
    name: 'Black Blazer',
    images: [
      motion7,
      img7_1,
      img7_2,
    ],
    date: '2024-03-05',
    category: 'male',
    price: 149.99,
    color: 'black',
  },
  {
    id: 16,
    name: 'Black Sneakers',
    images: [
      motion8,
      img8_1,
      img8_2,
    ],
    date: '2024-03-08',
    category: 'male',
    price: 129.99,
    color: 'black',
  },
  {
    id: 17,
    name: 'White Hoodie',
    images: [
      motion1,
      img1_1,
      img1_2,
    ],
    date: '2024-03-12',
    category: 'female',
    price: 89.99,
    color: 'white',
  },
  {
    id: 18,
    name: 'Black Blazer',
    images: [
      motion2,
      img2_1,
      img2_2,
    ],
    date: '2024-03-15',
    category: 'female',
    price: 149.99,
    color: 'black',
  },
  {
    id: 19,
    name: 'White Pants',
    images: [
      motion3,
      img3_1,
      img3_2,
    ],
    date: '2024-03-18',
    category: 'male',
    price: 79.99,
    color: 'white',
  },
  {
    id: 20,
    name: 'Black Shorts',
    images: [
      motion4,
      img4_1,
      img4_2,
    ],
    date: '2024-03-22',
    category: 'female',
    price: 49.99,
    color: 'black',
  },
  {
    id: 21,
    name: 'White Shirt',
    images: [
      motion5,
      img5_1,
      img5_2,
    ],
    date: '2024-03-25',
    category: 'male',
    price: 59.99,
    color: 'white',
  },
  {
    id: 22,
    name: 'Black Leather Jacket',
    images: [
      motion6,
      img6_1,
      img6_2,
    ],
    date: '2024-03-28',
    category: 'female',
    price: 249.99,
    color: 'black',
  },
  {
    id: 23,
    name: 'Black Blazer',
    images: [
      motion7,
      img7_1,
      img7_2,
    ],
    date: '2024-04-01',
    category: 'male',
    price: 149.99,
    color: 'black',
  },
  {
    id: 24,
    name: 'Black Sneakers',
    images: [
      motion8,
      img8_1,
      img8_2,
    ],
    date: '2024-04-05',
    category: 'male',
    price: 129.99,
    color: 'black',
  },
  {
    id: 25,
    name: 'White Hoodie',
    images: [
      motion1,
      img1_1,
      img1_2,
    ],
    date: '2024-04-08',
    category: 'female',
    price: 89.99,
    color: 'white',
  },
  {
    id: 26,
    name: 'Black Blazer',
    images: [
      motion2,
      img2_1,
      img2_2,
    ],
    date: '2024-04-12',
    category: 'female',
    price: 149.99,
    color: 'black',
  },
  {
    id: 27,
    name: 'White Pants',
    images: [
      motion3,
      img3_1,
      img3_2,
    ],
    date: '2024-04-15',
    category: 'male',
    price: 79.99,
    color: 'white',
  },
  {
    id: 28,
    name: 'Black Shorts',
    images: [
      motion4,
      img4_1,
      img4_2,
    ],
    date: '2024-04-18',
    category: 'female',
    price: 49.99,
    color: 'black',
  },
  {
    id: 29,
    name: 'White Shirt',
    images: [
      motion5,
      img5_1,
      img5_2,
    ],
    date: '2024-04-22',
    category: 'male',
    price: 59.99,
    color: 'white',
  },
  {
    id: 30,
    name: 'Black Leather Jacket',
    images: [
      motion6,
      img6_1,
      img6_2,
    ],
    date: '2024-04-25',
    category: 'female',
    price: 249.99,
    color: 'black',
  },
  {
    id: 31,
    name: 'Black Blazer',
    images: [
      motion7,
      img7_1,
      img7_2,
    ],
    date: '2024-04-28',
    category: 'male',
    price: 149.99,
    color: 'black',
  },
  {
    id: 32,
    name: 'Black Sneakers',
    images: [
      motion8,
      img8_1,
      img8_2,
    ],
    date: '2024-05-01',
    category: 'male',
    price: 129.99,
    color: 'black',
  },
];

export default products;
