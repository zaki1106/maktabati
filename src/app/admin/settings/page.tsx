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
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';

const settingsFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "الرجاء إدخال كلمة المرور الحالية." }),
  newPassword: z.string().min(6, { message: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل." }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});


type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function AdminSettingsPage() {
  const { changeAdminPassword } = useAppContext();
  const { toast } = useToast();
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: SettingsFormValues) {
    const success = changeAdminPassword(data.currentPassword, data.newPassword);
    if (success) {
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تحديث كلمة مرور المسؤول بنجاح.",
      });
      form.reset();
    } else {
        toast({
            title: "خطأ",
            description: "كلمة المرور الحالية غير صحيحة.",
            variant: "destructive",
        });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-center flex items-center justify-center gap-2">
                <KeyRound />
                إعدادات المسؤول
            </CardTitle>
            <CardDescription className="text-center">تغيير كلمة مرور الوصول للوحة الإدارة.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>كلمة المرور الحالية</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>كلمة المرور الجديدة</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full">تغيير كلمة المرور</Button>
            </form>
            </Form>
        </CardContent>
        </Card>
    </div>
  );
}
