import React from "react";
import { getFeaturedPlaces } from "@/lib/api/places";
import FeaturedPlacesClient from "./FeaturedPlacesClient";

export default async function FeaturedPlacesSection() {
  let places = [];
  
  try {
    // Utilize your exact server action data routine
    const response = await getFeaturedPlaces();
    
    // Safety check to handle raw arrays or nested data object returns safely
    places = Array.isArray(response) ? response : response?.data || [];
  } catch (error) {
    console.error("Failed loading homepage featured items context:", error);
  }

  if (places.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-transparent">
      <div className="container-app">
        <FeaturedPlacesClient initialPlaces={places} />
      </div>
    </section>
  );
}