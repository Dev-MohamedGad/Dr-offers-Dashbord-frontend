export interface Promotion {
    
    id: number;
    name: string;
    photo: string;
    developer: {
        id: number;
    };
    created_at: string;
    updated_at: string;
}
  
export interface CreatePromotionDto {
   name: string;
   photo: string;
   developer_id:number;
}
  
export interface UpdatePromotionDto  extends Partial<CreatePromotionDto>{  }
  

export type Developer = {
  id: number;
  name: string;
  photo: string;
  created_at: string;
  updated_at: string;
};