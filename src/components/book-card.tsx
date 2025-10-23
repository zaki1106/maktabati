"use client";

import Image from "next/image";
import type { Book } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { requestBorrow } = useAppContext();
  const placeholder = PlaceHolderImages.find(p => p.id === book.coverImageId);
  
  const imageUrl = book.coverImageUrl || placeholder?.imageUrl || `https://picsum.photos/seed/${book.id}/300/400`;
  const imageHint = book.coverImageUrl ? 'custom upload' : (placeholder?.imageHint || 'book cover');


  const getStatusBadge = () => {
    switch (book.status) {
      case 'available':
        return <Badge variant="secondary"><CheckCircle className="me-1 h-3 w-3" />متاح</Badge>;
      case 'requested':
        return <Badge variant="outline"><Clock className="me-1 h-3 w-3" />مطلوب</Badge>;
      case 'borrowed':
        return <Badge variant="destructive"><AlertTriangle className="me-1 h-3 w-3" />معار</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={imageUrl}
          alt={`غلاف كتاب ${book.name}`}
          width={300}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={imageHint}
        />
         <div className="absolute top-2 end-2">
            {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="font-headline text-lg mb-1">{book.name}</CardTitle>
        <CardDescription className="text-sm">{book.author}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => requestBorrow(book.id)}
          disabled={book.status !== 'available'}
        >
          اطلب استعارة
        </Button>
      </CardFooter>
    </Card>
  );
}
