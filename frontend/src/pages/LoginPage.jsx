import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to SecurePathway</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
