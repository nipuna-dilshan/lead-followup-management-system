import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-semibold text-border mb-4">404</p>
        <h1 className="text-2xl font-semibold text-text-primary mb-2">Page not found.</h1>
        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
      </div>
    </div>
  );
}
