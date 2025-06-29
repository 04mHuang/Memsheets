const Login = () => {
  return (
    <div>
      <form method="POST" className="flex flex-col" >
        <label htmlFor="email" className="step-1">Email</label>
        <input type="email" name="email" required />
        <label htmlFor="password" className="step-2">Password</label>
        <input type="password" name="password" required />
        <button type="submit" className="step-3">Login</button>
      </form>
    </div>
  );
}
export default Login;