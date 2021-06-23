import React from "react";
import { Drizzle, generateStore } from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";
import options from "../../drizzleOptions";
import Test from "../Test/Test";
import './App.css';

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

function App() {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }

          return (
            <div className="App">
              <Test drizzle={drizzle} drizzleState={drizzleState} />
            </div>
          );
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

export default App;
