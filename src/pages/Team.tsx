import React from 'react';

// 1. Define the shape of your team member data
interface TeamMember {
  name: string;
  role: string;
  desc: string;
  number: string;
  linkedin: string;
  image: string;
}

export default function Team() {
  const members: TeamMember[] = [
    {
      name: 'Deepak Kumar',
      role: 'President',
      desc: 'Leading the chapter with a vision for structural excellence and innovation in civil engineering education.',
      number: '+91 1234567890',
      linkedin: 'https://linkedin.com/in/your-link-here',
      image: 'Deepak.png',
    },
    {
      name: 'Matam Sai Yashwanth',
      role: 'Vice President',
      desc: 'Supporting chapter initiatives and fostering academic collaboration across departments.',
      number: '+91 91000 71964',
      linkedin: 'https://linkedin.com/in/your-link-here',
      image: 'Matam.jpeg',
    },
    {
      name: 'Abhishek Raj',
      role: 'Secretary',
      desc: 'Coordinating all chapter activities, communications, and maintaining organizational records.',
      number: '+91 3456789012',
      linkedin: 'https://linkedin.com/in/your-link-here',
      image: 'Abhishek.png',
    },
    {
      name: 'Pari Agrawal',
      role: 'Event Coordinator',
      desc: 'Planning and executing workshops, guest lectures, and technical competitions.',
      number: '+91 4567890123',
      linkedin: 'https://linkedin.com/in/your-link-here',
      image: 'Pari.png',
    },
    {
      name: 'Rishit Bhardwaj',
      role: 'Event Coordinator',
      desc: 'Managing event logistics and ensuring memorable experiences for all participants.',
      number: '+91 5678901234',
      linkedin: 'https://linkedin.com/in/your-link-here',
      image: 'placeholder.png',
    },
  ]

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.style.display = 'none';

    if (target.parentElement) {
      target.parentElement.innerHTML = '👤';
      target.parentElement.classList.add('text-3xl');
    }
  };

  return (
    <div className="pt-32 pb-20 px-12 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="inline-block text-xs tracking-[3px] uppercase text-amber-500 font-semibold mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          Our Leadership
        </span>
        <h2 className="font-['Outfit'] text-5xl font-extrabold mt-4">
          Meet the <span className="gradient-text">Team</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((m) => {
          const imageName = m.name.split(' ')[0].toLowerCase();

          return (
            <div key={m.name} className="glass-card p-8 flex flex-col items-center text-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 border-2 border-amber-500/30 flex items-center justify-center overflow-hidden">
                <img
                  src={`/${m.image}`}
                  alt={`${m.name}'s profile`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div>
                <h3 className="font-['Outfit'] text-xl font-semibold">{m.name}</h3>
                <span className="text-amber-500 text-sm font-medium tracking-wider uppercase">{m.role}</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{m.desc}</p>
              <div className="flex gap-4 mt-2">
                <a href={`tel:${m.number}`} className="text-[var(--text-muted)] hover:text-amber-400 transition-colors text-sm">
                  📱 Contact
                </a>
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-amber-400 transition-colors text-sm">
                  💼 LinkedIn
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}