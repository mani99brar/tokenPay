import React from "react";
import { ConnectKitButton } from "connectkit";
import StandardButton from "./StandardButton";
import PopUp from "./PopUp";
import { useState } from "react";
import { useGlobalState } from "@/utils/StateContext";

const NavBar = () => {
  const { uiTheme, setUiTheme } = useGlobalState();
  const [changeTheme, setChangeTheme] = useState(false);

  return (
    <div className="flex justify-center min-h-[100px] items-center w-full text-xl">
      <div className="w-[80%] flex justify-between">
        <p className="font-bold text-2xl">Token Pay</p>
        <div className="flex w-2/6 justify-between items-center">
          <div className="flex w-full justify-between items-center space-x-8">
            <StandardButton
              size="small"
              handleClick={() => setChangeTheme(true)}
              prompt="Theme"
            />
            <ConnectKitButton />
          </div>

          {changeTheme && (
            <PopUp prompt="Select a Theme" setValue={setChangeTheme}>
              <div className="w-full h-full bg-white rounded-lg flex flex-col p-4 space-y-4">
                <button
                  className="bg-[#8612F1] rounded-lg p-4 font-bold text-2xl text-white"
                  onClick={() => setUiTheme("Purple Hollow")}
                >
                  {uiTheme === "Purple Hollow" ? "Selected" : "Purple Hollow"}
                </button>
                <button
                  className="bg-white text-[#8612F1] text-2xl font-bold border-4 border-[#8612F1] p-4 rounded-lg"
                  onClick={() => setUiTheme("White Hollow")}
                >
                  {uiTheme === "White Hollow" ? "Selected" : "White Hollow"}
                </button>
                <button
                  className="bg-black text-white text-2xl font-bold border-4 border-white p-4 rounded-lg"
                  onClick={() => setUiTheme("White Solid")}
                >
                  {uiTheme === "White Solid" ? "Selected" : "White Solid"}
                </button>
                <button
                  className="bg-white text-black text-2xl font-bold border-4 border-black p-4 rounded-lg"
                  onClick={() => setUiTheme("Black Solid")}
                >
                  {uiTheme === "Black Solid" ? "Selected" : "Black Solid"}
                </button>
              </div>
            </PopUp>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
