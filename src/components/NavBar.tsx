import React from "react";
import { ConnectKitButton } from "connectkit";

const NavBar = () => {
  return (
    <div className="flex text-white justify-center h-[100px] items-center w-full text-xl">
      <div className="w-[80%] flex justify-between">
        <button className="font-bold" aria-label="Redirect to Home">
          Token Pay
        </button>
        <ConnectKitButton />
      </div>
    </div>
  );
};

export default NavBar;
