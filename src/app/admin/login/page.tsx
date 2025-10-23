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

const loginFormSchema = z.object({
  code: z.string().min(1, { message: "الرجاء إدخال الرمز." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function AdminLoginPage() {
  const { loginAdmin } = useAppContext();
  const router = useRouter();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    const loggedIn = loginAdmin(data.code);
    if (loggedIn) {
      router.push('/admin/dashboard');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-sm w-full">
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">دخول الإدارة</CardTitle>
            <CardDescription className="text-center">الرجاء إدخال رمز الدخول للمتابعة.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>رمز الدخول</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full">دخول</Button>
            </form>
            </Form>
        </CardContent>
        </Card>
    </div>
  );
}
