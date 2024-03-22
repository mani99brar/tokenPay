import React from "react";
import { ConnectKitButton } from "connectkit";
import StandardButton from "./StandardButton";
import PopUp from "./PopUp";
import { useState } from "react";
import { useGlobalState } from "@/utils/StateContext";

const NavBar = () => {
  const { uiTheme, setAllUiTheme } = useGlobalState();
  const [changeTheme, setChangeTheme] = useState(false);

  return (
    <div className="flex justify-center min-h-[100px]  items-center w-full text-xl">
      <div className="sm:w-3/4 w-full m-4 flex justify-between">
        <div className="flex flex-col sm:flex-row sm:space-x-4 md:w-2/4 lg:w-2/5 sm:w-3/4">
          <p className="font-bold text-2xl hidden sm:block sm:w-4/5 text-center sm:text-start w-full">
            Token Pay
          </p>
          <StandardButton
            size="small"
            handleClick={() => setChangeTheme(true)}
            prompt="Theme"
          />
        </div>

        <div className="flex sm:w-2/4 w-3/4 justify-end flex-row items-center sm:space-y-0 space-x-2  sm:space-x-8">
          <ConnectKitButton />
        </div>

        {changeTheme && (
          <PopUp prompt="Select a Theme" setValue={setChangeTheme}>
            <div className="w-full h-full bg-white rounded-lg flex flex-col p-4 space-y-4">
              <button
                className="bg-[#8612F1] rounded-lg p-4 font-bold text-2xl text-white"
                onClick={() => setAllUiTheme("Purple Hollow")}
              >
                {uiTheme === "Purple Hollow" ? "Selected" : "Purple Hollow"}
              </button>
              <button
                className="bg-white text-[#8612F1] text-2xl font-bold border-4 border-[#8612F1] p-4 rounded-lg"
                onClick={() => setAllUiTheme("White Hollow")}
              >
                {uiTheme === "White Hollow" ? "Selected" : "White Hollow"}
              </button>
              <button
                className="bg-black text-white text-2xl font-bold border-4 border-white p-4 rounded-lg"
                onClick={() => setAllUiTheme("White Solid")}
              >
                {uiTheme === "White Solid" ? "Selected" : "White Solid"}
              </button>
              <button
                className="bg-white text-black text-2xl font-bold border-4 border-black p-4 rounded-lg"
                onClick={() => setAllUiTheme("Black Solid")}
              >
                {uiTheme === "Black Solid" ? "Selected" : "Black Solid"}
              </button>
            </div>
          </PopUp>
        )}
      </div>
    </div>
  );
};

export default NavBar;
