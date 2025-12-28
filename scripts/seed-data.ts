import db from '../lib/db';

// Seed initial data
const seedData = () => {
  // Check if data already exists
  const existingTestimonials = db.prepare('SELECT COUNT(*) as count FROM testimonials').get() as { count: number };
  const existingTeam = db.prepare('SELECT COUNT(*) as count FROM team').get() as { count: number };
  const existingPortfolio = db.prepare('SELECT COUNT(*) as count FROM portfolio').get() as { count: number };

  // Seed testimonials if empty
  if (existingTestimonials.count === 0) {
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

    const insertTestimonial = db.prepare('INSERT INTO testimonials (name, username, body, img) VALUES (?, ?, ?, ?)');
    testimonials.forEach((t) => insertTestimonial.run(t.name, t.username, t.body, t.img));
  }

  // Seed team if empty
  if (existingTeam.count === 0) {
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

    const insertTeam = db.prepare('INSERT INTO team (name, position, bio, image, skills, linkedin, github, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    team.forEach((m) => insertTeam.run(m.name, m.position, m.bio, m.image, m.skills, m.linkedin, m.github, m.email));
  }

  // Seed portfolio if empty
  if (existingPortfolio.count === 0) {
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

    const insertPortfolio = db.prepare('INSERT INTO portfolio (title, description, image, category, technologies, client, duration, teamSize, status, liveUrl, githubUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    portfolio.forEach((p) => insertPortfolio.run(p.title, p.description, p.image, p.category, p.technologies, p.client, p.duration, p.teamSize, p.status, p.liveUrl, p.githubUrl));
  }

  console.log('Database seeded successfully!');
};

seedData();

