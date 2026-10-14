//what a job looks like (field and type)
export type Status = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" ;

export interface Job {
    id: number;
    company: string;
    role : string;
    appliedDate : string;
    notes : string | null; //notes can be empty
    createdAt: string;
    status : Status;
}

export interface JobPage {
    content: Job[];
    page:{
        size: number; //how many job per page
        totalElements: number; //how many jobs in total
        number: number; //current page
        totalPages:number; //how many pages in total
    }
}