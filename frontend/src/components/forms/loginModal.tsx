import { useState } from 'react'
import { type LoginForm, type LoginModalProps } from "../../types";
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const LoginModal = ({isOpen,onClose}: LoginModalProps) =>  
{
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<LoginForm>({
    email: '', 
    password: ''
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/login', form)
      console.log(res.data)
      toast.success(`Hello ${res.data.user.username}`)
      localStorage.setItem("token", res.data.token)
      onClose()
    }
    catch (err: any) {
      const message = err.response?.data?.error || 'Incorrect email or password'
      toast.error(message, {duration: 5000})
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="flex flex-col bg-white p-7 rounded shadow-md w-80 mx-auto mt-20 text-center opacity-100 scale-95">
      <button
        onClick={onClose}
        className="self-end text-bm-coral hover:text-bm-coral-dark font-bold cursor-pointer"
      >
        ✕
      </button>
      <h2 className="text-xl font-bold mb-4">Sign In to BizMart</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4 text-left">
          <label htmlFor="email">Email:</label>
          <input
            onChange={handleChange}
            value={form.email}
            placeholder="Email"
            type="email"
            id="email"
            name="email"
            className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-bm-coral"
          />
        </div>
        <div className="flex flex-col mb-4 text-left">
          <label htmlFor="password">Password:</label>
          <input
            onChange={handleChange}
            value={form.password}
            placeholder="Password"
            type="password"
            id="password"
            name="password"
            className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-bm-coral"
          />
        </div>
        <div className="text-center mb-2">
          <button type="button" className="text-sm text-bm-coral hover:underline">
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-bm-coral hover:bg-bm-coral-dark text-white font-bold py-2 px-10 rounded mb-3 mt-1">
          {loading ? 'Logging in..' : 'Login'}
        </button>
      </form>
      <p>
        New to BizMart?{" "}
        <a href="/signup" className="text-bm-coral hover:text-bm-coral-dark">
          Sign up here
        </a>
      </p>
    </div>
  );
}

export default LoginModal;