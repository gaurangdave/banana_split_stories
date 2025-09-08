import { FC } from "react";

const LoadingSpinner: FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#f2a20d]"></div>
  </div>
);

export default LoadingSpinner;