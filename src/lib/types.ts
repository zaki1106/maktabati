export interface Category {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  name: string;
  author: string;
  placementNumber: string;
  categoryId: string;
  status: 'available' | 'requested' | 'borrowed';
  borrowerName?: string;
  borrowDate?: Date;
  returnDate?: Date;
  dueDate?: Date;
  coverImageId: string;
  coverImageUrl?: string;
}
