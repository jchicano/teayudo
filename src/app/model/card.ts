export interface Card {
    title: string;
    pictogram: string;
    color: string;
    duration: string; // ISO String
    confirmed: boolean;
    completed: boolean; // se usa desde la pagina show
}