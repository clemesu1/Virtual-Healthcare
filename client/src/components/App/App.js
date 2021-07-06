import React from "react";
import { Drizzle, generateStore } from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";
import options from '../../drizzleOptions'
import Dashboard from "../Doctor/Dashboard/Dashboard";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from "./LoginButton";

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

function App() {
  const { isLoading } = useAuth0();

        
  if (isLoading) {
    return "Loading...";
  }
  

  return (
    <Router>
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;

         

            if (!initialized) {
              return "Loading...";
            }
      
            
            return (
              <>
                <LoginButton />
                <Dashboard drizzle={drizzle} drizzleState={drizzleState} />
              </>
            );
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    </Router>
  );
}

export default App;
