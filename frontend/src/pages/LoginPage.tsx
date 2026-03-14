import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { useTrans } from '@hooks/useTrans';
import { LoginRequest } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const t = useTrans();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: LoginRequest) => {
    try {
      setApiError(null);
      await login(data.emailOrUsername, data.password);
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.message || t.errors.loginFailed || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-extralight tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            МалоПазарче
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Најави се во твој профил</p>
        </div>

        {(error || apiError) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-xs">
            {error || apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            {...register('emailOrUsername', { required: t.validation.emailRequired })}
            placeholder={t.login.emailOrUsername}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
            disabled={isLoading}
          />
          {errors.emailOrUsername && <p className="text-red-500 text-xs">{errors.emailOrUsername.message}</p>}

          <input
            type="password"
            {...register('password', { required: t.validation.passwordRequired })}
            placeholder={t.login.password}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
            disabled={isLoading}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : t.login.loginBtn}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="px-3 text-gray-500 text-xs">или</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          {t.login.noAccount} <Link to="/register" className="text-blue-500 hover:text-blue-600">Регистрирај се</Link>
        </p>
      </div>
    </div>
  );
};