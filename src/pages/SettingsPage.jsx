import { CalendarDays, FileText, LifeBuoy, UserRound, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppButton from '../components/AppButton.jsx';
import AppCard from '../components/AppCard.jsx';
import AppHeader from '../components/AppHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function SettingsPage() {
  const { logout } = useAuth();

  return (
    <>
      <AppHeader title="Settings" back />
      <AppCard>
        <h2>Account</h2>
        <p className="muted">Sign out from this device.</p>
        <AppButton variant="danger" onClick={logout}>Logout</AppButton>
      </AppCard>
      <AppCard>
        <h2>Profile Menu</h2>
        <div className="menu-list">
          <Link to="/profile"><UserRound size={19} /> My Profile</Link>
          <Link to="/leave/balance"><WalletCards size={19} /> Leave Balance</Link>
          <Link to="/shifts"><CalendarDays size={19} /> My Shifts</Link>
          <Link to="/tickets"><LifeBuoy size={19} /> Helpdesk Tickets</Link>
          <Link to="/payslips"><FileText size={19} /> Payslips</Link>
        </div>
      </AppCard>
    </>
  );
}
