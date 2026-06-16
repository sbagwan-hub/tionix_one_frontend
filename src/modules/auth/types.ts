export interface Book {
  pk_book_id: number;
  book_name: string;
  active: boolean;
  file_name: string;
  database_name: string;
  product_id: string;
  parent_id: string;
  add_path: string;
  backup_path: string;
}

export interface BookResponse {
  success: boolean;
  message: string;
  timestamp: string;
  module: string;
  data: Book[];
}
