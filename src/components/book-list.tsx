"use client";

import { useAppContext } from "@/context/AppContext";
import { BookCard } from "@/components/book-card";
import type { Book } from '@/lib/types';

interface BookListProps {
  books: Book[];
}

export function BookList({ books }: BookListProps) {
  const { categories } = useAppContext();

  return (
    <div className="space-y-12">
      {categories.map((category) => {
        const booksInCategory = books.filter(
          (book) => book.categoryId === category.id
        );
        if (booksInCategory.length === 0) return null;

        return (
          <section key={category.id}>
            <h2 className="text-2xl font-headline font-semibold mb-6 border-b-2 border-primary pb-2 text-primary">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {booksInCategory.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
