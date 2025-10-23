"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import type { Book, Category } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

// Initial data to prevent build issues
const initialCategories: Category[] = [
  { id: '1', name: 'أدب' },
  { id: '2', name: 'تاريخ' },
  { id: '3', name: 'علوم' },
  { id: '4', name: 'تطوير ذات' },
];

const initialBooks: Book[] = [
  { id: '1', name: 'ثلاثية غرناطة', author: 'رضوى عاشور', placementNumber: 'A-101', categoryId: '1', status: 'available', coverImageId: 'book1' },
  { id: '2', name: 'مقدمة ابن خلدون', author: 'ابن خلدون', placementNumber: 'B-205', categoryId: '2', status: 'available', coverImageId: 'book2' },
  { id: '3', name: 'قصة الخلق', author: 'نيل ديغراس تايسون', placementNumber: 'C-310', categoryId: '3', status: 'requested', borrowerName: 'أحمد', coverImageId: 'book3' },
  { id: '4', name: 'فن اللامبالاة', author: 'مارك مانسون', placementNumber: 'D-415', categoryId: '4', status: 'borrowed', borrowerName: 'فاطمة', borrowDate: new Date('2024-05-15'), coverImageId: 'book4' },
  { id: '5', name: 'الحرب والسلم', author: 'ليو تولستوي', placementNumber: 'A-102', categoryId: '1', status: 'available', coverImageId: 'book5' },
  { id: '6', name: 'تاريخ موجز للزمان', author: 'ستيفن هوكينج', placementNumber: 'C-311', categoryId: '3', status: 'available', coverImageId: 'book6' },
];

interface AppContextType {
  books: Book[];
  categories: Category[];
  addBook: (book: Omit<Book, 'id' | 'status'>) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  requestBorrow: (bookId: string) => Promise<void>;
  approveBorrow: (bookId: string, dueDate: Date, borrowerName: string) => Promise<void>;
  deletebook:  (bookId:string) => Promise<void>;
  rejectBorrow: (bookId: string) => Promise<void>;
  returnBook: (bookId: string) => Promise<void>;
  isAdminAuthenticated: boolean;
  loginAdmin: (code: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (currentCode: string, newCode: string) => boolean;
  loading: boolean;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_CODE_STORAGE_KEY = 'adminCode';

// Safe API calls with error handling
async function updateDataAPI(data: { books?: Book[]; categories?: Category[] }) {
  try {
    const response = await fetch('/api/update-books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API update failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error calling update API:", error);
    throw error;
  }
}

async function getDataAPI() {
  try {
    const response = await fetch('/api/update-books', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return initial data as fallback
    return { books: initialBooks, categories: initialCategories };
  }
}

// Helper functions
function createBook(bookData: Omit<Book, 'id' | 'status'>): Book {
  return {
    ...bookData,
    id: Date.now().toString(),
    status: 'available',
  };
}

function createCategory(categoryData: Omit<Category, 'id'>): Category {
  return {
    ...categoryData,
    id: Date.now().toString(),
  };
}

function updateBookStatus(book: Book, updates: Partial<Book>): Book {
  return {
    ...book,
    ...updates,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | undefined>(undefined);
  const [adminCode, setAdminCode] = useState("admin123");
  const [loading, setLoading] = useState(false); // Start as false since we have initial data
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const isFetching = useRef(false);

  // Fetch data from API - safe version
  const fetchData = async (silent: boolean = false) => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    if (!silent) {
      setLoading(true);
    }

    try {
      const data = await getDataAPI();
      setBooks(data.books || initialBooks);
      setCategories(data.categories || initialCategories);
      setLastUpdated(new Date());
      
      if (!silent) {
        toast({
          title: "تم تحديث البيانات",
          description: "تم تحميل أحدث البيانات بنجاح.",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (!silent) {
        toast({
          title: "خطأ في التحديث",
          description: "تعذر تحديث البيانات.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // Manual refresh function
  const refreshData = async () => {
    await fetchData(false);
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializeData = async () => {
      // Use initial data immediately, then try to fetch updates
      await fetchData(true); // Silent initial load
      
      const storedCode = localStorage.getItem(ADMIN_CODE_STORAGE_KEY);
      if (storedCode) {
        setAdminCode(storedCode);
      }

      const authStatus = localStorage.getItem('isAdminAuthenticated');
      setIsAdminAuthenticated(authStatus === 'true');
    };

    initializeData();
  }, []);

  // Auto-refresh - only on client side
  useEffect(() => {
    // Don't set up auto-refresh during build/SSR
    if (typeof window === 'undefined') return;

    let intervalId: NodeJS.Timeout;

    const setupAutoRefresh = () => {
      intervalId = setInterval(() => {
        if (!document.hidden && !isFetching.current) {
          fetchData(true);
        }
      }, 600); // 1 minute
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !isFetching.current) {
        fetchData(true);
      }
    };

    const handleFocus = () => {
      if (!isFetching.current) {
        fetchData(true);
      }
    };

    setupAutoRefresh();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // All action functions remain the same but with better error handling
  const loginAdmin = (code: string) => {
    if (code === adminCode) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      setIsAdminAuthenticated(true);
      toast({
        title: "تم تسجيل الدخول",
        description: "مرحبًا بك في لوحة الإدارة.",
      });
      return true;
    } else {
      toast({
        title: "رمز غير صحيح",
        description: "الرمز الذي أدخلته غير صحيح. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAdminAuthenticated(false);
    router.push('/admin/login');
  };

  const changeAdminPassword = (currentCode: string, newCode: string) => {
    if (currentCode === adminCode) {
      setAdminCode(newCode);
      localStorage.setItem(ADMIN_CODE_STORAGE_KEY, newCode);
      return true;
    }
    return false;
  };

  const addBook = async (bookData: Omit<Book, 'id' | 'status'>) => {
    try {
      const newBook = createBook(bookData);
      const updatedBooks = [...books, newBook];
      
      setBooks(updatedBooks);
      await updateDataAPI({ books: updatedBooks });
      
      toast({
        title: "تمت إضافة الكتاب",
        description: `تمت إضافة "${bookData.name}" بنجاح.`,
      });
    } catch (error) {
      console.error("Error adding book:", error);
      await fetchData(true);
      toast({
        title: "خطأ في الإضافة",
        description: "تعذر إضافة الكتاب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

const deletebook = async (bookId: string) => {
  try {
    // STEP 1: Find the book in the array
    const bookToDelete = books.find(book => book.id === bookId);
    
    // STEP 2: Check if book was found
    if (!bookToDelete) {
      toast({ title: "خطأ", description: "الكتاب غير موجود." });
      return; // Stop the function here
    }

    // STEP 3: If book exists, create new array without that book
    const updatedBooks = books.filter(book => book.id !== bookId);
    
    // STEP 4: Update state and API
    setBooks(updatedBooks);
    await updateDataAPI({ books: updatedBooks });
    
    // STEP 5: Show success message with the book name
    toast({
      title: "تم الحذف",
      description: `تم حذف كتاب "${bookToDelete.name}" بنجاح.`, // ← Using bookToDelete.name here
    });
  } catch (error) {
    // Error handling...
  }
};
  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const newCategory = createCategory(categoryData);
      const updatedCategories = [...categories, newCategory];
      
      setCategories(updatedCategories);
      await updateDataAPI({ categories: updatedCategories });
      
      toast({
        title: "تمت إضافة الفئة",
        description: `تمت إضافة "${categoryData.name}" بنجاح.`,
      });
    } catch (error) {
      console.error("Error adding category:", error);
      await fetchData(true);
      toast({
        title: "خطأ في الإضافة",
        description: "تعذر إضافة الفئة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };
  
  const requestBorrow = async (bookId: string) => {
    try {
      const updatedBooks = books.map(book =>
        book.id === bookId ? updateBookStatus(book, { status: 'requested' }) : book
      );
      
      setBooks(updatedBooks);
      await updateDataAPI({ books: updatedBooks });
      
      toast({
        title: "تم إرسال الطلب",
        description: "تم إرسال طلب استعارة الكتاب للإدارة.",
      });
    } catch (error) {
      console.error("Error requesting borrow:", error);
      await fetchData(true);
      toast({
        title: "خطأ في الطلب",
        description: "تعذر إرسال طلب الاستعارة.",
        variant: "destructive",
      });
    }
  };

  const approveBorrow = async (bookId: string, dueDate: Date, borrowerName: string) => {
    try {
      const updatedBooks = books.map(book =>
        book.id === bookId
          ? updateBookStatus(book, {
              status: 'borrowed',
              borrowDate: new Date(),
              dueDate: dueDate,
              borrowerName: borrowerName
            })
          : book
      );
      
      setBooks(updatedBooks);
      await updateDataAPI({ books: updatedBooks });
      
      toast({
        title: "تمت الموافقة",
        description: "تم تسجيل الكتاب كـ 'معار'.",
      });
    } catch (error) {
      console.error("Error approving borrow:", error);
      await fetchData(true);
      toast({
        title: "خطأ في الموافقة",
        description: "تعذر تسجيل الاستعارة.",
        variant: "destructive",
      });
    }
  };

  const rejectBorrow = async (bookId: string) => {
    try {
      const updatedBooks = books.map(book =>
        book.id === bookId ? updateBookStatus(book, {
          status: 'available',
          borrowerName: undefined,
          borrowDate: undefined,
          dueDate: undefined
        }) : book
      );
      
      setBooks(updatedBooks);
      await updateDataAPI({ books: updatedBooks });
      
      toast({
        title: "تم رفض الطلب",
        description: "تم إعادة الكتاب إلى قائمة الكتب المتاحة.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error rejecting borrow:", error);
      await fetchData(true);
      toast({
        title: "خطأ في الرفض",
        description: "تعذر رفض طلب الاستعارة.",
        variant: "destructive",
      });
    }
  };

  const returnBook = async (bookId: string) => {
    try {
      const bookToReturn = books.find(book => book.id === bookId);
      if (!bookToReturn) return;
      
      const updatedBooks = books.map(book =>
        book.id === bookId
          ? updateBookStatus(book, {
              status: 'available',
              borrowDate: undefined,
              returnDate: new Date(),
              borrowerName: undefined,
              dueDate: undefined
            })
          : book
      );
      
      setBooks(updatedBooks);
      await updateDataAPI({ books: updatedBooks });
      
      toast({
        title: "تم الإرجاع",
        description: (
          <span>
            تم إرجاع كتاب &quot;{bookToReturn.name}&quot;. الرقم الموضعي: <strong className="font-bold">{bookToReturn.placementNumber}</strong>
          </span>
        ),
      });
    } catch (error) {
      console.error("Error returning book:", error);
      await fetchData(true);
      toast({
        title: "خطأ في الإرجاع",
        description: "تعذر تسجيل إرجاع الكتاب.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppContext.Provider value={{ 
      books, 
      categories, 
      addBook, 
      addCategory, 
      requestBorrow, 
      approveBorrow, 
      deletebook,
      rejectBorrow, 
      returnBook, 
      isAdminAuthenticated: isAdminAuthenticated || false, 
      loginAdmin, 
      logoutAdmin, 
      changeAdminPassword,
      loading,
      refreshData,
      lastUpdated
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}