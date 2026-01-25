import { getUserProfile } from '@/lib/auth-service';
import { getAllCategories } from '@/app/actions/admin';
import HomeClient from './home-client';

export default async function Home() {
  const [user, categories] = await Promise.all([
    getUserProfile(),
    getAllCategories()
  ]);

  let userProfile = null;
  if (user) {
    userProfile = {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    };
  }

  return <HomeClient user={userProfile} categories={categories} />;
}
