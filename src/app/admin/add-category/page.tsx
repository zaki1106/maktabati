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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Layers } from 'lucide-react';

const categoryFormSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يكون اسم الفئة من حرفين على الأقل." }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function AddCategoryPage() {
  const { addCategory } = useAppContext();
  const router = useRouter();
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: CategoryFormValues) {
    addCategory(data);
    router.push('/admin/dashboard');
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Layers />
            إضافة فئة جديدة
        </CardTitle>
        <CardDescription>أدخل اسم الفئة الجديدة لإضافتها إلى المكتبة.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الفئة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: روايات خيال علمي" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">إضافة الفئة</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
