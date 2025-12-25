import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Send email directly - backend will handle username lookup
      await authService.login({
        username: formData.email, // Send email in username field, backend accepts both
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login not yet implemented');
  };

  const handleForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark overflow-x-hidden p-4 sm:p-6 md:p-8">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-white dark:bg-[#1C3A27] dark:text-white shadow-lg p-8 sm:p-10">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>
              footprint
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-[#111814] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Welcome Back
            </h1>
            <p className="text-[#608a72] dark:text-[#a0c2b0] text-base font-normal leading-normal">
              Log in to your Carbon Footprint Tracker account
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111814] dark:text-white text-base font-medium leading-normal pb-2">
                Email or Username
              </p>
              <div className="flex w-full flex-1 items-stretch rounded-lg">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111814] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe6df] dark:border-[#334D3F] bg-white dark:bg-[#172D20] focus:border-primary/50 h-14 placeholder:text-[#608a72] dark:placeholder:text-[#a0c2b0] p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                  placeholder="Enter your email or username"
                  required
                />
                <div className="text-[#608a72] dark:text-[#a0c2b0] flex border border-[#dbe6df] dark:border-[#334D3F] bg-white dark:bg-[#172D20] items-center justify-center pr-[15px] rounded-r-lg border-l-0">
                  <span className="material-symbols-outlined">person</span>
                </div>
              </div>
            </label>

            {/* Password Field */}
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111814] dark:text-white text-base font-medium leading-normal pb-2">
                Password
              </p>
              <div className="flex w-full flex-1 items-stretch rounded-lg">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111814] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe6df] dark:border-[#334D3F] bg-white dark:bg-[#172D20] focus:border-primary/50 h-14 placeholder:text-[#608a72] dark:placeholder:text-[#a0c2b0] p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                  placeholder="Enter your password"
                  required
                />
                <div className="text-[#608a72] dark:text-[#a0c2b0] flex border border-[#dbe6df] dark:border-[#334D3F] bg-white dark:bg-[#172D20] items-center justify-center pr-[15px] rounded-r-lg border-l-0">
                  <span className="material-symbols-outlined">lock</span>
                </div>
              </div>
            </label>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#608a72] dark:text-[#a0c2b0] text-sm font-normal leading-normal underline cursor-pointer hover:text-primary"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <div className="w-full mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-[#111814] text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">{loading ? 'Logging in...' : 'Login'}</span>
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex w-full items-center justify-center">
          <div className="absolute h-px w-full bg-[#dbe6df] dark:bg-[#334D3F]"></div>
          <span className="relative bg-white dark:bg-[#1C3A27] px-4 text-sm text-[#608a72] dark:text-[#a0c2b0]">
            OR
          </span>
        </div>

        {/* Google Login */}
        <div className="w-full">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg h-12 px-5 bg-transparent border border-[#dbe6df] dark:border-[#334D3F] text-[#111814] dark:text-white text-base font-medium leading-normal hover:bg-primary/10 transition-colors"
          >
            <img
              alt="Google logo"
              className="h-6 w-6"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvNI9BIHDmSvVx117wlT_uxLsEY-erMZHIukd1fxUWfRxjGX8a9TgLtYX_MCbvjPYz9_gGnlEQlzVnLSZ5uT87MA1du6UJx23DrKVkzz0mWxGxQb0BjYriDSDt02NEyf7QSgfNajZWrejnWg8x_olZi711b8rlYzKHZNJuDPwfZ08eULnBxw25rfLg8H9GJFqXp-rykgEwygwt3KRIYauZV1N7AqA11kRb6X-fetduKdvGzb3_3_jXQIqokRhFaog9eJ3X4UeZEB0"
            />
            <span className="truncate">Continue with Google</span>
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-[#608a72] dark:text-[#a0c2b0] text-sm font-normal leading-normal">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary underline hover:text-primary/80">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
