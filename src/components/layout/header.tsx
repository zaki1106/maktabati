
"use client";
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, Linkedin, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { BookOpen, Info, Code, Database } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function Header() {
  const { isAdminAuthenticated, logoutAdmin } = useAppContext();
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-headline text-lg font-semibold text-primary">مكتبتي</span>
      </Link>
      <div className="flex-1" />
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
          الرئيسية
        </Link>
        <Link href="/admin/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
          الإدارة
        </Link>
      </nav>
      <div className="flex-1" />
      
      {isAdminPage && isAdminAuthenticated && (
        <div className='flex items-center gap-2'>
            <Button asChild variant="ghost" size="icon" className="rounded-full">
                <Link href="/admin/settings">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">الإعدادات</span>
                </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={logoutAdmin} title="تسجيل الخروج">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">تسجيل الخروج</span>
            </Button>
        </div>
      )}

      {!isAdminPage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">الملف الشخصي</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>About Me</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-default">
                <Linkedin className="me-2 h-4 w-4" />
                <span>houache zakaria</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-default">
                  <Briefcase className="me-2 h-4 w-4" />
                  <span>zakaria-houache.vercal.app/</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      )}
    </header>
  );
}
