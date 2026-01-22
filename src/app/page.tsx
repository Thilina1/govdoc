
import { getUserProfile } from '@/lib/auth-service';
import HomeClient from './home-client';

export default async function Home() {
  const user = await getUserProfile();

  let userProfile = null;
  if (user) {
    userProfile = {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    };
  }

  return <HomeClient user={userProfile} />;
}
