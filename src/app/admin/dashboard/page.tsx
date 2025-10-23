
"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Settings, Calendar as CalendarIcon, Layers, BookCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { arDZ } from '@/lib/locale/ar-DZ';


export default function AdminDashboardPage() {
    const { books, approveBorrow, rejectBorrow,deletebook, returnBook } = useAppContext();
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const [borrowerName, setBorrowerName] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const requestedBooks = books.filter(b => b.status === 'requested');
    const borrowedBooks = books.filter(b => b.status === 'borrowed');

    const handleApproveClick = (bookId: string) => {
        setSelectedBookId(bookId);
        setDueDate(undefined);
        setBorrowerName("");
        setIsDialogOpen(true);
    };

    const handleConfirmApproval = () => {
        if (selectedBookId && dueDate && borrowerName) {
            approveBorrow(selectedBookId, dueDate, borrowerName);
            setIsDialogOpen(false);
            setSelectedBookId(null);
            setDueDate(undefined);
            setBorrowerName("");
        }
    };



    return (
        <div className="space-y-8">
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>تأكيد الاستعارة</DialogTitle>
                    <DialogDescription>
                        الرجاء إدخال اسم المستعير وتحديد تاريخ إرجاع الكتاب.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                           <Label htmlFor="borrowerName">اسم المستعير</Label>
                           <Input id="borrowerName" value={borrowerName} onChange={(e) => setBorrowerName(e.target.value)} placeholder="الاسم الكامل للمستعير" />
                        </div>
                        <div className="grid gap-2">
                            <Label>تاريخ الإرجاع</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "PPP", { locale: arDZ }) : <span>اختر تاريخ</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                    locale={arDZ}
                                    dir="rtl"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <DialogFooter>
                    <Button onClick={() => setIsDialogOpen(false)} variant="outline">إلغاء</Button>
                    <Button onClick={handleConfirmApproval} disabled={!dueDate || !borrowerName}>
                        تأكيد الموافقة
                    </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-headline font-bold">لوحة الإدارة</h1>
                    <p className="text-muted-foreground">إدارة طلبات الاستعارة والكتب المعارة.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/admin/add-book">
                            <PlusCircle className="me-2 h-4 w-4" />
                            إضافة كتاب
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/add-category">
                            <Layers className="me-2 h-4 w-4" />
                            إضافة فئة
                        </Link>
                    </Button>
                     <Button asChild variant="secondary">
                        <Link href="/admin/settings">
                            <Settings className="me-2 h-4 w-4" />
                            الإعدادات
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>طلبات الاستعارة الجديدة</CardTitle>
                    <CardDescription>الكتب التي طلب المستخدمون استعارتها.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">اسم الكتاب</TableHead>
                                    <TableHead className="text-right">المؤلف</TableHead>
                                    <TableHead className="text-right">الرقم الموضعي</TableHead>
                                    <TableHead className="text-center">إجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requestedBooks.length > 0 ? (
                                    requestedBooks.map(book => (
                                        <TableRow key={book.id}>
                                            <TableCell className="font-medium">{book.name}</TableCell>
                                            <TableCell>{book.author}</TableCell>
                                            <TableCell>{book.placementNumber}</TableCell>
                                            <TableCell className="text-center space-x-2 space-x-reverse">
                                                <Button size="sm" onClick={() => handleApproveClick(book.id)}>موافقة</Button>
                                                <Button size="sm" variant="outline" onClick={() => rejectBorrow(book.id)}>رفض</Button>
                                                <Button size="sm" onClick={() => deletebook(book.id)}>حذف الكتاب</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">لا توجد طلبات جديدة.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>الكتب المعارة حالياً</CardTitle>
                    <CardDescription>الكتب التي هي معارة للمستخدمين حالياً.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">اسم الكتاب</TableHead>
                                    <TableHead className="text-right">المستعير</TableHead>
                                    <TableHead className="text-right">تاريخ الاستعارة</TableHead>
                                    <TableHead className="text-right">تاريخ الإرجاع</TableHead>
                                    <TableHead className="text-center">إجراء</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {borrowedBooks.length > 0 ? (
                                    borrowedBooks.map(book => (
                                        <TableRow key={book.id}>
                                            <TableCell className="font-medium">{book.name}</TableCell>
                                            <TableCell>{book.borrowerName}</TableCell>
                                            <TableCell>{book.borrowDate ? format(book.borrowDate, 'PPP', { locale: arDZ }) : '-'}</TableCell>
                                            <TableCell>{book.dueDate ? format(book.dueDate, 'PPP', { locale: arDZ }) : '-'}</TableCell>
                                            <TableCell className="text-center">
                                                <Button size="sm" variant="outline" onClick={() => returnBook(book.id)}>
                                                    <BookCheck className="me-2 h-4 w-4" />
                                                    إرجاع
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">لا توجد كتب معارة حالياً.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    
