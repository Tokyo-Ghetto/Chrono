import { useSubmit } from "@remix-run/react";
import { randomTicker } from "~/utils/chart";

export const RandomButton = () => {
  const submit = useSubmit();

  const handleClick = () => {
    const randomTick = randomTicker();
    const formData = new FormData();
    formData.append("ticker", randomTick);
    submit(formData, { method: "get" });
  };

  return (
    <button
      title="Random ETF"
      type="button"
      onClick={handleClick}
      className="group cursor-pointer outline-none hover:rotate-90 duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 20 20"
        transform="scale(0.85)"
        className="stroke-emerald-400 fill-none group-hover:fill-teal-800 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300 rounded-md"
      >
        <path
          fillRule="evenodd"
          d="M10 8.105a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM18 3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V3zm2-1v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2zM6 8.105a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8-8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm2 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
        ></path>
      </svg>
    </button>
  );
};
