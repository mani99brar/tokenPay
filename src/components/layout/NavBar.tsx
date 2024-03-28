// Desc: This file contains the NavBar component which is used to display the top
// theme and connect button.
import { ConnectKitButton } from "connectkit";
import StandardButton from "../common/StandardButton";
import { useState } from "react";
import PopUp from "../PopUp";
import ThemeSelector from "../selectors/ThemeSelector";

const NavBar = () => {
  const [changeTheme, setChangeTheme] = useState(false);

  return (
    <div className="flex justify-center min-h-[100px] items-center w-full text-xl">
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
            <ThemeSelector setChangeTheme={setChangeTheme} />
          </PopUp>
        )}
      </div>
    </div>
  );
};

export default NavBar;
