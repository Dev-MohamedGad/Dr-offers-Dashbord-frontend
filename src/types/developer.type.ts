export type Developer = {
    id: number;
    name: string;
    photo: string;
    created_at: string;
    updated_at: string;
};

export type CreateDeveloperDto = {
    name :string
    photo:string
  
};

export type UpdateDeveloperDto = Partial<CreateDeveloperDto>;

export type ResponseDevelopers = {
      data: Developer[]
  }

  
export type ResponseDeveloper = {
      data: Developer
  }