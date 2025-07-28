import { db } from "./db/connection";
import { entries } from "./db/schema";

const baseData = [
  {
    title: "Inception",
    type: "Movie" as const,
    director: "Christopher Nolan",
    budget: "$160M",
    location: "LA, Paris, Tokyo",
    duration: "148 min",
    yearTime: "2010",
    description: "A mind-bending thriller about dreams within dreams",
  },
  {
    title: "Breaking Bad",
    type: "TV Show" as const,
    director: "Vince Gilligan",
    budget: "$3M/ep",
    location: "Albuquerque",
    duration: "49 min/ep",
    yearTime: "2008-2013",
    description:
      "A high school chemistry teacher turned methamphetamine manufacturer",
  },
  {
    title: "The Dark Knight",
    type: "Movie" as const,
    director: "Christopher Nolan",
    budget: "$185M",
    location: "Chicago, Pittsburgh",
    duration: "152 min",
    yearTime: "2008",
    description: "Batman faces the Joker in this acclaimed superhero film",
  },
  {
    title: "Stranger Things",
    type: "TV Show" as const,
    director: "The Duffer Brothers",
    budget: "$8M/ep",
    location: "Atlanta (as Hawkins)",
    duration: "50 min/ep",
    yearTime: "2016-2025",
    description: "Supernatural events in a small town in the 1980s",
  },
  {
    title: "Pulp Fiction",
    type: "Movie" as const,
    director: "Quentin Tarantino",
    budget: "$8.5M",
    location: "Los Angeles",
    duration: "154 min",
    yearTime: "1994",
    description: "Interconnected stories of crime in Los Angeles",
  },
];

// Generate 100 entries by cloning and modifying baseData
const sampleData = Array.from({ length: 100 }, (_, i) => {
  const base = baseData[i % baseData.length];
  return {
    ...base,
    title: `${base.title} (${i + 1})`,
    yearTime: `${parseInt(base.yearTime.slice(0, 4)) + (i % 30)}`, // vary year
  };
});

async function seed() {
  try {
    console.log("Seeding database...");

    for (const entry of sampleData) {
      await db.insert(entries).values(entry);
      console.log(`Added: ${entry.title}`);
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();

