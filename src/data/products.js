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

const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    images: [
      motion1,
      img1_1,
      img1_2,
    ],
    date: '2024-01-15',
    category: 'male',
    price: 29.99,
  },
  {
    id: 2,
    name: 'Black Denim Jeans',
    images: [
      motion2,
      img2_1,
      img2_2,
    ],
    date: '2024-01-18',
    category: 'male',
    price: 79.99,
  },
  {
    id: 3,
    name: 'Elegant Black Dress',
    images: [
      motion3,
      img3_1,
      img3_2,
    ],
    date: '2024-01-20',
    category: 'female',
    price: 129.99,
  },
  {
    id: 4,
    name: 'Cotton Hoodie',
    images: [
      motion4,
      img4_1,
      img4_2,
    ],
    date: '2024-01-22',
    category: 'male',
    price: 59.99,
  },
  {
    id: 5,
    name: 'Silk Blouse',
    images: [
      motion5,
      img5_1,
      img5_2,
    ],
    date: '2024-01-25',
    category: 'female',
    price: 89.99,
  },
  {
    id: 6,
    name: 'Leather Jacket',
    images: [
      motion6,
      img6_1,
      img6_2,
    ],
    date: '2024-02-01',
    category: 'male',
    price: 249.99,
  },
  {
    id: 7,
    name: 'Casual Shorts',
    images: [
      motion1,
      img1_1,
      img1_2,
    ],
    date: '2024-02-05',
    category: 'male',
    price: 39.99,
  },
  {
    id: 8,
    name: 'Knit Sweater',
    images: [
      motion2,
      img2_1,
      img2_2,
    ],
    date: '2024-02-08',
    category: 'female',
    price: 69.99,
  },
  {
    id: 9,
    name: 'Wide Leg Pants',
    images: [
      motion3,
      img3_1,
      img3_2,
    ],
    date: '2024-02-12',
    category: 'female',
    price: 89.99,
  },
  {
    id: 10,
    name: 'Striped Polo Shirt',
    images: [
      motion4,
      img4_1,
      img4_2,
    ],
    date: '2024-02-15',
    category: 'male',
    price: 44.99,
  },
  {
    id: 11,
    name: 'Pleated Skirt',
    images: [
      motion5,
      img5_1,
      img5_2,
    ],
    date: '2024-02-18',
    category: 'female',
    price: 59.99,
  },
  {
    id: 12,
    name: 'Formal Blazer',
    images: [
      motion6,
      img6_1,
      img6_2,
    ],
    date: '2024-02-22',
    category: 'male',
    price: 199.99,
  },
  {
    id: 13,
    name: 'Crop Top',
    images: [
      motion1,
      img1_1,
      img1_2,
    ],
    date: '2024-02-25',
    category: 'female',
    price: 34.99,
  },
  {
    id: 14,
    name: 'Cargo Pants',
    images: [
      motion2,
      img2_1,
      img2_2,
    ],
    date: '2024-03-01',
    category: 'male',
    price: 74.99,
  },
  {
    id: 15,
    name: 'Wrap Dress',
    images: [
      motion3,
      img3_1,
      img3_2,
    ],
    date: '2024-03-05',
    category: 'female',
    price: 119.99,
  },
  {
    id: 16,
    name: 'Tank Top',
    images: [
      motion4,
      img4_1,
      img4_2,
    ],
    date: '2024-03-08',
    category: 'male',
    price: 24.99,
  },
  {
    id: 17,
    name: 'Cardigan',
    images: [
      motion5,
      img5_1,
      img5_2,
    ],
    date: '2024-03-12',
    category: 'female',
    price: 79.99,
  },
  {
    id: 18,
    name: 'Chino Pants',
    images: [
      motion6,
      img6_1,
      img6_2,
    ],
    date: '2024-03-15',
    category: 'male',
    price: 64.99,
  },
  {
    id: 19,
    name: 'Maxi Dress',
    images: [
      motion1,
      img1_1,
      img1_2,
    ],
    date: '2024-03-18',
    category: 'female',
    price: 139.99,
  },
  {
    id: 20,
    name: 'Denim Jacket',
    images: [
      motion2,
      img2_1,
      img2_2,
    ],
    date: '2024-03-22',
    category: 'male',
    price: 109.99,
  },
  {
    id: 21,
    name: 'Turtleneck',
    images: [
      motion3,
      img3_1,
      img3_2,
    ],
    date: '2024-03-25',
    category: 'female',
    price: 54.99,
  },
  {
    id: 22,
    name: 'Track Pants',
    images: [
      motion4,
      img4_1,
      img4_2,
    ],
    date: '2024-03-28',
    category: 'male',
    price: 49.99,
  },
  {
    id: 23,
    name: 'Midi Skirt',
    images: [
      motion5,
      img5_1,
      img5_2,
    ],
    date: '2024-04-01',
    category: 'female',
    price: 69.99,
  },
  {
    id: 24,
    name: 'Bomber Jacket',
    images: [
      motion6,
      img6_1,
      img6_2,
    ],
    date: '2024-04-05',
    category: 'male',
    price: 159.99,
  },
  {
    id: 25,
    name: 'Camisole',
    images: [
      motion1,
      img1_1,
      img1_2,
    ],
    date: '2024-04-08',
    category: 'female',
    price: 29.99,
  },
  {
    id: 26,
    name: 'Oxford Shirt',
    images: [
      motion2,
      img2_1,
      img2_2,
    ],
    date: '2024-04-12',
    category: 'male',
    price: 54.99,
  },
  {
    id: 27,
    name: 'High Waist Jeans',
    images: [
      motion3,
      img3_1,
      img3_2,
    ],
    date: '2024-04-15',
    category: 'female',
    price: 84.99,
  },
  {
    id: 28,
    name: 'Sweatshirt',
    images: [
      motion4,
      img4_1,
      img4_2,
    ],
    date: '2024-04-18',
    category: 'male',
    price: 49.99,
  },
  {
    id: 29,
    name: 'Pencil Skirt',
    images: [
      motion5,
      img5_1,
      img5_2,
    ],
    date: '2024-04-22',
    category: 'female',
    price: 64.99,
  },
  {
    id: 30,
    name: 'Windbreaker',
    images: [
      motion6,
      img6_1,
      img6_2,
    ],
    date: '2024-04-25',
    category: 'male',
    price: 94.99,
  },
];

export default products;
