export default function Professors() {
  const professors = [
    { name: "Prof. Abhishek Kumar Pandey", department: "Civil Engineering", position: "Assistant Professor", email: "akpandey@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1738164117679a47959f309.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=akpandey" },
    { name: "Prof. Ankti Srivastava", department: "Civil Engineering", position: "Assistant Professor", email: "ankti@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1746782714681dc9fad3efe.jpeg", profile: "https://www.iitism.ac.in/faculty-details?faculty=ankti" },
    { name: "Prof. Avinash Kumar Singh", department: "Civil Engineering", position: "Assistant Professor", email: "aksingh@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_173892619967a5e87768e9a.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=aksingh" },
    { name: "Prof. Bandita Barman", department: "Civil Engineering", position: "Assistant Professor", email: "bandita@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1737974446679762ae972c6.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=bandita" },
    { name: "Prof. Biswajeet Pradhan", department: "Civil Engineering", position: "Adjunct Faculty (Foreign)", email: "Biswajeet.Pradhan@uts.edu.au", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_176734961669579d700f476.jpeg", profile: "https://www.iitism.ac.in/faculty-details?faculty=Biswajeet.Pradhan" },
    { name: "Prof. Chandrashekhar Lakavath", department: "Civil Engineering", position: "Assistant Professor", email: "chandrashekhar@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1766745558694e65d657fb5.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=chandrashekhar" },
    { name: "Prof. Dharmananda Sarangi", department: "Civil Engineering", position: "Adjunct faculty", email: "d.sarangi@nic.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_174955612068481b985c780.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=d.sarangi" },
    { name: "Prof. Kironmala Chanda", department: "Civil Engineering", position: "Associate Professor", email: "kironmala@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879694686b900ea677b.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=kironmala" },
    { name: "Prof. Leeza Malik", department: "Civil Engineering", position: "Assistant Professor", email: "leeza@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879841686b90a16892d.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=leeza" },
    { name: "Prof. Lijith K P", department: "Civil Engineering", position: "Assistant Professor", email: "lijith@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1747993559683043d77c042.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=lijith" },
    { name: "Prof. Piyali Sengupta", department: "Civil Engineering", position: "Assistant Professor", email: "piyali@iitism.ac.in", image: "https://www.iitism.ac.in/facultyImages/Prof.%20Piyali%20Sengupta.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=piyali" },
    { name: "Prof. Pranesh Roy", department: "Civil Engineering", position: "Assistant Professor", email: "pranesh@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879879686b90c7bf0d8.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=pranesh" },
    { name: "Prof. Punyabeet Sarangi", department: "Civil Engineering", position: "Assistant Professor", email: "punyabeet@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_173858831067a0c0965343e.png", profile: "https://www.iitism.ac.in/faculty-details?faculty=punyabeet" },
    { name: "Prof. Rahul Bhartiya", department: "Civil Engineering", position: "Assistant Professor", email: "rahulb@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879914686b90ea94f96.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=rahulb" },
    { name: "Prof. Rajib Sarkar", department: "Civil Engineering", position: "Associate Professor", email: "rajib@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879728686b9030b518e.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=rajib" },
    { name: "Prof. Renu V", department: "Civil Engineering", position: "Assistant Professor", email: "renuvalsala@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879807686b907f31fb4.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=renuvalsala" },
    { name: "Prof. Sanket Nayak", department: "Civil Engineering", position: "Associate Professor", email: "sanket@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1753355436688214ac98ece.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=sanket" },
    { name: "Prof. Sarat Kumar Das", department: "Civil Engineering", position: "Professor", email: "saratdas@iitism.ac.in", image: "https://www.iitism.ac.in/facultyImages/Prof.%20Sarat%20Kumar%20Das.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=saratdas" },
    { name: "Prof. Satadru Das Adhikary", department: "Civil Engineering", position: "Associate Professor", email: "satadru@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879765686b9055eadaa.JPG", profile: "https://www.iitism.ac.in/faculty-details?faculty=satadru" },
    { name: "Prof. Sekhar Chandra Dutta", department: "Civil Engineering", position: "Professor (HAG)", email: "sekhar@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879241686b8e49b29ac.JPG", profile: "https://www.iitism.ac.in/faculty-details?faculty=sekhar" },
    { name: "Prof. Shushobhit Chaudhary", department: "Civil Engineering", position: "Assistant Professor", email: "shushobhit@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_175542284068a1a078b0291.png", profile: "https://www.iitism.ac.in/faculty-details?faculty=shushobhit" },
    { name: "Prof. Smruti Sourava Mohapatra", department: "Civil Engineering", position: "Associate Professor", email: "smruti@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879654686b8fe6c38bc.JPG", profile: "https://www.iitism.ac.in/faculty-details?faculty=smruti" },
    { name: "Prof. Sowmiya Chawla", department: "Civil Engineering", position: "Associate Professor", email: "sowmiya@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1753366741688240d59b1bc.JPG", profile: "https://www.iitism.ac.in/faculty-details?faculty=sowmiya" },
    { name: "Prof. Srinivas Pasupuleti", department: "Civil Engineering", position: "Associate Professor", email: "srinivas@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879078686b8da629532.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=srinivas" },
    { name: "Prof. Sukanta Chakraborty", department: "Civil Engineering", position: "Associate Professor", email: "sukanta@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879308686b8e8c0ef06.JPG", profile: "https://www.iitism.ac.in/faculty-details?faculty=sukanta" },
    { name: "Prof. Tanish Dey", department: "Civil Engineering", position: "Associate Professor", email: "tanish@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_1751879355686b8ebba6df7.JPG", profile: "https://www.iitism.ac.in/faculty-details?faculty=tanish" },
    { name: "Prof. Vishwas Nandkishor Khatri", department: "Civil Engineering", position: "Associate Professor", email: "vishwas@iitism.ac.in", image: "https://www.iitism.ac.in/storage/FacultyDetails/IMG_173883167267a47738a4165.jpg", profile: "https://www.iitism.ac.in/faculty-details?faculty=vishwas" }
  ]

  return (
    <div className="pt-32 pb-20 px-8 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="inline-block text-xs tracking-[3px] uppercase text-amber-500 font-semibold mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          Faculty
        </span>
        <h2 className="font-['Outfit'] text-5xl font-extrabold mt-4">
          Know Your <span className="gradient-text">Professors</span>
        </h2>
        <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
          Meet the distinguished faculty of the Civil Engineering Department at IIT ISM Dhanbad, dedicated to academic excellence and cutting-edge research.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {professors.map((p) => (
          <div key={p.name} className="glass-card hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full overflow-hidden group">
            <div className="h-48 relative overflow-hidden bg-white/5 flex items-center justify-center">
              <img 
                src={p.image} 
                alt={p.name}
                className={`w-full h-full object-cover transition-transform duration-500
                  ${p.name === 'Prof. Punyabeet Sarangi' 
                    ? 'scale-125 object-top group-hover:scale-150' 
                    : 'scale-90 object-[center_20%] group-hover:scale-100'
                  }
                `}
                onError={(e) => {
                  // Fallback for broken images
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0a0a0f&color=f59e0b&size=200`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-['Outfit'] text-lg font-bold mb-1 line-clamp-2">{p.name}</h3>
              <span className="text-amber-500 text-xs font-semibold tracking-wider uppercase mb-3">{p.position}</span>
              <div className="mt-auto space-y-2 text-sm text-[var(--text-muted)]">
                <a href={`mailto:${p.email.trim()}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <span>✉️</span> {p.email.trim()}
                </a>
                <a href={p.profile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <span>🔗</span> View Profile
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
