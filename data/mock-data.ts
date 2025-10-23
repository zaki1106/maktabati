import type { Book, Category } from '@/lib/types';

export const initialCategories: Category[] = [
  {
    "id": "1",
    "name": "أدب"
  },
  {
    "id": "2",
    "name": "تاريخ"
  },
  {
    "id": "3",
    "name": "علوم"
  },
  {
    "id": "4",
    "name": "تطوير ذات"
  }
];

export const initialBooks: Book[] = [
  {
    "id": "1",
    "name": "ثلاثية غرناطة",
    "author": "رضوى عاشور",
    "placementNumber": "A-101",
    "categoryId": "1",
    "status": "available",
    "coverImageId": "book1"
  },
  {
    "id": "2",
    "name": "مقدمة ابن خلدون",
    "author": "ابن خلدون",
    "placementNumber": "B-205",
    "categoryId": "2",
    "status": "available",
    "coverImageId": "book2"
  },
  {
    "id": "3",
    "name": "قصة الخلق",
    "author": "نيل ديغراس تايسون",
    "placementNumber": "C-310",
    "categoryId": "3",
    "status": "requested",
    "borrowerName": "أحمد",
    "coverImageId": "book3"
  },
  {
    "id": "4",
    "name": "فن اللامبالاة",
    "author": "مارك مانسون",
    "placementNumber": "D-415",
    "categoryId": "4",
    "status": "borrowed",
    "borrowerName": "فاطمة",
    "borrowDate": "2024-05-15T00:00:00.000Z",
    "coverImageId": "book4"
  },
  {
    "id": "5",
    "name": "الحرب والسلم",
    "author": "ليو تولستوي",
    "placementNumber": "A-102",
    "categoryId": "1",
    "status": "available",
    "coverImageId": "book5"
  },
  {
    "id": "6",
    "name": "تاريخ موجز للزمان",
    "author": "ستيفن هوكينج",
    "placementNumber": "C-311",
    "categoryId": "3",
    "status": "available",
    "coverImageId": "book6"
  },
  {
    "id": "1760863369349",
    "name": "اليوم الاول في العالم",
    "author": "حواش",
    "placementNumber": "101",
    "categoryId": "3",
    "status": "available",
    "coverImageId": "book516",
    "coverImageUrl": ""
  }
];
