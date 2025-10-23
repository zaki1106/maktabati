import { NextResponse } from 'next/server';
import type { Book, Category } from '@/lib/types';

// Helper function to read the current mock data
async function getMockData(): Promise<{ books: Book[]; categories: Category[] }> {
  try {
    const { initialBooks, initialCategories } = await import('@/lib/mock-data');
    return {
      books: initialBooks,
      categories: initialCategories
    };
  } catch (error) {
    console.error("Error reading mock data:", error);
    return { books: [], categories: [] };
  }
}

// Helper function to update the mock data file
async function updateMockDataFile(books: Book[], categories: Category[]): Promise<void> {
  const fileContent = `import type { Book, Category } from '@/lib/types';

export const initialCategories: Category[] = ${JSON.stringify(categories, null, 2)};

export const initialBooks: Book[] = ${JSON.stringify(books, null, 2)};
`;
  
  const fs = await import('fs/promises');
  await fs.writeFile('src/lib/mock-data.ts', fileContent, 'utf-8');
}

// POST - Update both books and categories
export async function POST(request: Request) {
  try {
    const receivedData = await request.json();
    
    console.log("POST received data:", receivedData);
    
    let updatedBooks: Book[];
    let updatedCategories: Category[];
    
    // Check if we're receiving books array, categories array, or both
    if (Array.isArray(receivedData)) {
      // If it's an array, assume it's books (for backward compatibility)
      const { categories: existingCategories } = await getMockData();
      updatedBooks = receivedData;
      updatedCategories = existingCategories;
      console.log("Updating books array with", updatedBooks.length, "books");
    } else if (receivedData.books && receivedData.categories) {
      // If it has both books and categories
      updatedBooks = receivedData.books;
      updatedCategories = receivedData.categories;
      console.log("Updating both books and categories");
    } else if (receivedData.books) {
      // If it only has books
      const { categories: existingCategories } = await getMockData();
      updatedBooks = receivedData.books;
      updatedCategories = existingCategories;
      console.log("Updating books only");
    } else if (receivedData.categories) {
      // If it only has categories
      const { books: existingBooks } = await getMockData();
      updatedBooks = existingBooks;
      updatedCategories = receivedData.categories;
      console.log("Updating categories only");
    } else {
      // If it's a single book object (for backward compatibility)
      const { books: existingBooks, categories: existingCategories } = await getMockData();
      const newBook: Book = {
        ...receivedData,
        id: receivedData.id || Date.now().toString(),
        status: receivedData.status || 'available',
      };
      updatedBooks = [...existingBooks, newBook];
      updatedCategories = existingCategories;
      console.log("Adding single book:", newBook.name);
    }
    
    // Update mock-data.ts file
    await updateMockDataFile(updatedBooks, updatedCategories);
    
    return NextResponse.json({ 
      message: "Data updated successfully", 
      booksCount: updatedBooks.length,
      categoriesCount: updatedCategories.length
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ message: "Error updating data" }, { status: 500 });
  }
}

// GET - Get both books and categories
export async function GET(request: Request) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ books: [], categories: [] });
    }
    const { books, categories } = await getMockData();
    return NextResponse.json({ books, categories }, { status: 200 });
    // During build, return empty data
    
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ message: "Error reading data" }, { status: 500 });
  }
}

// PUT - Update a specific book
export async function PUT(request: Request) {
  try {
    const updatedBook: Book = await request.json();
    const { books: existingBooks, categories } = await getMockData();
    
    const updatedBooks = existingBooks.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    );
    
    await updateMockDataFile(updatedBooks, categories);
    
    return NextResponse.json({ 
      message: "Book updated successfully", 
      book: updatedBook 
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json({ message: "Error updating book" }, { status: 500 });
  }
}

// DELETE - Delete a book
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "Book ID is required" }, { status: 400 });
    }
    
    const { books: existingBooks, categories } = await getMockData();
    const updatedBooks = existingBooks.filter(book => book.id !== id);
    
    await updateMockDataFile(updatedBooks, categories);
    
    return NextResponse.json({ 
      message: "Book deleted successfully",
      count: updatedBooks.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json({ message: "Error deleting book" }, { status: 500 });
  }
}