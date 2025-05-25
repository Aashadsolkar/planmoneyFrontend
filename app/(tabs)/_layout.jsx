import { Slot, Redirect } from 'expo-router';
import { useAuth } from '../context/useAuth';
import ProtectedTabs from '../components/tabs';

export default function ProtectedTabLayout() {
  const { user } = useAuth();

  if (!user) return <Redirect href="/" />;

  return <ProtectedTabs  />;
}
