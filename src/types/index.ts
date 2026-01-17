export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Stop {
    id: string;
    name: string;
    coordinates: Coordinates;
    category: string;
    vibe_match_reason: string;
    estimated_cost: string;
    is_premium: boolean;
    hidden_details?: string;
}

export interface Itinerary {
    itinerary_title: string;
    vibe_summary: string;
    stops: Stop[];
}
