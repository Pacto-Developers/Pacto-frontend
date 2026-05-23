export type Paginated<T> = {
  content: T[];
  page?: number;
  size?: number;
  total_elements?: number;
  total_pages?: number;
  current_page?: number;
};
