import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

const ProfilesPage = () => {
  const { profiles, setActiveProfileId, setKidsMode } = useApp();
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setActiveProfileId(id);
    const profile = profiles.find(p => p.id === id);
    if (profile?.isKids) setKidsMode(true);
    else setKidsMode(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-display text-3xl font-bold mb-10">Who's watching?</h1>
      <div className="flex gap-6">
        {profiles.map(profile => (
          <button
            key={profile.id}
            onClick={() => handleSelect(profile.id)}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center text-4xl group-hover:ring-2 group-hover:ring-primary transition-all group-hover:scale-110">
              {profile.avatar}
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {profile.name}
            </span>
            {profile.isKids && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">Kids</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfilesPage;
