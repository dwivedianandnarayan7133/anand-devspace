require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Skill = require('./server/models/Skill');

async function seedSkills() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    await Skill.deleteMany({});
    
    const skills = [
      { category: 'Programming', categoryIcon: 'fas fa-code', isTag: false, name: 'JavaScript', icon: 'devicon-javascript-plain colored', percentage: 88, color: '#f0db4f', order: 1 },
      { category: 'Programming', categoryIcon: 'fas fa-code', isTag: false, name: 'Python', icon: 'devicon-python-plain colored', percentage: 75, color: '#3572A5', order: 2 },
      { category: 'Programming', categoryIcon: 'fas fa-code', isTag: false, name: 'Java', icon: 'devicon-java-plain colored', percentage: 70, color: '#f89820', order: 3 },
      
      { category: 'Web Development', categoryIcon: 'fas fa-globe', isTag: false, name: 'React', icon: 'devicon-react-original colored', percentage: 82, color: '#61dafb', order: 1 },
      { category: 'Web Development', categoryIcon: 'fas fa-globe', isTag: false, name: 'Node.js', icon: 'devicon-nodejs-plain colored', percentage: 78, color: '#339933', order: 2 },
      { category: 'Web Development', categoryIcon: 'fas fa-globe', isTag: false, name: 'Express.js', icon: 'devicon-express-original', percentage: 75, color: '#00d9ff', order: 3 },
      { category: 'Web Development', categoryIcon: 'fas fa-globe', isTag: false, name: 'Django', icon: 'devicon-django-plain colored', percentage: 60, color: '#092E20', order: 4 },
      { category: 'Web Development', categoryIcon: 'fas fa-globe', isTag: false, name: 'HTML5', icon: 'devicon-html5-plain colored', percentage: 92, color: '#e34f26', order: 5 },
      { category: 'Web Development', categoryIcon: 'fas fa-globe', isTag: false, name: 'CSS3', icon: 'devicon-css3-plain colored', percentage: 85, color: '#264de4', order: 6 },
      
      { category: 'Databases', categoryIcon: 'fas fa-database', isTag: false, name: 'MongoDB', icon: 'devicon-mongodb-plain colored', percentage: 78, color: '#47A248', order: 1 },
      { category: 'Databases', categoryIcon: 'fas fa-database', isTag: false, name: 'MySQL', icon: 'devicon-mysql-plain colored', percentage: 72, color: '#4479A1', order: 2 },

      { category: 'Core CS & Tools', categoryIcon: 'fas fa-tools', isTag: true, name: 'OOP', icon: 'fas fa-brain', order: 1 },
      { category: 'Core CS & Tools', categoryIcon: 'fas fa-tools', isTag: true, name: 'DSA', icon: 'fas fa-sitemap', order: 2 },
      { category: 'Core CS & Tools', categoryIcon: 'fas fa-tools', isTag: true, name: 'DBMS', icon: 'fas fa-server', order: 3 },
      { category: 'Core CS & Tools', categoryIcon: 'fas fa-tools', isTag: true, name: 'GitHub', icon: 'devicon-github-original', order: 4 },
      { category: 'Core CS & Tools', categoryIcon: 'fas fa-tools', isTag: true, name: 'Wireshark', icon: 'fas fa-network-wired', order: 5 },
      { category: 'Core CS & Tools', categoryIcon: 'fas fa-tools', isTag: true, name: 'Cyber Security', icon: 'fas fa-shield-alt', order: 6 },
    ];

    await Skill.insertMany(skills);
    console.log('Seeded Skills');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedSkills();
