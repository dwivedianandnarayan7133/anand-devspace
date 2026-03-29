require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const Project = require('./server/models/Project');
const Education = require('./server/models/Education');
const Certification = require('./server/models/Certification');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    await Project.deleteMany({});
    await Project.create([
      {
        title: "Learning Management System",
        description: "A comprehensive course management platform designed for educators and students. Features robust assignment tracking, teacher assessment tools, and a powerful admin dashboard for full oversight.",
        features: ["Course management & enrollment system", "Assignment tracking & submission portal", "Teacher assessment & grading tools", "Admin dashboard with analytics"],
        techStack: ["React", "Node.js", "MongoDB", "Express"],
        icon: "fas fa-graduation-cap",
        order: 1
      },
      {
        title: "Language Translator with Speech",
        description: "An intelligent language translation tool with integrated speech capabilities. Supports real-time translation with voice input and output, making language barriers a thing of the past.",
        features: ["Real-time language translation", "Speech-to-text voice input", "Text-to-speech audio output", "Multiple language support"],
        techStack: ["JavaScript", "Web Speech API", "Translation API", "HTML5"],
        icon: "fas fa-language",
        order: 2
      }
    ]);
    console.log('Seeded Projects');

    await Education.deleteMany({});
    await Education.create([
      {
        degree: "B.Tech Computer Science Engineering",
        institution: "Bansal Institute of Engineering & Technology",
        dateRange: "2024 - 2027",
        location: "Lucknow, India",
        description: "Pursuing Bachelor's degree in Computer Science with focus on full-stack development, algorithms, and software engineering principles.",
        badgeText: "Current",
        icon: "fas fa-university",
        order: 1
      },
      {
        degree: "Diploma - Computer Science Engineering",
        institution: "MMIT Sant Kabir Nagar",
        dateRange: "2021 - 2024",
        location: "Sant Kabir Nagar, UP",
        description: "Completed diploma in Computer Science, building a strong foundation in programming, networking, and web technologies.",
        badgeText: "76.79%",
        icon: "fas fa-laptop-code",
        order: 2
      },
      {
        degree: "Secondary Education (UP Board)",
        institution: "K S S I C Baridiha, Sant Kabir Nagar",
        dateRange: "Completed",
        location: "Sant Kabir Nagar, UP",
        description: "Successfully completed secondary education with distinction under UP Board.",
        badgeText: "87%",
        icon: "fas fa-school",
        order: 3
      }
    ]);
    console.log('Seeded Education');

    await Certification.deleteMany({});
    await Certification.create([
      {
        title: "Infosys Springboard",
        issuer: "Infosys",
        topics: ["Java Programming", "Java Tools", "Cyber Security Overview", "Wireshark"],
        badgeText: "Verified",
        icon: "fas fa-certificate",
        order: 1
      },
      {
        title: "Summer Training",
        issuer: "Techpile Technology Pvt Ltd",
        date: "Jul 2023 - Sep 2023",
        description: "Hands-on industry training focusing on real-world web development skills and professional practices.",
        topics: [],
        badgeText: "Trained",
        icon: "fas fa-briefcase",
        order: 2
      }
    ]);
    console.log('Seeded Certifications');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
