import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <p className="flex items-center justify-center gap-1">
        Oops!!! I think you are lost.Go to{" "}
        <Link to={"/dashboard"} className="underline text-blue-500">
          Home
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
