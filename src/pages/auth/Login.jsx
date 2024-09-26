import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAlternateEmail, MdLockOutline } from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import imageSrc from '../auth/login.jpg'; // Update the path if needed
import axios from 'axios';

const translations = {
  en: {
    title: 'Welcome',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Password',
    emailError: 'Please enter your email',
    invalidEmailError: 'Invalid email',
    passwordError: 'Please enter your password',
    shortPasswordError: 'Password must be more than 6 characters',
    loginButton: 'Login',
    loginWithGoogle: 'Login with Google',
    or: 'or',
  },
  id: {
    title: 'Selamat datang',
    emailPlaceholder: 'Masukkan email anda',
    passwordPlaceholder: 'Kata sandi',
    emailError: 'Masukkan email',
    invalidEmailError: 'Email tidak valid',
    passwordError: 'Masukkan kata sandi',
    shortPasswordError: 'Kata sandi harus lebih dari 6 karakter',
    loginButton: 'Masuk',
    loginWithGoogle: 'Masuk dengan Google',
    or: 'atau',
  },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  const t = translations[language];

  const validateForm = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = t.emailError;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = t.invalidEmailError;
    }

    if (!password) {
      tempErrors.password = t.passwordError;
    } else if (password.length < 6) {
      tempErrors.password = t.shortPasswordError;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('https://api.beetpos.com/api/v1/auth/login', { email, password });
        const { token } = response.data.data;
        console.log("token", token);
        localStorage.setItem('token', token); // Simpan token di localStorage
        navigate('/'); // Arahkan ke halaman lain setelah login
      } catch (error) {
        setErrors({ general: 'Login failed, please check your credentials' });
      }
    }
  };


  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => {
      const { [e.target.name]: _, ...rest } = prevErrors;
      return rest;
    });
  };

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'id' : 'en'));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block w-1/2">
          <img src={imageSrc} alt="Side illustration" className="h-full w-full object-cover" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold text-center font-Poppins">{t.title}</h1>
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLanguage}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none"
            >
              {language === 'en' ? 'ID' : 'EN'}
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div className="relative flex items-center">
              <MdOutlineAlternateEmail className="absolute left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-100 ${errors.email ? 'border-red-500' : ''}`}
                value={email}
                onChange={handleChange(setEmail)}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            <div className="relative flex items-center">
              <MdLockOutline className="absolute left-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t.passwordPlaceholder}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-100 ${errors.password ? 'border-red-500' : ''}`}
                value={password}
                onChange={handleChange(setPassword)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-600 text-opacity-50"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="text-blue-500 text-sm mt-1">{errors.password}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-400 rounded-md hover:bg-blue-500"
            >
              {t.loginButton}
            </button>
          </form>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">{t.or}</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M24 9.5c3.1 0 5.7 1.1 7.8 2.9L36.6 9c-2.9-2.6-6.6-4-10.6-4-8.5 0-15.7 5.7-18.3 13.4l7.4 5.7C16.3 14.9 19.9 9.5 24 9.5z"></path>
                  <path fill="#34A853" d="M45 24.3c0-1.1-.1-2.3-.3-3.4H24v7.5h11.7c-.5 2.6-2 4.8-4.1 6.3l6.4 5.1C41.2 36.6 45 30.9 45 24.3z"></path>
                  <path fill="#FBBC05" d="M7.1 19.4c-1.6 3.1-1.6 6.5 0 9.6l7.4-5.7c-.5-1.6-.5-3.3 0-4.9l-7.4-5.7c-1.6 3.1-1.6 6.5 0 9.6z"></path>
                  <path fill="#EA4335" d="M24 44c4.1 0 7.7-1.4 10.6-4l-6.4-5.1c-1.8 1.4-4.2 2.3-6.6 2.3-4.1 0-7.7-2.7-9-6.6l-7.4 5.7C8.3 38.3 15.5 44 24 44z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                {t.loginWithGoogle}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-gray-500 text-sm">
        © 2019-2024, PT Lifetech
      </div>
    </div>
  );
};

export default Login;
  