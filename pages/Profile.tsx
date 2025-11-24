
import React from 'react';
import GlassCard from '../components/GlassCard';
import { EXPERIENCE_DATA, SKILLS_DATA, PROFILE_AVATAR_URL, PROJECTS_DATA, PROFILE_INFO } from '../constants';
import { MapPin, Link as LinkIcon, Mail, Briefcase, FolderGit2, Cpu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  
  // Generate a deterministic color style based on the string
  const getSkillStyle = (skillName: string) => {
    const styles = [
      "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-blue-200/50",
      "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-purple-200/50",
      "bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-green-200/50",
      "bg-orange-100 text-orange-700 hover:bg-orange-200 hover:shadow-orange-200/50",
      "bg-pink-100 text-pink-700 hover:bg-pink-200 hover:shadow-pink-200/50",
      "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 hover:shadow-cyan-200/50",
      "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-indigo-200/50",
      "bg-rose-100 text-rose-700 hover:bg-rose-200 hover:shadow-rose-200/50",
    ];
    
    let hash = 0;
    for (let i = 0; i < skillName.length; i++) {
      hash = skillName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % styles.length;
    return styles[index];
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative">
           <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-2xl animate-pulse-slow">
             <img src={PROFILE_AVATAR_URL} alt="Profile" className="w-full h-full object-cover" />
           </div>
        </div>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{PROFILE_INFO.name}</h1>
          <p className="text-lg text-gray-600 font-medium">{t(PROFILE_INFO.role)}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 pt-2">
            <span className="flex items-center gap-1"><MapPin size={14} /> {t(PROFILE_INFO.location)}</span>
            <span className="flex items-center gap-1"><LinkIcon size={14} /> {PROFILE_INFO.website}</span>
            <span className="flex items-center gap-1"><Mail size={14} /> {PROFILE_INFO.email}</span>
          </div>
        </div>
      </div>

      {/* About Me */}
      <GlassCard className="animate-slide-up">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t(PROFILE_INFO.aboutTitle)}</h2>
        <p className="text-gray-600 leading-relaxed">
          {t(PROFILE_INFO.aboutDesc)}
        </p>
      </GlassCard>

      {/* Experience */}
      <section className="animate-slide-up">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Briefcase size={20} /> {t('profile.exp_title')}
        </h2>
        <div className="space-y-4">
          {EXPERIENCE_DATA.map((job, idx) => (
            <GlassCard key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="md:w-1/3">
                <h3 className="font-bold text-gray-900">{job.company}</h3>
                <p className="text-sm text-gray-500 font-medium">{job.period}</p>
              </div>
              <div className="md:w-2/3">
                 <h4 className="font-semibold text-gray-800 mb-2">{job.role}</h4>
                 <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Projects / Portfolio */}
      <section className="animate-slide-up">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FolderGit2 size={20} /> {t('profile.portfolio_title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PROJECTS_DATA.map((project, idx) => (
            <a
              key={idx}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-white/20 bg-gray-100"
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                <p className="text-gray-300 text-xs translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{project.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="animate-slide-up">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Cpu size={20} /> {t('profile.skills_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SKILLS_DATA.map((skillGroup, idx) => (
            <GlassCard key={idx} className="p-5 group/card" hoverEffect={true}>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">{t(skillGroup.category)}</h3>
              <div className="flex flex-wrap gap-2.5">
                {skillGroup.items.map((skill) => (
                  <span 
                    key={skill} 
                    className={`
                      px-3.5 py-1.5 
                      rounded-full text-sm font-medium 
                      transition-all duration-300 
                      hover:scale-110 hover:-translate-y-0.5 hover:shadow-md
                      cursor-default select-none
                      ${getSkillStyle(skill)}
                    `}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
