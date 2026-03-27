function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="flex flex-col bg-white p-7 rounded shadow-md w-80 mx-auto mt-20 text-center opacity-100 scale-95">
      <button
        onClick={onClose}
        className="self-end text-bm-coral hover:text-bm-coral-dark font-bold"
      >
        ✕
      </button>
      <h2 className="text-xl font-bold mb-4">Sign In to BizMart</h2>
      <form>
        <div className="flex flex-col mb-4 text-left">
          <label htmlFor="email">Email:</label>
          <input
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
            placeholder="Password"
            type="password"
            id="password"
            name="password"
            className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-bm-coral"
          />
        </div>
        <div className="text-center mb-2">
          <button className="text-sm text-bm-coral hover:underline">
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          className="bg-bm-coral hover:bg-bm-coral-dark text-white font-bold py-2 px-10 rounded mb-3 mt-1"
        >
          Login
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