import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { useTrans } from '@hooks/useTrans';
import { RegisterRequest } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: authRegister, isLoading, error } = useAuth();
  const t = useTrans();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterRequest>();
  const [apiError, setApiError] = useState<string | null>(null);
  const password = watch('password');

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setApiError(null);
      await authRegister(data.email, data.username, data.password, data.fullName);
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.message || t.errors.registrationFailed);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="w-full max-w-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black">
        {/* Header */}
        <div className="px-10 py-8 text-center border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-5xl font-light tracking-tighter mb-6 text-black dark:text-white">МалоПазарче</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Создај нов профил</p>
        </div>

        {/* Form */}
        <div className="px-10 py-6">
          {(error || apiError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-sm mb-4 text-xs">
              {error || apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              type="text"
              {...register('fullName')}
              placeholder="Полно име"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm rounded-sm focus:bg-white dark:focus:bg-gray-800 text-black dark:text-white"
              disabled={isLoading}
            />

            <input
              type="text"
              {...register('username', {
                required: t.validation.usernameRequired,
                minLength: { value: 3, message: t.validation.usernameTooShort },
              })}
              placeholder={t.register.username}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm rounded-sm focus:bg-white dark:focus:bg-gray-800 text-black dark:text-white"
              disabled={isLoading}
            />
            {errors.username && <p className="text-red-500 dark:text-red-400 text-xs">{errors.username.message}</p>}

            <input
              type="email"
              {...register('email', {
                required: t.validation.emailRequired,
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: t.validation.emailInvalid },
              })}
              placeholder={t.register.email}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm rounded-sm focus:bg-white dark:focus:bg-gray-800 text-black dark:text-white"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 dark:text-red-400 text-xs">{errors.email.message}</p>}

            <input
              type="password"
              {...register('password', {
                required: t.validation.passwordRequired,
                minLength: { value: 6, message: t.validation.passwordTooShort },
              })}
              placeholder={t.register.password}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm rounded-sm focus:bg-white dark:focus:bg-gray-800 text-black dark:text-white"
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-500 dark:text-red-400 text-xs">{errors.password.message}</p>}

            <input
              type="password"
              {...register('confirmPassword', {
                required: t.validation.confirmPasswordRequired,
                validate: (value) => value === password || t.validation.passwordMismatch,
              })}
              placeholder={t.register.confirmPassword}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm rounded-sm focus:bg-white dark:focus:bg-gray-800 text-black dark:text-white"
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="text-red-500 dark:text-red-400 text-xs">{errors.confirmPassword.message}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-sm font-semibold text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? t.loading.registering : t.register.registerBtn}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
            <span className="px-2 text-gray-500 dark:text-gray-400 text-xs font-semibold">или</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            {t.register.haveAccount}{' '}
            <Link to="/login" className="font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">
              {t.register.loginHere}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
