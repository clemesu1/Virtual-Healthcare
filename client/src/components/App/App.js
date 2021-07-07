import React from "react";
import { Drizzle, generateStore } from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";
import options from '../../drizzleOptions'
import Dashboard from "../Doctor/Dashboard/Dashboard";
import { BrowserRouter as Router } from "react-router-dom";
import LoginButton from "./LoginButton";
import { useAuth0 } from '@auth0/auth0-react';

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

function App() {
  const { isLoading } = useAuth0();

  return (
    <Router>
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;

         
            if (isLoading) {
              return 'Loading Auth0...';
            }

            if (!initialized) {
              return "Initializing Drizzle...";
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
