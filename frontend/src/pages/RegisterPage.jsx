import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Join SecurePathway</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
