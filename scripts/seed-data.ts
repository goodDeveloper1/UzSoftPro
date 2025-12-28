import 'reflect-metadata';
import { getDataSource } from '../lib/db';
import { Testimonial } from '../lib/entities/Testimonial';
import { Team } from '../lib/entities/Team';
import { Portfolio } from '../lib/entities/Portfolio';

// Seed initial data
const seedData = async () => {
  const dataSource = await getDataSource();
  
  const testimonialRepo = dataSource.getRepository(Testimonial);
  const teamRepo = dataSource.getRepository(Team);
  const portfolioRepo = dataSource.getRepository(Portfolio);

  // Check if data already exists
  const existingTestimonialsCount = await testimonialRepo.count();
  const existingTeamCount = await teamRepo.count();
  const existingPortfolioCount = await portfolioRepo.count();

  // Seed testimonials if empty
  if (existingTestimonialsCount === 0) {
    const testimonials = [
      {
        name: "Dilshod Akhmedov",
        username: "CEO, Akfa Group",
        body: "UzSoftPro kompaniyasi bilan hamkorlik biznesimizni yangi bosqichga olib chiqdi. Ularning jamoasi har doim innovatsion va samarali yechimlar taklif qiladi.",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        name: "Gulnora Karimova",
        username: "IT Director, Orient Bank",
        body: "Bizning bank uchun yaratilgan mobil ilova va veb platforma mijozlarimiz uchun juda qulay va xavfsiz bo'ldi. UzSoftPro'ga ishonamiz!",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    ];

    for (const t of testimonials) {
      const testimonial = testimonialRepo.create(t);
      await testimonialRepo.save(testimonial);
    }
    console.log('Testimonials seeded!');
  }

  // Seed team if empty
  if (existingTeamCount === 0) {
    const team = [
      {
        name: "Pardayev Husniddin",
        position: "Bosh direktor va asoschi",
        bio: "10 yildan ortiq tajribaga ega dasturiy ta'minot muhandisi. Startaplar va korporativ loyihalarni muvaffaqiyatli boshqargan.",
        image: "/husniddin.JPG",
        skills: JSON.stringify(["Strategiya", "Boshqaruv", "Biznes tahlil"]),
        linkedin: "#",
        github: "#",
        email: "uzsoftpro@gmail.com",
      },
    ];

    for (const m of team) {
      const member = teamRepo.create(m);
      await teamRepo.save(member);
    }
    console.log('Team seeded!');
  }

  // Seed portfolio if empty
  if (existingPortfolioCount === 0) {
    const portfolio = [
      {
        title: "Milliard Biznes Club",
        description: "Bir-biringizga yordam berish va yangi foydali aloqalarni topish orqali baxt va muvaffaqiyatga erishing",
        image: "/milliard.png",
        category: "Web dasturlash",
        technologies: JSON.stringify(["React", "Node.js", "PostgreSQL", "Stripe"]),
        client: "Milliard Biznes Club",
        duration: "7 kun",
        teamSize: "3 kishi",
        status: "Yakunlangan",
        liveUrl: "https://milliarduz.vercel.app/",
        githubUrl: "#",
      },
    ];

    for (const p of portfolio) {
      const project = portfolioRepo.create(p);
      await portfolioRepo.save(project);
    }
    console.log('Portfolio seeded!');
  }

  console.log('Database seeded successfully!');
  process.exit(0);
};

seedData().catch((error) => {
  console.error('Error seeding data:', error);
  process.exit(1);
});


