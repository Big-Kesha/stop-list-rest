import type { MenuItem } from '@/types/menu';

const today = new Date();

const minutesFromNow = (m: number) =>
  new Date(today.getTime() + m * 60 * 1000).toISOString();

const hoursFromNow = (h: number) =>
  new Date(today.getTime() + h * 60 * 60 * 1000).toISOString();

const now = today.toISOString();

const in15Minutes = minutesFromNow(15);
const in5Hours = hoursFromNow(5);
const in23Hours = hoursFromNow(23);

export const SEED: MenuItem[] = [
  // Кухня — 6 позиций
  {
    id: 'k1',
    title: 'Борщ',
    shop: 'kitchen',
    stock: 12,
    status: { kind: 'available' },
    updatedAt: now,
  },
  {
    id: 'k2',
    title: 'Цезарь с курицей',
    shop: 'kitchen',
    stock: 7,
    status: { kind: 'available' },
    updatedAt: now,
  },
  {
    id: 'k3',
    title: 'Стейк рибай',
    shop: 'kitchen',
    stock: 0,
    status: { kind: 'stopped', reason: 'out_of_stock', until: null },
    updatedAt: now,
  },
  {
    id: 'k4',
    title: 'Паста карбонара',
    shop: 'kitchen',
    stock: 9,
    status: { kind: 'available' },
    updatedAt: now,
  },
  {
    id: 'k5',
    title: 'Том Ям',
    shop: 'kitchen',
    stock: 4,
    status: { kind: 'available' },
    updatedAt: now,
  },
  {
    id: 'k6',
    title: 'Бургер классический',
    shop: 'kitchen',
    stock: 0,
    status: { kind: 'stopped', reason: 'equipment', until: in5Hours },
    updatedAt: now,
  },

  // Бар — 5 позиций
  {
    id: 'b1',
    title: 'Апероль шприц',
    shop: 'bar',
    stock: 15,
    status: { kind: 'available' },
    updatedAt: now,
  },
  {
    id: 'b2',
    title: 'Негрони',
    shop: 'bar',
    stock: 8,
    status: { kind: 'available' },
    updatedAt: now,
  },
  {
    id: 'b3',
    title: 'Пиво крафт IPA',
    shop: 'bar',
    stock: 0,
    status: { kind: 'stopped', reason: 'quality', until: in15Minutes },
    updatedAt: now,
  },
  {
    id: 'b4',
    title: 'Лимонад домашний',
    shop: 'bar',
    stock: 20,
    status: { kind: 'available' },
    updatedAt: now,
  },
  {
    id: 'b5',
    title: 'Эспрессо-мартини',
    shop: 'bar',
    stock: 6,
    status: { kind: 'available' },
    updatedAt: now,
  },

  // Кондитерская — 4 позиции
  {
    id: 'p1',
    title: 'Чизкейк Нью-Йорк',
    shop: 'pastry',
    stock: 10,
    status: { kind: 'available' },
    updatedAt: now,
  },
  {
    id: 'p2',
    title: 'Тирамису',
    shop: 'pastry',
    stock: 0,
    status: { kind: 'stopped', reason: 'menu_change', until: in23Hours },
    updatedAt: now,
  },
  {
    id: 'p3',
    title: 'Круассан',
    shop: 'pastry',
    stock: 14,
    status: { kind: 'available' },
    updatedAt: now,
  },
  {
    id: 'p4',
    title: 'Медовик',
    shop: 'pastry',
    stock: 5,
    status: { kind: 'available' },
    updatedAt: now,
  },
];
