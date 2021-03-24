export interface Recipe {
  id: number;
  name: string;
  sub_title: string | null;
  ingredients: string;
  description: string;
  source: string | null;
  photo: string | null;
  category_id?: number;
}
