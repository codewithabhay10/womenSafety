import UserInfo from '../components/profile/UserInfo';
import EmergencyContacts from '../components/profile/EmergencyContacts';
import Settings from '../components/profile/Settings';

const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <UserInfo />
        <EmergencyContacts />
        <Settings />
      </div>
    </div>
  );
};

export default ProfilePage;