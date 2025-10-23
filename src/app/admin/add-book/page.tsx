"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppContext } from '@/context/AppContext';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const bookFormSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يكون الاسم من حرفين على الأقل." }),
  author: z.string().min(2, { message: "يجب أن يكون اسم المؤلف من حرفين على الأقل." }),
  placementNumber: z.string().min(1, { message: "حقل الرقم الموضعي مطلوب." }),
  categoryId: z.string({ required_error: "الرجاء اختيار فئة." }),
  coverImageUrl: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

export default function AddBookPage() {
  const { categories, addBook, books } = useAppContext();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      name: "",
      author: "",
      placementNumber: "",
      coverImageUrl: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('coverImageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };


  function onSubmit(data: BookFormValues) {
    const bookExists = books.some(
  (book) => book?.name?.toLowerCase() === data.name.toLowerCase()
);

    if (bookExists) {
        toast({
            title: "الكتاب موجود بالفعل",
            description: `كتاب بعنوان "${data.name}" موجود بالفعل في المكتبة.`,
            variant: "destructive",
        });
        return;
    }

    const bookData = {
      ...data,
      coverImageId: `book${Math.floor(Math.random() * 1000)}`,
    };

    addBook(bookData);
    router.push('/admin/dashboard');
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">إضافة كتاب جديد</CardTitle>
        <CardDescription>املأ التفاصيل لإضافة كتاب جديد إلى المكتبة.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الكتاب</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: ثلاثية غرناطة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المؤلف</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: رضوى عاشور" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="placementNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرقم الموضعي</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: A-101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فئة للكتاب" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
                <FormLabel>صورة الغلاف (اختياري)</FormLabel>
                <FormControl>
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                </FormControl>
                <FormMessage />
            </FormItem>

            {imagePreview && (
                <div className="mt-4">
                    <FormLabel>معاينة الصورة</FormLabel>
                    <div className="mt-2 relative w-32 h-48">
                        <Image src={imagePreview} alt="معاينة الغلاف" layout="fill" objectFit="cover" className="rounded-md" />
                    </div>
                </div>
            )}
            
            <Button type="submit" className="w-full">إضافة الكتاب</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
