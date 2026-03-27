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
        className="self-end text-red-500 hover:text-red-700 font-bold"
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
            className="border border-gray-300 rounded py-2 px-4"
          />
        </div>
        <div className="flex flex-col mb-4 text-left">
          <label htmlFor="password">Password:</label>
          <input
            placeholder="Password"
            type="password"
            id="password"
            name="password"
            className="border border-gray-300 rounded py-2 px-4"
          />
        </div>
        <div className="text-center mb-2">
          <button className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded mb-3 mt-1"
        >
          Login
        </button>
      </form>
      <p>
        New to BizMart?{" "}
        <a href="/signup" className="text-blue-500 hover:text-blue-700">
          Sign up here
        </a>
      </p>
    </div>
  );
}

export default LoginModal;
