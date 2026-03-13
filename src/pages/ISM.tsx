import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ISM() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-up', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Header Section */}
        <section className="reveal-up space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold font-['Outfit'] gradient-text text-center">
            IIT (ISM) Dhanbad
          </h1>
          <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl relative border border-white/[0.05]">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent z-10" />
            <img 
              src="/ISM.jpeg" 
              alt="IIT ISM Dhanbad Campus" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </section>

        {/* About Section */}
        <section className="reveal-up space-y-6 bg-white/[0.02] p-8 md:p-10 rounded-3xl border border-white/[0.05] shadow-lg relative overflow-hidden group hover:border-white/[0.1] transition-colors duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
          <h2 className="text-3xl font-bold font-['Outfit'] text-amber-400">About IIT(ISM) Dhanbad</h2>
          <div className="text-[var(--text-secondary)] space-y-4 leading-loose">
            <p>
              IIT(ISM) Dhanbad, an Educational Institute of Eminence located in Dhanbad, Jharkhand, India, carries a Rich Legacy of Excellence in Education, Research, and Innovation since its Establishment in 1926. Over the Decades, the Institution has made significant contributions across various Disciplines—particularly in Mining, Geology, Petroleum Engineering, and Applied Sciences—and has nurtured Highly-skilled Professionals who have played Pivotal Roles in the Mining and Mineral Industries Worldwide.
            </p>
            <p>
              With a Diverse Student Community Spanning Undergraduate, Postgraduate, and Doctoral Programs, IIT(ISM) Dhanbad fosters a Competitive and Intellectually Stimulating Academic Environment. The Institute provides state-of-the-art Facilities, Robust Research Opportunities, and a Comprehensive Curriculum Designed to shape Industry-ready Graduates and Future Leaders.
            </p>
            <p>
              Consistently Ranked amongst the <strong className="text-white font-semibold">Top 20 Engineering Institutions in India</strong>, IIT(ISM) Dhanbad has been Recognized for its Academic Excellence by Prestigious National and International Rankings, including the National Institutional Ranking Framework (NIRF) and the QS World University Rankings. In the Engineering Category of NIRF, the Institute secured the 11th position in 2021, 14th in 2022, 17th in 2023, and 15th in 2024. In the QS World University Rankings by Subject - Engineering (Mineral &amp; Mining), it achieved 20th in 2025, 25th in 2021, 26th in 2022, 40th in 2023, and 41st in 2024. These Accomplishments reflect IIT(ISM) Dhanbad's Unwavering Commitment to Academic Distinction, Impactful Research, and Strong Industry Collaborations.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="reveal-up bg-gradient-to-br from-blue-900/10 to-transparent p-8 md:p-10 rounded-3xl border border-blue-500/20 shadow-lg hover:border-blue-500/40 transition-colors duration-500">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl">👁️</span>
              <h2 className="text-2xl font-bold font-['Outfit'] text-blue-400">Vision</h2>
            </div>
            <p className="text-[var(--text-secondary)] leading-loose">
              To be a Nationally and Internationally Acclaimed Premier Institution of Higher Technical and Scientific Education with Social Commitments having an Ethos for Intellectual Excellence, where Initiatives are Nurtured, where New Ideas, Research and Scholarships Flourish, where Intellectual Honesty is the Norm and from which the Leaders and Innovators of Tomorrow in the Realm of Technology will emerge.
            </p>
          </section>

          <section className="reveal-up bg-gradient-to-br from-amber-900/10 to-transparent p-8 md:p-10 rounded-3xl border border-amber-500/20 shadow-lg hover:border-amber-500/40 transition-colors duration-500">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl">🎯</span>
              <h2 className="text-2xl font-bold font-['Outfit'] text-amber-400">Mission</h2>
            </div>
            <p className="text-[var(--text-secondary)] leading-loose">
              To Educate and Train Manpower in the Various Disciplines of Engineering and Technology, Management, Applied Sciences and Applied Arts at the Graduate, Postgraduate and Research Levels. As IIT(ISM) Dhanbad completes 100 Remarkable Years, the Institute reaffirms its Dedication towards Shaping Responsible and Skilled Professionals, encouraging Meaningful Multidisciplinary Research, and Developing Sustainable Technologies that can benefit the Society both in India and Globally. Celebrating a Century of Heritage, IIT(ISM) Dhanbad remains Committed to build Strong Partnerships, Supporting New Ideas and Entrepreneurships, and Preparing for a Future of Development and Innovation.
            </p>
          </section>
        </div>

        {/* Life History */}
        <section className="reveal-up space-y-6">
          <h2 className="text-3xl font-bold font-['Outfit'] text-white">Life History of IIT(ISM) Dhanbad</h2>
          <div className="bg-[var(--bg-secondary)] p-8 md:p-10 rounded-3xl border border-white/[0.05] text-[var(--text-secondary)] space-y-6 leading-loose shadow-lg">
            <p>
              The Indian National Congress at its XVII Session of December 1901 passed a Resolution stating that &quot;...In view of the fact that the tendency of recent Legislation namely, The Indian Mines Act VII of 1901, is that all Indian Mines must be kept under the supervision of Mining Experts, the Congress is of opinion that a Government College of Mining Engineering be established in some suitable place in India on the models of the Royal School of Mines in England, Mining Colleges of Japan and at other places in the Continent&quot;.
            </p>
            <p>
              The Indian School of Mines was formally opened on 9th December 1926 by Lord Irwin, the then Viceroy of India. In 1967 it was granted the status of a Deemed-to-be University under Section 3 of the UGC Act, 1956.
            </p>
          </div>
        </section>

        {/* Historical Milestones */}
        <section className="reveal-up space-y-12">
          <h2 className="text-3xl font-bold font-['Outfit'] text-white text-center">Historical Milestones</h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              { year: "1901", text: "The Indian National Congress passed a Resolution at its XVII Session stating that: \"In view of the fact that the tendency of recent Legislation namely, The Indian Mines Act VII of 1901...\"" },
              { year: "1920", text: "The McPherson Committee formed by the Government of British India submitted its Report recommending the Establishment of an Institution for imparting Education in the Fields of Mining and Geology." },
              { year: "1926", text: "Recurring Exigencies for the inception of such an Institute formed the primary basis for the Establishment of the 'Indian School of Mines & Applied Geology' at Dhanbad by the hands of the then Viceroy Lord Irwin on 9th December 1926. Institute's General Work commenced with Dr. David Penman as its First Founder-Principal. The Institute Offered Courses solely in Mining Engineering and Applied Geology." },
              { year: "1953", text: "Dr. Rajendra Prasad, the then President of India, inaugurated the Celebrations on the Silver Jubilee of the Institute, giving it an entirely Fresh Impetus." },
              { year: "1957", text: "The Institute began Offering Courses in Petroleum Engineering and Applied Geophysics. Its name was changed to 'Indian School of Mines (ISM)'." },
              { year: "1975 - 1976", text: "The School was Granted the University Status by the University Grants Commission under Section 3 of the University Grants Commission Act, 1956. In 1975 and 1976, the Institute began Offering Courses in Mining Machinery Engineering and Fuel and Mineral Engineering respectively." },
              { year: "1997 - 2016", text: "During this Period, the Institute progressively expanded its Academic Portfolio by introducing various B.Tech Programs in a phased manner. These included Mechanical Engineering, Electrical Engineering, Environmental Engineering, Chemical Engineering, Civil Engineering, Electronics and Communication Engineering, and Computer Science and Engineering, among others. In 2016, the Institute was elevated to the Status of an Indian Institute of Technology (IIT) and was subsequently Renamed IIT(ISM) Dhanbad." },
              { year: "2016 - 2026", text: "During this decade, the Institute consolidated its transition into the IIT system through academic expansion, research strengthening, digital transformation, and enhanced national and global engagement, culminating in the celebration of its Centenary Year (2025-26) a symbolic milestone marking 100 years of legacy, resilience, and forward-looking excellence." },
            ].map((milestone, idx) => (
              <div key={idx} className="relative pl-8 md:pl-10 border-l-2 border-amber-500/20 group">
                <div className="absolute w-4 h-4 bg-amber-400 rounded-full -left-[9px] top-2 shadow-[0_0_12px_rgba(251,191,36,0.5)] transition-transform duration-300 group-hover:scale-125"></div>
                <div className="bg-white/[0.015] p-6 md:p-8 rounded-2xl border border-white/[0.05] group-hover:border-amber-500/30 group-hover:bg-white/[0.03] transition-all duration-300">
                  <h3 className="font-bold font-['Outfit'] text-2xl text-amber-400 mb-3">{milestone.year}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed md:text-lg">
                    {milestone.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
