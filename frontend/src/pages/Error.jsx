import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="text-center">
      <h1>404</h1>
      <p>Page Not Found</p>
      <button className="bg-blue-600 text-white rounded-md h-12 w-32">
        <Link to="/">Back to Home</Link>
      </button>
    </div>
  );
};

export default Error;
