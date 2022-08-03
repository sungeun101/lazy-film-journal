import { FadeLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="flex justify-center pt-4">
      <FadeLoader color="gray" />
    </div>
  );
}
