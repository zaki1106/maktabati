"use client"

import { useState } from "react";
import { BookList } from "@/components/book-list";
import { Input } from "@/components/ui/input";
import { Search, Layers } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const { books, categories } = useAppContext();

const filteredBooks = books.filter((book) => {
  if (!book || !book.name || !book.author) return false;

  const matchesSearch =
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory =
    selectedCategoryId === "all" || book.categoryId === selectedCategoryId;

  return matchesSearch && matchesCategory;
});

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          استكشف مكتبتنا
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          تصفح مجموعتنا الواسعة من الكتب عبر مختلف الفئات.
        </p>
      </div>
      <div className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث عن كتاب أو مؤلف..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger>
              <Layers className="h-5 w-5 text-muted-foreground" />
              <SelectValue placeholder="اختر فئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفئات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <BookList books={filteredBooks} />
    </div>
  );
}
